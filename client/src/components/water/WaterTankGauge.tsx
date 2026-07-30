// client/src/components/water/WaterTankGauge.tsx
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';

interface WaterTankGaugeProps {
  level: number;
}

export default function WaterTankGauge({ level }: WaterTankGaugeProps) {
  const getColor = () => {
    if (level < 30) return '#ef4444';
    if (level < 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <motion.div
      className="glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-base">Water Storage</h3>
        <div className="flex items-center gap-1 text-xs text-eco-muted">
          <Droplets className="w-3 h-3" />
          <span>Capacity: 5000L</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* Tank Visualization */}
        <div className="relative w-full h-32 bg-eco-surface rounded-xl overflow-hidden border border-eco-border/30">
          {/* Water level */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 rounded-xl"
            style={{
              height: `${level}%`,
              background: `linear-gradient(to top, ${getColor()}cc, ${getColor()}66)`,
            }}
            initial={{ height: 0 }}
            animate={{ height: `${level}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            {/* Wave animation */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-2"
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: `linear-gradient(to right, transparent, ${getColor()}44, transparent)`,
              }}
            />
          </motion.div>

          {/* Level indicator */}
          <motion.div
            className="absolute top-2 right-2 glass px-2 py-1 rounded text-xs font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(level)}%
          </motion.div>

          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between px-2 py-1">
            {[90, 70, 50, 30, 10].map((line) => (
              <div
                key={line}
                className="w-full flex items-center gap-1"
                style={{ height: '0' }}
              >
                <div className="w-3 h-px bg-eco-border/30" />
                <span className="text-[8px] text-eco-muted opacity-30">{line}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-eco-muted">Current Level</span>
          <motion.span
            className="font-bold text-eco-dark"
            animate={{ 
              color: [getColor(), getColor(), getColor()],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {Math.round(level)}%
          </motion.span>
        </div>

        <motion.div
          className="h-1 bg-eco-border rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: getColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}