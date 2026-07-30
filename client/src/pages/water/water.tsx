// client/src/pages/water/Water.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets } from 'lucide-react';
import { fetchWaterData } from '../../services/api';

// Import components
import AIWaterStatus from '../../components/water/AIWaterStatus';
import WaterFlowVisualization from '../../components/water/WaterFlowVisualization';
import AIDecisionPanel from '../../components/water/AIDecisionPanel';
import WaterTankGauge from '../../components/water/WaterTankGauge';
import LeakDetectionCard from '../../components/water/LeakDetectionCard';
import RainForecastCard from '../../components/water/RainForecastCard';
import WaterQualityCard from '../../components/water/WaterQualityCard';
import AIRecommendationCard from '../../components/water/AIRecommendationCard';
import WaterEfficiencyScore from '../../components/water/WaterEfficiencyScore';
import EnvironmentalImpactCard from '../../components/water/EnvironmentalImpactCard';
import EnhancedWeatherWidget from '../../components/water/EnhanceWeatherWidget';
import BeforeAfterComparison from '../../components/water/BeforeAfterComparison';
import FloatingBubbles from '../../components/water/FloatingBubbles';

// ===== DEFINE TYPES LOCALLY TO AVOID IMPORT ISSUES =====
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

function Water() {
  const [waterData, setWaterData] = useState<WaterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWaterData();
        setWaterData(data as WaterData);
      } catch (error) {
        console.error('Failed to load water data:', error);
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mock data for when API fails
  const mockData: WaterData = {
    totalUsage: 3842,
    recyclingRate: 92,
    pueImpact: 1.38,
    waterSaved: 842,
    coolingEfficiency: 96,
    leakRisk: 0,
    aiConfidence: 98,
    storageLevel: 72,
    quality: {
      ph: 7.2,
      purity: 98,
      coolingSafe: true
    },
    recommendations: [
      {
        title: 'Shift cooling load to Tower B',
        saving: 180,
        priority: 'High',
        reason: 'Tower A at 85% capacity'
      },
      {
        title: 'Increase greywater recycling',
        saving: 95,
        priority: 'Medium',
        reason: 'Storage tank reached 85%'
      }
    ],
    beforeAI: 4200,
    afterAI: 3842,
    weather: {
      temp: 22.4,
      humidity: 58,
      rainProbability: 74,
      coolingDemand: 'Low',
      windSpeed: 12
    },
    decisions: [
      {
        action: 'Cooling tower flow reduced',
        reason: 'Outside temperature decreased',
        confidence: 98
      },
      {
        action: 'Greywater redirected',
        reason: 'Storage tank reached 85%',
        confidence: 96
      },
      {
        action: 'Rainwater harvesting enabled',
        reason: 'Rain forecast detected',
        confidence: 94
      }
    ],
    forecast: {
      rainExpected: true,
      estimatedHarvest: 1420,
      confidence: 91,
      timeFrame: 'Tomorrow'
    },
    environmentalImpact: {
      waterSaved: 842,
      carbonReduced: 12,
      energySaved: 18
    }
  };

  if (loading && !waterData) {
    return (
      <div className="relative min-h-screen">
        <FloatingBubbles />
        <div className="relative z-10 space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass p-6 animate-pulse">
              <div className="h-6 bg-eco-border/50 rounded w-48 mb-4" />
              <div className="h-12 bg-eco-border/50 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const data = waterData || mockData;

  return (
    <div className="relative min-h-screen">
      <FloatingBubbles />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
        className="relative z-10 space-y-6 px-4"
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="p-3 bg-blue-500/10 rounded-2xl">
            <Droplets className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-eco-dark">Water Intelligence</h1>
            <p className="text-sm text-eco-muted">AI-powered water management system</p>
          </div>
        </motion.div>

        {/* AI Water Status */}
        <AIWaterStatus data={data} />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WaterFlowVisualization />
          </div>
          <div>
            <AIDecisionPanel decisions={data.decisions} />
          </div>
        </div>

        {/* Water Tank + Leak Detection + Rain Forecast */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WaterTankGauge level={data.storageLevel} />
          <LeakDetectionCard />
          <RainForecastCard forecast={data.forecast} />
        </div>

        {/* Water Quality + Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WaterQualityCard quality={data.quality} />
          <div className="lg:col-span-2">
            <AIRecommendationCard recommendations={data.recommendations} />
          </div>
        </div>

        {/* Efficiency Score + Environmental Impact + Weather */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WaterEfficiencyScore score={92} />
          <EnvironmentalImpactCard impact={data.environmentalImpact} />
          <EnhancedWeatherWidget weather={data.weather} />
        </div>

        {/* Before vs After Comparison */}
        <BeforeAfterComparison before={data.beforeAI} after={data.afterAI} />
      </motion.div>
    </div>
  );
}

export default Water;