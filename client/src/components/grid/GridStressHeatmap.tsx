// client/src/components/grid/GridStressHeatmap.tsx
import { motion } from 'framer-motion';
import type { GridZone } from '../../types';

interface GridStressHeatmapProps {
  zones: GridZone[];
}

export default function GridStressHeatmap({ zones }: GridStressHeatmapProps) {
  return (
    <motion.div
      className="glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-base">Grid Zones</h3>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-eco-muted">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-eco-muted">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-eco-muted">High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-eco-muted">Critical</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <motion.div
              className="glass p-4 text-center border-2 transition-all cursor-pointer"
              style={{
                borderColor: zone.color,
                boxShadow: `0 0 30px ${zone.color}20`,
              }}
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: [
                  `0 0 20px ${zone.color}10`,
                  `0 0 40px ${zone.color}30`,
                  `0 0 20px ${zone.color}10`,
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-eco-dark">{zone.name}</span>
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: zone.color }}
                />
              </div>
              <div className="text-2xl font-bold" style={{ color: zone.color }}>
                {Math.round(zone.load)}%
              </div>
              <div className="text-xs text-eco-muted">Load</div>
              
              {/* Progress bar */}
              <div className="mt-2 h-1 bg-eco-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: zone.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.load}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}