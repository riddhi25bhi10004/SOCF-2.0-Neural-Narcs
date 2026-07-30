// client/src/components/water/LeakDetectionCard.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle2, AlertCircle, Activity, AlertTriangle, Droplets } from 'lucide-react';

interface LeakDetectionCardProps {
  risk?: number;
  onRiskUpdate?: (risk: number) => void;
}

export default function LeakDetectionCard({ risk: propRisk, onRiskUpdate }: LeakDetectionCardProps) {
  // Generate random risk if not provided
  const [risk, setRisk] = useState(() => {
    // If propRisk is provided and not 0, use it
    if (propRisk && propRisk > 0) return propRisk;
    // Otherwise generate random risk between 2-25%
    return Math.round((Math.random() * 23 + 2) * 10) / 10;
  });
  
  const [animatedRisk, setAnimatedRisk] = useState(risk);
  const [lastScan, setLastScan] = useState(new Date());
  const [sensorCount] = useState(127);
  const [activeSensors, setActiveSensors] = useState(0);

  // Update risk dynamically every 5-8 seconds
  useEffect(() => {
    // Calculate active sensors
    setActiveSensors(Math.floor(115 + Math.random() * 12));

    const interval = setInterval(() => {
      // Generate new risk value (2-35%)
      const newRisk = Math.round((Math.random() * 33 + 2) * 10) / 10;
      
      // Sometimes have spikes
      const finalRisk = Math.random() > 0.85 ? Math.min(45, newRisk + 15) : newRisk;
      
      setRisk(finalRisk);
      setLastScan(new Date());
      
      if (onRiskUpdate) {
        onRiskUpdate(finalRisk);
      }
    }, 5000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [onRiskUpdate]);

  // Animate risk value smoothly
  useEffect(() => {
    const animInterval = setInterval(() => {
      setAnimatedRisk(prev => {
        const diff = risk - prev;
        if (Math.abs(diff) < 0.5) return risk;
        return prev + Math.sign(diff) * Math.min(Math.abs(diff) * 0.3, 2);
      });
    }, 50);

    return () => clearInterval(animInterval);
  }, [risk]);

  const getRiskColor = (value: number) => {
    if (value < 10) return '#10b981';
    if (value < 20) return '#f59e0b';
    if (value < 35) return '#f97316';
    return '#ef4444';
  };

  const getRiskStatus = (value: number) => {
    if (value < 10) return { text: 'Low Risk', icon: CheckCircle2, bg: 'bg-green-500/10', border: 'border-green-500/20', textColor: 'text-green-500' };
    if (value < 20) return { text: 'Moderate Risk', icon: Activity, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', textColor: 'text-yellow-500' };
    if (value < 35) return { text: 'High Risk', icon: AlertTriangle, bg: 'bg-orange-500/10', border: 'border-orange-500/20', textColor: 'text-orange-500' };
    return { text: 'Critical Risk ⚠️', icon: AlertCircle, bg: 'bg-red-500/10', border: 'border-red-500/20', textColor: 'text-red-500' };
  };

  const getRiskFactors = (value: number) => {
    const factors = [];
    if (value < 10) {
      factors.push('All systems operating normally');
      factors.push('Pressure stable');
    } else if (value < 20) {
      factors.push('Minor pressure fluctuations detected');
      factors.push('Flow rate variations observed');
    } else if (value < 35) {
      factors.push('Unusual pressure patterns');
      factors.push('Temperature anomalies detected');
      factors.push('Flow irregularities');
    } else {
      factors.push('⚠️ Significant pressure loss');
      factors.push('⚠️ Major flow disruption');
      factors.push('⚠️ Immediate inspection required');
    }
    return factors.slice(0, 2);
  };

  const riskStatus = getRiskStatus(animatedRisk);
  const riskColor = getRiskColor(animatedRisk);
  const riskFactors = getRiskFactors(animatedRisk);
  const isLeakDetected = animatedRisk > 25;

  const lastScanTime = new Date(lastScan);
  lastScanTime.setSeconds(lastScanTime.getSeconds() - Math.floor(Math.random() * 30 + 5));

  return (
    <motion.div
      className="glass p-6 border border-green-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg ${isLeakDetected ? 'bg-red-500/10' : 'bg-green-500/10'}`}>
          <Shield className={`w-5 h-5 ${isLeakDetected ? 'text-red-500' : 'text-green-500'}`} />
        </div>
        <h3 className="section-title text-base">Leak Detection</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Main Status */}
        <div className={`flex items-center gap-3 p-4 rounded-lg ${riskStatus.bg} ${riskStatus.border}`}>
          <div className={`p-2 rounded-full ${isLeakDetected ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
            {isLeakDetected ? (
              <AlertCircle className="w-6 h-6 text-red-500" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            )}
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${riskStatus.textColor}`}>
              {isLeakDetected ? '⚠️ Leak Detected!' : '✓ No Leak'}
            </p>
            <p className="text-xs text-eco-muted">
              {riskStatus.text}
            </p>
          </div>
          <div className="text-right">
            <span 
              className="text-sm font-bold px-2 py-1 rounded-full"
              style={{ 
                backgroundColor: `${riskColor}20`,
                color: riskColor
              }}
            >
              {Math.round(animatedRisk)}%
            </span>
          </div>
        </div>

        {/* Risk Meter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-eco-muted">Risk Level</span>
            <span 
              className="font-medium"
              style={{ color: riskColor }}
            >
              {riskStatus.text}
            </span>
          </div>
          <div className="h-2 bg-eco-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: riskColor }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(animatedRisk, 100)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Risk Factors */}
        <div className="space-y-1">
          {riskFactors.map((factor, index) => (
            <div key={index} className="flex items-center gap-2 text-[10px] text-eco-muted">
              <div 
                className="w-1 h-1 rounded-full"
                style={{ backgroundColor: riskColor }}
              />
              <span>{factor}</span>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="glass p-2 text-center">
            <p className="text-lg font-bold text-eco-dark">{sensorCount}</p>
            <p className="text-[10px] text-eco-muted">Total Sensors</p>
          </div>
          <div className="glass p-2 text-center">
            <p className="text-lg font-bold text-eco-dark">{activeSensors || Math.floor(115 + Math.random() * 12)}</p>
            <p className="text-[10px] text-eco-muted">Active</p>
          </div>
          <div className="glass p-2 text-center">
            <p className="text-lg font-bold text-eco-dark">
              {lastScanTime.toLocaleTimeString()}
            </p>
            <p className="text-[10px] text-eco-muted">Last Scan</p>
          </div>
        </div>

        {/* Live Monitoring Indicator */}
        <motion.div
          className="flex items-center gap-2 text-[10px] text-eco-muted"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Activity className="w-3 h-3" />
          <span>
            {animatedRisk < 10 ? '✅ System stable' :
             animatedRisk < 20 ? '⚠️ Monitoring patterns' :
             animatedRisk < 35 ? '🔍 Analyzing anomalies' :
             '🚨 Alert: Action required'}
          </span>
        </motion.div>

        {/* Recent Activity */}
        <div className="p-2 bg-eco-surface/50 rounded-lg border border-eco-border/30">
          <div className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <Droplets className="w-3 h-3 text-blue-400" />
              <span className="text-eco-muted">Recent Activity</span>
            </div>
            <span className="text-eco-muted">
              {animatedRisk < 10 ? 'Normal flow detected' :
               animatedRisk < 20 ? 'Minor variations' :
               animatedRisk < 35 ? 'Unusual patterns' :
               '⚠️ Irregular flow detected'}
            </span>
          </div>
        </div>

        {/* Real-time updates indicator */}
        <div className="flex items-center justify-between text-[10px] text-eco-muted">
          <span>Auto-updating every 5s</span>
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-eco-primary"
          >
            ● Live
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}