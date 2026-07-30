// client/src/components/water/AIDecisionPanel.tsx
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface Decision {
  action: string;
  reason: string;
  confidence: number;
}

interface AIDecisionPanelProps {
  decisions: Decision[];
}

export default function AIDecisionPanel({ decisions }: AIDecisionPanelProps) {
  return (
    <motion.div
      className="glass p-6 h-full border border-purple-500/20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-purple-500/10 rounded-lg">
          <Brain className="w-5 h-5 text-purple-500" />
        </div>
        <h3 className="section-title text-base"> Water Decisions</h3>
        <div className="ml-auto flex items-center gap-2 text-xs text-eco-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Live
        </div>
      </div>

      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            className="glass p-3 border border-eco-border/30 hover:border-purple-500/30 transition-all"
          >
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-eco-dark">{decision.action}</span>
                  <div className="flex items-center gap-1 text-xs text-purple-500">
                    <Sparkles className="w-3 h-3" />
                    <span>{decision.confidence}%</span>
                  </div>
                </div>
                <p className="text-xs text-eco-muted mt-1">Reason: {decision.reason}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="mt-4 w-full text-center text-sm text-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-1"
        whileHover={{ x: 5 }}
      >
        View All Decisions
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}