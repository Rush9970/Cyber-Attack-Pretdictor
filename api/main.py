from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
from datetime import datetime
import joblib
import os
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Update expected columns to match training data
EXPECTED_COLUMNS = [
    'http.content_length',
    'tcp.connection.syn',
    'tcp.dstport',
    'tcp.flags.ack',
    'tcp.len',
    'tcp.srcport',
    'udp.port',
    'udp.time_delta',
    'dns.qry.type',
    'http.request.method_0',  # Note the _0 suffix expected by the model
    'http.request.method_GET',
    'http.request.method_POST'
]

# Load the ML model
try:
    model_path = os.path.join(os.path.dirname(__file__), "xgboost_model.pkl")
    model = joblib.load(model_path)
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model = None

def get_threat_details(prediction: int):
    threat_mappings = {
        0: {"type": "HTTP", "level": "low", "confidence": 0.95},
        1: {"type": "ICMP", "level": "high", "confidence": 0.88},
        2: {"type": "Normal", "level": "medium", "confidence": 0.78},
        3: {"type": "Password Attack", "level": "high", "confidence": 0.92},
        4: {"type": "TCP SYN", "level": "medium", "confidence": 0.85},
        5: {"type": "UDP", "level": "high", "confidence": 0.89}
    }
    return threat_mappings.get(prediction, {"type": "Unknown", "level": "No", "confidence": 0.5})

def prepare_features(df: pd.DataFrame):
    """Prepare and validate features for the model."""
    # Strip spaces from column names
    df.columns = df.columns.str.strip()
    # Rename column if needed: convert 'http.request.method' to 'http.request.method_0'
    if "http.request.method" in df.columns and "http.request.method_0" not in df.columns:
        df.rename(columns={"http.request.method": "http.request.method_0"}, inplace=True)
    
    # Check if all expected columns are present
    missing_cols = set(EXPECTED_COLUMNS) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing required columns: {missing_cols}")
    
    # Convert all columns to numeric and reindex in the expected order
    df = df[EXPECTED_COLUMNS].apply(pd.to_numeric, errors='coerce').fillna(0)
    return df

def analyze_network_traffic(df: pd.DataFrame):
    if model is None:
        raise HTTPException(status_code=500, detail="ML model not loaded")
    
    try:
        # Prepare features for prediction
        features = prepare_features(df)
        
        # Make predictions using the loaded model
        predictions = model.predict(features)
        
        threats = []
        for idx, pred in enumerate(predictions):
            threat_info = get_threat_details(int(pred))
            
            # Extract protocol information
            protocol = 'TCP' if df.iloc[idx][['tcp.srcport', 'tcp.dstport']].notna().any() else 'UDP'
            
            # Construct source and destination information
            source_port = int(df.iloc[idx]['tcp.srcport'] or df.iloc[idx]['udp.port'] or 0)
            dest_port = int(df.iloc[idx]['tcp.dstport'] or df.iloc[idx]['udp.port'] or 0)
            
            threats.append({
                "timestamp": datetime.now().isoformat(),
                "sourceIP": f"192.168.1.{source_port % 255}",  # Demo IP based on port
                "destinationIP": f"10.0.0.{dest_port % 255}",    # Demo IP based on port
                "protocol": protocol,
                "threatLevel": threat_info["level"],
                "confidence": threat_info["confidence"],
                "attackType": threat_info["type"]
            })
        
        # Calculate summary statistics
        summary = {
            "totalThreats": len(threats),
            "highRiskThreats": sum(1 for t in threats if t['threatLevel'] == 'high'),
            "mediumRiskThreats": sum(1 for t in threats if t['threatLevel'] == 'medium'),
            "lowRiskThreats": sum(1 for t in threats if t['threatLevel'] == 'low')
        }
        
        return {"threats": threats, "summary": summary}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")

@app.post("/analyze")
async def analyze_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
        result = analyze_network_traffic(df)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
