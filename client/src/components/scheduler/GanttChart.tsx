// client/src/components/scheduler/GanttChart.tsx
import { motion, AnimatePresence } from 'framer-motion';
import type { Job } from '../../types/index';

interface GanttChartProps {
  jobs: Job[];
  isOptimized: boolean;
  migratingJobs: Record<string, boolean>;
}

export default function GanttChart({ jobs, isOptimized, migratingJobs }: GanttChartProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const typeColors = { 'AI Training': '#10b981', 'Batch ETL': '#3b82f6', 'Backup': '#f59e0b', 'Inference': '#8b5cf6' };

  const getJobPosition = (job: Job) => {
    const [startHour] = job.start.split(':').map(Number);
    const [endHour] = job.end.split(':').map(Number);
    const duration = endHour - startHour;
    return { start: startHour, duration };
  };

  return (
    <div className="relative">
      {/* Timeline header */}
      <div className="flex mb-2">
        <div className="w-32 shrink-0" />
        <div className="flex-1 flex">
          {hours.map(hour => (
            <div key={hour} className="flex-1 text-center">
              <span className="text-[10px] text-eco-muted font-mono">
                {hour.toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Jobs */}
      <div className="space-y-2">
        {jobs.map((job, index) => {
          const { start, duration } = getJobPosition(job);
          const isMigrating = migratingJobs[job.id];
          const isOptimizedJob = isOptimized && isMigrating;

          return (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: isMigrating ? [1, 1.02, 1] : 1
              }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.05,
                scale: { duration: 0.8, times: [0, 0.5, 1] }
              }}
              className="flex items-center gap-3"
            >
              <div className="w-32 shrink-0 flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: typeColors[job.type] }}
                />
                <span className="text-sm truncate text-eco-dark">{job.name}</span>
                {isMigrating && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] text-eco-primary"
                  >
                    ✦
                  </motion.span>
                )}
              </div>

              <div className="flex-1 relative h-8 bg-eco-surface rounded-lg overflow-hidden">
                {/* Grid lines */}
                {hours.map(hour => (
                  <div 
                    key={hour}
                    className="absolute top-0 bottom-0 w-px bg-eco-border/30"
                    style={{ left: `${(hour / 24) * 100}%` }}
                  />
                ))}

                {/* Job bar */}
                <motion.div
                  className="absolute top-1 h-6 rounded-md cursor-pointer group"
                  style={{
                    backgroundColor: isOptimizedJob ? '#10b981' : typeColors[job.type],
                    opacity: isOptimizedJob ? 0.8 : 0.6,
                    left: `${(start / 24) * 100}%`,
                    width: `${(duration / 24) * 100}%`,
                  }}
                  animate={{
                    backgroundColor: isOptimizedJob ? ['#10b981', '#34d399', '#10b981'] : typeColors[job.type],
                  }}
                  transition={{
                    duration: 2,
                    repeat: isOptimizedJob ? Infinity : 0,
                    repeatType: "reverse"
                  }}
                  whileHover={{ 
                    scaleY: 1.2,
                    opacity: 1,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  <div className="h-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {job.power} kW
                    </span>
                  </div>
                </motion.div>

                {/* Migration animation */}
                {isMigrating && (
                  <motion.div
                    className="absolute top-1 h-6 rounded-md"
                    style={{
                      backgroundColor: '#10b981',
                      opacity: 0.3,
                      left: `${(start / 24) * 100}%`,
                      width: `${(duration / 24) * 100}%`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}