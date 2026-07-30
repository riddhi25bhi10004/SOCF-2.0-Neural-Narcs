import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Wand2, TrendingDown, Server, Zap } from 'lucide-react';
import { fetchSchedule } from '../../services/api';
import type { Job } from '../../types';
import LineChart from '../../components/charts/LineChart';

function Scheduler() {
  const [schedule, setSchedule] = useState<{ current: Job[]; optimized: Job[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'current' | 'optimized'>('current');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSchedule();
        setSchedule(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !schedule) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="glass p-8 animate-pulse">Loading scheduler...</div>
      </div>
    );
  }

  if (!schedule) {
    return <div className="text-eco-muted text-center py-12">Failed to load schedule data</div>;
  }

  const jobs = view === 'current' ? schedule.current : schedule.optimized;
  const typeColors = { 'AI Training': '#10b981', 'Batch ETL': '#3b82f6', 'Backup': '#f59e0b', 'Inference': '#8b5cf6' };

  const savings = {
    energy: view === 'optimized' ? 23 : 0,
    carbon: view === 'optimized' ? 18 : 0,
    cost: view === 'optimized' ? 31 : 0,
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-eco-primary" />
        <h1 className="text-2xl font-bold text-eco-dark">Workload Scheduler</h1>
      </div>

      {savings.energy > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-glow p-4 mb-6 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-eco-primary" />
            <span className="text-eco-primary font-mono font-bold">{savings.energy}% Energy Savings</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-eco-accent" />
            <span className="text-eco-accent font-mono font-bold">{savings.carbon}% Carbon Reduction</span>
          </div>
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-eco-success" />
            <span className="text-eco-success font-mono font-bold">{savings.cost}% Cost Savings</span>
          </div>
        </motion.div>
      )}

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView('current')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'current' ? 'bg-eco-primary/20 text-eco-primary' : 'bg-white text-eco-muted hover:text-eco-dark border border-eco-border'}`}
        >
          Current Schedule
        </button>
        <button
          onClick={() => setView('optimized')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'optimized' ? 'bg-eco-primary/20 text-eco-primary' : 'bg-white text-eco-muted hover:text-eco-dark border border-eco-border'}`}
        >
          <Wand2 className="w-3.5 h-3.5 inline mr-1" />
          AI-Optimized
        </button>
      </div>

      <div className="glass p-4 mb-6">
        <h3 className="section-title text-base mb-3">Job Timeline</h3>
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-eco-surface/50 border border-eco-border/30"
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: typeColors[job.type] }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-eco-dark truncate">{job.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-eco-card text-eco-muted border border-eco-border/50">{job.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-eco-muted mt-1">
                  <span>{job.rack}</span>
                  <span>{job.start} → {job.end}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-sm font-mono text-eco-text">{job.power} kW</div>
                <div className="text-xs text-eco-muted">Priority {job.priority}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass p-4">
        <h3 className="section-title text-base mb-2">Power Consumption (24h)</h3>
        <LineChart
          data={Array.from({ length: 24 }, (_, i) => ({
            hour: `${i}:00`,
            current: 100 + Math.sin(i / 24 * Math.PI * 2) * 30 + Math.random() * 10,
            optimized: 70 + Math.sin(i / 24 * Math.PI * 2) * 20 + Math.random() * 5,
          }))}
          lines={[
            { key: 'current', color: '#6b7280', name: 'Current (kW)' },
            { key: 'optimized', color: '#10b981', name: 'Optimized (kW)' },
          ]}
          xKey="hour"
          height={220}
          showArea
        />
      </div>
    </motion.div>
  );
}

export default Scheduler;