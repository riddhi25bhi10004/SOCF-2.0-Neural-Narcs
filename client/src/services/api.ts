const API_BASE = '/api';

const fallbackSchedule = {
  current: [
    { id: 'job-1', name: 'AI Training', type: 'AI Training' as const, start: '00:00', end: '04:00', rack: 'A1', power: 72, priority: 1 },
    { id: 'job-2', name: 'Batch ETL', type: 'Batch ETL' as const, start: '04:00', end: '08:00', rack: 'B2', power: 54, priority: 2 },
    { id: 'job-3', name: 'Inference', type: 'Inference' as const, start: '08:00', end: '12:00', rack: 'C1', power: 61, priority: 3 },
    { id: 'job-4', name: 'Backup', type: 'Backup' as const, start: '12:00', end: '16:00', rack: 'D1', power: 39, priority: 2 },
  ],
  optimized: [
    { id: 'job-1', name: 'AI Training', type: 'AI Training' as const, start: '22:00', end: '02:00', rack: 'A1', power: 68, priority: 1 },
    { id: 'job-2', name: 'Batch ETL', type: 'Batch ETL' as const, start: '02:00', end: '06:00', rack: 'B2', power: 49, priority: 2 },
    { id: 'job-3', name: 'Inference', type: 'Inference' as const, start: '06:00', end: '10:00', rack: 'C1', power: 57, priority: 3 },
    { id: 'job-4', name: 'Backup', type: 'Backup' as const, start: '10:00', end: '14:00', rack: 'D1', power: 35, priority: 2 },
  ],
};

const fallbackHardware = [
  { id: 'gpu-1', type: 'GPU' as const, rack: 'A1', health: 92, lifespan: 83, failureRisk: 'low' as const, recommendation: 'Monitor coolant pressure' },
  { id: 'cpu-1', type: 'CPU' as const, rack: 'A2', health: 78, lifespan: 70, failureRisk: 'medium' as const, recommendation: 'Rotate fans next week' },
  { id: 'ssd-1', type: 'SSD' as const, rack: 'B1', health: 88, lifespan: 89, failureRisk: 'low' as const },
  { id: 'fan-1', type: 'Fan' as const, rack: 'C1', health: 61, lifespan: 54, failureRisk: 'medium' as const, recommendation: 'Inspect vibration levels' },
  { id: 'psu-1', type: 'PSU' as const, rack: 'D1', health: 47, lifespan: 39, failureRisk: 'high' as const, recommendation: 'Replace before next peak window' },
];

const fallbackEcoScore = {
  overall: 83,
  energyEfficiency: 84,
  waterEfficiency: 79,
  coolingEfficiency: 88,
  carbonIntensity: 76,
  renewableUsage: 81,
  hardwareHealth: 74,
};

const fallbackReport = {
  title: 'Energy Optimization Report',
  generatedAt: new Date().toISOString(),
  totalEnergySavings: 12400,
  totalWaterSavings: 847,
  totalCarbonReduction: 1240,
  topActions: [
    { name: 'Cooling optimization triggered', impact: '8.2% energy saved', status: 'completed' as const },
    { name: 'Workload shifted to off-peak', impact: '4.1% cost reduction', status: 'completed' as const },
    { name: 'GPU frequency scaling applied', impact: '3.7% carbon reduced', status: 'completed' as const },
    { name: 'Renewable grid scheduling', impact: '2.9% renewable increase', status: 'in-progress' as const },
    { name: 'Battery reserve maintenance', impact: '1.8% peak reduction', status: 'pending' as const },
  ],
};

async function getJsonWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchTelemetry() {
  return getJsonWithFallback(`${API_BASE}/telemetry`, null);
}

export async function fetchRecommendations() {
  return getJsonWithFallback(`${API_BASE}/recommendations`, []);
}

export async function applyRecommendation(id: string) {
  return getJsonWithFallback(`${API_BASE}/recommendations/${id}/apply`, { success: false }, { method: 'POST' });
}

export async function fetchSchedule(optimized = false) {
  const data = await getJsonWithFallback(`${API_BASE}/schedule?optimized=${optimized}`, fallbackSchedule);
  return data as typeof fallbackSchedule;
}

export async function fetchWaterData() {
  return getJsonWithFallback(`${API_BASE}/water`, null);
}

export async function fetchGridData() {
  return getJsonWithFallback(`${API_BASE}/grid`, null);
}

export async function fetchHardware() {
  return getJsonWithFallback(`${API_BASE}/hardware`, fallbackHardware);
}

export async function fetchEcoScore() {
  return getJsonWithFallback(`${API_BASE}/ecoscore`, fallbackEcoScore);
}

export async function generateReport() {
  return getJsonWithFallback(`${API_BASE}/report`, fallbackReport, { method: 'POST' });
}

// ============ ADD THESE AUTH FUNCTIONS ============

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Login failed');
  }
  return res.json();
}

export async function logoutUser() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Logout failed');
  }
  return res.json();
}