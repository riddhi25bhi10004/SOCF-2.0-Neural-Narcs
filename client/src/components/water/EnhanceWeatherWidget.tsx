// client/src/components/water/EnhancedWeatherWidget.tsx
import { motion } from 'framer-motion';
import { Sun, CloudRain, Wind, Droplets, Thermometer, AlertCircle } from 'lucide-react';

interface Weather {
  temp: number;
  humidity: number;
  rainProbability: number;
  coolingDemand: string;
  windSpeed: number;
}

interface EnhancedWeatherWidgetProps {
  weather: Weather;
}

export default function EnhancedWeatherWidget({ weather }: EnhancedWeatherWidgetProps) {
  const weatherItems = [
    { label: 'Temperature', value: `${weather.temp}°C`, icon: <Thermometer className="w-4 h-4" />, color: 'text-red-400' },
    { label: 'Humidity', value: `${weather.humidity}%`, icon: <Droplets className="w-4 h-4" />, color: 'text-blue-400' },
    { label: 'Rain Probability', value: `${weather.rainProbability}%`, icon: <CloudRain className="w-4 h-4" />, color: 'text-blue-500' },
    { label: 'Wind Speed', value: `${weather.windSpeed} km/h`, icon: <Wind className="w-4 h-4" />, color: 'text-gray-400' },
  ];

  const getCoolingColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'low': return 'text-green-500 bg-green-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'high': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      className="glass p-6 border border-blue-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-blue-500/10 rounded-lg">
          <Sun className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="section-title text-base">Weather</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <AlertCircle className="w-3 h-3 text-blue-500" />
          <span className="text-blue-500">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {weatherItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-3 text-center border border-eco-border/30"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              <span className={item.color}>{item.icon}</span>
              <span className="text-xs text-eco-muted">{item.label}</span>
            </div>
            <span className="text-sm font-semibold text-eco-dark">{item.value}</span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className={`mt-3 p-2 rounded-lg text-center text-xs font-medium ${getCoolingColor(weather.coolingDemand)}`}
      >
        Cooling Demand: {weather.coolingDemand}
      </motion.div>

      {/* Weather influence indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mt-3 p-2 bg-blue-500/5 rounded-lg border border-blue-500/10 text-center"
      >
        <span className="text-xs text-eco-muted">
          {weather.rainProbability > 70 
            ? '🌧️ Rain expected - Water harvesting recommended' 
            : weather.temp > 25 
              ? '☀️ High temperature - Increased cooling demand' 
              : '✅ Optimal weather conditions'}
        </span>
      </motion.div>
    </motion.div>
  );
}