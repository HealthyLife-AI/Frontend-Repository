# HealthyLife AI — Web Frontend (Next.js)

Sprint 1 (Foundation & Authentication) + Sprint 2 (User & Health Profile), built
against the team's Laravel backend and the approved Stitch design system.

## Stack

- Next.js 16 (App Router, TypeScript, Turbopack)
- Tailwind CSS v4 (design tokens ported 1:1 from the Stitch `DESIGN.md`)
- Zustand (auth state + in-progress setup-wizard state, persisted to
  `localStorage`)
- react-hook-form + zod for form validation
- axios for API calls, with an interceptor that attaches the JWT bearer token
  and silently refreshes it on 401

## Getting started

```bash
npm install
npm run dev
```

The app expects the backend base URL in `NEXT_PUBLIC_API_BASE_URL` (see
`.env.example`). It's already set to:

```
NEXT_PUBLIC_API_BASE_URL=https://backend-repository-production.up.railway.app/api
```

## What's implemented

### Sprint 1 — Foundation & Authentication
- `/` — Onboarding / landing screen
- `/register` — Sign up (`US-01a`) -> `POST /auth/register`
- `/login` — Login (`US-01b`) -> `POST /auth/login`, with 429 lockout handling
  and automatic redirect to the setup wizard (new users) or dashboard
  (returning users with a saved profile)
- Language toggle (AR/EN) with full RTL layout mirroring, synced to
  `PATCH /user/locale` once the user is authenticated
- Logout -> `POST /auth/logout` (clears local state, revokes server-side
  tokens)
- Silent token refresh via `POST /auth/refresh` (rotates the HttpOnly
  `refresh_token` cookie) — wired into the axios response interceptor, so any
  authenticated call that 401s is retried automatically after a refresh

### Sprint 2 — User & Health Profile
- `/setup/step-1` ... `/setup/step-4` — 4-step profile wizard (age/gender ->
  height/weight with metric<->imperial toggle -> activity level -> goal),
  matching both request bodies documented in the Postman collection
- On finishing step 4: `POST /profile` with the full payload
- `/setup/results` — daily calorie & macro targets (`US-03`)
- `/weight` — log and view body-weight history (`US-12`)

### Cross-cutting
- `src/lib/i18n` — ar/en dictionaries + `LocaleProvider`, RTL mirroring via
  `<html dir>`
- `src/lib/api` — one file per resource (`auth.ts`, `profile.ts`,
  `weightLogs.ts`), all typed against the actual Postman request/response
  shapes
- `src/store` — `authStore` (token/user), `setupStore` (wizard state so a
  refresh mid-wizard doesn't lose progress)
- `src/components/ui` — `Button`, `TextField`, `SelectCard` (radio-style
  cards used for gender/activity/goal), shared across every screen
- `AuthGuard` — client-side route protection, redirects to `/login` if there's
  no access token

## Two integration points to confirm with the backend

1. **Weight log create/list routes.** The Postman collection's "Create Weight
   Log" and "List Weight Logs" requests were left as empty `GET` placeholders
   (no body, no path configured). This build calls `POST /weight-logs` and
   `GET /weight-logs`, following standard Laravel resource conventions and
   staying consistent with the confirmed `PUT /weight-logs/{id}` request. If
   the real routes differ, the only file to touch is
   `src/lib/api/weightLogs.ts`.

2. **Daily nutrition targets (`US-03`).** No `GET /nutrition/daily-needs` (or
   similar) endpoint exists yet in the collection. To avoid blocking the
   setup -> results flow, `src/lib/nutrition.ts` computes the same
   calorie/macro targets client-side (Mifflin-St Jeor formula, same
   30/45/25% macro split shown in the results mockup). Once the backend
   exposes the real endpoint, replace the call in
   `src/app/setup/results/page.tsx` with a fetch to it — the shape
   (`DailyTargets`) is already what the results screen expects.

## Auth model notes

- Access token: short-lived JWT, sent as `Authorization: Bearer <token>`,
  held in memory/localStorage via `authStore`.
- Refresh token: HttpOnly cookie, set by the backend, rotated one-time-use on
  every `POST /auth/refresh` call. The frontend never reads or stores it
  directly — `withCredentials: true` on the axios instance is what lets the
  browser send/receive it.

## Next steps (Sprint 3+, not in this build)

Food search & meal tracking (`US-04`, `US-05`), the nutrition dashboard
(`US-07`, `US-07b`), AI insights (`US-08a/b`), and admin (`US-11`) are out of
scope for this delivery and picked up in later sprints per the Milestones
document.
