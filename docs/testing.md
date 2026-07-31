# Testing

> **PRITHVI — Sustainability OS for Data Centers**
> Current testing status and a concrete plan for adding automated coverage. **Fact: the repository contains no tests** — no test files, no test runner config, no CI workflow, and no `test` script in any `package.json`.

## Table of Contents

- [1. Current Status](#1-current-status)
- [2. What Can Be Tested Today (Manual)](#2-what-can-be-tested-today-manual)
- [3. High-Value Automated Test Targets](#3-high-value-automated-test-targets)
- [4. Proposed Test Stack](#4-proposed-test-stack)
- [5. Recommended Test Plan](#5-recommended-test-plan)
- [6. Acceptance Criteria](#6-acceptance-criteria)

---

## 1. Current Status

| Item | Status |
|---|---|
| Unit tests | None |
| Component tests | None |
| E2E tests | None |
| Test runner | None (no vitest/jest/playwright/cypress config) |
| Coverage tooling | None |
| CI pipeline | None |
| `test` scripts | None in root/client/server `package.json` |

Verification today is manual: `npm run build` on both workspaces + browser smoke testing (docs/contributing.md §4).

---

## 2. What Can Be Tested Today (Manual)

| Area | Checklist |
|---|---|
| **Auth** | Correct creds → dashboard; wrong password → inline error; server down → fallback session (docs/troubleshooting.md §2); logout clears `localStorage["prithvi-auth-session"]`; direct navigation to `/scheduler` while logged out → `/login` with `state.from` return |
| **Scheduler** | Loads 7 jobs; "Run Optimization" animates migration (~3.5 s), shows optimized list + 23% savings; "Reset" restores current list; 30 s polling refreshes |
| **Water** | 13 widgets render from `/api/water`; leak risk fluctuates 2–45%; pause/resume works; polling every 5 s |
| **Grid** | Data changes every 30 s; optimization takes 8 s then **freezes**; Reset restarts; blackout risk/battery/price derived from simulation |
| **Hardware** | 16 components with racks A1–F1 cycle; high-risk items styled; 5 s polling |
| **EcoScore** | Scores render; applying a recommendation → success + score bump; re-apply → error handled; gauge/trend animate |
| **Reports** | Generate → report with 3 metric tiles + 5 actions; regenerate replaces content |
| **Resilience** | With server off: every page still renders (fallbacks); no unhandled console errors |
| **Builds** | `npm --prefix client run build` and `npm --prefix server run build` succeed |

---

## 3. High-Value Automated Test Targets

The most valuable (and cheapest) tests target **pure logic that currently has zero coverage**:

### Server — `telemetryService.ts`
- `updateTelemetry`: output ranges (power 750–1250, water 3800–6200, COP 3.4–4.6, carbon 180–420, temp 21–29, PUE 1.3–1.7, renewable 15–75); `gridStress` rules (power>1100 or renewable<25 → high); anomaly distribution bounds.
- `applyRecommendation`: each `rec-1..rec-8` multiplier table (docs/system-design.md §6); idempotence on re-apply; unknown id → unchanged state; EcoScore clamps at 100; `appliedAt` set.

### Server — `authService.ts`
- `authenticateUser`: case-insensitive email, plaintext match, password stripped from result.
- `generateToken`/`validateToken`: round-trip; malformed token → null.

### Server — routes
- `GET /api/schedule` DTO shape (field renames `startTime→start`, type default `'Batch ETL'`).
- `POST /api/recommendations/:id/apply`: 200/400/404 responses (supertest).
- `/api/ecoscore` `coolingEfficiency` echo quirk (docs/api.md §7) — pin as a regression test or fix first.

### Client — `gridService.ts`
- `generateGridData`: schema completeness, zone load formula, status thresholds (critical > 2400).
- `simulateOptimization`: all improvement factors applied; decision appended.

### Client — `api.ts`
- `getJsonWithFallback`: fallback on !ok and network error (mock `fetch`).
- Each wrapper returns its fallback payload when the server is absent.

### Client — `AuthContext`
- Login success persists session; failure creates fallback session; logout clears storage; hydration reads storage.

### Client — components (RTL)
- `MetricCard`, `GaugeChart` (value→angle), `HealthBar`, `RecommendationCard` (apply → callback), `ProtectedRoute` redirect.

---

## 4. Proposed Test Stack

| Layer | Tool | Rationale |
|---|---|---|
| Runner | **Vitest** | Vite-native, zero config in this repo, fast, TS out of the box |
| Server unit/integration | **Vitest + supertest** | Boot Express app in-process; no network |
| Component tests | **Vitest + @testing-library/react + jsdom** | Matches React 18 |
| E2E | **Playwright** (later phase) | Full flows: login → optimize → report |
| Coverage | Vitest `--coverage` (v8 provider) | Thresholds in CI |
| CI | GitHub Actions (parallel client/server jobs) | Enforce tests + builds on PRs |

---

## 5. Recommended Test Plan

**Phase 1 — Foundation (server logic first, ~1 day)**
1. `vitest` in `server/`: `telemetryService` + `authService` + route DTO/status tests.
2. Add `test` scripts; wire `npm run test` at root to run both workspaces.

**Phase 2 — Client units (~2 days)**
1. `gridService` + `api.ts` fallback tests.
2. `AuthContext` integration test (renderHook + mocked fetch).
3. Component smoke tests for the chart/ui primitives.

**Phase 3 — E2E (~2 days)**
1. Playwright: login (server on/off), scheduler optimize, grid optimize freeze, report generation.
2. Wire into CI as a smoke job against `npm run dev`.

**Phase 4 — Enforce**
1. CI: `test` + `build` + `npm audit` gates.
2. Coverage thresholds (start ≥ 60% lines on server services).
3. Lint (ESLint + Prettier) added before tests are gate-kept.

---

## 6. Acceptance Criteria

- [ ] `npm test` passes from repo root in under ~1 min
- [ ] Every documented fallback path (docs/api.md §6) has a test
- [ ] Every `applyRecommendation` multiplier has a regression test
- [ ] A broken server (routes failing) is caught by CI before merge
- [ ] Manual checklist in §2 remains executable (docs/contributing.md §4 references it)

---

*Next: [Roadmap](roadmap.md) · [Architecture Decisions](architecture-decisions.md)*
