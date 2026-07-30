import { motion } from 'framer-motion';
import { Brain, TrendingDown, Droplets, Leaf, Zap, Sparkles } from 'lucide-react';

interface AIInsightsProps {
  recommendation: string;
  reason: string;
  expectedSavings: number;
  carbonReduction: number;
  confidence: number;
  estimatedImpact: string;
  priority: 'high' | 'medium' | 'low';
  iconBg?: string;
  iconColor?: string;
}

function AIInsights({
  recommendation,
  reason,
  expectedSavings,
  carbonReduction,
  confidence,
  estimatedImpact,
  priority,
  iconBg = 'bg-violet-50',
  iconColor = '#8b5cf6',
}: AIInsightsProps) {
  const priorityConfig = {
    high: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High Priority' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium Priority' },
    low: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Low Priority' },
  };
  const p = priorityConfig[priority];

  const metrics = [
    { icon: TrendingDown, label: 'Energy Savings', value: `${expectedSavings}%`, color: '#10b981' },
    { icon: Droplets, label: 'Water Savings', value: `${(expectedSavings * 0.6).toFixed(1)}%`, color: '#3b82f6' },
    { icon: Leaf, label: 'Carbon Reduction', value: `${carbonReduction}%`, color: '#6d8b3d' },
    { icon: Zap, label: 'Efficiency Gain', value: `${(expectedSavings * 1.2).toFixed(1)}%`, color: '#c97a1d' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50/80 via-white to-emerald-50/40 backdrop-blur-xl p-6 shadow-[0_8px_40px_rgba(139,92,246,0.08)]"
    >
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 opacity-[0.04]">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="3 5" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="2 4" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="#8b5cf6" strokeWidth="0.5" strokeDasharray="1 3" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`} style={{ color: iconColor }}>
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-eco-dark">AI Insights</h3>
            <p className="text-[11px] text-eco-muted">Real-time recommendation engine</p>
          </div>
          <div className="ml-auto">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${p.bg} ${p.text} ${p.border}`}>
              <Sparkles className="h-3 w-3" />
              {p.label}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-white/60 border border-violet-100/60 p-4 mb-4">
          <p className="text-xs font-semibold text-eco-dark mb-1">Current Recommendation</p>
          <p className="text-sm text-eco-dark leading-relaxed">{recommendation}</p>
          <p className="text-[11px] text-eco-muted mt-2 leading-relaxed">{reason}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-2">
              <m.icon className="h-4 w-4 shrink-0" style={{ color: m.color }} />
              <div>
                <span className="text-[10px] text-eco-muted block">{m.label}</span>
                <span className="text-sm font-bold font-mono text-eco-dark">{m.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-eco-muted font-medium">Confidence</span>
              <span className="text-[10px] font-mono font-bold text-eco-dark">{confidence}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-violet-100">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-eco-muted block">Est. Impact</span>
            <span className="text-xs font-bold text-eco-dark">{estimatedImpact}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AIInsights;