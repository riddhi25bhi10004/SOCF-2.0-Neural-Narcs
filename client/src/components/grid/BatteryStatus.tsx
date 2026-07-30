// client/src/components/grid/BatteryStatus.tsx
import { motion } from 'framer-motion';
import { Battery, Zap, Clock, Plug } from 'lucide-react';
import type { BatteryStatus } from '../../types';

interface BatteryStatusProps {
  battery: BatteryStatus;
}

export default function BatteryStatus({ battery }: BatteryStatusProps) {
  const getColor = () => {
    if (battery.level < 30) return '#ef4444';
    if (battery.level < 60) return '#f59e0b';
    return '#10b981';
  };

  return (
    <motion.div
      className="glass p-6 border border-green-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-green-500/10 rounded-lg">
          <Battery className="w-5 h-5 text-green-500" />
        </div>
        <h3 className="section-title text-base">Battery</h3>
        <div className="ml-auto flex items-center gap-1 text-xs">
          {battery.charging ? (
            <span className="text-green-500 flex items-center gap-1">
              <Plug className="w-3 h-3" />
              Charging
            </span>
          ) : (
            <span className="text-yellow-500">Discharging</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Battery visual */}
        <div className="relative">
          <div className="w-full h-8 bg-eco-border/30 rounded-full overflow-hidden border-2 border-eco-border/50">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${getColor()}88, ${getColor()})`,
                boxShadow: `0 0 20px ${getColor()}40`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${battery.level}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              {/* Animated shine */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {Math.round(battery.level)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-eco-muted">
              <Clock className="w-3 h-3" />
              <span className="text-xs">Backup</span>
            </div>
            <p className="font-bold text-eco-dark">{battery.estimatedBackup}</p>
          </div>
          <div className="glass p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-eco-muted">
              <Zap className="w-3 h-3" />
              <span className="text-xs">Capacity</span>
            </div>
            <p className="font-bold text-eco-dark">{battery.capacity} kWh</p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-eco-muted">Status</span>
          <div className="flex items-center gap-2">
            <div 
              className={`w-2 h-2 rounded-full ${battery.charging ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}
            />
            <span className={battery.charging ? 'text-green-500' : 'text-yellow-500'}>
              {battery.charging ? 'Charging' : 'Discharging'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}