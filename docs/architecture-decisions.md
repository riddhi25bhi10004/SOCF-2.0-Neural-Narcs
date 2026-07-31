# Architecture Decision Records

> **PRITHVI — Sustainability OS for Data Centers**
> Decisions that shaped the codebase, reconstructed from code evidence. **Inference note**: no formal ADRs exist in the repository — these records capture the decisions the code implies, marked `[inferred]` where the decision was not written down anywhere.

## Table of Contents

- [1. ADR-001: Two-Workspace Monorepo](#1-adr-001-two-workspace-monorepo)
- [2. ADR-002: In-Memory State Instead of a Database](#2-adr-002-in-memory-state-instead-of-a-database)
- [3. ADR-003: Client-Side Fallback Data for Every API Call](#3-adr-003-client-side-fallback-data-for-every-api-call)
- [4. ADR-004: Fallback Authentication Session](#4-adr-004-fallback-authentication-session)
- [5. ADR-005: Simulated Intelligence (Heuristics, Not ML)](#5-adr-005-simulated-intelligence-heuristics-not-ml)
- [6. ADR-006: Client-Side Grid Simulation](#6-adr-006-client-side-grid-simulation)
- [7. ADR-007: Polling Instead of Push](#7-adr-007-polling-instead-of-push)
- [8. ADR-008: Route-Layer DTO Transforms](#8-adr-008-route-layer-dto-transforms)
- [9. ADR-009: Replace-Only State Mutations](#9-adr-009-replace-only-state-mutations)
- [10. ADR-010: Single Process Serves API and SPA](#10-adr-010-single-process-serves-api-and-spa)
- [11. ADR-011: Hybrid Charting (Recharts + Custom SVG)](#11-adr-011-hybrid-charting-recharts--custom-svg)
- [12. ADR-012: Tailwind with Custom Component Classes](#12-adr-012-tailwind-with-custom-component-classes)
- [13. ADR-013: Demo Credentials in Source](#13-adr-013-demo-credentials-in-source)
- [14. ADR-014: Ship Without Tests and CI](#14-adr-014-ship-without-tests-and-ci)

---

### Status Legend

| Status | Meaning |
|---|---|
| **Accepted** | The codebase implements this; project still stands by it |
| **Accepted (demo)** | Implemented for demo purposes; must be revisited for production |
| **Superseded** | Decision was reversed or planned to be (see roadmap.md) |
| **Proposed** | Recommended for the next phase |

---

## 1. ADR-001: Two-Workspace Monorepo

**Status**: Accepted — **Date**: initial commit era — **Type**: [inferred]

**Context**: One repository must contain a React SPA and an Express API with independent dependency graphs.

**Decision**: Root `package.json` with `concurrently` scripts (`npm run dev`) driving `client/` and `server/` sub-projects, each with its own `package.json` and lockfile. `install:all` handles nested installs.

**Consequences**
- Single-command boot (`npm run dev`), but duplicated install steps and no shared lockfile.
- Root deps (`cors`, `dotenv`) partially duplicate server deps.

---

## 2. ADR-002: In-Memory State Instead of a Database

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: The product needs a stateful demo (apply recommendation → score improves) without infra burden.

**Decision**: A module-scoped `AppState` seeded at boot (`createInitialState()`), mutated only by `applyRecommendation`. No persistence, no DB.

**Consequences**
- Zero setup; instant restarts.
- Data loss on restart; no history; single-instance only (database.md §1).
- **Superseded** by roadmap Phase 1 (database.md §8).

---

## 3. ADR-003: Client-Side Fallback Data for Every API Call

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: Pages must never appear broken during demos, including when the server is down.

**Decision**: `getJsonWithFallback(url, fallback)` wraps every domain call; each wrapper ships a hard-coded fallback payload.

**Consequences**
- The app is fully usable offline (demo superpower).
- Server outages are visually silent; fallback payloads bloat the bundle and diverge from server seeds (performance.md B5, api.md §6).

---

## 4. ADR-004: Fallback Authentication Session

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: A deployed demo must let evaluators reach protected pages even if the auth API is unreachable or returns 500.

**Decision**: `AuthContext` creates a local session (fake token, derived user) whenever `POST /api/auth/login` fails with 404/500/network error.

**Consequences**
- Demo never blocks the user.
- Authentication is fully bypassable — the single most critical security finding (security.md §3.4).

---

## 5. ADR-005: Simulated Intelligence (Heuristics, Not ML)

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: The UI promises AI insights, forecasts, and decisions; no ML pipeline exists.

**Decision**: Deterministic sinusoidal + noise generators (`updateTelemetry`, `GridService`) produce plausible telemetry, decisions, and anomalies; recommendations are seeded with static confidence scores.

**Consequences**
- Convincing demo with zero ML infra.
- Claims like "AI Confidence 98%" are theatrical (inference labeled as such in docs/architecture.md). Roadmap Phase 2 replaces with real analytics.

---

## 6. ADR-006: Client-Side Grid Simulation

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: The Grid page needs rich live-feeling data with interactive optimization.

**Decision**: Implement `GridService` as a client singleton generating grid data per call; the server's `/api/grid` endpoint exists but is unused by the page.

**Consequences**
- Zero network cost, instant interactivity.
- Two divergent grid models (client `GridData` vs server DTO) and dead endpoint code (api.md §7 #4).

---

## 7. ADR-007: Polling Instead of Push

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: Live updates are required; WebSocket/SSE adds complexity.

**Decision**: `setInterval` per page (5–30 s) with `clearInterval` on unmount.

**Consequences**
- Simple and robust; 5 s stale data worst case; request churn (720 req/h on water page). Performance.md §3.1.

---

## 8. ADR-008: Route-Layer DTO Transforms

**Status**: Accepted — **Type**: [inferred]

**Context**: Internal state models (e.g., `startTime`) differ from client contracts (e.g., `start`); components should consume stable wire shapes.

**Decision**: Each route maps internal → client DTO inline (schedule, water, hardware, ecoscore).

**Consequences**
- Clean component contracts; but transforms also hard-code values (water DTO) creating drift (api.md §7).

---

## 9. ADR-009: Replace-Only State Mutations

**Status**: Accepted — **Type**: [inferred]

**Context**: `applyRecommendation` must be side-effect-free and diffable (the UI compares pre/post state).

**Decision**: Mutations build a new `AppState` via spread and reassign the module reference (`state = applyRecommendation(...)`).

**Consequences**
- Predictable diffs; the `users` array (`authService`) violates the pattern with in-place `push` — accepted inconsistency (system-design.md §4.1).

---

## 10. ADR-010: Single Process Serves API and SPA

**Status**: Accepted — **Type**: [inferred]

**Context**: Deployment should be a single artifact with no S3/CDN coordination.

**Decision**: In production, Express serves `client/dist` with an SPA fallback when the directory exists (`server/index.ts`).

**Consequences**
- One process = whole app (deployment.md §1).
- Cannot independently scale/decouple frontend; CORS-open API sits on the same origin.

---

## 11. ADR-011: Hybrid Charting (Recharts + Custom SVG)

**Status**: Accepted — **Type**: [inferred]

**Context**: Line charts need speed of integration; gauges, sparklines, Gantt, and heatmaps need custom visuals.

**Decision**: Recharts for line/area; bespoke SVG for everything else.

**Consequences**
- Rich visual language consistent with the saffron-gold theme; more bespoke code to maintain (architecture.md §6.2).

---

## 12. ADR-012: Tailwind with Custom Component Classes

**Status**: Accepted — **Type**: [inferred]

**Context**: Rapid UI iteration with a distinctive glass/eco aesthetic.

**Decision**: Tailwind utilities + semantic component classes (`glass`, `btn-primary`, `section-title`) in `index.css`, with a custom `eco-*` palette in `tailwind.config.js`.

**Consequences**
- Fast, consistent styling; semantic classes hide composition details (performance overhead negligible).

---

## 13. ADR-013: Demo Credentials in Source

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: Evaluators need obvious login credentials.

**Decision**: Ship two users with plaintext passwords in `server/src/data/users.ts`.

**Consequences**
- Instant onboarding; plaintext secrets in a tracked file (security.md §9). Rotate before public release.

---

## 14. ADR-014: Ship Without Tests and CI

**Status**: Accepted (demo) — **Type**: [inferred]

**Context**: Velocity for a prototype over engineering rigor.

**Decision**: No test runner, no lint config (only `.hintrc`), no CI pipeline.

**Consequences**
- Fast iteration; regressions unguarded (testing.md §1).
- **Superseded** by roadmap Phase 0 (testing.md §5).

---

## Proposed ADRs (next phase)

| # | Proposal | Links |
|---|---|---|
| ADR-015 | Persist state to SQLite/Postgres | database.md §8 |
| ADR-016 | Real auth: bcrypt + signed JWT + middleware | security.md §13 |
| ADR-017 | Single source of truth for grid data | api.md §7 #4 |
| ADR-018 | Structured logging + request IDs | observability.md |

---

*Next: [Observability](observability.md) · [Repository Audit](repository-audit.md)*
