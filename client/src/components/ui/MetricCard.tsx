import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  color?: string;
}

function MetricCard({ label, value, unit, trend, trendValue, icon, color = 'eco-primary' }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      className="glass p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-eco-muted font-medium uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-lg ${color === 'eco-primary' ? 'bg-eco-primary/10 text-eco-primary' : color === 'eco-accent' ? 'bg-blue-500/10 text-eco-accent' : color === 'blue-400' ? 'bg-blue-100 text-blue-600' : color === 'eco-success' ? 'bg-emerald-100 text-emerald-600' : color === 'eco-warning' ? 'bg-amber-100 text-amber-600' : color === 'eco-danger' ? 'bg-red-100 text-red-600' : 'bg-eco-primary/10 text-eco-primary'} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="metric-value text-eco-text">{value}</span>
        {unit && <span className="text-sm text-eco-muted">{unit}</span>}
      </div>
      {trendValue && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-eco-success' : trend === 'down' ? 'text-eco-danger' : 'text-eco-muted'}`}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );
}

export default MetricCard;