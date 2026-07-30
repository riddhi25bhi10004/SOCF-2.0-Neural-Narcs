// client/src/components/water/WaterEfficiencyScore.tsx
import { motion } from 'framer-motion';
import WaterScoreGauge from './WaterScoreGauge';

interface WaterEfficiencyScoreProps {
  score: number;
}

export default function WaterEfficiencyScore({ score }: WaterEfficiencyScoreProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="h-full"
    >
      <WaterScoreGauge 
        score={score}
        label="Water Efficiency Score"
        subtitle="AI-optimized water management"
        size={220}
      />
    </motion.div>
  );
}