// client/src/components/grid/GridStatusCard.tsx
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, Zap, Shield } from 'lucide-react';
import type { GridStatus } from '../../types';

interface GridStatusCardProps {
  status: GridStatus;
  optimizationScore: number;
  isOptimized?: boolean;
}

export default function GridStatusCard({ 
  status, 
  optimizationScore, 
  isOptimized = false 
}: GridStatusCardProps) {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'critical':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case 'medium':
        return <Info className="w-8 h-8 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  const getStatusMessage = () => {
    switch (status.status) {
      case 'critical':
        return 'Immediate action required! Grid under extreme stress.';
      case 'high':
        return 'High stress detected. AI optimizing resources.';
      case 'medium':
        return 'Moderate stress. Grid performing within limits.';
      case 'low':
        return 'Grid stable. All systems operating optimally.';
      default:
        return 'Grid status unknown.';
    }
  };

  return (
    <motion.div
      className="glass p-6 border border-eco-border/30"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-start gap-4">
        {/* Status Icon with Pulse */}
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {getStatusIcon()}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ 
              border: `2px solid ${getStatusColor()}`,
              opacity: 0.3,
            }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-eco-dark">Grid Status</h3>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${getStatusColor()}20`,
                    color: getStatusColor(),
                  }}
                >
                  {isOptimized ? 'OPTIMIZED ✓' : 'LIVE'}
                </span>
              </div>
              <motion.div
                className="text-2xl font-bold mt-1"
                style={{ color: getStatusColor() }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {status.icon} {status.label}
              </motion.div>
            </div>

            {/* Optimization Score */}
            <div className="text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: 175.93, strokeDashoffset: 175.93 }}
                    animate={{ 
                      strokeDashoffset: 175.93 - (optimizationScore / 100) * 175.93 
                    }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span 
                    className="text-sm font-bold text-eco-dark"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {Math.round(optimizationScore)}%
                  </motion.span>
                </div>
              </div>
              <p className="text-[10px] text-eco-muted mt-1">Optimization</p>
            </div>
          </div>

          {/* Status Message */}
          <motion.p 
            className="text-sm text-eco-muted mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {isOptimized ? '✅ Grid optimized - All systems stable' : getStatusMessage()}
          </motion.p>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 mt-3">
            <motion.button
              className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: `${getStatusColor()}20`,
                color: getStatusColor(),
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                View Details
              </div>
            </motion.button>
            <motion.button
              className="px-3 py-1 rounded-lg text-xs font-medium bg-eco-primary/10 text-eco-primary transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Optimize Now
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}