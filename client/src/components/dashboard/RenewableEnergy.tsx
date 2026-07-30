import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Wind, Battery, Grid } from 'lucide-react';

interface Source {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
  percentage: number;
}

function RenewableEnergy() {
  const sources: Source[] = [
    { label: 'Solar', value: 42, max: 100, color: '#f59e0b', icon: <Sun className="h-4 w-4" />, percentage: 42 },
    { label: 'Wind', value: 38, max: 100, color: '#06b6d4', icon: <Wind className="h-4 w-4" />, percentage: 38 },
    { label: 'Battery', value: 15, max: 100, color: '#10b981', icon: <Battery className="h-4 w-4" />, percentage: 15 },
    { label: 'Grid', value: 5, max: 100, color: '#8b5cf6', icon: <Grid className="h-4 w-4" />, percentage: 5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Wind className="h-4 w-4 text-eco-success" />
        <h3 className="text-sm font-bold text-eco-dark">Renewable Energy</h3>
        <span className="ml-auto text-[10px] text-eco-muted font-medium">Current mix</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sources.map((source, i) => (
          <motion.div
            key={source.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl bg-white/50 border border-amber-100/60 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: `${source.color}15`, color: source.color }}>
                {source.icon}
              </div>
              <span className="text-xs font-semibold text-eco-dark">{source.label}</span>
              <span className="ml-auto text-sm font-bold font-mono text-eco-dark">{source.percentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: source.color }}
                initial={{ width: 0 }}
                animate={{ width: `${source.percentage}%` }}
                transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-eco-muted">{source.value} kW</span>
              <span className="text-[10px] text-eco-muted">of {source.max} kW</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/40 p-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-eco-muted">Total Renewable Output</span>
          <span className="text-sm font-bold font-mono text-eco-dark">95 kW</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-amber-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: '95%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[10px] text-eco-muted">95% renewable</span>
          <span className="text-[10px] font-semibold text-emerald-600">Target: 90%</span>
        </div>
      </div>
    </motion.div>
  );
}

export default RenewableEnergy;