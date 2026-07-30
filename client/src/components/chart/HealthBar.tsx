import { motion } from 'framer-motion';

interface HealthBarProps {
  value: number;
  label: string;
  color?: string;
  max?: number;
}

function HealthBar({ value, label, color = '#10b981', max = 100 }: HealthBarProps) {
  const percentage = Math.min(Math.max(value / max, 0), 1);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-eco-muted font-medium">{label}</span>
        <span className="text-eco-dark font-mono font-semibold">{value}/{max}</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
        <motion.div
          className="h-full rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}60`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default HealthBar;