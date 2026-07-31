# Security Review

> **PRITHVI — Sustainability OS for Data Centers**
> A security analysis of the current codebase. **This project is a demonstration prototype, not production software** — several findings are critical in a production context but are conscious trade-offs here. Evidence-based, with file references.

## Table of Contents

- [1. Executive Summary](#1-executive-summary)
- [2. Threat Model](#2-threat-model)
- [3. Authentication](#3-authentication)
- [4. Authorization](#4-authorization)
- [5. Input Validation](#5-input-validation)
- [6. Injection and XSS](#6-injection-and-xss)
- [7. Session and CSRF](#7-session-and-csrf)
- [8. CORS and Transport](#8-cors-and-transport)
- [9. Secrets Management](#9-secrets-management)
- [10. Dependencies and Supply Chain](#10-dependencies-and-supply-chain)
- [11. Abuse and Rate Limiting](#11-abuse-and-rate-limiting)
- [12. OWASP Mapping](#12-owasp-mapping)
- [13. Remediation Roadmap](#13-remediation-roadmap)

---

## 1. Executive Summary

| Dimension | Rating (1–10) | Notes |
|---|---|---|
| Authentication | **1** | Plaintext passwords, forgeable tokens, no middleware enforcement |
| Authorization | **1** | `role` field never enforced; guards are client-side only |
| Input validation | **3** | Basic presence checks on login; no schema validation on any endpoint |
| Injection/XSS | **7** | React escaping + no `dangerouslySetInnerHTML`/`eval` found; no SQL surface |
| Secrets | **2** | No real secrets exist (nothing to leak), but demo passwords ship in source |
| Dependencies | **6** | Lockfiles committed; versions pinned to `^` ranges — no audit evidence |
| Overall | **2/10** | Suitable for local demo; unsafe to expose publicly as-is |

**Primary risk**: the auth system is theater — everything is available without credentials (`/api/*` has no middleware) and fallback login makes "protected" routes open anyway.

---

## 2. Threat Model

| Actor | Capability | Impact |
|---|---|---|
| Anonymous internet user | Reaches `/api/*` directly | Full read + write (apply recommendations) — **no authentication barrier** |
| Attacker with valid demo creds | Logs in as admin | Same as anonymous (no additional power) |
| Attacker forging a token | `base64(userId:timestamp:random)` | Cannot be rejected — tokens are not validated |
| Malicious client | CORS allows any origin | Can call the API from any website (CORS preflight passes) |

**Assets**: demo telemetry (no real secrets), in-memory state, session token. **Real systems** (production credentials, PII, physical plant data) are not present — hence the low severity of *real* data exposure today.

---

## 3. Authentication

### 3.1 Plaintext passwords

```ts
// server/src/data/users.ts
password: 'password123'          // admin
password: 'demo123'              // demo
```

- Credentials are compared **byte-for-byte** in `authService.ts:9` (`u.password === password`).
- No hashing (bcrypt/argon2/scrypt), no salts.
- **Risk**: any source leak exposes working credentials; same-password reuse is likely in real deployments.

### 3.2 Forgeable, unexpiring tokens

```ts
// server/src/services/authService.ts:87-92
const data = `${userId}:${Date.now()}:${Math.random()}`;
return Buffer.from(data, 'utf-8').toString('base64');
```

- Base64 is encoding, not signing — anyone can decode (and forge) a token.
- `validateToken` exists (`authService.ts:94`) but is **never called** by any route or middleware.
- No expiry, no revocation, no server-side session store.

### 3.3 No endpoint is protected

```ts
// server/index.ts — router mounting (no auth middleware anywhere)
app.use('/api/auth', authRouter);
app.use('/api', telemetryRouter);
```

Every `/api/*` route (including mutating `POST /api/recommendations/:id/apply`) responds to unauthenticated callers.

### 3.4 Fallback login bypasses auth entirely

```ts
// client/src/context/AuthContext.tsx — on login failure:
// creates a local session with a "fallback-*" token and derived user
```

If `/api/auth/login` returns 404/500 (or is unreachable), the client **logs the user in anyway**. Combined with §3.3, the login screen is purely cosmetic.

### 3.5 Open Google-style sign-up

`POST /api/auth/google` accepts any email and creates the user on the fly (`findOrCreateGoogleUser`). No OAuth verification, no allowlist, no rate limit — mass account creation is trivial.

---

## 4. Authorization

- `User.role` (`'admin' | 'user'`) exists (`users.ts:6`) but is **checked nowhere** in server or client code.
- `ProtectedRoute` is purely presentational: it gates on `isAuthenticated` in React state, which is settable by the fallback path.
- All users (and anonymous callers) see identical data — no tenant/role isolation.

---

## 5. Input Validation

| Endpoint | Validation |
|---|---|
| `POST /api/auth/login` | presence of `email`/`password` strings; email trimmed/lowercased (`auth.ts:12-19`) |
| `POST /api/auth/google` | presence of `email` (`auth.ts:46-52`) |
| `POST /api/recommendations/:id/apply` | `:id` string used directly in `find` — safe from injection, no format check |
| `POST /api/report` | `hours` destructured, **ignored** |
| All GETs | none (no parameters) |

**Gaps**: no type/shape validation library (no zod/joi), no max-length limits on `email`/`password`/`name`, request bodies are untyped `any` at the boundary.

---

## 6. Injection and XSS

| Vector | Status |
|---|---|
| SQL/NoSQL injection | **N/A** — no database layer |
| Command injection | **N/A** — no shell execution |
| Stored/Reflected XSS | **Low** — React escapes rendered strings; grep found **zero** `dangerouslySetInnerHTML`, `eval`, `innerHTML` usages |
| Prototype pollution | No untrusted deep-merges on the client; server spreads only trusted seed objects |

**Remaining note**: fallback payloads and server DTOs are rendered as plain JSX — safe today, but keep the no-`dangerouslySetInnerHTML` invariant.

---

## 7. Session and CSRF

- **No cookies**: sessions live in `localStorage` (`AuthContext.tsx:30`). 
  - **Pro**: no automatic cookie sending → classic CSRF is not applicable.
  - **Con**: XSS (however unlikely) would expose the token; no `httpOnly` protection possible with this storage.
- **No CSRF tokens** — unnecessary without cookies, but worth noting for the future when real auth lands.
- **No auth header**: the client **never sends** the token with API calls (all endpoints are public), so the token is pure UI decoration today.

---

## 8. CORS and Transport

```ts
// server/index.ts
app.use(cors());   // default: Access-Control-Allow-Origin: *
```

- **Any origin** can call the API from a browser. Harmless for demo data; unacceptable for real data.
- **No HTTPS enforcement** (no redirect, no HSTS). Dev is HTTP (`:3001`).
- `express.json()` has a default 100 KB body limit — no `limit` overridden.

---

## 9. Secrets Management

- **No `.env` files, no real secrets, no API keys** — good (nothing to leak).
- Only env var consumed: `process.env.PORT` (`server/index.ts:11`).
- **Bad practice present**: passwords in source code (`users.ts`), which *become* the secret surface if the repo is public. Repo is git-tracked; ensure it's never made public with these credentials, or rotate before any public release.

---

## 10. Dependencies and Supply Chain

| Item | Status |
|---|---|
| Lockfiles | ✅ Committed at root, `client/`, `server/` |
| Version ranges | `^` semver ranges (root package.json) — `npm ci`/lockfile keeps installs reproducible |
| Security audit | **No evidence** of `npm audit` runs; dependency ages unknown (Express 4.21, React 18.2) |
| Known-risk surface | `three`/`@react-three/fiber` (large, actively updated), `cors` open config |

**Action**: run `npm audit` at the root and in both workspaces before any public release.

---

## 11. Abuse and Rate Limiting

- **No rate limiting** — an attacker (or a misconfigured load-balancer probe) can:
  - hammer `/api/auth/google` to create unbounded users;
  - spam `/api/report` (cheap, but logs noise);
  - poll every endpoint without restriction.
- No request logging middleware, no correlation IDs, no access logs beyond Express defaults.

---

## 12. OWASP Mapping

| OWASP Top 10 (2021) | PRITHVI status |
|---|---|
| A01 Broken Access Control | **Critical** — no auth on any API route; role unused |
| A02 Cryptographic Failures | **Critical** — base64 "tokens", plaintext passwords |
| A03 Injection | Not applicable (no DB/shell); low XSS risk |
| A04 Insecure Design | **High** — fallback-auth bypass, cosmetic guards |
| A05 Security Misconfiguration | Medium — wide-open CORS; no rate limits; verbose error paths are minimal (good) |
| A06 Vulnerable Components | Medium — audit not run; `^` ranges |
| A07 Identification/Authorization Failures | **High** — no session management server-side |
| A08 Software/Data Integrity | Low — lockfiles committed |
| A09 Logging/Monitoring | **High** — no access logs, no audit trail |
| A10 SSRF | Not applicable (no outbound fetches) |

---

## 13. Remediation Roadmap

| Priority | Item | Effort | Impact |
|---|---|---|---|
| **P0** | Require auth middleware on all `/api/*` routes; validate the token | S | Removes anonymous full access |
| **P0** | Hash passwords (bcrypt) + JWT with expiry and secret from env | M | Real identity model |
| **P0** | Remove client fallback login (or gate behind explicit "demo mode" env flag) | S | Stops auth bypass |
| **P1** | Restrict CORS to explicit origins; add `helmet` | S | Transport hardening |
| **P1** | Rate-limit `/api/auth/*` (express-rate-limit) | S | Stops account spam |
| **P1** | `npm audit` + upgrade strategy; pin exact versions | S | Supply chain |
| **P1** | Validate/enforce `role` for any admin-only actions | M | Real RBAC |
| **P2** | Structured request logging + request IDs | M | Observability |
| **P2** | Move `hours`/water/report magic numbers to config/DB | M | Input handling rigor |

> **Bottom line**: treat PRITHVI as a **demo**. Never deploy it publicly without P0 items. For a public showcase, at minimum put it behind an auth proxy (e.g., Basic Auth at the reverse proxy) or restrict CORS + add a shared-secret header.

---

*Next: [Performance & Scalability](performance.md) · [Deployment](deployment.md)*
