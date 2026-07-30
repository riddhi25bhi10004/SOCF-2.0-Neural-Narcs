import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Clock, Server, ShieldCheck, Wifi, Calendar, Gauge } from 'lucide-react';

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-[#fffdfa] via-[#fffaf2] to-[#fef3d7] backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.08)]"
    >
      <div className="absolute inset-0 opacity-[0.03]" style={{ background: 'radial-gradient(circle at 20% 50%, #c97a1d 0%, transparent 50%)' }} />

      <div className="relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#c97a1d] to-[#e8bb4f] shadow-lg shadow-[#c97a1d]/20">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-eco-dark tracking-tight">PRITHVI Operations Center</h1>
              <p className="text-xs text-eco-muted mt-0.5">Sustainable Data Center Management Platform</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
              <Calendar className="h-3.5 w-3.5 text-eco-muted" />
              <span className="text-xs font-medium text-eco-dark">{formatDate(currentDate)}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2">
              <Clock className="h-3.5 w-3.5 text-eco-muted" />
              <span className="text-xs font-mono font-bold text-eco-dark">{formatTime(currentTime)}</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-emerald-50/80 px-3 py-2">
              <div className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <span className="text-xs font-semibold text-emerald-700">System Online</span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-violet-50/80 px-3 py-2">
              <Brain className="h-3.5 w-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-700">AI Monitoring Active</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-amber-200/60 pt-4">
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-eco-muted" />
            <span className="text-[11px] text-eco-muted">DC:</span>
            <span className="text-xs font-semibold text-eco-dark">Ashburn-01</span>
          </div>

          <div className="flex items-center gap-2">
            <Gauge className="h-3.5 w-3.5 text-eco-muted" />
            <span className="text-[11px] text-eco-muted">Health:</span>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-emerald-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600">94</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-eco-muted" />
            <span className="text-[11px] text-eco-muted">Uptime:</span>
            <span className="text-xs font-mono font-bold text-eco-dark">99.97%</span>
          </div>

          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-eco-muted" />
            <span className="text-[11px] text-eco-muted">Latency:</span>
            <span className="text-xs font-mono font-bold text-eco-dark">12ms</span>
          </div>

          <div className="ml-auto flex items-center gap-1.5 text-[11px] text-eco-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Last synced {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;