# Contributing Guide

> **PRITHVI — Sustainability OS for Data Centers**

Thank you for considering contributing. This guide describes how the repository is organized, how to run it, and the conventions we ask you to follow. It applies to the current state of the codebase (no CI, no linter, no test suite — see docs/testing.md) and evolves as the project does.

## Table of Contents

- [1. Getting Started](#1-getting-started)
- [2. Repository Layout](#2-repository-layout)
- [3. Scripts](#3-scripts)
- [4. Branching and Pull Requests](#4-branching-and-pull-requests)
- [5. Commit Messages](#5-commit-messages)
- [6. Code Conventions](#6-code-conventions)
- [7. Adding a New Page](#7-adding-a-new-page)
- [8. Adding a New API Endpoint](#8-adding-a-new-api-endpoint)
- [9. Documentation](#9-documentation)
- [10. Before You Submit](#10-before-you-submit)

---

## 1. Getting Started

```bash
git clone <your-fork>
cd SOCF-2.0-Neural-Narcs
npm run install:all     # installs root, client, and server deps
npm run dev             # starts API (:3001) + Vite client (:5173)
```

Open `http://localhost:5173` and log in with `admin@prithvi.ai` / `password123`.

> **Note**: the app is fully usable without the server (client fallback data), so client-only work can proceed even if `:3001` is down — but always verify with the server running before submitting.

---

## 2. Repository Layout

```text
├── client/                     React + Vite + Tailwind SPA
│   └── src/
│       ├── components/         presentational widgets (chart/, grid/, scheduler/, water/, dashboard/, ui/, Layout/)
│       ├── pages/              route-level pages (one folder each)
│       ├── context/            AuthContext (session management)
│       ├── services/           api.ts (REST + fallbacks), gridService.ts (client grid simulation)
│       ├── types/index.ts      shared client/wire types
│       └── data/datacenters.ts six data center categories
├── server/                     Express + TypeScript API
│   └── src/
│       ├── data/               in-memory seeds + interfaces (telemetry.ts, users.ts)
│       ├── routes/             auth.ts, telemetry.ts (all domain endpoints + state holder)
│       └── services/           authService.ts, telemetryService.ts (simulation + effects)
├── docs/                       this documentation set
└── package.json                workspace scripts
```

---

## 3. Scripts

| Command | Where | Purpose |
|---|---|---|
| `npm run dev` | root | both processes via `concurrently` |
| `npm run dev` | client | Vite dev server (`:5173`) |
| `npm run dev` | server | tsx watch (`:3001`) |
| `npm run build` | client | production bundle → `client/dist` |
| `npm run build` | server | `tsc` compile → `server/dist` |
| `npm start` | server | run compiled server (serves `client/dist` when present) |

There is **no lint, format, or test script** yet — see docs/testing.md and docs/roadmap.md.

---

## 4. Branching and Pull Requests

- Use a short feature branch: `git checkout -b feat/water-dashboard-tweaks`
- Keep the PR scoped: one page, one endpoint, or one bug fix per PR.
- Never commit generated output (`client/dist`, `server/dist`) or `node_modules`.
- If your change alters API contracts, update `docs/api.md` in the same PR.
- Manual test checklist before opening a PR:
  1. `npm run dev` from root — both processes boot.
  2. Server **on**: page loads from live endpoints.
  3. Server **off**: page still renders (fallback path) without console errors.
  4. `npm --prefix client run build` passes.

---

## 5. Commit Messages

The current history is unstructured (e.g., `Updated schedular`). **Please use conventional commits** going forward so `CHANGELOG.md` can be generated:

```text
feat(scheduler): add weekend peek detection
fix(api): respect optimized query param on /api/schedule
docs(water): document DTO fields
refactor(grid): extract zone stress calculation
chore: bump react to 18.3
```

Types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `chore`. Keep the summary under 72 characters and describe **what/why**, not how.

---

## 6. Code Conventions

Observed patterns in the codebase (follow these; they are not yet enforced by tooling):

| Area | Convention |
|---|---|
| Imports | local components/components before services; named + default mixes exist — prefer named |
| Types | shared wire types in `client/src/types/index.ts`; server interfaces in `server/src/data/telemetry.ts` — **don't redeclare types per-page** (water.tsx currently redeclares several; prefer consolidating) |
| Data fetching | always through `client/src/services/api.ts` wrappers; never raw `fetch` in pages |
| Fallbacks | add a typed fallback payload with every new `getJsonWithFallback` call |
| Styling | Tailwind utility classes + existing `glass`/`btn-primary`/`section-title` component classes; eco palette (`eco-primary`, `eco-dark`, `eco-muted`, …) |
| Animation | framer-motion; keep infinite animations off data-heavy grids |
| Comments | sparse; only where logic is non-obvious |
| File naming | pages/components use both `Pascal.tsx` and `kebab/lower.tsx` today — prefer **PascalCase for components**, lowercase for others |

---

## 7. Adding a New Page

1. Create `client/src/pages/<name>/<Name>.tsx`.
2. Register the route in `client/src/App.tsx` (use `React.lazy` for heavy pages).
3. If the page needs auth, wrap it in `ProtectedRoute` + `Layout`.
4. Fetch data via a new wrapper in `api.ts` (with fallback payload).
5. Add nav item in `client/src/components/Layout/Navbar.tsx` (if in the sidebar).
6. Update `docs/architecture.md` component inventory.

---

## 8. Adding a New API Endpoint

1. Add the handler in the appropriate router (`server/src/routes/*.ts`).
2. Read state via `getState()`; write via `setState()` — keep the replace-only mutation pattern (`applyRecommendation` is the reference implementation).
3. Transform internal → client DTO in the route (route-layer transforms are the house style).
4. Add the client wrapper in `api.ts` with a sensible fallback.
5. Document the endpoint in `docs/api.md` (request/response schema + error codes).

---

## 9. Documentation

- `README.md` — project overview; update for user-facing changes.
- `docs/*` — one topic per file; every claim must be traceable to code.
- Diagrams: Mermaid, one per workflow.
- Mark claims about behavior as **fact** (with file:line) vs **inference** (clearly labeled).

---

## 10. Before You Submit

- [ ] `npm --prefix client run build` and `npm --prefix server run build` pass
- [ ] Behavior verified with server up **and** down
- [ ] No secrets, no `console.log` leftovers, no commented-out code blocks
- [ ] Types updated on both client and server if the contract changed
- [ ] `docs/api.md` (and any affected doc) updated
- [ ] Conventional commit message

---

*Related: [Testing](testing.md) · [Roadmap](roadmap.md) · [Code of conduct: none yet — be kind and constructive]*
