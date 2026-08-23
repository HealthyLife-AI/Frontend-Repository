# Specification: 002-health-profile (Epic 2 — Sprint 2)

> **Status: Implemented**
> **Target Milestone**: M1 (User Identity & Personalization)
> **Sprint**: Sprint 2 (1.5 wks, 11 Story Points)
> **Related FRs**: FR-02b, FR-03, FR-12
> **Data Entities**: `HealthProfile`, `NutritionTarget`, `WeightLog`

---

## 1. Feature Summary & User Intent

Enable users to build their biometric health profile (age, gender, height, weight, activity level, goal) in metric or imperial units, receive automatically calculated daily calorie and macronutrient targets, and track body weight changes over time.

---

## 2. Requirements & User Stories

### US-02: Create & Edit Health Profile (5 SP)
> As a registered user, I want to enter my biometrics, activity level, and goals so the system can build my health profile.

- **AC-1 (Initial Profile Setup)**: Given a new authenticated user, when they complete the 4-step wizard (`/setup/step-1` to `step-4`), then system sends `POST /profile` with metric or imperial payload and marks profile as complete.
- **AC-2 (Validation)**: Given empty required fields or invalid numeric ranges (e.g. negative age/weight), when user submits, then system highlights field errors and blocks submission.
- **AC-3 (Profile Update)**: Given an existing profile, when user updates biometric data and saves, then updated targets recalculate immediately across the platform.

### US-03: Calculate Daily Nutrition Needs (3 SP)
> As a user with a completed health profile, I want daily calorie and macro targets calculated automatically.

- **AC-1 (Target Calculation)**: Given a complete profile, when user views setup results (`/setup/results`) or dashboard, then system displays Mifflin-St Jeor daily calorie target and protein/carbs/fats breakdown.
- **AC-2 (Incomplete Profile Gate)**: Given an incomplete profile, when user accesses targets, then system redirects user to complete profile wizard first.
- **AC-3 (Auto-Recalculation)**: Given a profile update (weight change, goal change), when saved, then daily targets recalculate instantly.

### US-12: Log Body Weight Over Time (3 SP)
> As a registered user, I want to log my weight periodically to track progress over time.

- **AC-1 (Add Weight Log)**: Given a user on `/weight`, when they enter weight in kg and date, then system calls `POST /weight-logs`, saves timestamped log, and updates trend chart.
- **AC-2 (Edit Log)**: Given existing log entry, when user edits weight/date via `PUT /weight-logs/{id}`, then system updates entry and recalculates progress.
- **AC-3 (Validation)**: Given invalid weight value (≤0 or >500kg), when submitted, then entry is rejected with error.

---

## 3. Data Model & API Interfaces

### Endpoints
- `POST /profile` (Accepts `MetricProfilePayload` or `ImperialProfilePayload`)
- `GET /profile`
- `POST /weight-logs` (`weight_kg`, `recorded_date`)
- `GET /weight-logs`
- `PUT /weight-logs/{id}`

---

## 4. Current Implementation Verification

- [x] 4-Step Setup Wizard (`src/app/setup/step-1` to `step-4`).
- [x] Results Page (`src/app/setup/results/page.tsx`) displaying calorie ring and macro splits.
- [x] Client-side Mifflin-St Jeor Target Engine (`src/lib/nutrition.ts`).
- [x] Weight Logging Page (`src/app/weight/page.tsx`).
- [x] Setup Store (`src/store/setupStore.ts`) & Profile API (`src/lib/api/profile.ts`).
