// client/src/components/water/BeforeAfterComparison.tsx
import { motion } from 'framer-motion';
import { TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

interface BeforeAfterComparisonProps {
  before: number;
  after: number;
}

export default function BeforeAfterComparison({ before, after }: BeforeAfterComparisonProps) {
  const saved = before - after;
  const percentageSaved = Math.round((saved / before) * 100);

  return (
    <motion.div
      className="glass p-6 border border-eco-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-eco-primary/10 rounded-lg">
          <TrendingDown className="w-5 h-5 text-eco-primary" />
        </div>
        <h3 className="section-title text-base">Before vs After AI Optimization</h3>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Before */}
        <motion.div 
          className="flex-1 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="glass p-4 border border-red-500/20">
            <p className="text-sm text-eco-muted">Before AI</p>
            <p className="text-3xl font-bold text-eco-dark">{before.toLocaleString()} L</p>
            <div className="mt-2 h-1 bg-red-500/30 rounded-full">
              <motion.div 
                className="h-full bg-red-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="shrink-0"
        >
          <ArrowRight className="w-8 h-8 text-eco-primary" />
        </motion.div>

        {/* After */}
        <motion.div 
          className="flex-1 text-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="glass p-4 border border-green-500/20 bg-green-500/5">
            <p className="text-sm text-eco-muted">After AI</p>
            <p className="text-3xl font-bold text-green-500">{after.toLocaleString()} L</p>
            <div className="mt-2 h-1 bg-green-500/30 rounded-full">
              <motion.div 
                className="h-full bg-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(after / before) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Savings Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-3 bg-eco-primary/10 rounded-lg border border-eco-primary/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-eco-primary" />
          <span className="text-sm font-medium text-eco-dark">Water Saved</span>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-eco-primary">{saved.toLocaleString()} L</span>
          <span className="text-sm text-eco-muted ml-2">({percentageSaved}% reduction)</span>
        </div>
      </motion.div>
    </motion.div>
  );
}