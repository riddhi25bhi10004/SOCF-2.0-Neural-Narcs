# Troubleshooting Guide

> **PRITHVI — Sustainability OS for Data Centers**
> Common issues, their causes (with evidence), and fixes.

## Table of Contents

- [1. Startup Problems](#1-startup-problems)
- [2. Authentication Problems](#2-authentication-problems)
- [3. Data and Rendering Problems](#3-data-and-rendering-problems)
- [4. Network and Deployment Problems](#4-network-and-deployment-problems)
- [5. Expected Behaviors That Look Like Bugs](#5-expected-behaviors-that-look-like-bugs)

---

## 1. Startup Problems

### 1.1 `EADDRINUSE` — port 3001 or 5173 already in use

**Cause**: another process occupies the port.

**Fix**:
```powershell
# find the PID and kill it (Windows)
netstat -ano | findstr :3001
taskkill /PID <pid> /F
# or run on a different port
$env:PORT="3002"; npm run dev
```

> Note: changing `PORT` only affects the server. The Vite dev proxy (`client/vite.config.ts`) still points at `:3001` — update it too.

### 1.2 `npm run dev` fails immediately

**Cause**: missing dependencies.

**Fix**: run `npm run install:all` (installs root + client + server), then retry. Verify with `node --version` (18+ required).

### 1.3 Server crashes with `Cannot find module 'express'` in production

**Cause**: the server was started without installing `server/` dependencies (e.g., running `node server/dist/index.js` from the repo root with only root deps installed).

**Fix**: `cd server && npm install --omit=dev && cd ..` before starting, or install `dotenv`/`cors` at the root too (they exist at root `package.json` but the server imports them from its own `node_modules`).

---

## 2. Authentication Problems

### 2.1 Login "succeeds" but there's no server running

**Cause (by design)**: `AuthContext` falls back to a **local session** whenever `POST /api/auth/login` fails (404/500/network). See docs/system-design.md §7.

**Fix**: start the server, clear `localStorage` (`prithvi-auth-session`) in devtools, and log in again with real credentials.

### 2.2 Wrong credentials are accepted locally

**Cause**: same fallback path — any non-2xx login response produces a demo session. There is no way to distinguish "server down" from "wrong password" for 404/500 responses (401s do show an error).

**Fix**: verify the server is up (`curl http://localhost:3001/api/health`).

### 2.3 `Invalid email or password` with the exact demo credentials

**Check**: email must be `admin@prithvi.ai` (lowercase, trimmed). The email is lowercased server-side; the password is compared exactly. If you changed `server/src/data/users.ts`, restart the server (in-memory users).

### 2.4 Logout doesn't seem to do anything server-side

**Cause (by design)**: logout only clears the client session; `POST /api/auth/logout` just returns a success message. No server session exists.

---

## 3. Data and Rendering Problems

### 3.1 "Failed to load schedule data"

**Cause**: `fetchSchedule()` failed *and* returned a falsy result. The scheduler's fallback payload exists, but the page's `if (!schedule)` guard treats a missing/empty response as failure.

**Fix**: ensure the server is running, or confirm `client/dist` is being served in production. Check the browser console for the actual fetch error.

### 3.2 Telemetry numbers never change on the dashboard

**Cause (by design)**: `GET /api/telemetry` returns the **static seed snapshot** — `updateTelemetry()` (the simulation engine) is not wired to any route. See docs/api.md §7.

**Workaround**: none available without code changes; the client fallback and `ecoscore` page apply their own jitter so some pages do animate.

### 3.3 Water/hardware/ecoscore values "look random" across reloads

**Cause**: EcoScore applies `Math.random()` jitter on each client fetch; the seed trend is generated at boot; `updateTelemetry` uses `Math.random()` noise. Everything is simulated.

### 3.4 Grid page stops updating

**Cause (by design)**: the Grid page pauses its 30 s auto-refresh once optimization completes (`isOptimized`). Click **Reset** to regenerate fresh data and resume polling.

### 3.5 Blank page after an error

**Cause**: an uncaught render error. `ErrorBoundary` (wrapped around routes in `App.tsx`) shows a fallback with a reload button. If it's blank anyway, check the browser console; then hard-refresh (`Ctrl+Shift+R`).

### 3.6 Animations/3D scene missing or laggy

**Cause**: the landing hero uses WebGL (three.js). Low-end/headless devices may fail to initialize WebGL. The rest of the app is unaffected (the scene is landing-only).

---

## 4. Network and Deployment Problems

### 4.1 CORS errors when calling the API from a different origin

**Cause**: the server uses open CORS (`cors()` default), so cross-origin calls *should* succeed. Errors usually come from calling `http://localhost:3001/api/*` from a page served at `:5173` — that's the normal dev setup and works via the Vite proxy. Use relative `/api/*` paths (the client does).

### 4.2 Deep links return 404 in production

**Cause**: serving the SPA without the fallback rule. The server handles `/*` → `index.html` when `client/dist` exists (docs/deployment.md). If you host `client/dist` statically, configure a rewrite: all non-asset paths → `/index.html`.

### 4.3 API works but pages show mock data (in production)

**Cause**: pages use fallback payloads whenever `fetch` fails. If the API is reachable but returns non-2xx (e.g., a proxy returns HTML), the client silently uses fallbacks. Check `Network` tab → request status codes.

### 4.4 State "resets" after server restart

**Cause (by design)**: everything lives in process memory; no persistence exists (docs/database.md). Applied recommendations, score changes, and Google sign-ups are lost.

### 4.5 Google Fonts don't load (offline/intranet deployment)

**Cause**: `index.html` fetches `fonts.googleapis.com`. In air-gapped environments, self-host the fonts (docs/performance.md roadmap).

---

## 5. Expected Behaviors That Look Like Bugs

| Behavior | Why it's expected |
|---|---|
| Everything works with the server off | Client fallback data + fallback auth are intentional (docs/system-design.md §8) |
| `/api/schedule?optimized=false` returns both schedules | The query param is ignored by the server (docs/api.md §7) |
| `coolingEfficiency` equals `energyEfficiency` on `/api/ecoscore` | Route maps both to the same category (docs/api.md §7) |
| Report values are identical every time | `/api/report` is fully hard-coded (docs/api.md §4) |
| "Dashboard" and "Advisor" pages are unreachable | They are implemented but not routed in `App.tsx` (docs/architecture.md §2.1) |
| Demo credentials appear in source | Demo project trade-off; rotate before any public release (docs/security.md §13) |

---

*Next: [Testing](testing.md) · [Roadmap](roadmap.md) · [Repository Audit](repository-audit.md)*
