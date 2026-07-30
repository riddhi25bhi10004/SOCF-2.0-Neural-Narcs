import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Globe, Sun, Wind, BatteryCharging, TreePine, TrendingDown, ArrowDown } from 'lucide-react';

interface SustainabilityMetric {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend: string;
}

function SustainabilityPanel() {
  const metrics: SustainabilityMetric[] = [
    { label: "Today's CO₂ Saved", value: '2.4', unit: 'tons', icon: <Leaf className="h-4 w-4" />, color: '#6d8b3d', bgColor: 'bg-emerald-50', trend: '+12% vs yesterday' },
    { label: 'Water Saved', value: '847', unit: 'L', icon: <Globe className="h-4 w-4" />, color: '#3b82f6', bgColor: 'bg-blue-50', trend: '+8% vs yesterday' },
    { label: 'Renewable Usage', value: '67', unit: '%', icon: <Sun className="h-4 w-4" />, color: '#c97a1d', bgColor: 'bg-amber-50', trend: '+3.2% this week' },
    { label: 'Trees Equivalent', value: '142', unit: 'trees', icon: <TreePine className="h-4 w-4" />, color: '#10b981', bgColor: 'bg-emerald-50', trend: '+5 new equivalents' },
    { label: 'Monthly Goal', value: '78', unit: '%', icon: <TrendingDown className="h-4 w-4" />, color: '#8b5cf6', bgColor: 'bg-violet-50', trend: 'On track' },
    { label: 'Net Carbon Reduction', value: '18.6', unit: '%', icon: <ArrowDown className="h-4 w-4" />, color: '#0ea5e9', bgColor: 'bg-sky-50', trend: 'vs baseline' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Leaf className="h-4 w-4 text-eco-success" />
        <h3 className="text-sm font-bold text-eco-dark">Sustainability</h3>
        <span className="ml-auto text-[10px] text-eco-muted font-medium">Live metrics</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white/50 border border-amber-100/60 p-3 hover:bg-white/80 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${m.bgColor}`} style={{ color: m.color }}>
                {m.icon}
              </div>
              <span className="text-[11px] font-medium text-eco-muted">{m.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-eco-dark">{m.value}</span>
              <span className="text-[11px] text-eco-muted">{m.unit}</span>
            </div>
            <div className="mt-1 flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] font-medium text-emerald-600">{m.trend}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 py-3 rounded-xl bg-white/30 border border-amber-100/40">
        <div className="flex flex-col items-center gap-1">
          <Sun className="h-5 w-5 text-amber-400 opacity-60" />
          <span className="text-[10px] text-eco-muted">Solar</span>
        </div>
        <div className="h-8 w-px bg-amber-200/60" />
        <div className="flex flex-col items-center gap-1">
          <Wind className="h-5 w-5 text-sky-400 opacity-60" />
          <span className="text-[10px] text-eco-muted">Wind</span>
        </div>
        <div className="h-8 w-px bg-amber-200/60" />
        <div className="flex flex-col items-center gap-1">
          <BatteryCharging className="h-5 w-5 text-emerald-400 opacity-60" />
          <span className="text-[10px] text-eco-muted">Battery</span>
        </div>
        <div className="h-8 w-px bg-amber-200/60" />
        <div className="flex flex-col items-center gap-1">
          <Globe className="h-5 w-5 text-violet-400 opacity-60" />
          <span className="text-[10px] text-eco-muted">Grid</span>
        </div>
      </div>
    </motion.div>
  );
}

export default SustainabilityPanel;