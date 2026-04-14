# AIJobSync — Refactored v0.2.0

AI-powered SaaS platform that analyzes job descriptions, matches your master profile, and generates ATS-optimized resumes in seconds.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.3 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Auth | NextAuth v4 (Google + Credentials) |
| Database | PostgreSQL + Prisma 6 |
| AI | Groq API (llama-3.3-70b) |
| Notifications | Sonner |
| PDF Export | html2canvas + jsPDF (client-side) |

---

## Project Structure

```
AI-Jobsync/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   — NextAuth handler
│   │   │   └── signup/route.ts          — Email registration
│   │   ├── jd/
│   │   │   └── analyze/route.ts         — JD analysis (POST + GET)
│   │   ├── profile/
│   │   │   ├── route.ts                 — Master profile CRUD
│   │   │   └── import/route.ts          — LinkedIn PDF import
│   │   └── resume/
│   │       ├── create/route.ts          — Manual resume creation
│   │       ├── export/route.ts          — Resume data for PDF export
│   │       ├── generate/route.ts        — AI resume generation
│   │       ├── get/route.ts             — Fetch single resume
│   │       ├── list/route.ts            — List user resumes
│   │       └── match-profile/route.ts  — Profile ↔ JD matching
│   ├── dashboard/page.tsx               — Main dashboard (real stats)
│   ├── login/page.tsx                   — Sign in page
│   ├── signup/page.tsx                  — Registration page
│   ├── profile/                         — 7-step profile wizard
│   ├── resume/
│   │   ├── page.tsx                     — Resume library
│   │   └── new/page.tsx                 — JD analyzer + match + generate
│   ├── templates/                       — Template browser + preview
│   ├── layout.tsx                       — Root layout with Toaster
│   └── providers.tsx                    — NextAuth SessionProvider
│
├── components/
│   ├── resume-templates/layouts/        — Classic, Minimal, Modern
│   ├── resume/                          — A4Preview, SmartEdit, Sidebar
│   └── ui/                             — Button, Card, Input, Skeleton…
│
├── hooks/
│   ├── useMasterProfile.ts              — Profile hook with in-memory cache
│   └── useTemplateCalibration.ts        — Template layout calibration
│
├── lib/
│   ├── api-helpers.ts                   — getAuthUser(), apiError(), apiSuccess()
│   ├── auth-options.ts                  — NextAuth config
│   ├── groq-client.ts                   — Groq API wrapper + retry
│   ├── jd-analyzer.ts                   — JD analysis logic
│   ├── profile-matcher.ts               — Profile ↔ JD matching
│   ├── profileCompletion.ts             — Completeness calculator
│   ├── resume-generator.ts              — Resume content generation
│   └── prompts/resumeGeneratorPrompt.ts — AI system prompt
│
├── prisma/
│   ├── schema.prisma                    — Full DB schema
│   └── migrations/                      — All DB migrations
│
├── types/
│   ├── resume.ts                        — All resume + JD types + ResumeData
│   ├── profileWizard.ts                 — Profile form types
│   └── template.ts                      — Template config types
│
├── utils/
│   ├── exportResumePDF.ts               — Client-side PDF generation
│   └── recheckPagination.tsx            — Template pagination helper
│
├── middleware.ts                         — Auth-protected routes
├── next.config.ts                        — Next.js config
└── package.json                          — Dependencies
```

---

## Core User Flow

```
Signup/Login
     ↓
Complete Master Profile (7 steps)
  • LinkedIn PDF import available
     ↓
Resume/New — Paste Job Description
     ↓
AI Analysis (Groq llama-3.3-70b)
  • Extracts: skills, requirements, ATS keywords, experience level
     ↓
Profile Matching
  • Scores: skills match, experience match, keyword match, requirements match
  • Shows: missing skills, suggestions, ATS pass rate estimate
     ↓
Generate Resume
  • AI writes tailored content using only real profile data
     ↓
Choose Template (Classic / Minimal / Modern)
  • Smart edit sections inline
  • Export as PDF (client-side, no puppeteer)
```

---

## Environment Variables

Create `.env.local` in project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/aijobsync"

# NextAuth
NEXTAUTH_SECRET="your-secret-32-chars-minimum"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional — for Google sign-in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Groq AI (required)
GROQ_API_KEY="gsk_your-groq-api-key"
```

---

## Setup & Run

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npx prisma migrate dev --name init

# 3. Generate Prisma client
npx prisma generate

# 4. Run dev server (Turbopack enabled)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Key Changes in v0.2.0

### Performance
- **Next.js 15.3** with Turbopack (`--turbopack` flag) — 60%+ faster HMR
- **Puppeteer removed** — was adding 200MB+ to bundle. PDF now generated client-side via `html2canvas + jsPDF`
- **Profile caching** — `useMasterProfile` has in-memory cache (1 min TTL), prevents refetch on re-render
- **Parallel DB queries** — `resume/generate` fetches profile + JD + match with `Promise.all`
- **`optimizePackageImports`** in next.config for lucide-react and framer-motion

### API & Code Quality
- **`lib/api-helpers.ts`** — `getAuthUser()` centralizes auth (one DB call vs 2 per route before). `apiError()`, `apiSuccess()`, `unauthorized()`, `notFound()` eliminate repeated boilerplate
- **All `(prisma as any)` casts removed** — proper Prisma types throughout
- **`resume/generate` bug fixed** — was querying JD by `analysis.jd_id` JSON path (unreliable); now uses direct `id`
- **`types/resumedummy.tsx` deleted** — `ResumeData`, `SectionShape`, `PersonalDetails` moved to `types/resume.ts`
- **`lib/profileApi.ts` deleted** — was a duplicate of `useMasterProfile` hook
- **`scripts/testJD.ts` deleted** — dev-only script not needed in production

### UI & UX
- **Dashboard** — real stats from DB (resume count, avg ATS score, JDs analyzed), real recent resumes list, animated number counters, staggered card animations
- **Sonner** toasts — all user actions have feedback (save, error, loading states)
- **Framer Motion** — stagger children on dashboard cards, scroll-triggered reveals on results, animated score bars, spring progress bars
- **Skeleton loading** — resume library shows shimmer while loading
- **Login/Signup** — reduced from ~1000 lines each to ~150 lines. Split-panel layout, clean form design
- **Resume library** — fully functional with real API data, score badges, export + regenerate actions
- **`resume/new`** — step indicator, animated processing states, collapsible result sections

### Developer Experience
- `npm run type-check` script added
- All `/* eslint-disable @typescript-eslint/no-explicit-any */` banners removed
- Consistent error handling patterns across all routes
- `next.config.ts` is now proper ESM (`export default`)

---

## API Reference

### Authentication

All API routes (except `/api/auth/*` and `/api/auth/signup`) require a valid NextAuth session. The `getAuthUser()` helper handles this.

### Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Create new account |
| GET | `/api/profile` | Fetch master profile |
| POST | `/api/profile` | Upsert full profile |
| PUT | `/api/profile` | Update single section |
| DELETE | `/api/profile` | Delete profile |
| POST | `/api/profile/import` | Import from LinkedIn PDF |
| POST | `/api/jd/analyze` | Analyze job description |
| GET | `/api/jd/analyze?jd_id=` | Fetch analyzed JD |
| POST | `/api/resume/match-profile` | Match profile to JD |
| GET | `/api/resume/match-profile?match_id=` | Fetch match result |
| POST | `/api/resume/generate` | Generate AI resume |
| POST | `/api/resume/create` | Save manual resume |
| GET | `/api/resume/list` | List user resumes |
| GET | `/api/resume/get?resume_id=` | Fetch single resume |
| POST | `/api/resume/export` | Get resume data for PDF |

---

## Database Schema

Key models in `prisma/schema.prisma`:

- **User** — Auth, plan (FREE/PRO), relations
- **MasterProfile** — All career data in JSON fields (flexible)
- **JobDescription** — Stored JD + Groq analysis JSON
- **ProfileMatch** — Match scores + detailed breakdown JSON
- **Resume** — Generated content + template + version
- **Feedback** — Resume ratings and notes

---

## Subscription Tiers

| Feature | Free | Pro |
|---------|------|-----|
| Resume generation | ✓ | ✓ |
| JD analysis | ✓ | ✓ |
| Profile matching | Basic | Advanced |
| Potential score | ✗ | ✓ |
| Templates | 3 | All |
| Cover letters | ✗ | ✓ |

> Pro implementation pending — `user.plan === 'PRO'` check is already in place across routes.

---

## Deployment (Vercel)

```bash
# Build
npm run build

# Required env vars on Vercel:
# DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL,
# GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GROQ_API_KEY
```

Add `DATABASE_URL` as a Vercel environment variable pointing to a hosted PostgreSQL instance (Neon, Supabase, Railway recommended).

---

## Groq API

This project uses Groq's `llama-3.3-70b-versatile` model for:
1. **JD Analysis** (`lib/jd-analyzer.ts`) — extracts structured data from raw JD text
2. **Profile Matching** (`lib/profile-matcher.ts`) — scores profile vs JD
3. **Resume Generation** (`lib/resume-generator.ts`) — writes tailored resume content

Get your free API key at [console.groq.com](https://console.groq.com).

---

*Built by Hariom Ojha · [aijobsync.com](https://aijobsync.com)*
