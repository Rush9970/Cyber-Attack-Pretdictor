export interface ThreatData {
  timestamp: string;
  sourceIP: string;
  destinationIP: string;
  protocol: string;
  threatLevel: 'low' | 'medium' | 'high';
  confidence: number;
  attackType: string;
}

export interface AnalysisResult {
  threats: ThreatData[];
  summary: {
    totalThreats: number;
    highRiskThreats: number;
    mediumRiskThreats: number;
    lowRiskThreats: number;
  };
}