import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Snowflake, Wind, Grid3x3, Leaf, Clock, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ActivityItem {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}

function ActivityFeed() {
  const activities: ActivityItem[] = [
    {
      icon: <Brain className="h-3.5 w-3.5" />,
      color: '#8b5cf6',
      bgColor: 'bg-violet-50',
      title: 'AI shifted workloads',
      description: 'Workload redistributed from Rack 12 to Rack 07 for optimal cooling',
      timestamp: '2 min ago',
      type: 'info',
    },
    {
      icon: <Snowflake className="h-3.5 w-3.5" />,
      color: '#0ea5e9',
      bgColor: 'bg-sky-50',
      title: 'Cooling optimization applied',
      description: 'Chiller setpoint adjusted by 1.2°C based on thermal model',
      timestamp: '8 min ago',
      type: 'success',
    },
    {
      icon: <Wind className="h-3.5 w-3.5" />,
      color: '#06b6d4',
      bgColor: 'bg-cyan-50',
      title: 'Renewable source activated',
      description: 'Wind turbine output increased to 38 kW to match demand',
      timestamp: '15 min ago',
      type: 'success',
    },
    {
      icon: <Grid3x3 className="h-3.5 w-3.5" />,
      color: '#c97a1d',
      bgColor: 'bg-amber-50',
      title: 'Grid load reduced',
      description: 'Demand response signal received; load shifted to off-peak window',
      timestamp: '22 min ago',
      type: 'info',
    },
    {
      icon: <Leaf className="h-3.5 w-3.5" />,
      color: '#6d8b3d',
      bgColor: 'bg-emerald-50',
      title: 'Carbon emissions lowered',
      description: 'CO₂ output reduced by 4.2% through efficiency optimization',
      timestamp: '31 min ago',
      type: 'success',
    },
    {
      icon: <Info className="h-3.5 w-3.5" />,
      color: '#3b82f6',
      bgColor: 'bg-blue-50',
      title: 'Scheduled maintenance',
      description: 'UPS Unit 3 firmware update completed successfully',
      timestamp: '45 min ago',
      type: 'info',
    },
  ];

  const typeIcons = { info: <Info className="h-3 w-3" />, success: <CheckCircle className="h-3 w-3" />, warning: <AlertCircle className="h-3 w-3" /> };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-eco-primary" />
        <h3 className="text-sm font-bold text-eco-dark">Recent Activity</h3>
        <span className="ml-auto text-[10px] text-eco-muted font-medium">Live feed</span>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-amber-200/60" />

        <div className="flex flex-col gap-0">
          {activities.map((item, i) => (
            <motion.div
              key={`${item.title}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative flex gap-3 pb-4 pl-8"
            >
              <div className={`absolute left-2.5 top-1 flex h-7 w-7 items-center justify-center rounded-lg ${item.bgColor}`} style={{ color: item.color }}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-eco-dark truncate">{item.title}</span>
                  {typeIcons[item.type]}
                </div>
                <p className="text-[11px] text-eco-muted mt-0.5 leading-relaxed">{item.description}</p>
                <span className="text-[10px] text-eco-muted/60 mt-1 block">{item.timestamp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ActivityFeed;