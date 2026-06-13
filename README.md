<div align="center">

<img width="680" height="395" alt="image" src="https://github.com/user-attachments/assets/67075f49-12ab-4783-b24a-4131524eca3b" />


# 🪔 SimhasthaNetra
### *Har Pal Ki Nazar*

**AI-Powered Event Operations Command Center for Simhastha 2028, Ujjain**

[![Live Demo](https://img.shields.io/badge/🔴%20Live%20Demo-simhastha--netra.vercel.app-f97316?style=for-the-badge)](https://simhastha-netra.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Claude API](https://img.shields.io/badge/Claude-Sonnet%204-f97316?style=for-the-badge)](https://anthropic.com/)

> SimhasthaNetra (सिंहस्थ नेत्र) — *Netra* means "eye" in Sanskrit.  
> A unified command layer that connects Police, Health, NDRF, Railways, and Transport  
> into one real-time operations view — powered by agentic AI.

</div>

---

## 📸 Screenshots

### Login — Role Selection
<img width="1919" height="963" alt="image" src="https://github.com/user-attachments/assets/9bf0bdf2-e04b-4b5d-a408-f42fb3d0723d" />


---

### Command Dashboard — Live Overview
<img width="1919" height="963" alt="image" src="https://github.com/user-attachments/assets/00282f01-5595-4894-a242-b1ca9ee99447" />


---

### Crowd Heatmap — Zone Density View
<img width="1919" height="963" alt="image" src="https://github.com/user-attachments/assets/812cfde1-58a7-4ddc-b8a0-aa7fde11b976" />


---

### Incident Management — Agentic Triage Flow
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/e1a902c7-895b-4fe5-a7f4-bbc0f9929e3b" />


---

### AI Sujhav — NetraBot Suggestion Feed
<img width="432" height="666" alt="image" src="https://github.com/user-attachments/assets/a16bce4a-d266-4807-88d9-8a7e23e72a86" />


---

### Transport & Surge Prediction
<img width="1919" height="892" alt="image" src="https://github.com/user-attachments/assets/ce63191e-afbb-4b62-83a8-905573148fc9" />
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/e72f1240-9a01-47a0-97df-769a87317c09" />

---

### Health & Outbreak Watch
<img width="1915" height="966" alt="image" src="https://github.com/user-attachments/assets/f6daaaca-823d-45ae-97ba-6e9182431bea" />
<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/c94a39ae-20ce-4b15-93df-788afc5c42ce" />


---

## 🎯 Problem Statement

Simhastha Kumbh in Ujjain draws **5–7 crore pilgrims** over 30 days. The 2016 Simhastha exposed critical operational gaps:

| Gap | 2016 Impact |
|-----|-------------|
| No real-time crowd density monitoring | Stampede risk at Ramghat during peak Shahi Snan |
| Disease surveillance was weekly (IDSP reports) | Diarrhea outbreak at Dutta Akhara spread to 42+ cases before detection |
| No early weather warning system | May 5 storm killed 7 people, destroyed 700 tents |
| Cross-org communication via phone calls | Police, NDRF, Health had no shared situational picture |
| Volunteer deployment was manual | Average 23-minute response lag on critical incidents |

**SimhasthaNetra addresses all five gaps** — not by adding new hardware, but by connecting existing systems (CCTV, Railways API, hospital software, police radio, IMD weather) through a unified AI-powered command layer.

---

## ✨ Key Features

### 🔐 Role-Based Demo Login
Three operational roles, each with scoped access:
- **Command Controller** — full dashboard, all modules, approve AI suggestions
- **Health Desk** — health metrics, disease watch, medical resource management
- **Transport Desk** — train arrivals, bus routes, crowd ingress prediction

No password required in demo mode. Role stored in React context throughout session.

---

### 🗺️ Live Zone Status Dashboard
- **9 Ujjain zones** monitored in real time: Ramghat, Mangalnath, Mahakal Mandir, Freeganj, Dutta Akhara, Bhukhi Mata Ghat, Nanakheda, Tower Chowk, Dewas Naka
- Crowd density bars with color coding: 🟢 Safe · 🟡 Watch · 🔴 Critical
- Pulsing red border animation on critical zones for immediate visual attention
- Live pilgrim counter, active incidents, volunteer deployment stats
- Real-time clock with **Hindu calendar context** (Vaishakh Purnima · Shahi Snan countdown)

---

### 🤖 NetraBot — Agentic AI Core

The heart of SimhasthaNetra. NetraBot is not a chatbot — it is an **autonomous operations agent** running on Claude Sonnet.

**Three agentic flows:**

#### 1. Incident Triage Agent
```
Field worker submits raw Hindi/Hinglish report
    ↓
NetraBot reads, classifies, cross-references zone data
    ↓
Auto-generates: severity tag, zone, category, Hindi summary
    ↓
Drafts three org-specific alerts (Police / Health / NDRF)
    ↓
Commander reviews → clicks "Sab Bhejo" → all alerts dispatched
```
Human involvement: **1 button click**.

#### 2. Predictive Surge Agent
- Runs every 30 seconds autonomously
- Ingests: current zone densities + train arrival data + auspicious date calendar + weather
- Outputs proactive **AI Sujhav cards** before problems occur
- Each card: what was detected, recommended action, one-click Approve / Edit

#### 3. Cross-Org Coordination Agent
- When an incident is approved, agent determines which organisations need action
- Drafts organisation-specific messages tailored to each department's responsibilities
- Tracks acknowledgement status — escalates if no response in 5 minutes
- No human needs to forward anything manually

---

### 📍 Crowd Heatmap
- Simplified SVG map of Ujjain with all 9 operational zones
- Real-time color gradient: density drives zone fill color
- **Time slider** — replay crowd movement from 6 AM to current hour (mock data)
- Click any zone → slide-in panel with zone report, NetraBot zone assessment
- **Shahi Snan countdown banner** when within 24 hours of auspicious date

---

### 🚨 Incident Management Board
- Kanban-style board: **Naya → Active → Resolved**
- Field report submission in Hindi, Hinglish, or English
- AI triage runs on submit: `"NetraBot padh raha hai..."` → classified card appears in seconds
- Filter by zone, severity, organisation
- Full audit trail: who raised it, AI classification, who approved, time to resolve

---

### 🚌 Transport & Surge Prediction
- **Mock Indian Railways feed**: live train arrivals, passenger counts, delays
- **Bus route GPS status**: 8 routes, blocked/active/diverted
- AI-generated surge warnings: "Malwa Express arriving in 22 min — 2,847 passengers — Nanakheda crossing will be at 140% capacity"
- Route diversion suggestions with ETA impact
- **Hourly pilgrim ingress bar chart** (Recharts) with projected surge highlighted in saffron

---

### 🏥 Health & Outbreak Watch
- Zone-wise illness heatmap across all 9 sectors
- **Disease breakdown chart** based on 2016 Simhastha actual data:
  - Fever 33% · Respiratory 28% · Diarrhea 26% · Other 13%
- **AI Outbreak Scanner**: detects anomalous illness spikes per zone
- Built-in 2016 historical context: *"Dutta Akhara mein 2016 mein yahan outbreak hua tha"*
- Water quality monitoring table: zone, contamination level, last tested timestamp
- OPD load, critical cases, ambulance deployment metrics

---

### 🙋 Volunteer & Resource Management
- Live roster: who is where, which shift, contact number
- Equipment tracker: ambulances, water tankers, fire tenders — deployed vs. available
- Field app simulation: volunteer check-in/check-out
- AI recommends nearest available volunteer for open incidents

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SimhasthaNetra Frontend                   │
│                   React 18 + Tailwind CSS                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │ Incident │  │ Health   │   │
│  │  /roles  │  │/heatmap  │  │ /triage  │  │/outbreak │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              React Context (Global State)            │   │
│  │   role · zoneData · incidents · agentSuggestions    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                    Claude API (Sonnet 4)
                  /v1/messages — 3 agent flows
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
   Incident Triage     Surge Prediction    Cross-Org Alerts
   (on submit)         (every 30s)         (on approve)
          │                   │                   │
          └───────────────────┼───────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │     Mock Data Layer           │
              │  (simulating real integrations)│
              │                               │
              │  Indian Railways API (mock)   │
              │  IMD Weather API (mock)       │
              │  Hospital OPD feeds (mock)    │
              │  MP State Bus GPS (mock)      │
              │  CCTV density feeds (mock)    │
              └───────────────────────────────┘
```

### Data Flow — Incident Triage (Key Flow)

```
[Field Worker] → types Hindi/Hinglish report
      ↓
[React Frontend] → POST to Claude API with:
      - Raw report text
      - Current zone densities
      - Active incidents context
      - Simhastha calendar context
      ↓
[NetraBot / Claude Sonnet] → returns JSON:
      {
        severity, zone, category,
        hindi_summary,
        recommended_actions[],
        draft_police_alert,
        draft_health_alert,
        draft_ndrf_alert
      }
      ↓
[Dashboard] → renders classified card + draft alerts
      ↓
[Commander] → clicks "Sab Bhejo"
      ↓
[All 3 Org Panels] → update simultaneously
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 | Component-based, fast state updates for live data |
| Styling | Tailwind CSS | Utility-first, rapid UI, consistent design tokens |
| Charts | Recharts | Lightweight, composable, works great with React |
| AI Agent | Claude Sonnet 4 (Anthropic) | Multilingual, understands Hindi/Hinglish, structured JSON output |
| Font | Mukta + Space Grotesk | Mukta supports Devanagari + Latin — built for India |
| Routing | React Router v6 | Clean role-based route protection |
| State | React Context API | Lightweight, no Redux overhead for MVP |
| Deployment | Vercel | Zero-config, instant deploys |

---

## 🎨 Design System

```
Primary:    #f97316  (Saffron 500)   — CTAs, active states, badges
Dark:       #c2410c  (Saffron 700)   — hover states
Text:       #7c2d12  (Saffron 900)   — headings
Background: #fefce8  (Cream)         — page background
Cards:      #ffffff  (White)         — all card surfaces
Safe:       #22c55e  (Green 500)     — density OK, resolved
Watch:      #f59e0b  (Amber 500)     — approaching threshold
Critical:   #ef4444  (Red 500)       — immediate action needed
```

**Design principle:** Every color encodes operational meaning. Saffron is not decoration — it is the visual language of Ujjain itself (marigolds, tilak, Mahakal's bhasm).

---

## 🗂️ Folder Structure

```
simhastha-netra/
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── Layout.jsx
│   │   ├── dashboard/
│   │   │   ├── ZoneCard.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   └── IncidentLog.jsx
│   │   ├── ai/
│   │   │   ├── NetraBot.jsx        ← agentic AI panel
│   │   │   ├── SujhavCard.jsx      ← suggestion card
│   │   │   └── useAgentPolling.js  ← 30s polling hook
│   │   ├── incident/
│   │   │   ├── ReportForm.jsx
│   │   │   ├── TriageResult.jsx
│   │   │   └── KanbanBoard.jsx
│   │   ├── transport/
│   │   │   ├── TrainTable.jsx
│   │   │   └── BusRoutes.jsx
│   │   └── health/
│   │       ├── OutbreakPanel.jsx
│   │       └── DiseaseChart.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── CrowdMap.jsx
│   │   ├── Incidents.jsx
│   │   ├── Transport.jsx
│   │   └── Health.jsx
│   ├── context/
│   │   └── AppContext.jsx          ← role, zone data, incidents
│   ├── services/
│   │   └── claude.js               ← Claude API calls
│   ├── data/
│   │   ├── zones.js                ← mock zone data
│   │   ├── incidents.js            ← mock incident seed
│   │   └── transport.js            ← mock train/bus data
│   └── App.jsx
├── tailwind.config.js
├── .env.local                      ← VITE_ANTHROPIC_API_KEY
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/simhastha-netra.git
cd simhastha-netra

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Add your Anthropic API key to .env.local:
# VITE_ANTHROPIC_API_KEY=sk-ant-...

# Start development server
npm run dev
```

### Demo Login
Open `http://localhost:5173` and click any role card — no password required.

| Role | Access |
|------|--------|
| Command Controller | All modules + AI approval |
| Health Desk | Health + Incidents (read) |
| Transport Desk | Transport + Crowd map |

---

## 🤖 NetraBot System Prompt

The core AI agent uses this system prompt for incident triage:

```
You are NetraBot, the AI operations assistant for SimhasthaNetra —
the command center for Simhastha Kumbh 2028 in Ujjain, Madhya Pradesh.

You understand Hindi, Hinglish, and English field reports.
Simhastha draws 5-7 crore pilgrims. Every minute of delay costs lives.

Current context will be provided with each call:
- Zone densities (9 zones)
- Active incident count
- Weather conditions
- Time to next Shahi Snan

Always respond ONLY in valid JSON (no markdown, no preamble):
{
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "zone": "<zone name>",
  "category": "crowd_density | medical | fire | stampede | weather | infrastructure",
  "hindi_summary": "<2 line summary in Hindi>",
  "confidence": 0.0-1.0,
  "recommended_actions": ["<action 1>", "<action 2>", "<action 3>"],
  "draft_police_alert": "<message for police control room>",
  "draft_health_alert": "<message for health desk>",
  "draft_ndrf_alert": "<message for NDRF team>"
}
```

---

## 📊 2016 Simhastha — Data Baseline

SimhasthaNetra's AI models and thresholds are calibrated against actual 2016 data:

| Metric | 2016 Actual | 2028 Target |
|--------|-------------|-------------|
| Total pilgrims | ~5 crore | 7 crore |
| Illness cases | 56,600 | <10,000 (target) |
| Storm fatalities | 7 | 0 (early warning) |
| Disease detection lag | 7 days (IDSP weekly) | <2 hours (AI watch) |
| Incident response time | ~23 min average | <5 min target |
| Cross-org coordination | Phone calls | Single platform |

---

## 🗺️ Integrations Roadmap

SimhasthaNetra is designed to integrate with existing systems — no new hardware required:

| System | Status | Integration Method |
|--------|--------|--------------------|
| Indian Railways API | 🟡 Mock | REST API (public) |
| IMD Weather API | 🟡 Mock | REST API (public) |
| MP State Bus GPS | 🟡 Mock | GTFS-RT feed |
| CCTV Density Feeds | 🟡 Mock | Computer vision layer on existing cameras |
| Hospital OPD Software | 🟡 Mock | HL7 FHIR integration |
| Police Radio (P25) | 🟡 Mock | Digital gateway bridge |
| Akhara Committee Feeds | 🟡 Mock | WhatsApp Business API |

All mock data is structured to match real API response formats — production integration is a configuration change, not a rebuild.

---

## 🏆 Key Differentiators

1. **Multilingual Agentic AI** — processes raw Hindi/Hinglish field reports, no structured input required
2. **Proactive, not reactive** — NetraBot surfaces surge predictions before commanders ask
3. **One-click cross-org dispatch** — "Sab Bhejo" sends tailored alerts to all organisations simultaneously
4. **2016-calibrated thresholds** — AI warnings reference actual historical outbreak patterns
5. **Zero new hardware** — integrates existing CCTV, railways, buses, hospital systems
6. **Mobile-first field app** — works on ₹6,000 Android phones, 2G fallback, offline-capable

---

## 👥 Team

Built for Simhastha 2028 — Ujjain, Madhya Pradesh

---

## 📄 License

MIT License — built for public good.

---

<div align="center">

**🪔 SimhasthaNetra — Har Pal Ki Nazar**

*Jai Mahakal*

[Live Demo](https://simhastha-netra.vercel.app/) · [Report a Bug](https://github.com/yourusername/simhastha-netra/issues) · [Architecture Docs](./docs/ARCHITECTURE.md)

</div>
