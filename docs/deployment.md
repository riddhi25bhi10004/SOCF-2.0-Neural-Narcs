# Deployment Guide

> **PRITHVI — Sustainability OS for Data Centers**
> How to build and run the application in any environment. Note: the repository ships **no** Dockerfile, CI config, or platform config — the recipes below are recommended starting points, and only the single-process model matches the current architecture.

## Table of Contents

- [1. What the Build Produces](#1-what-the-build-produces)
- [2. Prerequisites](#2-prerequisites)
- [3. Local Development](#3-local-development)
- [4. Production Build](#4-production-build)
- [5. Deployment Targets](#5-deployment-targets)
- [6. Environment Variables](#6-environment-variables)
- [7. Reverse Proxy Configuration](#7-reverse-proxy-configuration)
- [8. Multi-Instance Caveats](#8-multi-instance-caveats)
- [9. Deployment Checklist](#9-deployment-checklist)

---

## 1. What the Build Produces

```text
PRITHVI
├── client/dist/        ← static SPA (Vite build: HTML, JS, CSS, assets)
├── server/             ← Express API (compiled or tsx-run)
```

**The server is a single deployable**: when `client/dist` exists next to the server (same working directory at runtime), Express serves it (`server/index.ts`) with an SPA fallback for `/`, `/login`, `/datacenter/*`, etc. One process = full app.

---

## 2. Prerequisites

| Tool | Version (verified) | Purpose |
|---|---|---|
| Node.js | 18+ (repo built with Node 18-era deps: Vite 5, Express 4.21) | runtime + tooling |
| npm | 9+ | package management |

No database, no Redis, no platform accounts required.

---

## 3. Local Development

```powershell
# root installs workspace deps (root package.json has workspaces)
npm install
npm run dev
```

- Client: `http://localhost:5173` (Vite, hot reload)
- API: `http://localhost:3001` (tsx watch)
- Vite proxies `/api` → `:3001` (`client/vite.config.ts`)

**Demo credentials**

| Role | Email | Password |
|---|---|---|
| Admin | `admin@prithvi.ai` | `password123` |
| User | `demo@prithvi.ai` | `demo123` |

---

## 4. Production Build

```powershell
# 1. build the client
npm --prefix client run build        # → client/dist

# 2. start the server (it serves client/dist automatically)
npm --prefix server start            # or: node server/index.mjs style entry
```

The server entry is `server/index.ts` (TypeScript). For a compiled run:

```powershell
npm --prefix server run build        # tsc → dist/
node server/dist/index.js
```

> If `client/dist` is missing, the API runs alone (CORS-open, all endpoints live) — useful for API-only testing, but don't expose that combination publicly (see security.md).

---

## 5. Deployment Targets

### 5.1 Single VPS (recommended for current architecture)

```text
User → nginx (80/443, TLS) → :3001 (Express serving API + SPA)
```

Use PM2 or systemd to keep the process alive:

```bash
# PM2
npm --prefix server install -g pm2
pm2 start node --name prithvi -- server/dist/index.js
pm2 save && pm2 startup
```

### 5.2 Docker (suggested — no Dockerfile in repo)

`Dockerfile` (root):

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm install
COPY . .
RUN npm --prefix client run build && npm --prefix server run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/server/package*.json ./server/
RUN npm --prefix server install --omit=dev
EXPOSE 3001
CMD ["node", "server/dist/index.js"]
```

> Note: the server resolves `client/dist` relative to the **working directory** (`server/index.ts` uses `path` from CWD) — keep `client/dist` in the same workdir as the server process.

### 5.3 Platform-as-a-Service (Render / Railway / Fly.io)

- **One service, single process** — matches the architecture exactly:
  - Build: `npm install && npm --prefix client run build && npm --prefix server run build`
  - Start: `node server/dist/index.js`
  - Port: set `PORT` env var (platform-injected) — the app reads `process.env.PORT || 3001`.
- Health check: `GET /api/health` (ready-made for platform probes).

### 5.4 Static-host frontend + API (NOT recommended as-is)

The client hard-codes `const API_BASE = '/api'` (`api.ts:1`) with **no** runtime env override and no build-time env replacement configured. Splitting the SPA (Netlify/Vercel) from the API requires either:
- a rewrite rule mapping `/api/*` on the static host to the API origin, or
- adding `VITE_API_BASE` handling in `api.ts` + `.env` support (code change).

---

## 6. Environment Variables

| Variable | Default | Required | Used by |
|---|---|---|---|
| `PORT` | `3001` | No | `server/index.ts` — HTTP listen port |
| `NODE_ENV` | — | No | conventional; no code branches on it today |

**No other env vars are read.** Secrets, DB URLs, and auth keys do not exist yet (see security.md §13 for the P0/P1 items that will add them).

---

## 7. Reverse Proxy Configuration

nginx example:

```nginx
server {
    listen 80;
    server_name prithvi.example.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Pair with `certbot --nginx` for TLS. **Do not** deploy publicly before addressing security.md P0 items.

---

## 8. Multi-Instance Caveats

The current state model is **single-process only**:

- State (recommendations, scores, users) is per-instance memory — two instances diverge immediately.
- Applying a recommendation on instance A is invisible on instance B.
- Restart = factory reset (all applied changes lost).

**Until a database lands (database.md §8), deploy exactly one instance.**

---

## 9. Deployment Checklist

- [ ] `npm audit` clean at root, `client/`, `server/` (or accepted findings)
- [ ] `client` build succeeds; `client/dist` present
- [ ] `PORT` set correctly; health check `GET /api/health` returns 200
- [ ] SPA fallback verified: `GET /datacenter/enterprise` (deep link) serves the SPA, not 404
- [ ] TLS terminated at proxy; CORS locked down to your domain (security.md P1)
- [ ] Demo credentials rotated or auth proxy in front (security.md P0)
- [ ] Single instance running; restarts tested
- [ ] Logs wired to your log collector (observability.md)

---

*Next: [Troubleshooting](troubleshooting.md) · [Testing](testing.md)*
