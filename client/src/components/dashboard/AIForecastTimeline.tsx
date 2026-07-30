import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ForecastPoint {
  time: string;
  power: number;
  cooling: number;
  carbon: number;
  temperature: number;
  renewable: number;
}

function AIForecastTimeline() {
  const forecastData: ForecastPoint[] = useMemo(() => {
    return [
      { time: 'Now', power: 142, cooling: 88, carbon: 62, temperature: 23.4, renewable: 67 },
      { time: '30m', power: 148, cooling: 91, carbon: 65, temperature: 23.6, renewable: 65 },
      { time: '1h', power: 155, cooling: 94, carbon: 68, temperature: 23.9, renewable: 62 },
      { time: '3h', power: 138, cooling: 85, carbon: 58, temperature: 23.1, renewable: 71 },
      { time: '6h', power: 125, cooling: 80, carbon: 52, temperature: 22.8, renewable: 74 },
    ];
  }, []);

  const metrics = [
    { key: 'power', label: 'Power (kW)', color: '#10b981', unit: 'kW', icon: <TrendingUp className="h-3 w-3" /> },
    { key: 'cooling', label: 'Cooling', color: '#0ea5e9', unit: '%', icon: <TrendingUp className="h-3 w-3" /> },
    { key: 'carbon', label: 'Carbon (kg)', color: '#3b82f6', unit: 'kg', icon: <TrendingDown className="h-3 w-3" /> },
    { key: 'temperature', label: 'Temp (°C)', color: '#f59e0b', unit: '°C', icon: <Minus className="h-3 w-3" /> },
    { key: 'renewable', label: 'Renewable %', color: '#6d8b3d', unit: '%', icon: <TrendingUp className="h-3 w-3" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/95 backdrop-blur-xl p-5 shadow-[0_8px_40px_rgba(146,92,25,0.06)]"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-eco-primary" />
        <h3 className="text-sm font-bold text-eco-dark">AI Forecast Timeline</h3>
        <span className="ml-auto text-[10px] text-eco-muted font-medium">Next 6 hours</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {forecastData.map((point, i) => (
          <motion.div
            key={point.time}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-xl border p-3 ${i === 0 ? 'bg-eco-primary/5 border-eco-primary/30' : 'bg-white/50 border-amber-100/60'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${i === 0 ? 'text-eco-primary' : 'text-eco-dark'}`}>{point.time}</span>
              {i === 0 && (
                <span className="text-[9px] font-bold uppercase tracking-wider text-eco-primary">Live</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              {metrics.map((m) => {
                const val = point[m.key as keyof ForecastPoint] as number;
                const prevVal = i > 0 ? forecastData[i - 1][m.key as keyof ForecastPoint] as number : val;
                const diff = val - prevVal;
                const isUp = diff > 0;
                const isDown = diff < 0;

                return (
                  <div key={m.key} className="flex items-center justify-between">
                    <span className="text-[10px] text-eco-muted">{m.label}</span>
                    <div className="flex items-center gap-1">
                      {isUp && <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />}
                      {isDown && <TrendingDown className="h-2.5 w-2.5 text-amber-500" />}
                      {!isUp && !isDown && <Minus className="h-2.5 w-2.5 text-slate-400" />}
                      <span className="text-[11px] font-mono font-semibold text-eco-dark">
                        {val}{m.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default AIForecastTimeline;