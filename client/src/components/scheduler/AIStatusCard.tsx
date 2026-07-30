// client/src/components/scheduler/AIStatusCard.tsx
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, Cpu, Gauge, Leaf, CheckCircle2 } from 'lucide-react';

interface AIStatusProps {
  status: {
    status: string;
    message: string;
    confidence: number;
    carbonSaved: number;
    peakLoad: { start: string; end: string };
    suggestion: string;
  };
  isOptimizing: boolean;
}

export default function AIStatusCard({ status, isOptimizing }: AIStatusProps) {
  return (
    <motion.div 
      className="glass-glow p-6 border border-eco-primary/20"
      animate={{
        borderColor: isOptimizing ? '#f59e0b' : status.status === 'completed' ? '#10b981' : '#6b7280'
      }}
    >
      <div className="grid grid-cols-4 gap-6">
        {/* Status */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isOptimizing ? 'bg-yellow-500/20' : status.status === 'completed' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
            {isOptimizing ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </motion.div>
            ) : status.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Cpu className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-eco-muted">AI Status</p>
            <p className="font-semibold text-eco-dark">
              {isOptimizing ? 'Optimizing...' : status.status === 'completed' ? 'Optimized ✓' : 'Active'}
            </p>
            <p className="text-xs text-eco-muted">{status.message}</p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Gauge className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-eco-muted">Confidence</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-eco-dark">{status.confidence}</span>
              <span className="text-sm text-eco-muted">%</span>
            </div>
            <div className="w-24 h-1 bg-eco-border rounded-full mt-1">
              <motion.div 
                className="h-full bg-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${status.confidence}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>

        {/* Peak Load */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-red-500/20">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-eco-muted">Peak Load Detected</p>
            <p className="font-semibold text-eco-dark">{status.peakLoad.start} - {status.peakLoad.end}</p>
            <p className="text-xs text-eco-muted">High energy demand</p>
          </div>
        </div>

        {/* Carbon Saved */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <Leaf className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-eco-muted">Carbon Saved</p>
            <p className="text-2xl font-bold text-green-500">{status.carbonSaved}</p>
            <p className="text-xs text-eco-muted">kg CO₂ avoided</p>
          </div>
        </div>
      </div>

      {/* Suggestion */}
      {status.suggestion && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-eco-primary/10 rounded-lg border border-eco-primary/20"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-eco-primary" />
            <span className="text-sm font-medium text-eco-dark">Suggested Action:</span>
            <span className="text-sm text-eco-text">{status.suggestion}</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}