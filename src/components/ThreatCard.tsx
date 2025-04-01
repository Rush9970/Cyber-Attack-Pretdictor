import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, ShieldAlert, ArrowRight } from 'lucide-react';
import { ThreatData } from '../types';

interface ThreatCardProps {
  threat: ThreatData;
  index: number;
}

export const ThreatCard: React.FC<ThreatCardProps> = ({ threat, index }) => {
  const getThreatIcon = () => {
    switch (threat.threatLevel) {
      case 'high':
        return <ShieldAlert className="w-6 h-6 text-red-400" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      default:
        return <Shield className="w-6 h-6 text-green-400" />;
    }
  };

  const getBgColor = () => {
    switch (threat.threatLevel) {
      case 'high':
        return 'bg-red-500/10 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-green-500/10 border-green-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className={`relative overflow-hidden rounded-xl backdrop-blur-sm border ${getBgColor()} p-6`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 rounded-lg bg-gray-800/50">
            {getThreatIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{threat.attackType}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-400">
              <span>{threat.sourceIP}</span>
              <ArrowRight className="w-4 h-4 mx-2" />
              <span>{threat.destinationIP}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: `rgba(${threat.confidence * 255}, 100, 100, 0.1)`,
              color: `rgb(${threat.confidence * 255}, 200, 200)`
            }}
          >
            {Math.round(threat.confidence * 100)}% confidence
          </motion.div>
          <p className="text-xs text-gray-500 mt-2">{threat.timestamp}</p>
        </div>
      </div>
      
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50"
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      />
    </motion.div>
  );
};