// client/src/pages/grid/GridMonitor.tsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Import components
import AIGridCommandCenter from '../../components/grid/AIGridCommandCenter';
import GridMetrics from '../../components/grid/GridMetrics';
import GridStatusCard from '../../components/grid/GridStatusCard';
import AIDecisionCenter from '../../components/grid/AIDecisionCenter';
import GridStressHeatmap from '../../components/grid/GridStressHeatmap';
import BlackoutPrediction from '../../components/grid/BlackoutPrediction';
import LiveElectricityPrice from '../../components/grid/LiveElectricityPrice';
import BatteryStatus from '../../components/grid/BatteryStatus';
import RunOptimization from '../../components/grid/RunOptimization';

// Import services
import GridService from '../../services/gridService';
import type { GridData } from '../../types';

function GridMonitor() {
  const [gridData, setGridData] = useState<GridData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Load initial data and start auto-refresh
  useEffect(() => {
    loadData();
    startAutoRefresh();
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []); // ✅ Empty dependency array - runs only once

  // ✅ Separate effect to handle optimization state change
  useEffect(() => {
    if (isOptimized) {
      // Stop auto-refresh when optimized
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Restart auto-refresh when not optimized
      startAutoRefresh();
    }
  }, [isOptimized]);

  const startAutoRefresh = () => {
    // Clear existing timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Only start if not optimized
    if (isOptimized) return;
    
    // Refresh every 30 seconds
    intervalRef.current = setInterval(() => {
      if (!isSimulating && !isOptimized) {
        loadData();
      }
    }, 30000);
  };

  const loadData = () => {
    // Don't load if optimized
    if (isOptimized) return;
    
    const service = GridService.getInstance();
    const data = service.generateGridData();
    setGridData(data);
    setLoading(false);
  };

  const handleSimulation = () => {
    if (isSimulating || isOptimized) return;
    
    setIsSimulating(true);
    
    const service = GridService.getInstance();
    
    // Simulation takes 8 seconds
    setTimeout(() => {
      if (gridData) {
        const optimized = service.simulateOptimization(gridData);
        setGridData(optimized);
        setIsSimulating(false);
        setIsOptimized(true);
        
        // ✅ Stop auto-refresh immediately
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 8000);
  };

  const handleReset = () => {
    // Reset all states
    setIsOptimized(false);
    setIsSimulating(false);
    
    // Load fresh data
    const service = GridService.getInstance();
    const data = service.generateGridData();
    setGridData(data);
    
    // Restart auto-refresh
    startAutoRefresh();
  };

  if (loading || !gridData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="glass p-8 animate-pulse">Loading AI Grid Command Center...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <AIGridCommandCenter data={gridData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GridStatusCard 
          status={gridData.status} 
          optimizationScore={gridData.optimizationScore}
          isOptimized={isOptimized}
        />
        <GridMetrics 
          metrics={gridData.metrics} 
          isOptimized={isOptimized}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIDecisionCenter decisions={gridData.decisions} />
        </div>
        <div>
          <GridStressHeatmap zones={gridData.zones} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <BlackoutPrediction prediction={gridData.blackout} />
        <BatteryStatus battery={gridData.battery} />
        <LiveElectricityPrice price={gridData.price} />
      </div>

      <RunOptimization 
        onSimulate={handleSimulation} 
        isSimulating={isSimulating}
        isOptimized={isOptimized}
        onReset={handleReset}
      />
    </motion.div>
  );
}

export default GridMonitor;