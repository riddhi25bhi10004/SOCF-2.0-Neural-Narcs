# Flowcharts — Workflow Diagrams

> **PRITHVI — Sustainability OS for Data Centers**
> End-to-end user and system workflows, mapped directly from the page, component, and service implementations.

## Table of Contents

- [1. User Journey Overview](#1-user-journey-overview)
- [2. Login Flow](#2-login-flow)
- [3. Route Protection Flow](#3-route-protection-flow)
- [4. Scheduler — Workload Optimization Workflow](#4-scheduler--workload-optimization-workflow)
- [5. Grid Monitor — Optimization Workflow](#5-grid-monitor--optimization-workflow)
- [6. Water Intelligence — Data and Leak Detection Flow](#6-water-intelligence--data-and-leak-detection-flow)
- [7. EcoScore — Apply Recommendation Flow](#7-ecoscore--apply-recommendation-flow)
- [8. Hardware — Lifecycle Monitoring Flow](#8-hardware--lifecycle-monitoring-flow)
- [9. Reports — Generation Flow](#9-reports--generation-flow)
- [10. Data Center Exploration Flow](#10-data-center-exploration-flow)
- [11. Data Acquisition and Fallback Flow](#11-data-acquisition-and-fallback-flow)
- [12. Error Handling Flow](#12-error-handling-flow)

---

## 1. User Journey Overview

```mermaid
flowchart TD
    A["Landing page (/)"]
    A --> B{"Which path?"}
    B -->|"Explore data centers"| C["/datacenter/:slug (public)"]
    B -->|"Sign in"| D["/login"]
    C --> E{"CTA clicked"}
    E -->|"Authenticated"| F["/dashboard/:slug"]
    E -->|"Guest"| D
    D -->|"success"| F
    F --> G["Protected modules"]
    G --> G1["/scheduler"]
    G --> G2["/water"]
    G --> G3["/grid"]
    G --> G4["/hardware"]
    G --> G5["/ecoscore"]
    G --> G6["/reports"]
```

---

## 2. Login Flow

```mermaid
flowchart TD
    START["/login page"] --> FORM["Email + password form"]
    FORM -->|"demo autofill button"| PREFILL["Fill admin@prithvi.ai / password123"]
    FORM -->|"sign in click"| VALIDATE{"Client-side check<br/>(email + password present)"}
    VALIDATE -- no --> ERROR["Inline error"]
    VALIDATE -- yes --> CALL["loginUser(email, password)<br/>POST /api/auth/login"]
    CALL --> RESP{"Response?"}
    RESP -->|"200 {token, user}"| PERSIST["AuthContext: persist session<br/>localStorage['prithvi-auth-session']"]
    RESP -->|"401 / 4xx"| ERROR2["Show 'Invalid credentials' error"]
    RESP -->|"404 / 5xx / network"| FALLBACK["Client fallback session<br/>(demo user + fake token)"]
    PERSIST --> NAV["Navigate to state.from<br/>or /datacenter/enterprise"]
    FALLBACK --> NAV
```

---

## 3. Route Protection Flow

```mermaid
flowchart TD
    REQ["Navigate to protected route"] --> GUARD["ProtectedRoute renders"]
    GUARD --> AUTH{"isAuthenticated?"}
    AUTH -- yes --> OK["Render page inside Layout<br/>(Navbar sidebar + main)"]
    AUTH -- no --> REDIR["Navigate to /login<br/>state.from = current location"]
    REDIR --> LOGIN["Login page"]
    LOGIN -->|"login success"| BACK["Navigate back to state.from"]
    LOGIN -->|"cancel"| LAND["Redirect to /"]
```

---

## 4. Scheduler — Workload Optimization Workflow

Timeline: mount → poll every 30 s → optimize → animated migration → reset.

```mermaid
sequenceDiagram
    participant P as Scheduler page
    participant API as services/api.ts
    participant S as Server /api/schedule
    participant UI as AIStatusCard / GanttChart / SavingsCounter

    P->>API: fetchSchedule()
    API->>S: GET /api/schedule
    S-->>P: { current, optimized }
    P->>P: analyzeWorkload(current) → peak hours (first/last job)
    loop every 30s
        P->>API: fetchSchedule()
    end

    User->>P: Click "Run Optimization"
    P->>P: isOptimizing = true; AIStatus = "optimizing"
    P->>P: stagger migratingJobs flags (t=1s + 300ms × index)
    Note over P: GanttChart + job cards animate migration
    P->>P: await 3.5s (simulated AI processing)
    P->>P: isOptimized = true; AIStatus = "completed" (23% savings)
    P-->>UI: displayJobs = schedule.optimized

    User->>P: Click "Reset"
    P->>P: isOptimized = false; migratingJobs = {}; AIStatus = "idle"
    P-->>UI: displayJobs = schedule.current
```

**Notes:** the actual optimization decision is **pre-computed in seed data** (`initialSchedule.optimized`); the page never POSTs to the server for this workflow — `optimizeSchedule` exists in `api.ts` but the page does not call it.

---

## 5. Grid Monitor — Optimization Workflow

```mermaid
flowchart TD
    MOUNT["GridMonitor mounts"] --> LOAD["loadData():<br/>GridService.generateGridData()"]
    LOAD --> RENDER["Render 9 grid widgets"]
    MOUNT --> TIMER["setInterval 30s → loadData()"]
    TIMER -->|"while !isOptimized && !isSimulating"| LOAD

    RUN["User clicks Run Optimization"] --> GUARD{"isSimulating or isOptimized?"}
    GUARD -- yes --> IGNORE["No-op"]
    GUARD -- no --> SIM["isSimulating = true<br/>RunOptimization shows progress"]
    SIM --> WAIT["setTimeout 8s"]
    WAIT --> OPT["simulateOptimization(gridData)"]
    OPT --> APPLY["setGridData(optimized)"]
    APPLY --> FROZEN["isOptimized = true<br/>clearInterval → auto-refresh stopped"]

    RESET["User clicks Reset"] --> R2["isOptimized = false; isSimulating = false"]
    R2 --> FRESH["generateGridData() fresh snapshot"]
    FRESH --> RESTART["startAutoRefresh()"]
```

**Decision rule** (in `GridService`): `status = 'critical'` when demand > 2400; otherwise `'optimal'`/`'stable'` by thresholds.

---

## 6. Water Intelligence — Data and Leak Detection Flow

```mermaid
flowchart TD
    MOUNT["Water page mounts"] --> FETCH["fetchWaterData()<br/>GET /api/water"]
    FETCH --> RENDER["Render 13 water widgets<br/>(flow viz, tanks, gauges, decisions)"]
    MOUNT --> POLL["setInterval 5s → refetch"]
    POLL --> RENDER

    LEAK["LeakDetectionCard"] --> RISK["Risk simulation timer<br/>(2–45% random walk)"]
    RISK --> CHECK{"Risk > threshold?"}
    CHECK -- yes --> ALERT["Alert styling + 127 sensors scanned"]
    CHECK -- no --> NORMAL["Normal status"]
    RISK -->|"pause button"| PAUSE["Simulation paused"]
    PAUSE -->|"resume"| RISK

    AID["AIDecisionPanel"] --> DECS["Decision log from API<br/>(action, reason, confidence)"]
    RAIN["RainForecastCard"] --> HARVEST["Rain forecast → estimated harvest"]
```

---

## 7. EcoScore — Apply Recommendation Flow

```mermaid
sequenceDiagram
    participant P as EcoScore page
    participant API as services/api.ts
    participant S as Server
    participant UI as RecommendationCard

    P->>API: fetchEcoScore()
    API->>S: GET /api/ecoscore
    S-->>P: overall + category scores
    P->>API: fetchRecommendations()
    API->>S: GET /api/recommendations
    S-->>P: recommendations[]

    User->>UI: Click "Apply" on rec-6 (Retire GPU cluster)
    UI->>API: applyRecommendation('rec-6')
    API->>S: POST /api/recommendations/rec-6/apply
    S->>S: applyRecommendation():<br/>telemetry.power ×0.78, carbon ×0.80<br/>ecoscore overall +2..6, categories +1..4
    S-->>API: { success, recommendation (applied) }
    API-->>P: result
    P->>P: Refresh score display<br/>(+ Math.random jitter on fetch)
    P-->>UI: card shows "Applied" + new metrics
```

**Error paths:** unknown ID → `404`; already applied → `400`; both surfaced by the card without breaking the page.

---

## 8. Hardware — Lifecycle Monitoring Flow

```mermaid
flowchart TD
    MOUNT["Hardware page mounts"] --> FETCH["fetchHardware()<br/>GET /api/hardware"]
    FETCH --> MAP["Map components: rack from index<br/>(A1..F1 cycle), lifespan % remaining"]
    MAP --> RENDER["Render HealthBar per component"]
    MOUNT --> POLL["setInterval 5s → refetch"]
    POLL --> RENDER
    RENDER --> STATUS{"failureRisk?"}
    STATUS -->|"high"| HIGH["Red bar + 'Replace immediately' callout"]
    STATUS -->|"medium"| MED["Amber bar + recommendation text"]
    STATUS -->|"low"| LOW["Green bar"]
```

---

## 9. Reports — Generation Flow

```mermaid
flowchart TD
    PAGE["Reports page (empty state)"] --> CLICK["Click 'Generate Report'"]
    CLICK --> LOAD["loading = true"]
    LOAD --> POST["generateReport()<br/>POST /api/report { hours: 24 }"]
    POST --> RESP{"Success?"}
    RESP -- yes --> RENDER["Render report:<br/>3 metric tiles (kWh / L / kg)<br/>+ 5 top actions with status chips"]
    RESP -- no --> SILENT["catch → silently ignore<br/>(empty state remains)"]
    RENDER --> REGEN["'Regenerate Report' button"]
    REGEN --> LOAD
    RENDER --> NEW["Report replaced (no history)"]
```

---

## 10. Data Center Exploration Flow

```mermaid
flowchart TD
    LAND["Landing page"] --> SCROLL["Scroll sections:<br/>hero (3D) → stats → data centers → categories"]
    SCROLL --> CARDS["DataCenterSection renders 6 cards:<br/>enterprise, hyperscale, colocation,<br/>edge, modular, government"]
    CARDS --> CLICK["Click card"]
    CLICK --> DETAIL["/datacenter/:slug detail page"]
    DETAIL --> CTA{"CTA: 'Launch Dashboard'"}

    CTA -->|"authenticated"| DASH["/dashboard/:slug (protected)"]
    CTA -->|"guest"| LOGIN["/login (state.from = target)"]
    LOGIN -->|"success"| DASH
```

---

## 11. Data Acquisition and Fallback Flow

Every page's data request funnels through `getJsonWithFallback`:

```mermaid
flowchart LR
    PAGE["Page"] -->|"typed fetch fn"| GWF["getJsonWithFallback(url, fallback)"]
    GWF --> FETCH["fetch(url)"]
    FETCH -->|"ok"| JSON["JSON → typed object"]
    FETCH -->|"!ok"| FB["return fallback payload<br/>(hard-coded mock data)"]
    FETCH -->|"network error"| FB
    JSON --> RENDER["Render"]
    FB --> RENDER
```

---

## 12. Error Handling Flow

```mermaid
flowchart TD
    ERR["Error thrown in component tree"] --> EB["ErrorBoundary catches"]
    EB --> UI["Fallback UI:<br/>'Something went wrong' + reload action"]
    ERR2["API error in page fetch"] -->|"getJsonWithFallback"| FB["fallback data → page still renders"]
    ERR3["Missing /api/auth/login (server down)"] -->|"AuthContext"| FALL["client fallback session → user still logged in"]
```

**Caveat (design consequence):** because every layer degrades gracefully, genuine outages are visually silent — the app never indicates that data is simulated/offline (see repository audit).

---

*Next: [API Reference](api.md) · [Database & Data Models](database.md)*
