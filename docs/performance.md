# Performance & Scalability Review

> **PRITHVI — Sustainability OS for Data Centers**
> Client rendering, network, server, and scaling analysis with evidence from the source and configs.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Client-Side Performance](#2-client-side-performance)
- [3. Network Performance](#3-network-performance)
- [4. Server-Side Performance](#4-server-side-performance)
- [5. Scalability Analysis](#5-scalability-analysis)
- [6. Bottleneck Register](#6-bottleneck-register)
- [7. Optimization Roadmap](#7-optimization-roadmap)

---

## 1. Executive Summary

| Dimension | Rating (1–10) | Notes |
|---|---|---|
| Client first load | **4** | Heavy vendor bundle (three.js, framer-motion, recharts); only 4 routes lazy-loaded |
| Client runtime | **6** | 5–30 s polling re-renders; charts re-render wholesale |
| Network | **5** | 1–12 requests/min per page; large payloads with hard-coded fallbacks |
| Server runtime | **8** | Trivial CPU/memory: small arrays, in-memory state |
| Horizontal scalability | **1** | In-memory state prevents multi-instance without a shared store |
| Overall | **5/10** | Fine for a single demo instance; production needs architecture work |

---

## 2. Client-Side Performance

### 2.1 Bundle composition

Dependencies at `client/package.json`: `react`, `react-dom`, `react-router-dom`, `framer-motion`, `recharts`, `react-countup`, `react-intersection-observer`, `three`, `@react-three/fiber`, `@react-three/drei`, `lucide-react`, `tailwindcss`.

- `three` + `@react-three/fiber` + `@react-three/drei` are **only used by the landing page hero** (`pages/landing/`), yet are statically resolvable from `main.tsx` — Vite will hoist them into the vendor chunk for the initial bundle unless route-split.
- **Positive**: `React.lazy` is used for `Landing`, `Login`, `DataCenterPage`, `DataCenterDashboard` (`App.tsx`) — these pages load on demand.
- **Negative**: `Landing` is the **default route** — its lazy chunk is requested on first paint anyway, so the largest page (3D scene) is effectively part of first load.
- No `manualChunks` config in `vite.config.ts`; no `unplugin-auto-import`; no bundle-size budget; no `bundle-analyzer` evidence.

### 2.2 First-load sequence (`index.html`)

- Google Fonts (`Inter` 300–700 + `JetBrains Mono`) loaded via `<link>` with `preconnect` — render-blocking CSS fetch to a third party; no `font-display: swap` guarantee, no self-hosting.
- No resource hints (`preload`/`prefetch`) for route chunks.
- `vite.svg` favicon is the only other asset — no images shipped in the repo, which keeps payloads low elsewhere.

### 2.3 Runtime rendering

| Concern | Evidence | Impact |
|---|---|---|
| Polling re-fetch every 5 s (water, hardware, ecoscore) | `useEffect` + `setInterval(..., 5000)` | Full page subtree re-renders; `ecoscore` jitters values (`Math.random`) so the UI animates on every poll |
| Chart re-render | Recharts components receive fresh data arrays each poll | Recharts diffing is cheap at this scale (≤30 points) — acceptable |
| Framer-motion `LayoutGroup` + `layout` | Scheduler job cards animate positions | One-time 1.5 s cost on optimize; fine |
| Gantt/heatmap SVG | 7 jobs × 24 columns; 10×10 dots | Negligible DOM |
| Leak detection timer | `setInterval` inside `LeakDetectionCard` running 2–45% random walk | Independent of polling; paused via button |
| Unrouted heavy pages | `Dashboard.tsx`, `Advisor.tsx` are imported in `App.tsx` (static) | Their component code ships in the main bundle despite being unreachable |

### 2.4 Animations & jank

- `AnimatedCounter` uses `requestAnimationFrame` (landing) and `react-countup` elsewhere — both cheap.
- Infinite glow/pulse loops (`animate` with `repeat: Infinity`) — GPU-composited transforms/opacity, low cost, but accumulate if many cards animate simultaneously (grid page has several pulse rings).
- 900-point particle sphere on landing — GPU point cloud; acceptable on desktop, throttles low-end mobiles.

---

## 3. Network Performance

### 3.1 Request profile (per page, server online)

| Page | Interval | Requests/hour |
|---|---|---|
| Scheduler | 30 s | 120 |
| Water | 5 s | 720 |
| Hardware | 5 s | 720 |
| EcoScore | 5 s | 720 |
| Grid | 30 s (client-side, no network) | 0 (paused when optimized) |
| Reports | on demand | — |

- Payloads: water DTO ≈ 900 B, hardware ≈ 1.2 KB, ecoscore ≈ 200 B — tiny; bandwidth is a non-issue.
- **No HTTP caching** (`Cache-Control` headers absent; all responses computed fresh).
- `fetchTelemetry` returns fallback `null` → any consumer must guard (crash risk offline).

### 3.2 Fallback payload bloat

`api.ts` ships **full mock datasets inside the client bundle** (`fallbackSchedule`, `fallbackHardware`, `fallbackEcoScore`, `fallbackReport`). This is dead weight when the server is healthy and duplicates server seed data — two sources of truth (see api.md §6).

---

## 4. Server-Side Performance

| Area | Evidence | Assessment |
|---|---|---|
| Request handling | Express single process, synchronous handlers | Max: arrays of ≤30 items; all handlers are O(n) or O(1) — sub-ms per request |
| State size | ~60 objects total (8 recs, 14 jobs, 24 grid points, 16 hardware, 5 ecoscore cats, 30 trend points) | Negligible memory (< 1 MB) |
| Simulation | `updateTelemetry` is **not wired to any route** — zero runtime cost today | Would be ~µs per call if enabled |
| Static assets | `express.static(client/dist)` in production | Efficient, but no compression middleware (no `compression` package found) |
| Concurrency | Node single-threaded event loop; synchronous handlers don't block | 1k+ concurrent read requests trivially serviced |
| JSON parsing | `express.json()` default 100 KB limit | Fine for these payloads |

---

## 5. Scalability Analysis

### 5.1 What scales today

- **Stateless HTTP surface**: endpoints have no per-request state; a load balancer could distribute reads.
- **CDN-servable static build**: `client/dist` is static output — any static host works.

### 5.2 What cannot scale today

| Blocking factor | Why |
|---|---|
| **In-memory `AppState`** | Each instance has its own state; apply-recommendation on instance A is invisible to instance B; restarts reset everything |
| **In-memory `users[]`** | Google sign-ups created per-instance |
| **Client-side grid simulation** | Data source is the browser, not the platform — no shared truth |
| **Polling model** | 5 s polling across many clients multiplies load linearly (though trivial numbers here) |
| **Single-process Express** | Node is single-threaded — CPU-bound work (none today) would not scale horizontally |

### 5.3 Scale envelope (estimation)

- Reads: effectively unbounded for this workload (sub-ms handlers; 1000 req/s trivial on one core).
- Writes: single mutation endpoint; synchronous; no locking concerns within a process.
- Session growth: unbounded `users.push` in memory → memory leak-like growth with sustained sign-ups.

---

## 6. Bottleneck Register

| # | Bottleneck | Severity | Where |
|---|---|---|---|
| B1 | three.js in initial bundle path | Medium | landing/3D deps |
| B2 | Static imports of unrouted `Dashboard`/`Advisor` | Low | `App.tsx` |
| B3 | Third-party font render-blocking | Low | `index.html` |
| B4 | 5 s polling re-renders + jitter animations | Low | water/hardware/ecoscore pages |
| B5 | Duplicate mock payloads in client bundle | Low | `api.ts` |
| B6 | In-memory state = no horizontal scale, data loss on restart | **High** | server state holder |
| B7 | No compression middleware for static assets | Low | `server/index.ts` |
| B8 | No `Cache-Control`/ETag strategy | Low | all routes |

---

## 7. Optimization Roadmap

| Priority | Item | Effort | Expected gain |
|---|---|---|---|
| **P1** | Lazy-load `Dashboard`/`Advisor` or remove from bundle; lazy-load three.js behind the Landing chunk only | S | Shrinks initial bundle (~1 MB → ~350 KB est.) |
| **P1** | Add `manualChunks` vendor split (react, three, charts) | S | Cache-stable vendor chunks |
| **P1** | Persist state to a DB (see database.md §8) | L | Enables horizontal scaling, kills data loss |
| **P2** | Self-host fonts or add `display=swap` | S | Removes third-party render blocking |
| **P2** | `compression` middleware on server | S | ~60–80% payload reduction (text JSON) |
| **P2** | Long-lived polling (30 s) for water/hardware/ecoscore; back off when tab hidden | S | 6× fewer requests |
| **P2** | `Cache-Control: max-age` on `/api/telemetry`-like static responses; ETags on schedule | M | Better cache reuse |
| **P3** | Bundle-size CI check (`vite-bundle-visualizer`/`size-limit`) | S | Prevents regressions |
| **P3** | Switch 5 s polls to SSE/WebSocket when live telemetry lands | M | Real-time + fewer requests |

---

*Next: [Deployment Guide](deployment.md) · [Troubleshooting](troubleshooting.md)*
