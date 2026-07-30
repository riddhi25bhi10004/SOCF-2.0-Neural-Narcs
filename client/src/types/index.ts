// ============ TYPE ALIASES ============
export type Priority = 'High' | 'Medium' | 'Low';
export type JobCategory = 'AI Training' | 'Batch ETL' | 'Backup' | 'Inference';
export type GridStatusLevel = 'critical' | 'high' | 'medium' | 'low';
export type ZoneStressLevel = 'low' | 'medium' | 'high' | 'critical';
export type PriceChange = 'up' | 'down' | 'stable';

// ============ TELEMETRY TYPES ============
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

// ============ APP RECOMMENDATION TYPES ============
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

// ============ JOB TYPES ============
export interface Job {
  id: string;
  name: string;
  type: JobCategory;
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

export interface ScheduleData {
  current: Job[];
  optimized: Job[];
}

// ============ WATER TYPES ============
export interface WaterQuality {
  ph: number;
  purity: number;
  coolingSafe: boolean;
}

export interface WaterRecommendation {
  title: string;
  saving: number;
  priority: Priority;
  reason: string;
}

export interface Weather {
  temp: number;
  humidity: number;
  rainProbability: number;
  coolingDemand: string;
  windSpeed: number;
}

export interface Decision {
  action: string;
  reason: string;
  confidence: number;
}

export interface Forecast {
  rainExpected: boolean;
  estimatedHarvest: number;
  confidence: number;
  timeFrame: string;
}

export interface EnvironmentalImpact {
  waterSaved: number;
  carbonReduced: number;
  energySaved: number;
}

export interface WaterData {
  totalUsage: number;
  recyclingRate: number;
  pueImpact: number;
  waterSaved: number;
  coolingEfficiency: number;
  leakRisk: number;
  aiConfidence: number;
  storageLevel: number;
  quality: WaterQuality;
  recommendations: WaterRecommendation[];
  beforeAI: number;
  afterAI: number;
  weather: Weather;
  decisions: Decision[];
  forecast: Forecast;
  environmentalImpact: EnvironmentalImpact;
}

// ============ GRID TYPES ============
export interface GridMetrics {
  demand: number;
  supply: number;
  frequency: number;
  voltage: number;
  carbonIntensity: number;
}

export interface GridStatus {
  status: GridStatusLevel;
  label: string;
  color: string;
  icon: string;
}

export interface GridDecision {
  id: string;
  action: string;
  reason: string;
  saving: string;
  confidence?: number;
  timestamp: Date;
}

export interface GridZone {
  id: string;
  name: string;
  stress: ZoneStressLevel;
  load: number;
  color: string;
}

export interface BlackoutPrediction {
  risk: number;
  timeStart: string;
  timeEnd: string;
  cause: string;
  recommendedAction: string;
}

export interface BatteryStatus {
  level: number;
  estimatedBackup: string;
  charging: boolean;
  capacity: number;
}

export interface ElectricityPrice {
  current: number;
  trend: PriceChange;
  recommendation: string;
  saving: string;
}

export interface GridData {
  metrics: GridMetrics;
  status: GridStatus;
  decisions: GridDecision[];
  zones: GridZone[];
  blackout: BlackoutPrediction;
  battery: BatteryStatus;
  price: ElectricityPrice;
  optimizationScore: number;
  predictedFailure: number;
}