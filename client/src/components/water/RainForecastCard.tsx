// client/src/components/water/RainForecastCard.tsx
import { motion } from 'framer-motion';
import { CloudRain, Sun, Droplets, Sparkles } from 'lucide-react';

interface Forecast {
  rainExpected: boolean;
  estimatedHarvest: number;
  confidence: number;
  timeFrame: string;
}

interface RainForecastCardProps {
  forecast: Forecast;
}

export default function RainForecastCard({ forecast }: RainForecastCardProps) {
  return (
    <motion.div
      className="glass p-6 border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <CloudRain className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="section-title text-base">AI Forecast</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${forecast.rainExpected ? 'bg-blue-500/20' : 'bg-yellow-500/20'}`}>
            {forecast.rainExpected ? (
              <CloudRain className="w-8 h-8 text-blue-500" />
            ) : (
              <Sun className="w-8 h-8 text-yellow-500" />
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-eco-dark">
              {forecast.rainExpected ? 'Rain Expected' : 'No Rain Expected'}
            </p>
            <p className="text-sm text-eco-muted">{forecast.timeFrame}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <Droplets className="w-4 h-4" />
              <span className="text-2xl font-bold text-eco-dark">
                {forecast.estimatedHarvest}
              </span>
            </div>
            <p className="text-xs text-eco-muted">Est. Harvest (L)</p>
          </div>
          <div className="glass p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-purple-500">
              <Sparkles className="w-4 h-4" />
              <span className="text-2xl font-bold text-eco-dark">
                {forecast.confidence}%
              </span>
            </div>
            <p className="text-xs text-eco-muted">Confidence</p>
          </div>
        </div>

        <motion.div
          className="h-1 bg-eco-border rounded-full overflow-hidden"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${forecast.confidence}%` }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}