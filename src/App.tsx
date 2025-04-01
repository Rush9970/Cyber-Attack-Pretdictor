import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity } from 'lucide-react';
import axios from 'axios';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { ThreatCard } from './components/ThreatCard';
import type { AnalysisResult } from './types';

function App() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    setAnalysisResult(null);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(response.data);
    } catch (err: any) {
      console.error('Error analyzing file:', err.response || err);
      setError(
        err.response && err.response.data && err.response.data.detail
          ? err.response.data.detail
          : 'Failed to analyze the file. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative max-w-7xl mx-auto px-4 py-12"
      >
        <motion.div 
          className="flex items-center justify-center mb-12"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <Shield className="w-12 h-12 text-blue-400 mr-4" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Cyber Threat Analyzer
          </h1>
        </motion.div>

        <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center mt-12"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-blue-400/20 animate-pulse" />
                <Activity className="w-16 h-16 text-blue-400 animate-spin" />
              </div>
              <motion.p 
                className="mt-6 text-lg text-blue-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Analyzing network traffic data...
              </motion.p>
            </motion.div>
          )}

          {analysisResult && !isProcessing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-12"
            >
              <Dashboard data={analysisResult} />
              
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <h2 className="text-2xl font-semibold text-blue-300 mb-6">Detected Threats</h2>
                <div className="space-y-4">
                  {analysisResult.threats.map((threat, index) => (
                    <ThreatCard key={index} threat={threat} index={index} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;