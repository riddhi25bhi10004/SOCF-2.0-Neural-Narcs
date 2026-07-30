// client/src/components/grid/RunOptimization.tsx
import { motion } from 'framer-motion';
import { Play, Sparkles, Zap, TrendingDown, Battery, Leaf, RefreshCw, CheckCircle } from 'lucide-react';

interface RunOptimizationProps {
  onSimulate: () => void;
  isSimulating: boolean;
  isOptimized?: boolean;
  onReset?: () => void;
}

export default function RunOptimization({ 
  onSimulate, 
  isSimulating, 
  isOptimized = false,
  onReset 
}: RunOptimizationProps) {
  return (
    <motion.div
      className={`glass p-6 border text-center ${
        isOptimized ? 'border-green-500/40 bg-green-500/5' : 'border-purple-500/20'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-2 mb-4 justify-center">
        <div className={`p-1.5 rounded-lg ${
          isOptimized ? 'bg-green-500/10' : 'bg-purple-500/10'
        }`}>
          {isOptimized ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Sparkles className="w-5 h-5 text-purple-500" />
          )}
        </div>
        <h3 className="section-title text-base">
          {isOptimized ? '✅ Grid Optimized' : 'Run Optimization'}
        </h3>
        {isOptimized && (
          <span className="text-xs text-green-500 font-medium animate-pulse">• Active</span>
        )}
      </div>

      <p className="text-sm text-eco-muted mb-4">
        {isOptimized 
          ? 'Grid is running at peak efficiency - All systems stable'
          : 'Run AI optimization to improve grid performance'
        }
      </p>

      {!isOptimized ? (
        <motion.button
          onClick={onSimulate}
          disabled={isSimulating}
          className="btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSimulating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Optimizing...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Run Optimization
            </>
          )}
        </motion.button>
      ) : (
        <motion.button
          onClick={onReset}
          className="px-8 py-3 text-lg flex items-center gap-2 mx-auto rounded-lg border-2 border-green-500/30 text-green-600 hover:bg-green-500/10 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          Reset to Live Mode
        </motion.button>
      )}

      {isSimulating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 grid grid-cols-4 gap-2 text-xs"
        >
          <div className="glass p-2">
            <div className="flex items-center gap-1 text-green-500">
              <TrendingDown className="w-3 h-3" />
              <span>Grid Risk ↓</span>
            </div>
          </div>
          <div className="glass p-2">
            <div className="flex items-center gap-1 text-blue-500">
              <Zap className="w-3 h-3" />
              <span>Demand ↓</span>
            </div>
          </div>
          <div className="glass p-2">
            <div className="flex items-center gap-1 text-green-500">
              <Battery className="w-3 h-3" />
              <span>Battery ↑</span>
            </div>
          </div>
          <div className="glass p-2">
            <div className="flex items-center gap-1 text-eco-primary">
              <Leaf className="w-3 h-3" />
              <span>Carbon ↓</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}