import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, Network, Fan, Battery, Zap, Activity } from 'lucide-react';
import HealthBar from '../charts/HealthBar';

interface InfrastructureItem {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
  status: 'optimal' | 'nominal' | 'elevated' | 'warning';
  detail: string;
}

function InfrastructurePanel() {
  const items: InfrastructureItem[] = [
    { label: 'Healthy Servers', value: 47, max: 50, color: '#10b981', icon: <Server className="h-4 w-4" />, status: 'optimal', detail: '47 of 50 operational' },
    { label: 'GPU Usage', value: 78, max: 100, color: '#8b5cf6', icon: <Cpu className="h-4 w-4" />, status: 'nominal', detail: 'Avg across 12 GPUs' },
    { label: 'CPU Usage', value: 62, max: 100, color: '#3b82f6', icon: <Activity className="h-4 w-4" />, status: 'nominal', detail: 'Avg across 48 cores' },
    { label: 'Storage', value: 71, max: 100, color: '#f59e0b', icon: <HardDrive className="h-4 w-4" />, status: 'elevated', detail: '14.2 TB / 20 TB' },
    { label: 'Network', value: 85, max: 100, color: '#06b6d4', icon: <Network className="h-4 w-4" />, status: 'nominal', detail: '850 Gbps throughput' },
    { label: 'Cooling Units', value: 92, max: 100, color: '#0ea5e9', icon: <Fan className="h-4 w-4" />, status: 'nominal', detail: '18 of 20 active' },
    { label: 'UPS Status', value: 98, max: 100, color: '#10b981', icon: <Battery className="h-4 w-4" />, status: 'optimal', detail: 'All units online' },
    { label: 'Power Distribution', value: 88, max: 100, color: '#c97a1d', icon: <Zap className="h-4 w-4" />, status: 'nominal', detail: '880 kW / 1000 kW capacity' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Server className="h-4 w-4 text-eco-primary" />
        <h3 className="text-sm font-bold text-eco-dark">Infrastructure</h3>
        <span className="ml-auto text-[10px] text-eco-muted font-medium">8 subsystems</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white/50 border border-amber-100/60 p-3 hover:bg-white/80 transition-colors duration-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-eco-muted">
                {item.icon}
              </div>
              <span className="text-[11px] font-medium text-eco-muted">{item.label}</span>
            </div>
            <HealthBar value={item.value} label={item.label} max={item.max} color={item.color} />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-eco-muted">{item.detail}</span>
              <span className={`text-[10px] font-semibold ${item.status === 'optimal' ? 'text-emerald-600' : item.status === 'warning' ? 'text-red-600' : item.status === 'elevated' ? 'text-amber-600' : 'text-slate-500'}`}>
                {item.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default InfrastructurePanel;