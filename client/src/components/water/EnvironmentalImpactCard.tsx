// client/src/components/water/EnvironmentalImpactCard.tsx
import { motion } from 'framer-motion';
import { Droplets, Leaf, Zap, TrendingUp, Award } from 'lucide-react';

interface Impact {
  waterSaved: number;
  carbonReduced: number;
  energySaved: number;
}

interface EnvironmentalImpactCardProps {
  impact: Impact;
}

export default function EnvironmentalImpactCard({ impact }: EnvironmentalImpactCardProps) {
  const impacts = [
    {
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      label: 'Water Saved',
      value: impact.waterSaved,
      unit: 'L',
      color: 'blue'
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-500" />,
      label: 'Carbon Reduced',
      value: impact.carbonReduced,
      unit: 'kg',
      color: 'green'
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      label: 'Energy Saved',
      value: impact.energySaved,
      unit: 'kWh',
      color: 'yellow'
    }
  ];

  return (
    <motion.div
      className="glass p-6 border border-green-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.95 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-green-500/10 rounded-lg">
          <Award className="w-5 h-5 text-green-500" />
        </div>
        <h3 className="section-title text-base">Today's Impact</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-500">+12% vs yesterday</span>
        </div>
      </div>

      <div className="space-y-4">
        {impacts.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={`p-2 rounded-lg bg-${item.color}-500/10`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-eco-muted">{item.label}</span>
                <span className="text-lg font-bold text-eco-dark">
                  {item.value.toLocaleString()}
                  <span className="text-sm font-normal text-eco-muted ml-1">{item.unit}</span>
                </span>
              </div>
              <div className="h-1 bg-eco-border rounded-full mt-1 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full bg-${item.color}-500`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (item.value / 50) * 100)}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 p-3 bg-eco-primary/10 rounded-lg text-center border border-eco-primary/20"
      >
        <span className="text-sm font-medium text-eco-primary">
          Total environmental savings: {impact.waterSaved + impact.carbonReduced + impact.energySaved} units
        </span>
      </motion.div>
    </motion.div>
  );
}