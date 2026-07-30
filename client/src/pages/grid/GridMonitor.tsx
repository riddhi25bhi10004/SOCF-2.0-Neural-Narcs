import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, AlertTriangle, TrendingDown, Zap } from 'lucide-react';
import { fetchGridData } from '../../services/api';
import MetricCard from '../../components/ui/MetricCard';
import LineChart from '../../components/chart/LineChart';

function GridMonitor() {
  const [gridData, setGridData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGridData();
        setGridData(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !gridData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="glass p-8 animate-pulse">Loading grid data...</div>
      </div>
    );
  }

  if (!gridData) {
    return <div className="text-eco-muted text-center py-12">Failed to load grid data</div>;
  }

  const riskLevel = gridData.riskLevel || 'medium';
  const riskColor = riskLevel === 'low' ? '#10b981' : riskLevel === 'medium' ? '#f59e0b' : '#ef4444';

  const gridDemandData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    gridDemand: 800 + Math.sin(i / 24 * Math.PI * 2) * 200 + Math.random() * 50,
    dcDemand: 120 + Math.sin(i / 24 * Math.PI * 2) * 40 + Math.random() * 10,
  }));

  const demandResponseExamples = [
    { title: 'Pre-cooling', desc: 'Pre-cool thermal storage during off-peak grid hours', impact: '15% peak reduction' },
    { title: 'Load Shifting', desc: 'Shift batch jobs to low-demand periods', impact: '12% cost savings' },
    { title: 'Battery Reserve', desc: 'Discharge battery during peak grid pricing', impact: '8% grid draw offset' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <Grid3x3 className="w-6 h-6 text-eco-accent" />
        <h1 className="text-2xl font-bold text-eco-dark">Grid Stress Monitor</h1>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <MetricCard label="Grid Demand" value={gridData.gridDemand?.toFixed(0) || '843'} unit="MW" icon={<Zap className="w-4 h-4" />} color="eco-accent" trend="up" trendValue="Peak approaching" />
        <MetricCard label="DC Demand" value={gridData.dcDemand?.toFixed(0) || '142'} unit="MW" icon={<Zap className="w-4 h-4" />} color="eco-primary" trend="down" trendValue="Optimized" />
        <MetricCard label="Risk Level" value={riskLevel.toUpperCase()} unit="" icon={<AlertTriangle className="w-4 h-4" />} color={riskColor === '#10b981' ? 'eco-success' : riskColor === '#f59e0b' ? 'eco-warning' : 'eco-danger'} />
      </div>

      <div className="glass p-4 mb-6">
        <h3 className="section-title text-base mb-2">Grid vs DC Demand (24h)</h3>
        <LineChart
          data={gridDemandData}
          lines={[
            { key: 'gridDemand', color: '#f59e0b', name: 'Grid Demand (MW)' },
            { key: 'dcDemand', color: '#10b981', name: 'DC Demand (MW)' },
          ]}
          xKey="hour"
          height={250}
        />
      </div>

      <div className="glass p-4 mb-6">
        <h3 className="section-title text-base mb-3">Risk Indicator</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-eco-border/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: riskColor }}
              initial={{ width: 0 }}
              animate={{ width: riskLevel === 'low' ? '35%' : riskLevel === 'medium' ? '65%' : '90%' }}
              transition={{ duration: 1 }}
            />
          </div>
          <span className="text-xs font-mono text-eco-muted">{riskLevel.toUpperCase()} RISK</span>
        </div>
        <div className="flex justify-between mt-2 text-xs text-eco-muted">
          <span>Low</span><span>Medium</span><span>High</span>
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="section-title text-base mb-3">Demand Response Strategies</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demandResponseExamples.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-eco-primary" />
                <span className="text-sm font-medium text-eco-dark">{item.title}</span>
              </div>
              <p className="text-xs text-eco-muted mb-2">{item.desc}</p>
              <span className="text-xs font-mono text-eco-primary">{item.impact}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default GridMonitor;