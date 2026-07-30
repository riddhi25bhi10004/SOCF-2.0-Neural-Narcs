// client/src/components/grid/BlackoutPrediction.tsx
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, TrendingUp, Shield } from 'lucide-react';
import type { BlackoutPrediction } from '../../types';

interface BlackoutPredictionProps {
  prediction: BlackoutPrediction;
}

export default function BlackoutPrediction({ prediction }: BlackoutPredictionProps) {
  return (
    <motion.div
      className="glass p-6 border border-red-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-red-500/10 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
        {/* 👇 CHANGE THIS LINE */}
        <h3 className="section-title text-base">Blackout Prediction</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <Clock className="w-3 h-3" />
          <span>Updated: Now</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Risk meter */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-eco-muted">Risk</span>
            <motion.span
              className="font-bold"
              style={{ color: prediction.risk > 15 ? '#ef4444' : '#f59e0b' }}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {prediction.risk.toFixed(1)}%
            </motion.span>
          </div>
          <div className="h-2 bg-eco-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #10b981, #f59e0b, #ef4444)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(prediction.risk, 100)}%` }}
              transition={{ duration: 1.5 }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass p-2 text-center">
            <p className="text-xs text-eco-muted">Expected</p>
            <p className="font-bold text-eco-dark">
              {prediction.timeStart}–{prediction.timeEnd}
            </p>
          </div>
          <div className="glass p-2 text-center">
            <p className="text-xs text-eco-muted">Cause</p>
            <p className="font-bold text-eco-dark">{prediction.cause}</p>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 text-xs">
            <Shield className="w-4 h-4 text-blue-500" />
            <span className="text-eco-muted">Recommended Action:</span>
            <span className="font-medium text-eco-dark">{prediction.recommendedAction}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}