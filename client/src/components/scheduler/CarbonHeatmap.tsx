// client/src/components/scheduler/CarbonHeatmap.tsx
import { motion } from 'framer-motion';

interface CarbonHeatmapProps {
  isOptimized: boolean;
}

export default function CarbonHeatmap({ isOptimized }: CarbonHeatmapProps) {
  // Simulate rack data with carbon intensity
  const racks = [
    { id: 'Rack A', carbonIntensity: isOptimized ? 0.2 : 0.8, status: 'low' },
    { id: 'Rack B', carbonIntensity: isOptimized ? 0.4 : 1.0, status: isOptimized ? 'medium' : 'high' },
    { id: 'Rack C', carbonIntensity: isOptimized ? 0.1 : 0.6, status: isOptimized ? 'low' : 'medium' },
    { id: 'Rack D', carbonIntensity: isOptimized ? 0.3 : 0.9, status: isOptimized ? 'low' : 'high' },
    { id: 'Rack E', carbonIntensity: isOptimized ? 0.5 : 0.7, status: 'medium' },
  ];

  const getColor = (intensity: number) => {
    if (intensity < 0.3) return 'bg-green-500';
    if (intensity < 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getGlowColor = (intensity: number) => {
    if (intensity < 0.3) return 'rgba(34, 197, 94, 0.3)';
    if (intensity < 0.6) return 'rgba(234, 179, 8, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  };

  const getStatusText = (intensity: number) => {
    if (intensity < 0.3) return 'Renewable ✓';
    if (intensity < 0.6) return 'Mixed';
    return 'Fossil Fuel';
  };

  return (
    <motion.div 
      className="glass p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-base">Carbon Intensity Heatmap</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-eco-muted">Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-eco-muted">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-eco-muted">High</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {racks.map((rack, index) => (
          <motion.div
            key={rack.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: `0 0 30px ${getGlowColor(rack.carbonIntensity)}`
            }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="glass p-4 text-center border-2 border-transparent hover:border-eco-primary/30 transition-all">
              <div className="flex items-center justify-center mb-2">
                <div className={`w-16 h-16 rounded-full ${getColor(rack.carbonIntensity)} flex items-center justify-center`}>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-10 h-10 rounded-full bg-white/20"
                  />
                </div>
              </div>
              <p className="font-medium text-eco-dark">{rack.id}</p>
              <p className="text-sm text-eco-muted">
                {getStatusText(rack.carbonIntensity)}
              </p>
              <p className="text-xs text-eco-muted mt-1">
                {Math.round((1 - rack.carbonIntensity) * 100)}% cleaner
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}