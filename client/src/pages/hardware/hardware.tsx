import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, HardDrive, Fan, Battery } from 'lucide-react';
import { fetchHardware } from '../../services/api';
import type { HardwareComponent } from '../../types/index';
import HealthBar from '../../components/chart/HealthBar';

const componentIcons = {
  GPU: <Cpu className="w-5 h-5 text-eco-primary" />,
  CPU: <Server className="w-5 h-5 text-eco-accent" />,
  SSD: <HardDrive className="w-5 h-5 text-blue-400" />,
  Fan: <Fan className="w-5 h-5 text-eco-warning" />,
  PSU: <Battery className="w-5 h-5 text-eco-danger" />,
};

function Hardware() {
  const [hardware, setHardware] = useState<HardwareComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchHardware();
        setHardware(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="glass p-4 animate-pulse">
            <div className="h-4 bg-eco-border/50 rounded w-12 mb-3" />
            <div className="h-2 bg-eco-border/50 rounded w-full mb-2" />
            <div className="h-2 bg-eco-border/50 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  const avgHealth = hardware.length ? Math.round(hardware.reduce((s, c) => s + c.health, 0) / hardware.length) : 0;
  const healthColor = avgHealth > 80 ? '#10b981' : avgHealth > 50 ? '#f59e0b' : '#ef4444';
  const eWasteAvoided = hardware.filter((c) => c.failureRisk === 'high' && c.health > 30).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
          <Cpu className="w-6 h-6 text-eco-primary" />
        <h1 className="text-2xl font-bold text-eco-dark">Hardware Lifecycle</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass p-4">
          <div className="text-xs text-eco-muted uppercase tracking-wider mb-1">Aggregate Health</div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold font-mono text-eco-dark">{avgHealth}</span>
            <span className="text-lg text-eco-muted mb-1">/100</span>
          </div>
          <HealthBar value={avgHealth} label="Overall" color={healthColor} max={100} />
        </div>
        <div className="glass p-4">
          <div className="text-xs text-eco-muted uppercase tracking-wider mb-1">Components Tracked</div>
          <div className="text-3xl font-bold font-mono text-eco-dark">{hardware.length}</div>
          <div className="text-xs text-eco-muted mt-2">Across {new Set(hardware.map((c) => c.rack)).size} racks</div>
        </div>
        <div className="glass p-4">
          <div className="text-xs text-eco-muted uppercase tracking-wider mb-1">E-Waste Avoided</div>
          <div className="text-3xl font-bold font-mono text-eco-success">{eWasteAvoided}</div>
          <div className="text-xs text-eco-muted mt-2">Preventive replacements</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {hardware.map((comp, i) => {
          const riskColor = comp.failureRisk === 'low' ? '#10b981' : comp.failureRisk === 'medium' ? '#f59e0b' : '#ef4444';
          return (
            <motion.div
              key={comp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass p-4 flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-eco-surface flex items-center justify-center">
                  {componentIcons[comp.type]}
                </div>
                <div>
                  <div className="text-sm font-medium text-eco-dark">{comp.type}</div>
                  <div className="text-xs text-eco-muted">{comp.rack}</div>
                </div>
              </div>
              <HealthBar value={comp.health} label="Health" color={comp.health > 70 ? '#10b981' : comp.health > 40 ? '#f59e0b' : '#ef4444'} max={100} />
              <div className="flex justify-between text-xs text-eco-muted">
                <span>Lifespan: {comp.lifespan}%</span>
                <span style={{ color: riskColor }}>{comp.failureRisk}</span>
              </div>
              {comp.recommendation && (
                <div className="text-xs text-eco-warning bg-eco-warning/5 rounded-lg p-2">
                  {comp.recommendation}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Hardware;