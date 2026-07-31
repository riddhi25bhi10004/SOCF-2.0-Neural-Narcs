<div align="center">

# 🌍 PRITHVI — Sustainability OS for Data Centers

**The intelligent command center for sustainable infrastructure.**

PRITHVI turns power, water, cooling, and carbon data into one clear operating system that helps teams cut waste, reduce risk, and think faster.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-PRIVATE-informational)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6)
![Vite](https://img.shields.io/badge/Vite-5.x-646cff)
![Express](https://img.shields.io/badge/Express-4.21-000000)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.3-38bdf8)
![Build](https://img.shields.io/badge/build-passing-brightgreen)
[![Contributors](https://img.shields.io/badge/contributors-Neural%20Narcs-orange)](https://github.com/your-org/prithvi-ai/graphs/contributors)
![Stars](https://img.shields.io/badge/stars-0-gray)

</div>

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Configuration](#configuration)
- [Architecture Overview](#architecture-overview)
- [Documentation](#documentation)
- [Demo Credentials](#demo-credentials)
- [License](#license)

---

## Project Overview

### What it does

**PRITHVI** is a full-stack sustainability operations platform for data centers. It provides a real-time, AI-assisted command center that monitors and optimizes the four critical resources of modern data center infrastructure:

- ⚡ **Energy** — power consumption, PUE, grid stress, electricity pricing
- 💧 **Water** — cooling water usage, leak detection, rainwater harvesting forecasts
- 🌡️ **Cooling** — efficiency (COP), weather-aware cooling demand
- 🌱 **Carbon** — emissions tracking, renewable share, EcoScore

### Why it exists

Data centers consume up to 30% of their energy through inefficient cooling and unoptimized workloads, and traditional cooling consumes millions of liters of water annually. Most operators lack a single pane of glass that connects these systems with actionable, prioritized recommendations. PRITHVI exists to solve that problem.

### Intended users

- **Data center operators** — enterprise, hyperscale, colocation, edge, modular, and government facilities
- **Sustainability/ESG teams** — track EcoScore, carbon reduction, and water stewardship
- **Facility engineers** — hardware lifecycle, leak detection, cooling optimization

### Key capabilities

| Capability | Description |
|---|---|
| **Live telemetry** | Power, water, cooling, carbon, PUE simulated in real time on the server |
| **AI Advisor** | Prioritized recommendations with confidence scores, impact estimates, and trade-offs |
| **Workload scheduling** | Gantt timeline comparing current vs. AI-optimized job placement with animated migration |
| **Water intelligence** | Flow visualization, storage levels, leak risk, water quality, rain harvesting forecast |
| **Grid orchestration** | Zone stress heatmap, blackout prediction, battery status, live electricity pricing |
| **Hardware lifecycle** | Health scores, failure risk, lifespan tracking across 16 components |
| **EcoScore** | Weighted sustainability score across energy, water, carbon, renewable, and hardware |
| **Reporting** | On-demand optimization report with savings totals and top actions |
| **Auth** | Email/password + Google-style sign-in with role-based user model |

> **Note on "AI"**: All AI features (recommendations, forecasts, optimizations) are **simulated** with deterministic heuristic models — there are no ML model integrations. See [docs/system-design.md](docs/system-design.md) for the simulation engine details.

### High-level architecture

PRITHVI is a **monorepo** with two workspaces:

```
┌─────────────────────────────┐        ┌──────────────────────────────┐
│   client/ (React SPA)       │        │   server/ (Express API)      │
│   Vite + React 18 + TS      │  HTTP  │   REST + in-memory state     │
│   Tailwind + Framer Motion  │ ─────► │   simulated telemetry engine │
│   Three.js landing visuals  │  /api  │   auth + token service       │
└─────────────────────────────┘        └──────────────────────────────┘
```

In development, Vite proxies `/api` to the Express server. In production, the Express server statically serves the built SPA from `client/dist`.

---

## Features

### AI Features

- **AI Advisor** (`Advisor` page) — recommendation engine exposing energy/water/carbon impact, confidence %, priority, and trade-offs. Applying a recommendation mutates live telemetry (e.g., `rec-1` cuts power draw 12% and improves PUE).
- **AI Status Card** — scheduler-side status with confidence, peak-load detection, and suggested actions.
- **AI Forecast Timeline** — 6-hour power/cooling/carbon/temperature/renewable projections.
- **AI Water Status** — system confidence, water saved, recycling rate, cooling efficiency.
- **AI Grid Decisions** — decision log with reasons and confidence for grid actions.

### Dashboard

- **Operations Center header** — live clock, system health, uptime, latency.
- **KPI cards** — animated numbers, sparklines, status badges, AI prediction text.
- **Infrastructure panel** — 8 subsystems (servers, GPU, CPU, storage, network, cooling, UPS, power).
- **Renewable mix** — solar/wind/battery/grid energy source breakdown.
- **Sustainability panel** — CO₂ saved, water saved, trees equivalent, net carbon reduction.

### Analytics

- Power & carbon 24h line charts (Recharts + custom SVG).
- Grid stress radial gauge, renewable share trend, EcoScore 30-day trend.
- Carbon intensity heatmap per rack (scheduler).
- Grid zone load heatmap (north/east/south/west).

### Authentication

- Email/password login with demo credentials.
- Google-style login (`POST /api/auth/google`) — accepts an email/name payload.
- Base64 session token stored in `localStorage`.
- Protected routes redirect unauthenticated users to `/login`.
- Client-side **fallback auth** keeps the app usable if the API is unreachable.

### Scheduling

- **Run Optimization** — simulates AI workload redistribution (3.5s animated migration).
- **Gantt chart** — 24h timeline comparing current vs. optimized job windows.
- **Savings counters** — energy, carbon, cost, efficiency percentages (CountUp animation).
- **Schedule polling** — refreshed every 30 seconds from the API.

### Monitoring

- 30-second grid data refresh; 5-second water/hardware/ecoscore refresh.
- Leak detection with dynamic risk simulation and 127-sensor telemetry.
- Hardware health cards with failure-risk colors and replacement recommendations.

### Automation (Simulated)

- **Apply Recommendation** endpoint mutates telemetry and improves EcoScore.
- **Grid Optimization** force-transitions all metrics to stable/optimal states.
- **Water decisions** — cooling tower flow reduction, greywater redirect, rainwater harvesting (forecast-driven).

### Reporting

- `POST /api/report` generates an optimization report with energy/water/carbon savings and top actions (completed / in-progress / pending).

### Notifications

- Status badges, anomaly banners (heat spike, renewable drop, cooling drift — simulated with ~9% probability per refresh).
- Live activity feed with timestamped infrastructure events.

### Administration

- Role model (`admin` | `user`) surfaced in the API; `admin@prithvi.ai` demos the admin role.

---

## Technology Stack

| Category | Technology |
|---|---|
| **Languages** | TypeScript 5.x (100% of source) |
| **Frontend Framework** | React 18.2 |
| **Backend Framework** | Express 4.21 |
| **Runtime** | Node.js (≥ 18 recommended) |
| **Package Manager** | npm (workspace scripts + `concurrently`) |
| **Build Tool** | Vite 5 (`client/`), `tsc` (type-check server) |
| **Styling** | Tailwind CSS 3.3, PostCSS, Autoprefixer |
| **UI Icons** | lucide-react |
| **Animation** | framer-motion, react-countup, react-intersection-observer |
| **Charts** | Recharts 2.10 + custom SVG (gauge, sparkline, radial, Gantt) |
| **3D** | three + @react-three/fiber + @react-three/drei (landing hero only) |
| **State Management** | React Context (auth) + local component state (no global store) |
| **Database** | None — in-memory server state (`server/src/data/telemetry.ts`) |
| **ORM** | None |
| **Authentication** | Custom base64 token service (`server/src/services/authService.ts`) |
| **API Framework** | Express Router (`/api` namespace) |
| **AI Services** | None — heuristic simulation engines (see system design) |
| **Hosting** | Any Node.js host; Express serves static frontend (Render/Railway/VPS pattern) |
| **Dev Tools** | tsx (watch mode), concurrently, Vite HMR |
| **Testing** | None currently (see [docs/testing.md](docs/testing.md)) |
| **Linting** | None configured (see [docs/architecture.md](docs/architecture.md) audit) |

---

## Project Structure

```
prithvi-ai/
├── package.json              # Root scripts (dev, client, server, install:all)
├── .gitignore
├── .hintrc                   # webhint configuration
├── client/                   # React frontend (Vite SPA)
│   ├── index.html            # SPA entry, fonts, meta
│   ├── vite.config.ts        # Dev server :5173, /api proxy → :3001
│   ├── tailwind.config.js    # eco-* color palette, fonts, animations
│   ├── postcss.config.js
│   ├── tsconfig.json         # Strict TS config for src
│   ├── public/               # static assets (vite.svg)
│   └── src/
│       ├── main.tsx          # ReactDOM root + BrowserRouter
│       ├── App.tsx           # Route table (public + protected)
│       ├── index.css         # Tailwind layers, .glass/.btn-* utilities
│       ├── types/index.ts    # Shared domain types
│       ├── data/datacenters.ts   # 6 data center type definitions
│       ├── context/AuthContext.tsx # Auth provider, localStorage session
│       ├── services/
│       │   ├── api.ts        # REST client + fallback data
│       │   └── gridService.ts    # Grid simulation singleton (client-side)
│       ├── pages/            # Route pages (see below)
│       └── components/
│           ├── Layout/       # Navbar, sidebar layout, ProtectedRoute
│           ├── chart/        # GaugeChart, HealthBar, LineChart
│           ├── dashboard/    # KPI, infrastructure, renewable, activity...
│           ├── grid/         # Grid command center widgets
│           ├── scheduler/    # Gantt, heatmap, status, savings
│           ├── water/        # Water intelligence widgets
│           └── ui/           # MetricCard, RecommendationCard
└── server/                   # Express backend
    ├── index.ts              # Server bootstrap, static hosting, API mount
    ├── tsconfig.json
    └── src/
        ├── data/
        │   ├── telemetry.ts  # State interfaces + seed data + createInitialState
        │   └── users.ts      # In-memory user store (demo accounts)
        ├── routes/
        │   ├── auth.ts       # /login, /google, /logout
        │   └── telemetry.ts  # All telemetry + domain endpoints
        └── services/
            ├── authService.ts    # Credential check, token gen/validate
            └── telemetryService.ts # Simulation engine + recommendation effects
```

### Page map

| Route | Page | Protected |
|---|---|---|
| `/` | Landing (3D hero) | No |
| `/login` | Login | No |
| `/datacenter/:slug` | Data center type page | No |
| `/dashboard/:slug` | Data center dashboard | Yes |
| `/scheduler` | Command Center (workload orchestration) | Yes |
| `/water` | Water Intelligence | Yes |
| `/grid` | AI Grid Command Center | Yes |
| `/hardware` | Hardware Lifecycle | Yes |
| `/ecoscore` | EcoScore | Yes |
| `/reports` | Reports | Yes |

> Unrouted pages: `pages/dashboard/Dashboard.tsx` and `pages/advisor/Advisor.tsx` are implemented but not mounted in the route table.

---

## Installation Guide

### Prerequisites

- **Node.js ≥ 18** (tested with modern LTS; TypeScript 7 toolchain in root devDeps)
- **npm ≥ 9**

### 1. Clone

```bash
git clone <your-repo-url> prithvi-ai
cd prithvi-ai
```

### 2. Install dependencies

```bash
npm run install:all
```

This installs root, `client/`, and `server/` dependencies in one pass. Alternatively:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

### 3. Environment setup

No environment file is required. The only supported variable is `PORT` (see [Environment Variables](#environment-variables)).

### 4. Run locally (development)

```bash
npm run dev
```

| Process | URL |
|---|---|
| Client (Vite dev server + HMR) | http://localhost:5173 |
| Server (Express API) | http://localhost:3001 |
| Health check | http://localhost:3001/api/health |

Vite proxies `/api/*` requests to the server automatically.

### 5. Production build

```bash
cd client && npm run build     # type-checks + bundles into client/dist
cd ../server && npm run start  # serves API + static client/dist
```

Or from the root:

```bash
npm run client:build           # if you add this script; otherwise use the two commands above
```

The server detects `client/dist` at startup and serves it, including SPA fallback for client-side routes.

### Development commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run client + server concurrently |
| `npm run client` | Client dev server only (:5173) |
| `npm run server` | Server watch mode only (:3001) |
| `npm run install:all` | Install all three workspaces |
| `cd client && npm run build` | Production build of the SPA |
| `cd client && npm run preview` | Preview the production build |
| `cd server && npm run build` | Type-check the server (`tsc --noEmit`) |

### Troubleshooting

- **Port 3001 already in use** — set `PORT=3002 npm run server` and update the proxy in `client/vite.config.ts` (dev only).
- **API unreachable from client in dev** — confirm Vite proxy target matches the server port.
- **Login fails** — the app falls back to local auth automatically if the API is down; otherwise use demo credentials.
- See [docs/troubleshooting.md](docs/troubleshooting.md) for the full FAQ.

---

## Environment Variables

| Variable | Purpose | Required | Default | Example |
|---|---|---|---|---|
| `PORT` | HTTP port for the Express server | No | `3001` | `PORT=8080 npm run server` |

> This is the **only** environment variable referenced in the codebase (`server/index.ts:11`). Credentials, telemetry, and all data are hard-coded demo values.

---

## Configuration

### Root `package.json`

- `dev` — runs client and server concurrently.
- `install:all` — installs all workspaces.
- TypeScript 7 is declared at root for editor tooling; runtime execution uses `tsx`.

### `client/vite.config.ts`

- Dev server on port `5173`; proxies `/api` → `http://localhost:3001`.

### `client/tsconfig.json`

- Strict mode, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `jsx: react-jsx`, bundler module resolution.

### `client/tailwind.config.js`

- Defines the `eco-*` palette (saffron/gold/earth tones), Inter + JetBrains Mono fonts, glow/float keyframes, custom blur.

### `client/index.html`

- Font preconnects (Google Fonts), viewport, page title `PRITHVI — Sustainability OS for Data Centers`.

### `client/postcss.config.js`

- Tailwind + Autoprefixer pipeline.

### `server/tsconfig.json`

- `ES2020` target, `NodeNext` module resolution, strict mode, `outDir: dist`.

### `.gitignore`

- Ignores `node_modules/`, `client/dist/`, and a stray `client/tmp-login-test.js`.

### `.hintrc`

- webhint config extending `development` preset; relaxes two TypeScript-config hints.

### CI / Docker

- No CI workflows, Dockerfiles, or container configuration exist in this repository yet. See [docs/deployment.md](docs/deployment.md) for supported deployment patterns.

---

## Architecture Overview

```
Browser (React SPA)
    │  fetch('/api/...')
    ▼
Express Server (:3001)
    ├─ /api/auth/*        → authService (users.ts, token gen/validate)
    ├─ /api/*             → telemetry routes (in-memory AppState)
    │                        └─ telemetryService (simulation + effects)
    └─ static client/dist (production SPA hosting)
```

- **Frontend**: React 18 SPA with client-side routing, route-level code splitting (`React.lazy` for landing/login/data-center pages), and React Context for auth. All data flows through `client/src/services/api.ts`, which wraps every endpoint with an offline fallback.
- **Backend**: Single Express process holding an in-memory `AppState` snapshot. Telemetry is returned as a static seed snapshot — a sinusoidal + noise simulation engine (`updateTelemetry`) exists but is not yet wired to any route. There is **no persistence** — restarts reset all state.
- **Auth**: Custom opaque base64 token (`userId:timestamp:random`), stored in `localStorage`. Token validation checks user existence. Plaintext passwords in memory (demo-only).
- **Grid data**: Simulated **client-side** in `GridService` (singleton) rather than via the API — the `/api/grid` endpoint exists but the Grid page does not call it.

Deep dives:

- [Architecture](docs/architecture.md) — layers, folders, components
- [System Design](docs/system-design.md) — state model, data flow, request lifecycle
- [Flowcharts](docs/flowcharts.md) — 12 workflow diagrams (25 Mermaid diagrams across the docs set)
- [API Reference](docs/api.md) — every endpoint
- [Security](docs/security.md) — auth model and review
- [Performance](docs/performance.md) — performance & scalability review

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@prithvi.ai` | `password123` |
| User | `demo@prithvi.ai` | `demo123` |

> These are hard-coded demo credentials (server/src/data/users.ts). Do not use for real deployments.

---

## License

Private. All rights reserved. © 2026 PRITHVI.
