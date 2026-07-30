import type { AppState, TelemetryState } from '../data/telemetry';

export function updateTelemetry(state: TelemetryState): TelemetryState {
  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60;
  const dayProgress = hour / 24;

  const solarFactor = Math.sin((hour - 6) / 12 * Math.PI);
  const baseRenewable = 35 + solarFactor * 25;
  const renewableNoise = (Math.random() - 0.5) * 10;
  let renewableShare = Math.max(15, Math.min(75, baseRenewable + renewableNoise));

  const basePower = 900 + Math.sin(dayProgress * Math.PI * 2) * 150;
  const powerNoise = (Math.random() - 0.5) * 80;
  let power = Math.max(750, Math.min(1250, basePower + powerNoise));
  power = Math.round(power * 100) / 100;

  const baseWater = 4400 + Math.sin(dayProgress * Math.PI * 2) * 600;
  const waterNoise = (Math.random() - 0.5) * 200;
  let water = Math.max(3800, Math.min(6200, baseWater + waterNoise));
  water = Math.round(water * 100) / 100;

  const baseCOP = 4.0 + Math.sin(dayProgress * Math.PI * 2) * 0.3;
  const copNoise = (Math.random() - 0.5) * 0.2;
  let coolingEfficiency = Math.max(3.4, Math.min(4.6, baseCOP + copNoise));
  coolingEfficiency = Math.round(coolingEfficiency * 100) / 100;

  const carbonIntensity = 0.28 - (renewableShare / 100) * 0.15;
  let carbon = power * carbonIntensity;
  const carbonNoise = (Math.random() - 0.5) * 20;
  carbon = Math.max(180, Math.min(420, carbon + carbonNoise));
  carbon = Math.round(carbon * 100) / 100;

  let gridStress: TelemetryState['gridStress'] = 'low';
  if (power > 1100 || renewableShare < 25) gridStress = 'high';
  else if (power > 950 || renewableShare < 40) gridStress = 'medium';

  const baseTemp = 25 + Math.sin(dayProgress * Math.PI * 2) * 2;
  const tempNoise = (Math.random() - 0.5) * 1.5;
  let avgTemperature = Math.max(21, Math.min(29, baseTemp + tempNoise));
  avgTemperature = Math.round(avgTemperature * 100) / 100;

  let pue = 1.45 + (power / 1250) * 0.15 + Math.random() * 0.05;
  pue = Math.max(1.3, Math.min(1.7, pue));
  pue = Math.round(pue * 100) / 100;

  let anomaly: { type: string; severity: number } | null = null;
  const anomalyRoll = Math.random();
  if (anomalyRoll > 0.97) {
    anomaly = { type: 'heat_spike', severity: 0.8 };
    avgTemperature = Math.min(29, avgTemperature + 2);
    power = Math.min(1250, power + 60);
  } else if (anomalyRoll > 0.94) {
    anomaly = { type: 'renewable_drop', severity: 0.6 };
    renewableShare = Math.max(15, renewableShare - 15);
  } else if (anomalyRoll > 0.91) {
    anomaly = { type: 'cooling_drift', severity: 0.4 };
    coolingEfficiency = Math.max(3.4, coolingEfficiency - 0.3);
  }

  return {
    power,
    water,
    coolingEfficiency,
    carbon,
    renewableShare: Math.round(renewableShare * 100) / 100,
    gridStress,
    avgTemperature,
    pue,
    timestamp: Date.now(),
    anomaly,
  };
}

export function applyRecommendation(state: AppState, id: string): AppState {
  const rec = state.recommendations.find(r => r.id === id);
  if (!rec || rec.applied) return state;

  const updatedRecs = state.recommendations.map(r =>
    r.id === id ? { ...r, applied: true, appliedAt: Date.now() } : r
  );

  let telemetry = { ...state.telemetry };

  if (rec.id === 'rec-1') {
    telemetry.power = Math.round((telemetry.power * 0.88) * 100) / 100;
    telemetry.coolingEfficiency = Math.round((telemetry.coolingEfficiency + 0.15) * 100) / 100;
    telemetry.pue = Math.round((telemetry.pue - 0.03) * 100) / 100;
  } else if (rec.id === 'rec-2') {
    telemetry.carbon = Math.round((telemetry.carbon * 0.82) * 100) / 100;
  } else if (rec.id === 'rec-3') {
    telemetry.coolingEfficiency = Math.round((telemetry.coolingEfficiency + 0.2) * 100) / 100;
    telemetry.water = Math.round((telemetry.water * 0.97) * 100) / 100;
  } else if (rec.id === 'rec-4') {
    telemetry.power = Math.round((telemetry.power * 0.97) * 100) / 100;
  } else if (rec.id === 'rec-5') {
    telemetry.power = Math.round((telemetry.power * 0.85) * 100) / 100;
    telemetry.water = Math.round((telemetry.water * 0.8) * 100) / 100;
  } else if (rec.id === 'rec-6') {
    telemetry.power = Math.round((telemetry.power * 0.78) * 100) / 100;
    telemetry.carbon = Math.round((telemetry.carbon * 0.8) * 100) / 100;
  } else if (rec.id === 'rec-7') {
    telemetry.power = Math.round((telemetry.power * 0.94) * 100) / 100;
  } else if (rec.id === 'rec-8') {
    telemetry.power = Math.round((telemetry.power * 0.9) * 100) / 100;
    telemetry.coolingEfficiency = Math.round((telemetry.coolingEfficiency + 0.25) * 100) / 100;
  }

  const newEcoScore = Math.min(100, state.ecoscore.overall + Math.round(Math.random() * 4 + 2));
  const updatedEcoscore = {
    ...state.ecoscore,
    overall: newEcoScore,
    categories: state.ecoscore.categories.map(c => ({
      ...c,
      score: Math.min(100, c.score + Math.round(Math.random() * 3 + 1)),
    })),
  };

  return {
    ...state,
    recommendations: updatedRecs,
    telemetry,
    ecoscore: updatedEcoscore,
  };
}
