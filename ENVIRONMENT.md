# CivicVision AI: Environment Configuration

## Environment Variables

| Variable | Description | Required | Default |
|---|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key used on the server side for multimodal vision analysis and factual explanations (`gemini-3.8-flash`). Injected automatically in Google AI Studio or configured via `.env`. | Optional (has offline fallback) | `""` |
| `PORT` | Local HTTP port for the full-stack Express & Vite server. | Optional | `3000` |
| `NODE_ENV` | Application environment (`development` or `production`). | Optional | `development` |

---

## File Hierarchy

```
/
├── .env.example                # Example environment variables
├── metadata.json               # AI Studio applet capabilities
├── index.html                  # HTML entry point with Leaflet stylesheet
├── package.json                # Project dependencies and full-stack scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── server.ts                   # Express REST API & Vite middleware server
├── data/
│   └── civicvision-db.json     # Persistent JSON database store
├── server/
│   ├── gemini.ts               # Server-side Gemini 3.8 Flash SDK integration
│   ├── algorithms/
│   │   ├── severity.ts         # Deterministic severity calculation
│   │   ├── duplicates.ts       # Multi-signal duplicate detection
│   │   └── priority.ts         # Deterministic 5-factor priority formula
│   └── data/
│       ├── demoData.ts         # Realistic 25-report municipal demo dataset
│       └── store.ts            # Persistent storage manager
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Master view router and state coordinator
│   ├── index.css               # Tailwind CSS stylesheet
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces and domain models
│   ├── services/
│   │   └── api.ts              # Frontend API client
│   ├── data/
│   │   └── sampleImages.ts     # 1-Click test scenario preset items
│   └── components/
│       ├── Navbar.tsx          # Navigation header with demo reset
│       ├── Footer.tsx          # Civic-tech footer
│       ├── LandingPage.tsx     # Overview landing page with live counter
│       ├── CitizenReportForm.tsx # Photo & video hazard reporting form
│       ├── ReportResultView.tsx# Post-submission consolidation confirmation
│       ├── TrackReportView.tsx # Citizen report tracking lookup
│       ├── AuthorityDashboard.tsx# Operations command dashboard & queue
│       ├── IncidentDetailModal.tsx# Incident inspection & status updater
│       ├── MapView.tsx         # Full-page Leaflet geospatial map
│       └── LeafletMap.tsx      # OpenStreetMap Leaflet component
└── docs/
    ├── README.md
    ├── ARCHITECTURE.md
    ├── PROJECT_PLAN.md
    ├── TEST_REPORT.md
    └── ENVIRONMENT.md
```
