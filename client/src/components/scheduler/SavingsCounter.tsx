// client/src/components/scheduler/SavingsCounter.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

interface SavingsCounterProps {
  icon: ReactNode;
  label: string;
  value: number;
  suffix: string;
  color: string;
  inView: boolean;
}

export default function SavingsCounter({ 
  icon, label, value, suffix, color, inView 
}: SavingsCounterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className="glass p-4 text-center border border-eco-border/30"
    >
      <div className="flex items-center justify-center mb-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <div className="text-2xl font-bold text-eco-dark">
        {inView ? (
          <CountUp
            start={0}
            end={value}
            duration={2.5}
            suffix={suffix}
            delay={0.2}
            useEasing={true}
            easingFn={(t, b, c, d) => {
              return c * (1 - Math.pow(1 - t / d, 3)) + b;
            }}
            onEnd={() => console.log('Animation complete!')}
          />
        ) : (
          `0${suffix}`
        )}
      </div>
      <p className="text-sm text-eco-muted">{label}</p>
    </motion.div>
  );
}