export interface TelemetryData {
  timestamp: number;
  power: number; // kW
  water: number; // liters/hour
  coolingEfficiency: number; // COP
  carbon: number; // kg CO2e/hour
  renewableShare: number; // %
  gridStress: 'low' | 'medium' | 'high';
  avgTemperature: number; // °C
  pue: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: {
    energy: number;
    water: number;
    carbon: number;
  };
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  tradeoff: string;
  applied: boolean;
  appliedAt?: number;
}

export interface Job {
  id: string;
  name: string;
  type: 'AI Training' | 'Batch ETL' | 'Backup' | 'Inference';
  start: string;
  end: string;
  rack: string;
  power: number;
  priority: number;
}

export interface HardwareComponent {
  id: string;
  type: 'GPU' | 'CPU' | 'SSD' | 'Fan' | 'PSU';
  rack: string;
  health: number;
  lifespan: number;
  failureRisk: 'low' | 'medium' | 'high';
  recommendation?: string;
}

export interface EcoScoreBreakdown {
  energyEfficiency: number;
  waterEfficiency: number;
  coolingEfficiency: number;
  carbonIntensity: number;
  renewableUsage: number;
  hardwareHealth: number;
  overall: number;
}

// client/src/types/index.ts

// Add to existing types
export interface AIStatus {
  status: 'idle' | 'optimizing' | 'completed';
  message: string;
  confidence: number;
  carbonSaved: number;
  peakLoad: {
    start: string;
    end: string;
  };
  suggestion: string;
}

export interface RackData {
  id: string;
  carbonIntensity: number;
  status: 'low' | 'medium' | 'high';
  jobs?: Job[];
}

// Export existing Job interface
export interface Job {
  id: string;
  name: string;
  type: 'AI Training' | 'Batch ETL' | 'Backup' | 'Inference';
  start: string;
  end: string;
  rack: string;
  power: number;
  priority: number;
}