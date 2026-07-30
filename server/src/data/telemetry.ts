export interface TelemetryState {
  power: number;
  water: number;
  coolingEfficiency: number;
  carbon: number;
  renewableShare: number;
  gridStress: 'low' | 'medium' | 'high';
  avgTemperature: number;
  pue: number;
  timestamp: number;
  anomaly: { type: string; severity: number } | null;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: { energy: number; water?: number; carbon: number };
  confidence: number;
  priority: 'high' | 'medium' | 'low' | 'critical';
  tradeoff: string;
  applied: boolean;
  appliedAt: number | null;
}

export interface ScheduleJob {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  rack: string;
  power: number;
  type: string;
  priority: number;
}

export interface ScheduleData {
  current: ScheduleJob[];
  optimized: ScheduleJob[];
  savings: { energy: string; carbon: string };
}

export interface WaterData {
  currentUsage: number;
  breakdown: { coolingTowers: number; chillers: number; adiabatic: number };
  weather: { temp: number; humidity: number; wetBulb: number };
  recommendations: string[];
}

export interface GridData {
  demandSeries: { time: string; grid: number; dc: number }[];
  riskIndicator: 'low' | 'medium' | 'high';
  demandResponseActions: string[];
}

export interface HardwareComponent {
  id: string;
  name: string;
  type: string;
  healthScore: number;
  lifespan: number;
  usedLifespan: number;
  failureRisk: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface EcoScoreCategory {
  name: string;
  score: number;
  weight: number;
}

export interface EcoScore {
  overall: number;
  categories: EcoScoreCategory[];
  trend: { date: string; score: number }[];
}

export interface ReportSummary {
  generatedAt: string;
  timeRange: { start: string; end: string };
  totals: { energyKwh: number; waterL: number; carbonKg: number };
  topActions: string[];
  ecoScore: number;
}

export interface AppState {
  telemetry: TelemetryState;
  recommendations: Recommendation[];
  schedule: ScheduleData;
  water: WaterData;
  grid: GridData;
  hardware: HardwareComponent[];
  ecoscore: EcoScore;
  report: ReportSummary | null;
}

export const initialTelemetry: TelemetryState = {
  power: 950,
  water: 4800,
  coolingEfficiency: 4.0,
  carbon: 280,
  renewableShare: 45,
  gridStress: 'medium',
  avgTemperature: 25,
  pue: 1.45,
  timestamp: Date.now(),
  anomaly: null,
};

export const initialRecommendations: Recommendation[] = [
  { id: 'rec-1', title: 'Increase cooling setpoint by 2°C', description: 'Raise data hall temperature within ASHRAE limits to reduce chiller load.', impact: { energy: 12, water: 8, carbon: 10 }, confidence: 92, priority: 'high', tradeoff: 'Slightly higher hardware temps', applied: false, appliedAt: null },
  { id: 'rec-2', title: 'Shift batch workloads to 14:00-18:00', description: 'Reschedule GPU training jobs to peak solar hours.', impact: { energy: 5, carbon: 18 }, confidence: 88, priority: 'medium', tradeoff: 'Delayed job completion', applied: false, appliedAt: null },
  { id: 'rec-3', title: 'Enable adiabatic pre-cooling', description: 'Use evaporative cooling when wet-bulb depression is sufficient.', impact: { energy: 8, water: 3, carbon: 7 }, confidence: 76, priority: 'medium', tradeoff: 'Increased water usage', applied: false, appliedAt: null },
  { id: 'rec-4', title: 'Replace PSU #12 with 80 PLUS Titanium', description: 'Inefficient power supply in Row C wasting ~3% of draw.', impact: { energy: 3, carbon: 2.5 }, confidence: 95, priority: 'low', tradeoff: 'CapEx for new hardware', applied: false, appliedAt: null },
  { id: 'rec-5', title: 'Deploy free-cooling economizer', description: 'Use outside air when ambient is below 18°C.', impact: { energy: 15, water: 20, carbon: 14 }, confidence: 65, priority: 'critical', tradeoff: 'Air filtration maintenance', applied: false, appliedAt: null },
  { id: 'rec-6', title: 'Retire GPU cluster gen-3', description: 'Old GPUs have 2.1x worse perf/W than current gen.', impact: { energy: 22, carbon: 20 }, confidence: 98, priority: 'high', tradeoff: 'Downtime during migration', applied: false, appliedAt: null },
  { id: 'rec-7', title: 'Adjust CRAH fan speed curves', description: 'Optimize fan response to temperature deltas.', impact: { energy: 6, carbon: 5 }, confidence: 81, priority: 'medium', tradeoff: 'None significant', applied: false, appliedAt: null },
  { id: 'rec-8', title: 'Implement liquid cooling for AI pods', description: 'Direct-to-chip cooling for high-density racks.', impact: { energy: 10, water: 5, carbon: 9 }, confidence: 70, priority: 'high', tradeoff: 'Higher water usage', applied: false, appliedAt: null },
];

export const initialSchedule: { current: ScheduleJob[]; optimized: ScheduleJob[]; savings: { energy: string; carbon: string } } = {
  current: [
    { id: 'job-1', name: 'ML Training - Alpha', startTime: '08:00', endTime: '12:00', rack: 'A1-A4', power: 180, type: 'AI Training', priority: 1 },
    { id: 'job-2', name: 'Data Backup', startTime: '09:00', endTime: '11:00', rack: 'B2', power: 45, type: 'Backup', priority: 3 },
    { id: 'job-3', name: 'Video Transcoding', startTime: '10:00', endTime: '14:00', rack: 'C1-C3', power: 120, type: 'Batch ETL', priority: 2 },
    { id: 'job-4', name: 'Batch Inference', startTime: '13:00', endTime: '17:00', rack: 'D1', power: 90, type: 'Inference', priority: 2 },
    { id: 'job-5', name: 'Model Compilation', startTime: '15:00', endTime: '18:00', rack: 'E2', power: 60, type: 'AI Training', priority: 3 },
    { id: 'job-6', name: 'Log Aggregation', startTime: '19:00', endTime: '22:00', rack: 'F1', power: 35, type: 'Batch ETL', priority: 4 },
    { id: 'job-7', name: 'Nightly Sanity Checks', startTime: '23:00', endTime: '01:00', rack: 'A5', power: 25, type: 'Backup', priority: 5 },
  ],
  optimized: [
    { id: 'job-1', name: 'ML Training - Alpha', startTime: '14:00', endTime: '18:00', rack: 'A1-A4', power: 180, type: 'AI Training', priority: 1 },
    { id: 'job-2', name: 'Data Backup', startTime: '11:00', endTime: '13:00', rack: 'B2', power: 45, type: 'Backup', priority: 3 },
    { id: 'job-3', name: 'Video Transcoding', startTime: '12:00', endTime: '16:00', rack: 'C1-C3', power: 120, type: 'Batch ETL', priority: 2 },
    { id: 'job-4', name: 'Batch Inference', startTime: '15:00', endTime: '19:00', rack: 'D1', power: 90, type: 'Inference', priority: 2 },
    { id: 'job-5', name: 'Model Compilation', startTime: '13:00', endTime: '16:00', rack: 'E2', power: 60, type: 'AI Training', priority: 3 },
    { id: 'job-6', name: 'Log Aggregation', startTime: '20:00', endTime: '23:00', rack: 'F1', power: 35, type: 'Batch ETL', priority: 4 },
    { id: 'job-7', name: 'Nightly Sanity Checks', startTime: '00:00', endTime: '02:00', rack: 'A5', power: 25, type: 'Backup', priority: 5 },
  ],
  savings: { energy: '8.2%', carbon: '14.5%' },
};

export const initialWater: WaterData = {
  currentUsage: 4800,
  breakdown: { coolingTowers: 2800, chillers: 1500, adiabatic: 500 },
  weather: { temp: 32, humidity: 45, wetBulb: 22 },
  recommendations: ['Enable adiabatic pre-cooling during afternoon peaks', 'Monitor cooling tower drift eliminators'],
};

export const initialGrid: GridData = {
  demandSeries: Array.from({ length: 24 }, (_, i) => ({
    time: `${String(i).padStart(2, '0')}:00`,
    grid: 600 + Math.sin(i / 24 * Math.PI * 2) * 150 + Math.random() * 80,
    dc: 850 + Math.cos(i / 24 * Math.PI * 2) * 120 + Math.random() * 40,
  })),
  riskIndicator: 'medium',
  demandResponseActions: ['Curtail non-critical batch jobs', 'Switch to UPS buffer for 15 min', 'Activate demand-response contract'],
};

export const initialHardware: HardwareComponent[] = [
  { id: 'hw-1', name: 'GPU A100 x8', type: 'GPU', healthScore: 94, lifespan: 5, usedLifespan: 2.1, failureRisk: 'low', recommendation: 'Schedule thermal paste refresh next quarter' },
  { id: 'hw-2', name: 'GPU A100 x8', type: 'GPU', healthScore: 91, lifespan: 5, usedLifespan: 2.4, failureRisk: 'low', recommendation: 'Monitor memory ECC errors' },
  { id: 'hw-3', name: 'CPU EPYC 9654 x2', type: 'CPU', healthScore: 97, lifespan: 7, usedLifespan: 1.2, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-4', name: 'CPU EPYC 9654 x2', type: 'CPU', healthScore: 96, lifespan: 7, usedLifespan: 1.3, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-5', name: 'SSD NVMe 3.84TB', type: 'SSD', healthScore: 88, lifespan: 5, usedLifespan: 3.8, failureRisk: 'medium', recommendation: 'Plan replacement within 12 months' },
  { id: 'hw-6', name: 'SSD NVMe 3.84TB', type: 'SSD', healthScore: 82, lifespan: 5, usedLifespan: 4.2, failureRisk: 'high', recommendation: 'Replace immediately' },
  { id: 'hw-7', name: 'Fan 120mm PWM', type: 'Fan', healthScore: 79, lifespan: 4, usedLifespan: 3.5, failureRisk: 'medium', recommendation: 'Replace bearing assembly' },
  { id: 'hw-8', name: 'Fan 120mm PWM', type: 'Fan', healthScore: 85, lifespan: 4, usedLifespan: 2.8, failureRisk: 'low', recommendation: 'Clean filters' },
  { id: 'hw-9', name: 'PSU 3000W 80PLUS', type: 'PSU', healthScore: 93, lifespan: 6, usedLifespan: 1.8, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-10', name: 'PSU 3000W 80PLUS', type: 'PSU', healthScore: 90, lifespan: 6, usedLifespan: 2.2, failureRisk: 'low', recommendation: 'Monitor ripple' },
  { id: 'hw-11', name: 'PSU 3000W 80PLUS', type: 'PSU', healthScore: 72, lifespan: 6, usedLifespan: 4.9, failureRisk: 'high', recommendation: 'Replace before next peak season' },
  { id: 'hw-12', name: 'GPU H100 x8', type: 'GPU', healthScore: 99, lifespan: 5, usedLifespan: 0.4, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-13', name: 'Fan 80mm PWM', type: 'Fan', healthScore: 91, lifespan: 4, usedLifespan: 2.1, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-14', name: 'SSD NVMe 7.68TB', type: 'SSD', healthScore: 95, lifespan: 5, usedLifespan: 1.1, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-15', name: 'CPU Xeon 8480 x2', type: 'CPU', healthScore: 98, lifespan: 7, usedLifespan: 0.8, failureRisk: 'low', recommendation: 'None' },
  { id: 'hw-16', name: 'PSU 2000W 80PLUS', type: 'PSU', healthScore: 86, lifespan: 6, usedLifespan: 3.1, failureRisk: 'medium', recommendation: 'Schedule capacitor check' },
];

export const initialEcoscore: EcoScore = {
  overall: 72,
  categories: [
    { name: 'Energy Efficiency', score: 78, weight: 0.3 },
    { name: 'Renewable Usage', score: 65, weight: 0.25 },
    { name: 'Water Stewardship', score: 70, weight: 0.2 },
    { name: 'Hardware Lifecycle', score: 68, weight: 0.15 },
    { name: 'Carbon Footprint', score: 74, weight: 0.1 },
  ],
  trend: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    score: 65 + Math.random() * 15 + i * 0.2,
  })),
};

export const initialReport: ReportSummary = {
  generatedAt: new Date().toISOString(),
  timeRange: { start: new Date(Date.now() - 86400000).toISOString(), end: new Date().toISOString() },
  totals: { energyKwh: 22000, waterL: 112000, carbonKg: 6400 },
  topActions: ['Apply cooling setpoint increase', 'Shift batch workloads to solar peak', 'Replace failing SSD #6'],
  ecoScore: 72,
};

export const createInitialState = (): AppState => ({
  telemetry: { ...initialTelemetry },
  recommendations: initialRecommendations.map(r => ({ ...r })),
  schedule: {
    current: initialSchedule.current.map(j => ({ ...j })),
    optimized: initialSchedule.optimized.map(j => ({ ...j })),
    savings: { ...initialSchedule.savings },
  },
  water: {
    currentUsage: initialWater.currentUsage,
    breakdown: { ...initialWater.breakdown },
    weather: { ...initialWater.weather },
    recommendations: [...initialWater.recommendations],
  },
  grid: {
    demandSeries: initialGrid.demandSeries.map(d => ({ ...d })),
    riskIndicator: initialGrid.riskIndicator,
    demandResponseActions: [...initialGrid.demandResponseActions],
  },
  hardware: initialHardware.map(h => ({ ...h })),
  ecoscore: {
    overall: initialEcoscore.overall,
    categories: initialEcoscore.categories.map(c => ({ ...c })),
    trend: initialEcoscore.trend.map(t => ({ ...t })),
  },
  report: initialReport ? { ...initialReport, timeRange: { ...initialReport.timeRange }, totals: { ...initialReport.totals }, topActions: [...initialReport.topActions] } : null,
});
