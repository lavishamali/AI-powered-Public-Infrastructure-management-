# CivicVision AI
### AI-Powered Public Infrastructure Monitoring & Prioritization System
> **"Do not merely detect infrastructure problems. Convert scattered citizen reports and visual evidence into verified, consolidated, and intelligently prioritized incidents."**

---

## 🏛️ Executive Summary

Municipal infrastructure departments face an acute operational bottleneck: public infrastructure problems such as **potholes, structural road damage, broken streetlights, overflowing drains, garbage accumulation, damaged sidewalks, and downed signs** are often reported late, reported dozens of times by different citizens across disparate channels, or triaged arbitrarily on a "first-come, first-served" basis without regard to danger or transit exposure.

**CivicVision AI** is a full-stack, hackathon-ready civic technology platform that solves this problem end-to-end:
1. **Multimodal AI Vision:** Citizens submit photos or short videos; Google Gemini 3.8 Flash assesses damage severity and factual physical characteristics.
2. **Multi-Signal Duplicate Consolidation:** High-precision clustering evaluates geospatial proximity (Haversine distance $\le 250\text{m}$), hazard classification compatibility, and semantic token matching to merge duplicate complaints into master incidents rather than proliferating redundant tickets.
3. **Deterministic 5-Factor Priority Engine:** Computes an objective 0–100 priority score based on verified physical damage (40%), citizen report count (20%), school/hospital zone vulnerability (15%), chronic recurrence history (10%), and transit safety impact (15%).
4. **Authority Command Dashboard & Interactive Map:** Public works dispatchers inspect ranked incident queues, view Leaflet/OpenStreetMap geospatial pins, read AI executive explanations, dispatch work crews, and resolve issues with complete audit trails.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js $\ge 18$
- npm or bun

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file from `.env.example`:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
*(Note: If `GEMINI_API_KEY` is omitted, CivicVision AI transparently falls back to an offline rule-based heuristic analyzer and labels the output accordingly.)*

### 4. Running Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Tailwind CSS, Lucide Icons, Leaflet, OpenStreetMap |
| **Backend** | Node.js, Express, TypeScript (`tsx`), REST APIs |
| **Multimodal AI** | `@google/genai` (Gemini 3.8 Flash) for multimodal vision and factual explanation |
| **Data & State** | File-backed JSON data store (`data/civicvision-db.json`) with persistent cache |
| **Geospatial** | Leaflet 1.9, OpenStreetMap tiles, Haversine spherical distance math |

---

## 📊 Core Engines

### 1. Deterministic Severity Engine
Calculates a 0–100 score:
- **Baseline Hazard:** Pothole (65), Overflowing Drain (70), Road Damage (60), Damaged Sign (55), Sidewalk (52), Broken Luminaire (45), Garbage (42).
- **Damage Extent Modifier:** Minor ($-15$), Moderate ($0$), Severe ($+18$), Catastrophic ($+28$).
- **Zone Modifier:** School Zone ($+14$), Hospital Corridor ($+15$), Arterial Road ($+12$), Transit Hub ($+10$), Commercial ($+6$), Residential ($+2$), Alleyway ($-4$).

### 2. Multi-Signal Duplicate Detection
Evaluates four distinct signals against active incidents:
- **Spatial Proximity (50% weight):** Distance $\le 35\text{m} \implies 1.0$; $75\text{m} \implies 0.85$; $150\text{m} \implies 0.55$; $>250\text{m} \implies 0.0$.
- **Category Compatibility (30% weight):** Identical category ($1.0$), compatible failure ($0.70$), incompatible ($0.0$).
- **Semantic Text Jaccard (20% weight):** Shared landmark tokens and street keywords.
- **Threshold $\ge 58\%$:** Auto-consolidates report into existing master incident and increments report count.

### 3. Priority Engine
Configurable weights (adjustable via Authority UI):
$$\text{Priority} = (S \times 0.40) + (R \times 0.20) + (L \times 0.15) + (H \times 0.10) + (P \times 0.15)$$
- $S$ = Severity Score (0–100)
- $R$ = Citizen Report Count (1 report = 40; 2 = 65; 3 = 80; 4 = 92; 5+ = 100)
- $L$ = Zone Criticality (Hospital = 100, School = 95, Highway = 90, Transit = 85, Retail = 72, Residential = 55, Alley = 35)
- $H$ = Recurrence History (0 prior = 20; 1 = 55; 2 = 80; 3+ = 100)
- $P$ = Public Safety Risk (0–100)

---

## 📋 Evaluation Scenario for Judges

1. **Open "Report an Issue"** tab.
2. Select the 1-click preset **"Pothole near School Gate (Duplicate Test)"**.
3. Notice multimodal AI detects **Pothole (96% confidence)** with physical cavity observations.
4. Click **"Analyze & Submit Report"**.
5. Observe that the system **detects an existing active incident (#INC-2026-101)** 18 meters away and consolidates the submission!
6. Notice the report count updates to **5 independent citizens** and priority escalates to **Critical (95/100)**.
7. Switch to **"Authority Dashboard"**; see #INC-2026-101 ranked at the top of the queue and pulsing on the Map.
8. Click **"Inspect"** to review the consolidated citizen photo gallery, transparent weights, and AI dispatch directive.
9. Change status from `Verified` $\to$ `Assigned` $\to$ `In Progress` $\to$ `Resolved`.
10. Watch the real-time timeline audit trail update across the system.
