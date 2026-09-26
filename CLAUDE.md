# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production (Next.js standalone mode)
npm run lint         # Run ESLint
npm run build:static # Build static site → ./out/ (GitHub Pages)
npm run deploy       # Build + deploy to GitHub Pages (gh-pages)
npm run api:install  # Install API dependencies (first-time setup)
npm run api:dev      # Start Hono API in watch mode with tsx (port 3001)
npm run api:start    # Start Hono API with tsx (port 3001)
cd api && npm test               # Run all API tests (vitest)
cd api && npx vitest run -t "test name"  # Run a single test by name
```

## Architecture

This is a **Next.js 16 (App Router) landing page** for VBT Hackathon 2026 with a **Hono API backend**, both running in a **single Docker container**.

**Three deployment modes:**
- **GitHub Pages** (`STATIC_EXPORT=1`): static HTML export (`output: 'export'`, `basePath: '/Hackathon2026'`), no API, registration links point to Google Forms
- **Docker / K8s** (default): Next.js standalone server + Hono API in one container. Next.js rewrites proxy `/api/*` to Hono on port 3001. Only port 3000 is exposed.
- **Vercel** (`VERCEL=1`, set automatically): default Next.js output, no `basePath`, no `standalone`. No local Hono server — uses Vercel's own API routing.

**API** (`api/src/index.ts` + `api/src/validation.ts`): Hono server split across two files — `index.ts` handles routes/DB/R2, `validation.ts` exports regex patterns, length limits, `escapeHtml`, `validateMemberFields`, and `assertAdminToken`. Endpoints:
- `POST /api/apply` — team application with CV uploads (multipart/form-data) → Supabase `submissions` + `members` tables + CV files in Cloudflare R2 (`cvs` bucket)
- `POST /api/submit` — hackathon deliverables (poster, presentation, repo) → Supabase `deliverables` table + files in R2 (`deliverables` bucket); upserts on `team_email`
- `GET /api/admin/submissions` — list applications (requires `Authorization: Bearer <ADMIN_TOKEN>`)
- `PATCH /api/admin/submissions/:id/status` — update status (`pending`/`accepted`/`rejected`); sends Resend email to captain
- `GET /api/admin/cv?path=...` — 2-min signed URL for CV files from R2
- `GET /api/admin/deliverables` — list project deliverables
- `GET /api/admin/deliverable-file?path=...` — 2-min signed URL from R2
- `GET /health` — health check

Dev: runs with `tsx`. Docker: compiled with `tsc` → `api/dist/`. Required env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`, `CF_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`. Optional: `RESEND_API_KEY` (emails), `PORT` (default 3001).

**Docker:** Multi-stage Dockerfile. Stage 1 builds Next.js standalone + compiles API with `tsc`. Stage 2 is minimal runtime. `start.sh` starts Hono API (background, port 3001) then Next.js (foreground, port 3000).

**Key constraint (static mode):** `output: 'export'` means no API routes, no server components with data fetching, and no dynamic routes. All asset paths must use the `BASE_PATH` constant from `src/lib/constants.ts`.

**Tech stack:** Next.js 16 + React 19, TypeScript, Tailwind CSS v4, Framer Motion 12, Hono, Supabase (DB only), Cloudflare R2 (file storage), Resend (email)

**Pages:**
- `/` — homepage: Header → Hero → TrustBar → About → Timeline → Jury → HowToApply → Rules → Prizes → Venue → FAQ → Footer
- `/program` — program/schedule detail page (`ProgramFlow` component)
- `/apply` — multi-step team application form (4 steps: team info → captain → members → closing)
- `/submit` — project deliverable submission form (poster + presentation + repo)
- `/admin` — password-protected admin panel (token stored in sessionStorage, `NEXT_PUBLIC_API_URL` env var for API base)
- `/kvkk` — KVKK (data privacy) page
- `/gizlilik` — privacy policy page
- `/katilim-sartlari` — participation terms page

**Structure:**
- `src/app/` — App Router pages
- `src/components/` — All UI sections. Every component uses `"use client"`.
- `src/components/apply/` — Multi-step form: `ApplyForm.tsx` orchestrates `StepTeam`, `StepCaptain`, `StepMembers`, `StepClosing`; `ApplyCountdown.tsx` shows deadline timer
- `src/components/submit/SubmitForm.tsx` — Project submission form
- `src/lib/constants.ts` — `BASE_PATH` for asset paths (empty string in Docker mode, `/Hackathon2026` in static export)
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge)
- `src/lib/validations.ts` — shared regex + validation helpers
- `src/components/apply/FormFields.tsx` — reusable `FormInput` and `CustomSelect` primitives; use these for all form fields
- `api/src/index.ts` — Hono API server (routes, DB, R2)
- `api/src/validation.ts` — validation helpers shared across API
- `src/app/admin/types.ts` — admin TypeScript types (`Submission`, `Deliverable`, `Member`) + display constants (`STATUS_CONFIG`, `EXPERIENCE_TR`, `SOURCE_TR`) + `safeHref()` URL validator
- `src/app/admin/utils.ts` — `formatDate()` (Turkish locale) and `exportCSV()` (BOM-prefixed for Excel)
- `src/app/sitemap.ts` — sitemap (Docker/production only; static export mode doesn't serve it)
- `k8s/` — Kubernetes deployment + service manifests

**Global layout** (`GlobalLayoutComponents.tsx`): Renders `CustomCursor` on all routes. `Preloader`, `ScrollProgress`, and `StickyBar` are excluded on: `/admin`, `/apply`, `/katilim-sartlari`, `/kvkk`, `/gizlilik`, `/program`, `/submit`. The SSR cover (`#ssr-cover` div in layout) hides flash before hydration; `Preloader` removes it on the homepage, `GlobalLayoutComponents` removes it on excluded paths. `PageBackground` renders a decorative animated canvas/gradient background on every page (rendered directly in `layout.tsx`).

**Smooth scrolling:** `SmoothScrollProvider` wraps all pages using `@studio-freight/lenis`.

**Preloader / video loading handshake:** `HeroBackground` sets `window.__heroVideoLoaded = true` and dispatches `hero-video-loaded` when video fires `canplaythrough`. `Preloader` checks the flag on mount (race condition fix) and waits for both progress (~8s) and that flag before dismissing. Video assets are served from `https://assets.vbthackathon.com.tr/videos/`.

## Styling

- **Tailwind v4** with `@import "tailwindcss"` (no `tailwind.config.js`)
- **Dark theme only** — background `#05050a`, primary cyan `#22d3ee`, secondary orange `#f97316`
- Custom utilities in `globals.css`: `.text-gradient` (cyan→orange gradient text), `.neon-btn` (animated cyan glow)
- Colors are defined as CSS custom properties in `globals.css` under `@theme` — use `bg-background`, `text-foreground`, `text-primary`, `text-secondary` etc.
- Use `cn()` from `src/lib/utils.ts` for conditional className merging
- **Fonts** (loaded via `next/font/google`, available as CSS vars): `--font-inter` (body), `--font-bebas` (display/headings), `--font-exo2` (subheadings), `--font-orbitron` (accents/numbers)

## Animations

All animations use **Framer Motion**. Standard pattern: `whileInView` with `viewport={{ once: true }}` for scroll-triggered reveals, `AnimatePresence` for mount/unmount transitions. Keep animation delays reasonable for mobile performance.

## CI/CD

- **`docker-publish.yml`**: triggers on push to `main` → builds Docker image → pushes to `ghcr.io/vbthub/hackathon2026:<sha>` → commits updated image tag to `k8s/deployment.yaml`
- **`deploy.yml`**: triggers on push to `main` on self-hosted runner → ArgoCD detects the manifest change in `k8s/deployment.yaml` and syncs automatically (GitOps)
- GitHub Pages deploy is manual: `npm run deploy`

## Content

All user-facing content is in **Turkish**.

