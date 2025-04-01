import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, AlertTriangle, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '../types';

interface DashboardProps {
  data: AnalysisResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = [
    {
      label: 'Total Threats',
      value: data.summary.totalThreats,
      icon: Shield,
      color: 'blue'
    },
    {
      label: 'High Risk',
      value: data.summary.highRiskThreats,
      icon: ShieldAlert,
      color: 'red'
    },
    {
      label: 'Medium Risk',
      value: data.summary.mediumRiskThreats,
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      label: 'Low Risk',
      value: data.summary.lowRiskThreats,
      icon: AlertCircle,
      color: 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className={`relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm p-6 border border-gray-700/50`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <motion.p 
                className="text-3xl font-bold text-white mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
            </div>
            <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
            </div>
          </div>
          <motion.div
            className={`absolute bottom-0 left-0 h-1 bg-${stat.color}-400/50`}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
          />
        </motion.div>
      ))}
    </div>
  );
};