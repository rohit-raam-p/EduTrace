# EduTrace-ES Full Website — Implementation Plan

EduTrace-ES is an AI-powered Academic Accreditation Status Tracing Platform. This plan covers building the complete website — from public marketing pages to authenticated dashboard modules — using **Next.js (App Router)** with **vanilla CSS** and a premium dark-mode design.

---

## Proposed Changes

### Project Bootstrap

#### [NEW] `edutrace-web/` — Next.js 14 App (App Router)

Initialized in `c:\Users\rohit\Documents\Edutrace-Es\edutrace-web\` using `create-next-app`.

---

### Design System

#### [NEW] `app/globals.css`
- CSS custom properties: color palette (deep navy/indigo with gold/amber accents), spacing scale, typography scale
- Google Fonts: **Inter** + **Outfit**
- Glassmorphism card utility classes
- Gradient and animation utilities
- Premium dark mode base

---

### Layout & Shared Components

#### [NEW] `components/PublicNav.jsx` — Top navigation for public pages
#### [NEW] `components/DashboardSidebar.jsx` — Collapsible sidebar for dashboard
#### [NEW] `components/DashboardTopbar.jsx` — Dashboard header with profile & notifications
#### [NEW] `components/Footer.jsx` — Public footer

---

### Public Pages (`app/(public)/`)

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, feature highlights, accreditation score demo, social proof |
| About | `/about` | Mission, vision, how it works |
| Features | `/features` | Detailed feature breakdown with icons |
| Pricing | `/pricing` | Institutional subscription tiers |
| Contact | `/contact` | Demo request form, support info |

---

### Authentication Pages (`app/(auth)/`)

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Email + password, institution SSO |
| Register | `/register` | Institution signup (multi-step) |
| Password Reset | `/reset-password` | Email-based reset flow |

---

### Dashboard (`app/(dashboard)/`)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard Home | `/dashboard` | Accreditation readiness score, key KPIs, quick stats |
| Accreditation Scoring | `/dashboard/scoring` | Score breakdown by IIQA, SSR, DVV, etc.; historical trends |
| Sensor Monitoring | `/dashboard/sensors` | Real-time sensor cards, infrastructure status, alerts |
| Document Analysis | `/dashboard/documents` | Upload docs, OCR status, AI analysis results, gap reports |
| Analytics & Reports | `/dashboard/analytics` | Department performance, KPIs, export functionality |
| AI Recommendations | `/dashboard/ai-recommendations` | Suggestions, action items, priority areas |
| Settings | `/dashboard/settings` | Profile, institution config, sensor setup |
| Notifications | `/dashboard/notifications` | Notification center |
| Help | `/dashboard/help` | Documentation, FAQs |

---

## Design Direction

- **Color palette**: Deep navy (`#0A0F1E`) background, indigo/violet (`#6366F1`) primary, gold (`#F59E0B`) accent
- **Style**: Glassmorphism cards, subtle grid backgrounds, gradient text headings
- **Typography**: **Outfit** for headings, **Inter** for body
- **Animations**: CSS keyframe fade-ins, hover glows, smooth sidebar transitions
- **Reference**: Inspired by the Dribbble references (clean HR platform + modern tech solutions aesthetic)
- **Charts**: Recharts library for data visualizations in dashboard

---

## Verification Plan

### Automated
- Run `npm run build` in `edutrace-web/` — must complete with 0 errors
- Run `npm run dev` and verify server starts on port 3000

### Browser Verification (via browser tool)
- Navigate to `http://localhost:3000` — verify Home page renders
- Navigate to `/dashboard` — verify dashboard loads with score card
- Navigate to `/dashboard/sensors` — verify sensor monitoring UI
- Navigate to `/dashboard/documents` — verify document analysis UI
- Navigate to `/login`, `/register`, `/reset-password` — verify auth pages
- Navigate to `/features`, `/pricing`, `/contact` — verify public pages

> [!NOTE]
> All data in the dashboard will be **mock/demo data** — no real backend integration in this phase. The UI will be fully functional visually with realistic placeholder data matching the PRD.
