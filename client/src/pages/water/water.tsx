import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sun, CloudRain, Wind } from 'lucide-react';
import { fetchWaterData } from '../../services/api';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/chart/LineChart';

function WeatherWidget() {
  const temp = 22.4;
  const humidity = 58;

  return (
    <div className="glass p-4 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
        <Sun className="w-6 h-6" />
      </div>
      <div>
        <div className="text-eco-dark font-semibold">{temp}°C</div>
        <div className="text-xs text-eco-muted">Partly Cloudy</div>
        <div className="flex items-center gap-1 text-xs text-eco-muted mt-0.5">
          <Wind className="w-3 h-3" />
          <span>Humidity {humidity}%</span>
        </div>
      </div>
    </div>
  );
}

function Water() {
  const [waterData, setWaterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchWaterData();
        setWaterData(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !waterData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass p-4 animate-pulse">
            <div className="h-4 bg-eco-border/50 rounded w-24 mb-3" />
            <div className="h-8 bg-eco-border/50 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  const usageData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    usage: 1200 + Math.sin(i / 24 * Math.PI * 2) * 400 + Math.random() * 100,
    recycling: 400 + Math.sin(i / 24 * Math.PI * 2) * 150 + Math.random() * 30,
  }));

  const recommendations = [
    'Cooling tower optimization active',
    'Rainwater harvest enabled',
    'Greywater recycling at 92%',
    'Leak detection: no issues',
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <Droplets className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold text-eco-dark">Water Intelligence</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total Usage" value={waterData?.totalUsage?.toFixed(0) || '3,842'} unit="L/day" icon={<Droplets className="w-4 h-4" />} color="blue-400" trend="down" trendValue="8.3% reduced" />
        <MetricCard label="Recycling Rate" value={waterData?.recyclingRate?.toFixed(0) || '92'} unit="%" icon={<CloudRain className="w-4 h-4" />} color="eco-primary" trend="up" trendValue="+2.1% this week" />
        <MetricCard label="PUE Impact" value={waterData?.pueImpact?.toFixed(2) || '1.38'} unit="" icon={<Wind className="w-4 h-4" />} color="eco-accent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <WeatherWidget />
        <div className="glass p-4 md:col-span-3">
          <h3 className="section-title text-base mb-2">24h Water Usage</h3>
          <LineChart
            data={usageData}
            lines={[
              { key: 'usage', color: '#3b82f6', name: 'Usage (L)' },
              { key: 'recycling', color: '#10b981', name: 'Recycled (L)' },
            ]}
            xKey="hour"
            height={180}
            showArea
          />
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="section-title text-base mb-3">Recommendation Chips</h3>
        <div className="flex flex-wrap gap-2">
          {recommendations.map((chip, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="px-3 py-1.5 rounded-full bg-eco-primary/10 text-eco-primary text-xs font-medium border border-eco-primary/20 hover:bg-eco-primary/20 transition-colors cursor-default"
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Water;