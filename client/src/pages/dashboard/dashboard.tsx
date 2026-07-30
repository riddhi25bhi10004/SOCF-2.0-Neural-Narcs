import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, Snowflake, Cloud, Wind, Thermometer, Gauge } from 'lucide-react';
import { fetchTelemetry } from '../../services/api';
import type { TelemetryData } from '../../types';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/charts/LineChart';
import GaugeChart from '../../components/charts/GaugeChart';

function Dashboard() {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h'>('24h');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTelemetry();
        setTelemetry(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const chartData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    power: 120 + Math.sin(i / 24 * Math.PI * 2) * 40 + Math.random() * 10,
    carbon: 80 + Math.sin(i / 24 * Math.PI * 2) * 25 + Math.random() * 5,
  }));

  if (loading && !telemetry) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="glass p-4 animate-pulse">
            <div className="h-4 bg-eco-border/50 rounded w-20 mb-3" />
            <div className="h-8 bg-eco-border/50 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!telemetry) {
    return <div className="text-eco-muted text-center py-12">Failed to load telemetry data</div>;
  }

  const stressColor = telemetry.gridStress === 'low' ? '#10b981' : telemetry.gridStress === 'medium' ? '#f59e0b' : '#ef4444';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-eco-dark">Dashboard</h1>
        <div className="flex gap-2">
          {(['1h', '6h', '24h'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-eco-primary/20 text-eco-primary'
                  : 'bg-white text-eco-muted hover:text-eco-dark border border-eco-border'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Power" value={telemetry.power.toFixed(1)} unit="kW" trend={telemetry.power > 150 ? 'up' : 'down'} trendValue="3.2% vs avg" icon={<Activity className="w-4 h-4" />} color="eco-primary" />
        <MetricCard label="Water" value={telemetry.water.toFixed(0)} unit="L/hr" trend="down" trendValue="5.1% saved" icon={<Droplets className="w-4 h-4" />} color="blue-400" />
        <MetricCard label="Cooling Efficiency" value={telemetry.coolingEfficiency.toFixed(1)} unit="COP" trend={telemetry.coolingEfficiency > 3.0 ? 'up' : 'down'} trendValue="+0.3 this hour" icon={<Snowflake className="w-4 h-4" />} color="cyan-400" />
        <MetricCard label="Carbon" value={telemetry.carbon.toFixed(1)} unit="kg/h" trend="down" trendValue="2.8% reduced" icon={<Cloud className="w-4 h-4" />} color="eco-accent" />
        <MetricCard label="Renewable Share" value={telemetry.renewableShare.toFixed(0)} unit="%" trend={telemetry.renewableShare > 60 ? 'up' : 'down'} trendValue="+4.2% today" icon={<Wind className="w-4 h-4" />} color="eco-success" />
        <MetricCard label="Avg Temperature" value={telemetry.avgTemperature.toFixed(1)} unit="°C" trend={telemetry.avgTemperature > 25 ? 'up' : 'down'} trendValue="-0.5° from target" icon={<Thermometer className="w-4 h-4" />} color="eco-warning" />
        <MetricCard label="PUE" value={telemetry.pue.toFixed(2)} unit="" trend={telemetry.pue < 1.4 ? 'down' : 'up'} trendValue="Target: &lt;1.4" icon={<Gauge className="w-4 h-4" />} color="eco-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 glass p-4">
          <h3 className="section-title text-base mb-2">Power & Carbon (24h)</h3>
          <LineChart
            data={chartData}
            lines={[
              { key: 'power', color: '#10b981', name: 'Power (kW)' },
              { key: 'carbon', color: '#3b82f6', name: 'Carbon (kg)' },
            ]}
            xKey="hour"
            height={280}
            showArea
          />
        </div>
        <div className="glass p-4 flex flex-col items-center justify-center">
          <h3 className="section-title text-base mb-2">Grid Stress</h3>
          <GaugeChart
            value={telemetry.gridStress === 'low' ? 20 : telemetry.gridStress === 'medium' ? 55 : 85}
            label="Level"
            color={stressColor}
            size={180}
          />
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="section-title text-base mb-2">Renewable Share</h3>
        <LineChart
          data={chartData.map((d) => ({ ...d, renewable: 40 + Math.sin(parseInt(d.hour) / 24 * Math.PI * 2) * 20 + Math.random() * 5 }))}
          lines={[{ key: 'renewable', color: '#10b981', name: 'Renewable %' }]}
          xKey="hour"
          height={200}
        />
      </div>
    </motion.div>
  );
}

export default Dashboard;