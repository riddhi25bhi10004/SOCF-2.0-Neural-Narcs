// client/src/services/gridService.ts
import type { 
  GridData, 
  GridDecision, 
  GridZone, 
  BlackoutPrediction, 
  BatteryStatus, 
  ElectricityPrice,
  GridMetrics,
  GridStatus
} from '../types';

class GridService {
  private static instance: GridService;
  private simulationMode = false;

  static getInstance() {
    if (!this.instance) {
      this.instance = new GridService();
    }
    return this.instance;
  }

  generateGridData(): GridData {
    const statuses: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
    const currentStatus = statuses[Math.floor(Math.random() * 2)];
    
    return {
      metrics: this.generateMetrics(),
      status: this.generateStatus(currentStatus),
      decisions: this.generateDecisions(),
      zones: this.generateZones(),
      blackout: this.generateBlackoutPrediction(),
      battery: this.generateBatteryStatus(),
      price: this.generateElectricityPrice(),
      optimizationScore: 72 + Math.random() * 15, // Start lower
      predictedFailure: 8 + Math.random() * 10, // Start higher
    };
  }

  private generateMetrics(): GridMetrics {
    return {
      demand: 1800 + Math.random() * 400,
      supply: 1600 + Math.random() * 300,
      frequency: 49.8 + Math.random() * 0.4,
      voltage: 230 + Math.random() * 10,
      carbonIntensity: 200 + Math.random() * 100,
    };
  }

  private generateStatus(status: 'critical' | 'high' | 'medium' | 'low'): GridStatus {
    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      critical: {
        label: 'CRITICAL',
        color: '#ef4444',
        icon: '🔴',
      },
      high: {
        label: 'HIGH STRESS',
        color: '#f97316',
        icon: '🟠',
      },
      medium: {
        label: 'MODERATE',
        color: '#f59e0b',
        icon: '🟡',
      },
      low: {
        label: 'STABLE',
        color: '#10b981',
        icon: '🟢',
      },
    };

    return {
      status: status,
      label: statusMap[status].label,
      color: statusMap[status].color,
      icon: statusMap[status].icon,
    };
  }

  private generateDecisions(): GridDecision[] {
    const actions = [
      { action: 'Shifted AI Training', reason: 'Grid peak detected', saving: '18 MW', confidence: 98 },
      { action: 'Enabled Battery', reason: 'Electricity price increased', saving: '₹45,000', confidence: 96 },
      { action: 'Activated Thermal Storage', reason: 'Cooling demand increased', saving: '12 MW', confidence: 97 },
    ];
    
    return actions.map((a, i) => ({
      id: `decision-${i}`,
      action: a.action,
      reason: a.reason,
      saving: a.saving,
      confidence: a.confidence,
      timestamp: new Date(),
    }));
  }

  private generateZones(): GridZone[] {
    const zones: GridZone[] = [
      { id: 'north', name: 'North', stress: 'low', load: 45 + Math.random() * 20, color: '#10b981' },
      { id: 'east', name: 'East', stress: 'medium', load: 60 + Math.random() * 20, color: '#f59e0b' },
      { id: 'south', name: 'South', stress: 'high', load: 75 + Math.random() * 15, color: '#f97316' },
      { id: 'west', name: 'West', stress: 'low', load: 40 + Math.random() * 20, color: '#10b981' },
    ];
    
    // Randomly change one zone to critical
    if (Math.random() > 0.7) {
      const criticalZone = zones[Math.floor(Math.random() * zones.length)];
      criticalZone.stress = 'critical';
      criticalZone.color = '#ef4444';
      criticalZone.load = 85 + Math.random() * 10;
    }
    
    return zones;
  }

  private generateBlackoutPrediction(): BlackoutPrediction {
    return {
      risk: 8 + Math.random() * 15, // Start higher
      timeStart: '18:00',
      timeEnd: '19:00',
      cause: 'High Industrial Demand',
      recommendedAction: 'Shift Batch Jobs',
    };
  }

  private generateBatteryStatus(): BatteryStatus {
    return {
      level: 45 + Math.random() * 25, // Start lower
      estimatedBackup: `${2 + Math.floor(Math.random() * 2)} hr`,
      charging: Math.random() > 0.5,
      capacity: 5000,
    };
  }

  private generateElectricityPrice(): ElectricityPrice {
    const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
    return {
      current: 6.5 + Math.random() * 3,
      trend: trends[Math.floor(Math.random() * 3)],
      recommendation: 'Switch to Battery',
      saving: '₹12,000',
    };
  }

  // ✅ COMPLETELY FIXED OPTIMIZATION - Forces everything to stable state
  simulateOptimization(data: GridData): GridData {
    // Deep clone the data
    const optimized = JSON.parse(JSON.stringify(data));
    
    // === FORCE GRID STATUS TO STABLE ===
    optimized.status = {
      status: 'low',
      label: 'STABLE',
      color: '#10b981',
      icon: '🟢',
    };
    
    // === FORCE METRICS TO OPTIMAL VALUES ===
    optimized.metrics = {
      demand: 1650 + Math.random() * 100,  // Reduced from 1800+
      supply: 1900 + Math.random() * 100,  // Increased from 1600+
      frequency: 50.0 + (Math.random() - 0.5) * 0.2, // Stable at 50Hz
      voltage: 230 + (Math.random() - 0.5) * 2, // Stable at 230V
      carbonIntensity: 150 + Math.random() * 30, // Reduced from 200+
    };
    
    // === FORCE ALL ZONES TO STABLE ===
    optimized.zones = optimized.zones.map((zone: GridZone) => ({
      ...zone,
      stress: 'low',  // Force all to low
      load: 30 + Math.random() * 20, // Reduced load (30-50%)
      color: '#10b981', // All green
    }));
    
    // === FORCE BATTERY TO OPTIMAL ===
    optimized.battery = {
      ...optimized.battery,
      level: 85 + Math.random() * 10, // 85-95%
      estimatedBackup: `${4 + Math.floor(Math.random() * 2)} hr`, // 4-5 hr
      charging: true,
    };
    
    // === FORCE BLACKOUT RISK TO MINIMAL ===
    optimized.blackout = {
      ...optimized.blackout,
      risk: 0.5 + Math.random() * 1.5, // 0.5-2%
      timeStart: 'N/A',
      timeEnd: 'N/A',
      cause: 'All systems stable',
      recommendedAction: 'Continue monitoring',
    };
    
    // === FORCE OPTIMIZATION SCORE TO MAX ===
    optimized.optimizationScore = 96 + Math.random() * 4; // 96-100%
    optimized.predictedFailure = 0.5 + Math.random() * 1.5; // 0.5-2%
    
    // === ADD NEW OPTIMIZED DECISIONS ===
    const optimizedDecisions = [
      {
        id: `decision-${Date.now()}`,
        action: '✅ Grid fully optimized',
        reason: 'All systems running at peak efficiency',
        saving: '32% energy saved',
        confidence: 99,
        timestamp: new Date(),
      },
      {
        id: `decision-${Date.now() + 1}`,
        action: '✅ Battery charged to optimal level',
        reason: 'Utilized off-peak electricity pricing',
        saving: '₹67,000 saved',
        confidence: 98,
        timestamp: new Date(),
      },
      {
        id: `decision-${Date.now() + 2}`,
        action: '✅ Carbon emissions reduced',
        reason: 'Switched to renewable sources',
        saving: '45% carbon reduction',
        confidence: 97,
        timestamp: new Date(),
      },
    ];
    
    optimized.decisions = optimizedDecisions;
    
    // === FORCE PRICE TO OPTIMAL ===
    optimized.price = {
      ...optimized.price,
      current: 5.2 + Math.random() * 0.5, // Lower price
      trend: 'stable',
      recommendation: 'Grid optimized - continue current strategy',
      saving: '₹67,000',
    };
    
    return optimized;
  }
}

export default GridService;

