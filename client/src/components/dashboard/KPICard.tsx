import { motion } from 'framer-motion';
import Sparkline from './Sparkline';
import StatusBadge from './StatusBadge';
import AnimatedNumber from './AnimatedNumber';
import { TrendingUp, TrendingDown, Minus, Brain, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: LucideIcon;
  color: string;
  sparklineData: number[];
  status: 'online' | 'warning' | 'critical' | 'optimal' | 'nominal' | 'elevated';
  statusLabel: string;
  aiPrediction: string;
  aiConfidence: number;
  lastUpdated: string;
  iconBg?: string;
  iconColor?: string;
}

function KPICard({
  label,
  value,
  unit,
  trend,
  trendValue,
  icon: Icon,
  color,
  sparklineData,
  status,
  statusLabel,
  aiPrediction,
  aiConfidence,
  lastUpdated,
  iconBg,
  iconColor,
}: KPICardProps) {
  const defaultIconBg = `${color}15`;
  const defaultIconColor = color;
  const bg = iconBg || defaultIconBg;
  const ic = iconColor || defaultIconColor;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-amber-600' : 'text-slate-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.015 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)] transition-all duration-300 hover:shadow-[0_12px_50px_rgba(146,92,25,0.12)]"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: `radial-gradient(circle at 80% 20%, ${color} 0%, transparent 60%)` }} />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-eco-muted">{label}</span>
            <div className="flex items-baseline gap-1.5">
              <AnimatedNumber value={value} decimals={1} className="text-2xl font-bold font-mono text-eco-dark" />
              <span className="text-xs font-medium text-eco-muted">{unit}</span>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: bg, color: ic }}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Sparkline data={sparklineData} width={72} height={28} color={color} />
          <span className={`flex items-center gap-0.5 text-[11px] font-medium ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            {trendValue}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <StatusBadge status={status} label={statusLabel} />
          <div className="flex items-center gap-1 text-[10px] text-eco-muted">
            <Brain className="h-3 w-3" />
            <span>{aiConfidence}%</span>
          </div>
        </div>

        <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-[#fefaf3]/80 px-2.5 py-1.5">
          <Clock className="mt-0.5 h-3 w-3 shrink-0 text-eco-muted" />
          <span className="text-[10px] leading-relaxed text-eco-muted">
            <span className="font-medium text-eco-dark">AI:</span> {aiPrediction}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-[10px] text-eco-muted/70">Updated {lastUpdated}</span>
        </div>
      </div>
    </motion.div>
  );
}

export default KPICard;