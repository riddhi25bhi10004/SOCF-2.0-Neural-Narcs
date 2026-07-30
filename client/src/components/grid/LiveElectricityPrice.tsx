// client/src/components/grid/LiveElectricityPrice.tsx
import { motion } from 'framer-motion';
import { Zap, TrendingUp, TrendingDown, Minus, Battery, IndianRupee } from 'lucide-react';
import type { ElectricityPrice } from '../../types';

interface LiveElectricityPriceProps {
  price: ElectricityPrice;
}

export default function LiveElectricityPrice({ price }: LiveElectricityPriceProps) {
  const getTrendIcon = () => {
    if (price.trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (price.trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-yellow-500" />;
  };

  return (
    <motion.div
      className="glass p-6 border border-yellow-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
          <Zap className="w-5 h-5 text-yellow-500" />
        </div>
        <h3 className="section-title text-base">Electricity Price</h3>
      </div>

      <div className="space-y-4">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-eco-muted" />
            <motion.span
              className="text-3xl font-bold text-eco-dark"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              {price.current.toFixed(1)}
            </motion.span>
            <span className="text-sm text-eco-muted">/kWh</span>
          </div>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${
              price.trend === 'up' ? 'text-red-500' :
              price.trend === 'down' ? 'text-green-500' :
              'text-yellow-500'
            }`}>
              {price.trend === 'up' ? 'Rising' :
               price.trend === 'down' ? 'Falling' :
               'Stable'}
            </span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4 text-green-500" />
            <span className="text-sm text-eco-muted">AI Recommendation:</span>
            <span className="text-sm font-medium text-eco-dark">{price.recommendation}</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-xs text-eco-primary">
            <span>Saving: {price.saving}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}