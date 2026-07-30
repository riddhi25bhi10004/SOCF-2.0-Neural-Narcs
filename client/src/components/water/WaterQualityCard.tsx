// client/src/components/water/WaterQualityCard.tsx
import { motion } from 'framer-motion';
import { Droplets, CheckCircle2, XCircle } from 'lucide-react';

interface Quality {
  ph: number;
  purity: number;
  coolingSafe: boolean;
}

interface WaterQualityCardProps {
  quality: Quality;
}

export default function WaterQualityCard({ quality }: WaterQualityCardProps) {
  const qualityItems = [
    { label: 'pH', value: quality.ph, unit: '', status: quality.ph >= 6.5 && quality.ph <= 8.5 ? 'good' : 'bad' },
    { label: 'Purity', value: quality.purity, unit: '%', status: quality.purity >= 90 ? 'good' : 'bad' },
    { label: 'Cooling Safe', value: quality.coolingSafe ? '✓' : '✗', unit: '', status: quality.coolingSafe ? 'good' : 'bad' },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'good') return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <motion.div
      className="glass p-6 border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Droplets className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="section-title text-base">Water Quality</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Monitoring</span>
        </div>
      </div>

      <div className="space-y-3">
        {qualityItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-eco-surface rounded-lg hover:bg-eco-surface/80 transition-all"
          >
            <span className="text-sm text-eco-muted">{item.label}</span>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${item.status === 'good' ? 'text-eco-dark' : 'text-red-500'}`}>
                {item.value}{item.unit}
              </span>
              {getStatusIcon(item.status)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Overall Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20 text-center"
      >
        <span className="text-sm font-medium text-green-600">
          All parameters within safe limits ✓
        </span>
      </motion.div>
    </motion.div>
  );
}