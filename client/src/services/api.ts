const API_BASE = '/api';

export async function fetchTelemetry() {
  const res = await fetch(`${API_BASE}/telemetry`);
  if (!res.ok) throw new Error('Failed to fetch telemetry');
  return res.json();
}

export async function fetchRecommendations() {
  const res = await fetch(`${API_BASE}/recommendations`);
  if (!res.ok) throw new Error('Failed to fetch recommendations');
  return res.json();
}

export async function applyRecommendation(id: string) {
  const res = await fetch(`${API_BASE}/recommendations/${id}/apply`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to apply recommendation');
  return res.json();
}

export async function fetchSchedule(optimized = false) {
  const res = await fetch(`${API_BASE}/schedule?optimized=${optimized}`);
  if (!res.ok) throw new Error('Failed to fetch schedule');
  return res.json();
}

export async function fetchWaterData() {
  const res = await fetch(`${API_BASE}/water`);
  if (!res.ok) throw new Error('Failed to fetch water data');
  return res.json();
}

export async function fetchGridData() {
  const res = await fetch(`${API_BASE}/grid`);
  if (!res.ok) throw new Error('Failed to fetch grid data');
  return res.json();
}

export async function fetchHardware() {
  const res = await fetch(`${API_BASE}/hardware`);
  if (!res.ok) throw new Error('Failed to fetch hardware');
  return res.json();
}

export async function fetchEcoScore() {
  const res = await fetch(`${API_BASE}/ecoscore`);
  if (!res.ok) throw new Error('Failed to fetch eco score');
  return res.json();
}

export async function generateReport() {
  const res = await fetch(`${API_BASE}/report`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to generate report');
  return res.json();
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