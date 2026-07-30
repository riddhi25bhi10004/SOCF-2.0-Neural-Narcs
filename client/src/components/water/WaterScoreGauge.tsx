// client/src/components/water/WaterScoreGauge.tsx
import { motion } from 'framer-motion';

interface WaterScoreGaugeProps {
  score: number;
  label?: string;
  subtitle?: string;
  size?: number;
}

export default function WaterScoreGauge({ 
  score, 
  label = 'Water Efficiency',
  subtitle = 'Excellent',
  size = 200 
}: WaterScoreGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getColor = (): string => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };

  const getStatus = (): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <motion.div 
      className="glass p-6 text-center border border-blue-500/20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative inline-block" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 10}
            fill="none"
            stroke={getColor()}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              strokeDasharray: circumference,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-4xl font-bold text-eco-dark"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-eco-muted">Score</span>
          <span 
            className="text-xs font-medium mt-1 px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${getColor()}20`, color: getColor() }}
          >
            {getStatus()}
          </span>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="section-title text-base">{label}</h3>
        <p className="text-sm text-eco-muted">{subtitle}</p>
      </div>
    </motion.div>
  );
}