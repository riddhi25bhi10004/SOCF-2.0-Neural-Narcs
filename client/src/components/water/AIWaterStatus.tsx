// client/src/components/water/AIWaterStatus.tsx
import { motion } from 'framer-motion';
import { Droplets, Zap, Shield, Gauge, Sparkles, Activity } from 'lucide-react';

// ===== DEFINE TYPES LOCALLY =====
interface WaterQuality {
  ph: number;
  purity: number;
  coolingSafe: boolean;
}

interface Recommendation {
  title: string;
  saving: number;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

interface Weather {
  temp: number;
  humidity: number;
  rainProbability: number;
  coolingDemand: string;
  windSpeed: number;
}

interface Decision {
  action: string;
  reason: string;
  confidence: number;
}

interface Forecast {
  rainExpected: boolean;
  estimatedHarvest: number;
  confidence: number;
  timeFrame: string;
}

interface EnvironmentalImpact {
  waterSaved: number;
  carbonReduced: number;
  energySaved: number;
}

interface WaterData {
  totalUsage: number;
  recyclingRate: number;
  pueImpact: number;
  waterSaved: number;
  coolingEfficiency: number;
  leakRisk: number;
  aiConfidence: number;
  storageLevel: number;
  quality: WaterQuality;
  recommendations: Recommendation[];
  beforeAI: number;
  afterAI: number;
  weather: Weather;
  decisions: Decision[];
  forecast: Forecast;
  environmentalImpact: EnvironmentalImpact;
}

interface AIWaterStatusProps {
  data: WaterData;
}

export default function AIWaterStatus({ data }: AIWaterStatusProps) {
  const statusItems = [
    {
      icon: <Droplets className="w-5 h-5" />,
      label: 'Water Saved Today',
      value: `${data.waterSaved} L`,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      icon: <Gauge className="w-5 h-5" />,
      label: 'Cooling Efficiency',
      value: `${data.coolingEfficiency}%`,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: <Activity className="w-5 h-5" />,
      label: 'Recycling Rate',
      value: `${data.recyclingRate}%`,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'System Confidence',
      value: `${data.aiConfidence}%`,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-glow p-6 border border-blue-500/20 relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 animate-pulse" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <Droplets className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-eco-dark">Water Intelligence</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-eco-muted">Optimizing</span>
                <span className="text-eco-muted">•</span>
                <span className="text-eco-muted">Active for 30 mins</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium text-green-600">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {statusItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-4 text-center border border-eco-border/30 hover:border-blue-500/30 transition-all"
            >
              <div className={`p-2 rounded-lg ${item.bg} inline-block mb-2`}>
                <span className={item.color}>{item.icon}</span>
              </div>
              <p className="text-2xl font-bold text-eco-dark">{item.value}</p>
              <p className="text-xs text-eco-muted">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}