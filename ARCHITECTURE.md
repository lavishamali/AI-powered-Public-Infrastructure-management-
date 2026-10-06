# CivicVision AI: Architecture & System Design

## 1. High-Level Architecture

CivicVision AI is architected as an autonomous civic infrastructure monitoring and intelligent incident consolidation pipeline:

```
[ Citizen Ingestion ]
    ├── Mobile / Web Photo Upload
    ├── Video Keyframe Sampler (HTML5 Canvas)
    └── Geolocation / Leaflet Pin-Drop
             │
             ▼
[ Server-Side AI Vision (Gemini 3.8 Flash) ]
    ├── Multimodal Hazard Classification (8 Classes)
    ├── Calibrated Confidence Scoring (0–100%)
    └── Factual Damage Extent & Bounding Boxes
             │
             ▼
[ Deterministic Severity Engine ]
    ├── Inherent Hazard Baseline
    ├── Damage Extent Multiplier
    └── Zone Vulnerability Multiplier
             │
             ▼
[ Multi-Signal Duplicate Detection Engine ]
    ├── Haversine Geospatial Radius (<= 250m)
    ├── Issue Category Compatibility Matrix
    └── Token Jaccard / Landmark Semantic Overlap
             │
      ┌──────┴────────────────────────┐
      ▼                               ▼
[ Match Found >= 58% ]       [ No Match (< 58%) ]
Consolidate into Incident    Create Master Incident (1:1)
Increment reportCount (N+1)  Initialize Baseline Priority
Recalculate Priority Score   Initialize Master Timeline
             │                                │
             └────────────────┬───────────────┘
                              │
                              ▼
[ Deterministic Priority Engine (Configurable Weights) ]
    ├── Severity Score (40%)
    ├── Corroborating Citizen Reports (20%)
    ├── Location Zone Criticality (15%)
    ├── Chronic Hotspot Recurrence (10%)
    └── Public Safety & Transit Risk (15%)
                              │
                              ▼
[ Executive AI Synthesis (Gemini 3.8 Flash) ]
    ├── Verified-Data Only Summary (No Hallucinations)
    └── Direct Action Directive for Public Works
                              │
                              ▼
[ Authority Command Dashboard ]
    ├── Leaflet Geospatial Heatmap
    ├── Priority-Ranked Triage Queue
    ├── Resolution Workflow Stepper
    └── Real-time Audit Trail Timeline
```

---

## 2. Component Breakdown

### Frontend (`/src`)
- **`App.tsx`:** Master coordinator managing routing, global incident state, active modal views, and data refreshes.
- **`components/Navbar.tsx`:** Civic-tech navigation with live status indicator and 1-click demo database reset tool.
- **`components/LandingPage.tsx`:** Professional public works overview with live metric counters, 5-stage pipeline diagram, and featured triage queue.
- **`components/CitizenReportForm.tsx`:** High-fidelity citizen reporting interface supporting photo uploads, video keyframe sampling, GPS/pin-drop maps, and real-time AI previews.
- **`components/ReportResultView.tsx`:** Post-ingestion summary presenting duplicate consolidation badges, match signals, severity scores, and tracking links.
- **`components/TrackReportView.tsx`:** Public tracking view enabling residents to look up submissions by Report ID or Incident ID.
- **`components/AuthorityDashboard.tsx`:** Dispatch center with KPI stats, Leaflet map, priority queue, filter toolbar, and weight tuning modal.
- **`components/IncidentDetailModal.tsx`:** Complete operational view featuring consolidated photo galleries, audit trails, and dispatch assignment forms.
- **`components/LeafletMap.tsx`:** Resilient Leaflet + OpenStreetMap component rendering priority-color-coded custom HTML markers.

### Backend (`/server` & `server.ts`)
- **`server.ts`:** Express server providing REST endpoints (`/api/incidents`, `/api/reports`, `/api/reports/analyze`, `/api/config/weights`, etc.) and serving Vite in development.
- **`server/gemini.ts`:** Server-side Google GenAI client (`@google/genai`) invoking `gemini-3.8-flash` for multimodal vision and factual executive explanations.
- **`server/algorithms/severity.ts`:** Deterministic, rule-grounded severity formula with transparent factor breakdown.
- **`server/algorithms/duplicates.ts`:** Multi-signal duplicate detection algorithm combining Haversine distance, compatibility matrices, and token Jaccard similarity.
- **`server/algorithms/priority.ts`:** Configurable multi-variable priority calculation engine.
- **`server/data/store.ts`:** Persistent JSON database store with automatic file writes and demo data seeding.
- **`server/data/demoData.ts`:** 25+ realistic municipal reports across 12 master incidents covering various civic zones.

---

## 3. Data Model (`REPORT` vs `INCIDENT`)

A critical architectural distinction is maintained between **Reports** and **Incidents**:

| Entity | Description | Fields |
|---|---|---|
| **CitizenReport** | An individual citizen submission with physical photo or video evidence. | `id`, `timestamp`, `imageUrl`, `description`, `location`, `aiAnalysis`, `severity`, `linkedIncidentId`, `isDuplicate`, `duplicateProbability`, `status` |
| **Incident** | The consolidated physical infrastructure problem in the physical world. | `id`, `issueType`, `title`, `location`, `severityScore`, `priorityScore`, `priorityFactors`, `reportCount`, `sourceReports`, `status`, `timeline`, `aiExplanation`, `assignedCrew` |

This 1-to-many relationship enables the system to absorb dozens of duplicate citizen reports while maintaining a clean, prioritized queue for public works crews.
