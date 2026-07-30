// client/src/components/grid/GridMetrics.tsx
import { motion } from 'framer-motion';
import { Activity, Zap, Gauge, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';
import type { GridMetrics as GridMetricsType } from '../../types';

interface GridMetricsProps {
  metrics: GridMetricsType;
  isOptimized?: boolean;
}

export default function GridMetrics({ metrics, isOptimized = false }: GridMetricsProps) {
  const metricItems = [
    {
      icon: <Zap className="w-4 h-4" />,
      label: 'Demand',
      value: `${Math.round(metrics.demand)} MW`,
      trend: isOptimized ? 'down' : 'up',
      color: isOptimized ? '#10b981' : '#f59e0b',
    },
    {
      icon: <Activity className="w-4 h-4" />,
      label: 'Supply',
      value: `${Math.round(metrics.supply)} MW`,
      trend: isOptimized ? 'up' : 'stable',
      color: isOptimized ? '#10b981' : '#3b82f6',
    },
    {
      icon: <Gauge className="w-4 h-4" />,
      label: 'Frequency',
      value: `${metrics.frequency.toFixed(1)} Hz`,
      trend: 'stable',
      color: metrics.frequency > 49.5 ? '#10b981' : '#f59e0b',
    },
    {
      icon: <Thermometer className="w-4 h-4" />,
      label: 'Carbon Intensity',
      value: `${Math.round(metrics.carbonIntensity)} g/kWh`,
      trend: isOptimized ? 'down' : 'up',
      color: isOptimized ? '#10b981' : '#ef4444',
    },
  ];

  return (
    <motion.div
      className="glass p-6 border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="section-title text-base">Grid Metrics</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          {isOptimized ? (
            <span className="text-green-500 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Optimized
            </span>
          ) : (
            <span className="text-blue-500">Live</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metricItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-3 border border-eco-border/30 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-xs text-eco-muted">{item.label}</span>
              </div>
              {item.trend !== 'stable' && (
                <span className={item.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {item.trend === 'up' ? '↑' : '↓'}
                </span>
              )}
            </div>
            <motion.div
              className="text-lg font-bold text-eco-dark"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {item.value}
            </motion.div>
            <div className="mt-1 h-1 bg-eco-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
                initial={{ width: 0 }}
                animate={{ 
                  width: item.trend === 'up' ? '80%' : 
                         item.trend === 'down' ? '40%' : 
                         '60%' 
                }}
                transition={{ duration: 1, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall grid health indicator */}
      <motion.div
        className="mt-3 p-2 rounded-lg text-center text-xs"
        style={{
          background: isOptimized ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          border: `1px solid ${isOptimized ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
        }}
      >
        <span className={isOptimized ? 'text-green-600' : 'text-blue-600'}>
          {isOptimized ? '✅ Grid optimized - All metrics in ideal range' : '📊 Monitoring grid performance'}
        </span>
      </motion.div>
    </motion.div>
  );
}