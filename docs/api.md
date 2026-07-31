# API Reference

> **PRITHVI — Sustainability OS for Data Centers**
> Complete REST API documentation, generated from `server/src/routes/` and cross-checked against `client/src/services/api.ts`.

## Table of Contents

- [1. Conventions](#1-conventions)
- [2. Endpoint Matrix](#2-endpoint-matrix)
- [3. Authentication Endpoints](#3-authentication-endpoints)
- [4. Domain Endpoints](#4-domain-endpoints)
- [5. Error Handling](#5-error-handling)
- [6. Client-Side Fallback Behavior](#6-client-side-fallback-behavior)
- [7. Known Divergences](#7-known-divergences)

---

## 1. Conventions

| Item | Value |
|---|---|
| Base path | `/api` |
| Transport | HTTP/JSON over `fetch` |
| Content type | `application/json` |
| Auth requirement | **None** — no endpoint validates tokens |
| CORS | Wide open (`cors()` default: `*` origins) |
| Base URL | Dev: `http://localhost:5173/api` (Vite proxy → `:3001`) · Prod: same origin (`:3001` serves SPA + API) |

---

## 2. Endpoint Matrix

| Method | Path | Purpose | Body | Auth |
|---|---|---|---|---|
| GET | `/api/health` | Liveness probe | — | — |
| GET | `/api/telemetry` | Current telemetry snapshot | — | — |
| GET | `/api/recommendations` | AI recommendation list | — | — |
| POST | `/api/recommendations/:id/apply` | Apply a recommendation (mutates state) | — | — |
| GET | `/api/schedule` | Current + optimized job schedules | — | — |
| GET | `/api/water` | Water intelligence bundle | — | — |
| GET | `/api/grid` | Grid demand + risk snapshot | — | — |
| GET | `/api/hardware` | Hardware lifecycle inventory | — | — |
| GET | `/api/ecoscore` | Sustainability score breakdown | — | — |
| POST | `/api/report` | Generate optimization report | `{ hours? }` | — |
| POST | `/api/auth/login` | Email/password sign-in | `{ email, password }` | — |
| POST | `/api/auth/google` | Google-style sign-in | `{ email, name? }` | — |
| POST | `/api/auth/logout` | Sign out (client-side semantics) | — | — |

---

## 3. Authentication Endpoints

### POST `/api/auth/login`

Sign in with email and password (plaintext comparison against in-memory users).

**Request**

```json
{
  "email": "admin@prithvi.ai",
  "password": "password123"
}
```

**Responses**

| Status | Body |
|---|---|
| `200` | `{ "token": "<base64>", "user": { "id", "email", "name", "role" } }` (password stripped) |
| `400` | `{ "error": "Email and password are required" }` |
| `401` | `{ "error": "Invalid email or password" }` |
| `500` | `{ "error": "Internal server error" }` |

**Behavioral details**
- Email is trimmed and lowercased before lookup.
- Token format: `base64("<userId>:<Date.now()>:<Math.random()>")` — unverified, unsigned, no expiry.

### POST `/api/auth/google`

Simulated Google sign-in. Creates a user on the fly if the email is unknown (empty password, `role: 'user'`).

**Request**

```json
{ "email": "user@example.com", "name": "User" }
```

**Responses**

| Status | Body |
|---|---|
| `200` | `{ "token", "user" }` |
| `400` | `{ "error": "Email is required" }` |
| `500` | `{ "error": "Unable to sign in with Google right now" }` |

### POST `/api/auth/logout`

Always succeeds. **No server-side session exists** — the client clears `localStorage["prithvi-auth-session"]`.

| Status | Body |
|---|---|
| `200` | `{ "message": "Logged out successfully" }` |

---

## 4. Domain Endpoints

### GET `/api/health`

```json
{ "status": "ok", "timestamp": "2026-07-31T12:00:00.000Z" }
```

### GET `/api/telemetry`

Returns the **static seed snapshot** (`initialTelemetry`). The simulation engine (`updateTelemetry`) is not wired to this endpoint.

```json
{
  "power": 950,
  "water": 4800,
  "coolingEfficiency": 4.0,
  "carbon": 280,
  "renewableShare": 45,
  "gridStress": "medium",
  "avgTemperature": 25,
  "pue": 1.45,
  "timestamp": 1780000000000,
  "anomaly": null
}
```

| Field | Type | Notes |
|---|---|---|
| `power` | number | kW |
| `water` | number | L |
| `coolingEfficiency` | number | COP |
| `carbon` | number | kgCO₂ |
| `renewableShare` | number | % |
| `gridStress` | `"low" \| "medium" \| "high"` | |
| `avgTemperature` | number | °C |
| `pue` | number | 1.30–1.70 |
| `timestamp` | number | ms epoch |
| `anomaly` | `{ type, severity } \| null` | `heat_spike` / `renewable_drop` / `cooling_drift` |

### GET `/api/recommendations`

Array of 8 seed recommendations.

```json
[
  {
    "id": "rec-1",
    "title": "Increase cooling setpoint by 2°C",
    "description": "Raise data hall temperature within ASHRAE limits to reduce chiller load.",
    "impact": { "energy": 12, "water": 8, "carbon": 10 },
    "confidence": 92,
    "priority": "high",
    "tradeoff": "Slightly higher hardware temps",
    "applied": false,
    "appliedAt": null
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | `rec-1` … `rec-8` |
| `impact` | object | `energy` (%), optional `water` (%), `carbon` (%) |
| `priority` | `"critical" \| "high" \| "medium" \| "low"` | |

### POST `/api/recommendations/:id/apply`

Applies the recommendation's multiplier effects to telemetry and boosts EcoScore.

**Responses**

| Status | Body |
|---|---|
| `200` | `{ "success": true, "recommendation": { ...applied rec } }` |
| `400` | `{ "error": "Already applied" }` |
| `404` | `{ "error": "Recommendation not found" }` |

**Effect on state** (see system-design.md §6 for the full multiplier table): power/carbon/water scaled by fixed factors, COP/PUE adjusted, `applied: true`, `appliedAt` set, overall score `+2..6`, each category `+1..4` (both clamped at 100).

### GET `/api/schedule`

Returns both schedules. The `optimized` query parameter is **accepted by the client but ignored by the server**.

**Response**

```json
{
  "current": [
    {
      "id": "job-1",
      "name": "ML Training - Alpha",
      "type": "AI Training",
      "start": "08:00",
      "end": "12:00",
      "rack": "A1-A4",
      "power": 180,
      "priority": 1
    }
  ],
  "optimized": []
}
```

- 7 jobs in each list (seed data).
- `savings` (`{ energy: "8.2%", carbon: "14.5%" }`) exists in state but is **not serialized** by this route.

### GET `/api/water`

Returns an **enriched DTO** — mixes real seed values with hard-coded numbers:

| Field | Source |
|---|---|
| `totalUsage`, `breakdown` | `state.water` |
| `recyclingRate: 92`, `pueImpact: 1.38`, `waterSaved: 842`, `coolingEfficiency: 96`, `leakRisk: 12`, `aiConfidence: 98`, `storageLevel: 72`, `quality`, `beforeAI: 4200`, `afterAI: 3842`, `decisions`, `forecast`, `environmentalImpact` | hard-coded in route |
| `recommendations`, `weather` | `state.water` |

**Response shape**

```json
{
  "totalUsage": 4800,
  "recyclingRate": 92,
  "pueImpact": 1.38,
  "waterSaved": 842,
  "coolingEfficiency": 96,
  "leakRisk": 12,
  "aiConfidence": 98,
  "storageLevel": 72,
  "quality": { "ph": 7.2, "purity": 98, "coolingSafe": true },
  "recommendations": [],
  "beforeAI": 4200,
  "afterAI": 3842,
  "weather": {
    "temp": 22.4, "humidity": 58, "rainProbability": 74,
    "coolingDemand": "Low", "windSpeed": 12
  },
  "decisions": [
    { "action": "Cooling tower flow reduced", "reason": "Outside temperature decreased", "confidence": 98 }
  ],
  "forecast": { "rainExpected": true, "estimatedHarvest": 1420, "confidence": 91, "timeFrame": "Tomorrow" },
  "environmentalImpact": { "waterSaved": 842, "carbonReduced": 12, "energySaved": 18 },
  "breakdown": { "coolingTowers": 2800, "chillers": 1500, "adiabatic": 500 }
}
```

### GET `/api/grid`

```json
{
  "gridDemand": 843,
  "dcDemand": 142,
  "riskLevel": "medium",
  "demandSeries": [ { "time": "00:00", "grid": 712.4, "dc": 821.3 } ],
  "demandResponseActions": ["Curtail non-critical batch jobs"]
}
```

> **Note:** the Grid page does not consume this endpoint — it runs its own client-side simulation (`GridService`). The endpoint's `riskLevel`/`demandSeries` come from `state.grid`; `gridDemand`/`dcDemand` are hard-coded.

### GET `/api/hardware`

Transforms 16 seed components; adds `rack` by index and computes `lifespan` as remaining %.

```json
[
  {
    "id": "hw-1",
    "type": "GPU",
    "rack": "A1",
    "health": 94,
    "lifespan": 58,
    "failureRisk": "low",
    "recommendation": "Schedule thermal paste refresh next quarter"
  }
]
```

| Field | Type | Notes |
|---|---|---|
| `type` | string | `GPU` / `CPU` / `SSD` / `Fan` / `PSU` |
| `rack` | string | `A1`…`F1` cycle (16 racks, by index) |
| `health` | number | 0–100 health score |
| `lifespan` | number | `round((1 - used/lifespan) * 100)` |
| `failureRisk` | `"low" \| "medium" \| "high"` | |

### GET `/api/ecoscore`

```json
{
  "overall": 72,
  "energyEfficiency": 78,
  "waterEfficiency": 70,
  "coolingEfficiency": 78,
  "carbonIntensity": 74,
  "renewableUsage": 65,
  "hardwareHealth": 68
}
```

| Field | Mapping |
|---|---|
| `energyEfficiency` | category "Energy Efficiency" |
| `waterEfficiency` | category "Water Stewardship" |
| `coolingEfficiency` | **same value as `energyEfficiency`** (route reuses it — see Known Divergences) |
| `carbonIntensity` | category "Carbon Footprint" |
| `renewableUsage` | category "Renewable Usage" |
| `hardwareHealth` | category "Hardware Lifecycle" |

Fallbacks: missing category → hard-coded defaults (78 / 70 / 78 / 74 / 65 / 68).

### POST `/api/report`

**Request**

```json
{ "hours": 24 }
```

`hours` is accepted but ignored — the report is fully hard-coded and identical on every call.

**Response** (same shape as the client fallback)

```json
{
  "title": "Energy Optimization Report",
  "generatedAt": "<ISO>",
  "totalEnergySavings": 12400,
  "totalWaterSavings": 847,
  "totalCarbonReduction": 1240,
  "topActions": [
    { "name": "Cooling optimization triggered", "impact": "8.2% energy saved", "status": "completed" }
  ]
}
```

---

## 5. Error Handling

| Code | Scenario | Client behavior |
|---|---|---|
| `200` | Success | parsed and rendered |
| `400` | Validation / already applied | `getJsonWithFallback` returns the fallback payload (recommendation apply falls back to `{ success: false }`) |
| `401` | Bad credentials | `loginUser` throws `error.error`; page shows inline message |
| `404` | Unknown route / recommendation | Route fallback; SPA catch-all in prod serves `index.html` |
| `500` | Auth service exceptions | `loginUser` throws; fallback auth kicks in |
| Network fail | Server unreachable | Fallback payload (domain calls) or client fallback session (auth) |

**Conventions:** error bodies are always `{ "error": string }`; non-auth routes never return 4xx/5xx for state issues (they have no validation paths except recommendation apply).

---

## 6. Client-Side Fallback Behavior

| Client function | Endpoint | Fallback payload |
|---|---|---|
| `fetchTelemetry` | `GET /api/telemetry` | `null` |
| `fetchRecommendations` | `GET /api/recommendations` | `[]` |
| `applyRecommendation` | `POST /api/recommendations/:id/apply` | `{ success: false }` |
| `fetchSchedule` | `GET /api/schedule?optimized=` | `fallbackSchedule` (4 jobs, different times than seed) |
| `fetchWaterData` | `GET /api/water` | `null` |
| `fetchGridData` | `GET /api/grid` | `null` (never called by pages) |
| `fetchHardware` | `GET /api/hardware` | `fallbackHardware` (5 components) |
| `fetchEcoScore` | `GET /api/ecoscore` | `fallbackEcoScore` (score 83) |
| `generateReport` | `POST /api/report` | `fallbackReport` (identical values to server response) |
| `loginUser` / `logoutUser` | `/api/auth/*` | **No** fallback inside api.ts — handled in `AuthContext` (local session) |

> Consequence: when the server is down, schedules and hardware show **different mock data** than the server's seed (two sources of truth).

---

## 7. Known Divergences

| # | Finding | Evidence |
|---|---|---|
| 1 | `?optimized=` query is sent but ignored; server always returns both lists | `api.ts:76` vs `telemetry.ts:39` |
| 2 | `coolingEfficiency` echoes `energyEfficiency` (both resolve to "Energy Efficiency" category) | `telemetry.ts:126-136` |
| 3 | `/api/telemetry` returns the static seed — `updateTelemetry` engine is unused | `telemetry.ts:21` vs `telemetryService.ts` |
| 4 | `/api/grid` is unused by the Grid page (client-side `GridService` instead) | `GridMonitor.tsx:17` |
| 5 | `fetchTelemetry` fallback is `null`, so a `fetchTelemetry` consumer gets a crash-prone value if the server is down | `api.ts:63-65` |
| 6 | `/api/report` response does not match the `ReportSummary` interface in `data/telemetry.ts` (different fields) | `telemetry.ts:93-99` vs route |
| 7 | Server's `/api/water` is fully hard-coded above seed values — "live" water data is static | `telemetry.ts:56-100` |
| 8 | `state.schedule.savings` is never serialized | `telemetry.ts:39-54` |

---

*Next: [Database & Data Models](database.md) · [Security Review](security.md)*
