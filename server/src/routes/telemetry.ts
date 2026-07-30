import express from 'express';
import type { AppState, Recommendation } from '../data/telemetry';
import { updateTelemetry, applyRecommendation } from '../services/telemetryService';

let state: AppState;

export function setState(s: AppState) {
  state = s;
}

export function getState() {
  return state;
}

const router = express.Router();

router.get('/health', (_, res: express.Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.get('/telemetry', (_, res: express.Response) => {
  res.json(state.telemetry);
});

router.get('/recommendations', (_, res: express.Response) => {
  res.json(state.recommendations);
});

router.post('/recommendations/:id/apply', (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const rec = state.recommendations.find((r: Recommendation) => r.id === id);
  if (!rec) return res.status(404).json({ error: 'Recommendation not found' });
  if (rec.applied) return res.status(400).json({ error: 'Already applied' });

  state = applyRecommendation(state, id);
  res.json({ success: true, recommendation: state.recommendations.find((r: Recommendation) => r.id === id) });
});

router.get('/schedule', (req: express.Request, res: express.Response) => {
  const transform = (jobs: typeof state.schedule.current) => jobs.map(j => ({
    id: j.id,
    name: j.name,
    type: j.type || 'Batch ETL' as const,
    start: j.startTime,
    end: j.endTime,
    rack: j.rack,
    power: j.power,
    priority: j.priority || 3,
  }));
  res.json({
    current: transform(state.schedule.current),
    optimized: transform(state.schedule.optimized),
  });
});

router.get('/water', (_, res: express.Response) => {
  const w = state.water;
  res.json({
    totalUsage: w.currentUsage,
    recyclingRate: 92,
    pueImpact: 1.38,
    breakdown: w.breakdown,
    weather: w.weather,
    recommendations: w.recommendations,
  });
});

router.get('/grid', (_, res: express.Response) => {
  res.json({
    gridDemand: 843,
    dcDemand: 142,
    riskLevel: state.grid.riskIndicator,
    demandSeries: state.grid.demandSeries,
    demandResponseActions: state.grid.demandResponseActions,
  });
});

router.get('/hardware', (_, res: express.Response) => {
  const racks = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'E1', 'F1', 'A3', 'B3', 'C3', 'D2', 'E2', 'A4', 'B4'];
  const transformed = state.hardware.map((h, i) => ({
    id: h.id,
    type: h.type,
    rack: racks[i % racks.length],
    health: h.healthScore,
    lifespan: Math.round((1 - h.usedLifespan / h.lifespan) * 100),
    failureRisk: h.failureRisk,
    recommendation: h.recommendation,
  }));
  res.json(transformed);
});

router.get('/ecoscore', (_, res: express.Response) => {
  const e = state.ecoscore;
  res.json({
    overall: e.overall,
    energyEfficiency: e.categories.find(c => c.name === 'Energy Efficiency')?.score || 78,
    waterEfficiency: e.categories.find(c => c.name === 'Water Stewardship')?.score || 70,
    coolingEfficiency: e.categories.find(c => c.name === 'Energy Efficiency')?.score || 78,
    carbonIntensity: e.categories.find(c => c.name === 'Carbon Footprint')?.score || 74,
    renewableUsage: e.categories.find(c => c.name === 'Renewable Usage')?.score || 65,
    hardwareHealth: e.categories.find(c => c.name === 'Hardware Lifecycle')?.score || 68,
  });
});

router.post('/report', (req: express.Request, res: express.Response) => {
  const { hours = 24 } = req.body;
  const end = new Date();

  const defaultActions = [
    { name: 'Cooling optimization triggered', impact: '8.2% energy saved', status: 'completed' as const },
    { name: 'Workload shifted to off-peak', impact: '4.1% cost reduction', status: 'completed' as const },
    { name: 'GPU frequency scaling applied', impact: '3.7% carbon reduced', status: 'completed' as const },
    { name: 'Renewable grid scheduling', impact: '2.9% renewable increase', status: 'in-progress' as const },
    { name: 'Battery reserve maintenance', impact: '1.8% peak reduction', status: 'pending' as const },
  ];

  const report = {
    title: 'Energy Optimization Report',
    generatedAt: end.toISOString(),
    totalEnergySavings: 12400,
    totalWaterSavings: 847,
    totalCarbonReduction: 1240,
    topActions: defaultActions,
  };

  res.json(report);
});

export default router;
