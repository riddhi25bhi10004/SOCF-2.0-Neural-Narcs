// client/src/pages/scheduler/Scheduler.tsx
import { useState, useEffect } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import { 
  Server, Zap, Activity, Leaf, Cpu, Wand2, CheckCircle2
} from 'lucide-react';
import { fetchSchedule } from '../../services/api';
import type { Job } from '../../types/index';
import { useInView } from 'react-intersection-observer';

// Import new components
import AIStatusCard from '../../components/scheduler/AIStatusCard';
import GanttChart from '../../components/scheduler/GanttChart';
import CarbonHeatmap from '../../components/scheduler/CarbonHeatmap';
import SavingsCounter from '../../components/scheduler/SavingsCounter';

function Scheduler() {
  const [schedule, setSchedule] = useState<{ current: Job[]; optimized: Job[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOptimized, setIsOptimized] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [migratingJobs, setMigratingJobs] = useState<Record<string, boolean>>({});
  const [aiStatus, setAIStatus] = useState({
    status: 'idle',
    message: 'Ready to optimize',
    confidence: 96,
    carbonSaved: 18.4,
    peakLoad: { start: '14:00', end: '17:00' },
    suggestion: 'Move AI Training to 22:00 for 31% cost reduction'
  });

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchSchedule();
        setSchedule(data);
        analyzeWorkload(data.current);
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  const analyzeWorkload = (jobs: Job[]) => {
    // Simulate AI analysis - replace with actual logic
    const peakHours = findPeakHours(jobs);
    setAIStatus(prev => ({
      ...prev,
      peakLoad: peakHours,
      carbonSaved: isOptimized ? 23.6 : 18.4
    }));
  };

  const findPeakHours = (jobs: Job[]) => {
    // Simple peak detection - enhance with real logic
    if (!jobs.length) return { start: '14:00', end: '17:00' };
    const start = jobs[0].start || '14:00';
    const end = jobs[jobs.length - 1].end || '17:00';
    return { start, end };
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setAIStatus(prev => ({ 
      ...prev, 
      status: 'optimizing', 
      message: 'Optimizing workload distribution...' 
    }));
    
    // Animate job migrations
    if (schedule) {
      schedule.current.forEach((job, index) => {
        setTimeout(() => {
          setMigratingJobs(prev => ({ ...prev, [job.id]: true }));
        }, 1000 + (index * 300));
      });
    }

    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3500));
    
    setIsOptimized(true);
    setIsOptimizing(false);
    setAIStatus(prev => ({ 
      ...prev, 
      status: 'completed', 
      message: 'Optimization complete! 23% energy savings achieved',
      confidence: 98,
      carbonSaved: 23.6
    }));
  };

  const resetOptimization = () => {
    setIsOptimized(false);
    setMigratingJobs({});
    setAIStatus(prev => ({ 
      ...prev, 
      status: 'idle', 
      message: 'Ready to optimize',
      confidence: 96,
      carbonSaved: 18.4
    }));
  };

  if (loading && !schedule) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="glass p-8 animate-pulse">Loading AI Scheduler...</div>
      </div>
    );
  }

  if (!schedule) {
    return <div className="text-eco-muted text-center py-12">Failed to load schedule data</div>;
  }

  const displayJobs = isOptimized ? schedule.optimized : schedule.current;

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-eco-primary/10 rounded-xl">
            <Cpu className="w-6 h-6 text-eco-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-eco-dark">Command Center</h1>
            <p className="text-sm text-eco-muted">Intelligent workload orchestration</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-eco-primary/10 rounded-full">
            <div className={`w-2 h-2 rounded-full ${aiStatus.status === 'optimizing' ? 'animate-pulse bg-yellow-500' : aiStatus.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="text-sm font-medium text-eco-dark">
              {aiStatus.status === 'optimizing' ? 'Optimizing...' : 
               aiStatus.status === 'completed' ? 'Optimized ✓' : 'Active'}
            </span>
          </div>
          {!isOptimized ? (
            <button
              onClick={handleOptimize}
              disabled={isOptimizing}
              className="btn-primary flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {isOptimizing ? 'Optimizing...' : 'Run AI Optimization'}
            </button>
          ) : (
            <button
              onClick={resetOptimization}
              className="btn-secondary flex items-center gap-2"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* AI Status Cards */}
      <AIStatusCard status={aiStatus} isOptimizing={isOptimizing} />

      {/* Savings Counters - Animated */}
      <div ref={ref} className="grid grid-cols-4 gap-4">
        <SavingsCounter 
          icon={<Zap className="w-4 h-4" />}
          label="Energy Saved"
          value={isOptimized ? 23 : 0}
          suffix="%"
          color="#10b981"
          inView={inView}
        />
        <SavingsCounter 
          icon={<Leaf className="w-4 h-4" />}
          label="Carbon Saved"
          value={isOptimized ? 18 : 0}
          suffix="%"
          color="#8b5cf6"
          inView={inView}
        />
        <SavingsCounter 
          icon={<Server className="w-4 h-4" />}
          label="Cost Savings"
          value={isOptimized ? 31 : 0}
          suffix="%"
          color="#f59e0b"
          inView={inView}
        />
        <SavingsCounter 
          icon={<Activity className="w-4 h-4" />}
          label="Efficiency Gain"
          value={isOptimized ? 27 : 0}
          suffix="%"
          color="#3b82f6"
          inView={inView}
        />
      </div>

      {/* Gantt Chart with animated job migration */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title text-base">Workload Timeline</h3>
          <div className="flex items-center gap-2 text-xs text-eco-muted">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-eco-primary/30" />
              <span>Current</span>
            </div>
            {isOptimized && (
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-eco-primary" />
                <span>Optimized</span>
              </div>
            )}
          </div>
        </div>
        
        <GanttChart 
          jobs={displayJobs} 
          isOptimized={isOptimized}
          migratingJobs={migratingJobs}
        />
      </div>

      {/* Carbon Heatmap */}
      <CarbonHeatmap 
        isOptimized={isOptimized}
      />

      {/* Job Details with migration animation */}
      <LayoutGroup>
        <div className="grid grid-cols-2 gap-4">
          {displayJobs.map((job, index) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                x: migratingJobs[job.id] ? [0, 20, 0] : 0
              }}
              transition={{ 
                duration: 0.8,
                delay: index * 0.1,
                x: { duration: 1.5, times: [0, 0.5, 1] }
              }}
              className="glass p-4 border border-eco-border/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ 
                      backgroundColor: migratingJobs[job.id] ? '#10b981' : '#6b7280' 
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-eco-dark">{job.name}</span>
                      {migratingJobs[job.id] && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs text-eco-primary flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Migrated
                        </motion.span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-eco-muted">
                      <span>{job.rack}</span>
                      <span>{job.start} → {job.end}</span>
                      <span>{job.power} kW</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-eco-text">{job.priority}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LayoutGroup>
    </motion.div>
  );
}

export default Scheduler;