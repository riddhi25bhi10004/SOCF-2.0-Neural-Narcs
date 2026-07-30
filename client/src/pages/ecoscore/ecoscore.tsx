import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gauge as GaugeIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { fetchEcoScore } from '../../services/api';
import type { EcoScoreBreakdown } from '../../types';
import GaugeChart from '../../components/chart/GaugeChart';
import HealthBar from '../../components/chart/HealthBar';
import LineChart from '../../components/chart/LineChart';

function EcoScore() {
  const [scoreData, setScoreData] = useState<EcoScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchEcoScore();
        setScoreData(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !scoreData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="glass p-8 animate-pulse">Loading EcoScore...</div>
      </div>
    );
  }

  if (!scoreData) {
    return <div className="text-eco-muted text-center py-12">Failed to load EcoScore data</div>;
  }

  const trend = Math.random() > 0.5 ? 'up' as const : 'down' as const;

  const breakdownBars = [
    { label: 'Energy Efficiency', value: scoreData.energyEfficiency, color: '#10b981' },
    { label: 'Water Efficiency', value: scoreData.waterEfficiency, color: '#3b82f6' },
    { label: 'Cooling Efficiency', value: scoreData.coolingEfficiency, color: '#06b6d4' },
    { label: 'Carbon Intensity', value: scoreData.carbonIntensity, color: '#f59e0b' },
    { label: 'Renewable Usage', value: scoreData.renewableUsage, color: '#10b981' },
    { label: 'Hardware Health', value: scoreData.hardwareHealth, color: '#8b5cf6' },
  ];

  const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    score: 65 + Math.sin(i / 30 * Math.PI * 4) * 15 + Math.random() * 5,
  }));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <GaugeIcon className="w-6 h-6 text-eco-primary" />
        <h1 className="text-2xl font-bold text-eco-dark">EcoScore</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass p-6 flex flex-col items-center justify-center">
          <h3 className="section-title text-base mb-2">Overall Score</h3>
          <GaugeChart
            value={scoreData.overall}
            label="score"
            color={scoreData.overall > 75 ? '#10b981' : scoreData.overall > 50 ? '#f59e0b' : '#ef4444'}
            size={220}
          />
          <div className="flex items-center gap-1 mt-2 text-sm">
            {trend === 'up' ? <TrendingUp className="w-4 h-4 text-eco-success" /> : <TrendingDown className="w-4 h-4 text-eco-danger" />}
            <span className={trend === 'up' ? 'text-eco-success' : 'text-eco-danger'}>
              {trend === 'up' ? 'Improving' : 'Declining'} this week
            </span>
          </div>
        </div>

        <div className="glass p-4">
          <h3 className="section-title text-base mb-2">Breakdown</h3>
          <div className="flex flex-col gap-3">
            {breakdownBars.map((bar, i) => (
              <div key={i}>
                <HealthBar value={bar.value} label={bar.label} color={bar.color} max={100} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="section-title text-base mb-2">30-Day Trend</h3>
        <LineChart
          data={trendData}
          lines={[{ key: 'score', color: '#10b981', name: 'EcoScore' }]}
          xKey="day"
          height={220}
        />
      </div>
    </motion.div>
  );
}

export default EcoScore;