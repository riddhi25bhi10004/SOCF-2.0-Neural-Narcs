# Changelog

All notable changes to **PRITHVI** are documented in this file. Entries are derived from the git history. Versioning follows [Semantic Versioning](https://semver.org/) — the project is currently at `1.0.0` (unreleased formal versions).

## [Unreleased]

### Security (planned, P0 — see docs/security.md)
- Enforce token validation middleware on all `/api/*` routes.
- Replace plaintext passwords with hashed credentials (bcrypt/argon2).
- Remove the client-side fallback login (or gate it behind an explicit demo flag).
- Restrict CORS to explicit origins.

### Performance (planned — see docs/performance.md)
- Lazy-load or remove unrouted `Dashboard` and `Advisor` pages from the bundle.
- Vendor chunk splitting for react/three/recharts.
- Longer polling intervals + visibility-based backoff.

### Persistence (planned — see docs/database.md)
- Database-backed state (currently in-memory only; data is lost on restart).

## [1.0.0] — current baseline

Project snapshot as of the last commit on `main` (`6f5cd3f`).

### Added
- **Landing page** with 3D hero (three.js scene: particle sphere, torus knot, data rings), animated counters, scroll reveals, and a "Why PRITHVI" acronym section.
- **Data center categories**: enterprise, hyperscale, colocation, edge, modular, government (`client/src/data/datacenters.ts`) with public `/datacenter/:slug` pages and protected `/dashboard/:slug`.
- **Login page** with saffron-gold-white theme, demo autofill, and Google-style sign-in (`/api/auth/google`).
- **Command Center** (`/scheduler`): workload timeline (Gantt), carbon heatmap, AI status card, animated job migration, animated savings counters.
- **Water Intelligence** (`/water`): 13 widgets — flow visualization, decision panel, tank gauge, leak detection (2–45% risk simulation), rain forecast, quality, recommendations, before/after comparison.
- **Grid Monitor** (`/grid`): fully client-side grid simulation (`GridService`) — command center, metrics, stress heatmap, blackout prediction, live price, battery, 8-second optimization workflow.
- **Hardware lifecycle** (`/hardware`): health bars, lifespan %, rack mapping, failure-risk callouts.
- **EcoScore** (`/ecoscore`): weighted category breakdown (30/25/20/15/10), gauge, 30-day trend, apply-recommendation workflow with server-side score effects.
- **Reports** (`/reports`): one-click optimization report (energy/water/carbon tiles + top actions).
- **API**: `/api/health`, `/api/telemetry`, `/api/recommendations` (+apply), `/api/schedule`, `/api/water`, `/api/grid`, `/api/hardware`, `/api/ecoscore`, `/api/report`, `/api/auth/login|google|logout`.
- **Server simulation engine** (`updateTelemetry`): sinusoidal + noise telemetry generator with anomaly rolls (currently not wired to any route).
- **Client resilience**: every API call falls back to hard-coded mock data (`api.ts`); auth falls back to a local session when the server is unreachable.
- **SPA hosting**: production server serves `client/dist` with SPA fallback.

### Fixed (notable bug-fix commits)
- `bf59fe1` — scheduler, hardware, ecoscore, report fallback data.
- `f2c0846` — auth login flow for deployed apps (client fallback session).
- `0f1c806` — deployment prep; unused imports removed.

### Known limitations (tracked in docs)
- No database — all state is in-memory and resets on restart (docs/database.md).
- Telemetry endpoint returns static seed data; the simulation engine is unwired (docs/api.md §7).
- No tests, no CI, no linter (docs/testing.md, docs/repository-audit.md).
- `Dashboard` and `Advisor` pages exist but are not routed (docs/architecture.md).
- Auth is cosmetic: no endpoint validates tokens; passwords are plaintext (docs/security.md).

---

## How this changelog is maintained

- Format: [Keep a Changelog](https://keepachangelog.com/) style.
- New PRs must add an entry under `[Unreleased]` (Added / Changed / Deprecated / Removed / Fixed / Security).
- Release a version by renaming `[Unreleased]` to `[x.y.z]` with date, following the conventions in docs/contributing.md.
