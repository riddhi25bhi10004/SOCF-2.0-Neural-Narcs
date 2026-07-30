// client/src/components/grid/AIDecisionCenter.tsx
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import type { GridDecision } from '../../types';

interface AIDecisionCenterProps {
  decisions: GridDecision[];
}

export default function AIDecisionCenter({ decisions }: AIDecisionCenterProps) {
  return (
    <motion.div
      className="glass p-6 border border-blue-500/20 h-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Brain className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="section-title text-base">AI Grid Decisions</h3>
        <div className="ml-auto flex items-center gap-2 text-xs text-eco-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <motion.div
            key={decision.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="glass p-3 border border-eco-border/30 hover:border-blue-500/30 transition-all cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-eco-dark">
                    {decision.action}
                  </span>
                  {decision.confidence && (
                    <div className="flex items-center gap-1 text-xs text-purple-500">
                      <Sparkles className="w-3 h-3" />
                      <span>{decision.confidence}%</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-eco-muted mt-1">Reason: {decision.reason}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-eco-primary font-medium">
                    Saving: {decision.saving}
                  </span>
                  <motion.span
                    className="text-eco-muted group-hover:text-eco-primary transition-colors flex items-center gap-1"
                    whileHover={{ x: 5 }}
                  >
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="mt-4 w-full text-center text-sm text-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-1"
        whileHover={{ x: 5 }}
      >
        View All Decisions
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}