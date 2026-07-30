// client/src/components/grid/AIGridCommandCenter.tsx
import { motion } from 'framer-motion';
import { Zap, Cpu, Activity, AlertTriangle } from 'lucide-react';
import type { GridData } from '../../types';

interface AIGridCommandCenterProps {
  data: GridData;
}

export default function AIGridCommandCenter({ data }: AIGridCommandCenterProps) {
  const metrics = [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      label: 'Grid Status',
      value: data.status.label,
      color: data.status.color,
      subValue: data.status.icon,
    },
    {
      icon: <Cpu className="w-5 h-5" />,
      label: 'AI Mode',
      value: 'Demand Response',
      subValue: 'ACTIVE',
      color: '#10b981',
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Predicted Failure',
      value: `${data.predictedFailure.toFixed(1)}%`,
      color: data.predictedFailure < 3 ? '#10b981' : '#f59e0b',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'Optimization Score',
      value: `${Math.round(data.optimizationScore)}%`,
      color: '#8b5cf6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-glow p-6 border border-purple-500/20 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 animate-pulse" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-eco-dark">AI Grid Command Center</h2>
            <p className="text-sm text-eco-muted">Intelligent grid orchestration</p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 text-center border border-eco-border/30 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <span style={{ color: metric.color }}>{metric.icon}</span>
                <span className="text-xs text-eco-muted">{metric.label}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <motion.span
                  className="text-2xl font-bold"
                  style={{ color: metric.color }}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {metric.value}
                </motion.span>
                {metric.subValue && (
                  <span className="text-sm font-medium text-eco-primary bg-eco-primary/10 px-2 py-0.5 rounded-full">
                    {metric.subValue}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}