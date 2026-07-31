# Roadmap

> **PRITHVI — Sustainability OS for Data Centers**
> Phased plan to evolve the demonstration prototype into a production-grade sustainability platform. Phases are ordered by dependency; every item maps to evidence in this documentation set.

## Table of Contents

- [1. Vision](#1-vision)
- [2. Phase 0 — Stabilization (immediate)](#2-phase-0--stabilization-immediate)
- [3. Phase 1 — Make Data Real (next)](#3-phase-1--make-data-real-next)
- [4. Phase 2 — Real Intelligence](#4-phase-2--real-intelligence)
- [5. Phase 3 — Enterprise Readiness](#5-phase-3--enterprise-readiness)
- [6. Technical Debt Register](#6-technical-debt-register)
- [7. Non-Goals](#7-non-goals)

---

## 1. Vision

PRITHVI becomes a platform that ingests real telemetry from data centers (power, water, cooling, grid, hardware) and produces **actionable, trustworthy** optimization recommendations — first for a single facility, then multi-facility. The current codebase demonstrates the UX vision; the roadmap fills in the engineering.

---

## 2. Phase 0 — Stabilization (immediate)

*Goal: make the current codebase safe to maintain and share.*

| Item | Evidence / rationale |
|---|---|
| Add test suite (docs/testing.md Phase 1–2) | Zero tests today |
| Add ESLint + Prettier + configs | No lint config exists (only `.hintrc`) |
| Wire CI (GitHub Actions): test + build + audit | No CI workflow |
| Run `npm audit`; pin/upgrade dependencies | `^` ranges, no audit evidence (security.md §10) |
| Route `Dashboard` + `Advisor` pages or delete them | Implemented but unrouted; they ship dead code (architecture.md §2.1, performance.md B2) |
| Fix `/api/ecoscore` `coolingEfficiency` echo bug | api.md §7 (#2) |
| Decide/delete `/api/grid` vs client `GridService` (one source of truth) | api.md §7 (#4) |
| Split water types out of `water.tsx` into shared types | duplication noted in architecture.md §6.5 |

## 3. Phase 1 — Make Data Real (next)

*Goal: data is live, persistent, and trustworthy.*

| Item | Evidence / rationale |
|---|---|
| Wire `updateTelemetry` to `/api/telemetry` (schedule tick or on-read) | engine is dead code (system-design.md §3.3) |
| Add database persistence (`AppState` → SQLite/Postgres; time-series telemetry) | database.md §8 |
| Real auth: hashed passwords, signed expiring tokens, auth middleware, remove fallback login | security.md §13 P0 |
| Server-driven schedules: implement `optimizeSchedule` POST; move optimization decision to the server | scheduler never POSTs (flowcharts.md §4) |
| Replace hard-coded DTO values (water/report/ecoscore) with state/config | api.md §7 (#6, #7) |
| Honor `?optimized=` query or remove it | api.md §7 (#1) |
| Rate limiting + CORS allowlist + helmet | security.md §13 P1 |
| Structured logging + request IDs | security.md §13 P2, observability.md |

## 4. Phase 2 — Real Intelligence

*Goal: replace simulated heuristics with defensible analytics.*

| Item | Evidence / rationale |
|---|---|
| Replace sinusoidal noise with real ML-adjacent models: load forecasting, anomaly detection, carbon-aware scheduling | current engine is `sin + random` (system-design.md §5) |
| Recommendation engine driven by telemetry rules, not hard-coded rec-1..8 multipliers | system-design.md §6 |
| Real-time updates (SSE/WebSocket) to replace 5 s polling | performance.md §7 |
| Multi-data-center data model (the 6 categories already exist in `datacenters.ts`) | architecture.md §5 |
| Historical analytics + reporting from time-series data | database.md §8 |

## 5. Phase 3 — Enterprise Readiness

*Goal: production operations for real facilities.*

| Item | Rationale |
|---|---|
| RBAC enforcement (`admin`/`user` currently decorative) | security.md §4 |
| SSO (OAuth2/OIDC) replacing `/api/auth/google` stub | security.md §3.5 |
| Multi-tenant isolation + audit trail | security.md §12 |
| Accessibility pass (WCAG) | see repository-audit.md |
| Localization (i18n) | landing copy is English-only |
| PWA/offline mode (intentional offline support already exists via fallbacks) | system-design.md §8 |
| Mobile app shell / kiosk mode for facility operators | dashboard UX exists |

## 6. Technical Debt Register

| Debt | Where | Effort |
|---|---|---|
| Two grid data models (client `GridData` vs server DTO) | `types/index.ts` vs `telemetry.ts:64` | M |
| Duplicate water type declarations | `pages/water/water.tsx` | S |
| Route-level magic numbers (water 92/1.38/842, report totals, ecoscore fallbacks) | `routes/telemetry.ts` | M |
| `fallbackReport` duplicates the server's hard-coded report | `api.ts:36` vs `telemetry.ts:139` | S |
| Dead exports: `updateTelemetry`, `validateToken`, `fetchGridData`, `optimizeSchedule`(unused by page), `findUserByCredentials`, `findOrCreateUserByEmail` | various | S |
| Unauthenticated API + cosmetic guards | server routes, `ProtectedRoute` | L |
| In-memory `users.push` growth (no eviction) | `authService.ts` | S |
| Git history contains an index/stash artifact commit (`e726b18`) | git | S |

## 7. Non-Goals (for the foreseeable future)

- Physical hardware integration (PLC/BMS/SCADA drivers) — out of scope for the demo; assume a telemetry ingestion contract instead.
- Carbon-market/certificate integration — add only when real telemetry exists.
- Multi-cloud SaaS billing — focus on the platform core first.

---

*Next: [Architecture Decisions](architecture-decisions.md) · [Observability](observability.md) · [Repository Audit](repository-audit.md)*
