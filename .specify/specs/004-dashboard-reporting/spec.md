# Specification: 004-dashboard-reporting (Epic 4 — Sprint 4)

> **Status: Planned**
> **Target Milestone**: M2 (Nutrition Tracking, Progress & Platform Reach)
> **Sprint**: Sprint 4 (1.5 wks, 15 Story Points)
> **Related FRs**: FR-07, FR-09, FR-10
> **Data Entities**: `Meal`, `MealItem`, `WeightLog`, `NutritionTarget`, `Session`

---

## 1. Feature Summary & User Intent

Provide an interactive, responsive dashboard giving users a visual summary of consumed vs. target calories, macronutrient progress (Protein, Carbs, Fats), weekly weight trend graphs, historical nutrition reports, and multi-device sync capabilities.

---

## 2. Requirements & User Stories

### US-07: View Nutrition Dashboard (5 SP)
> As a user, I want to see my consumed and remaining calories for the day, so that I can track how well I am meeting my daily goal.

- **AC-1 (Daily Summary)**: Given a logged-in user on `/dashboard`, when loaded, then system displays SVG progress ring showing consumed/remaining calories, and progress bars for Protein, Carbs, and Fats.
- **AC-2 (Live Refresh)**: Given dashboard open, when a meal or weight log is updated, then dashboard figures update in real-time.
- **AC-3 (Empty Day State)**: Given a day with no logged meals, when viewed, then dashboard shows zero consumed calories with full remaining target.
- **AC-4 (Performance)**: Given dashboard load, then page renders interactive state in ≤ 3 seconds (NFR-01).

### US-07b: View Weekly Progress Charts (5 SP)
> As a user, I want to view weekly charts of weight progress and nutrition history, so that I can understand my long-term trends.

- **AC-1 (Weekly Trend Render)**: Given user opening progress section, when viewed, then interactive SVG/Canvas charts render daily calorie intake vs. target and weight trend line.
- **AC-2 (Historical Selector)**: Given weekly charts, when user selects past weeks/months, then system fetches historical logs and updates charts.
- **AC-3 (Empty History State)**: Given a date range without logged data, when selected, then system displays helpful guidance encouraging data logging.

### US-09: Switch Between Arabic and English (3 SP)
> As a user, I want to switch language and reading direction at any time across all reporting components.

- **AC-1 (Universal RTL/LTR)**: Given any chart or report component, when language is toggled, then axis, labels, tooltips, and legends flip orientation seamlessly (RTL for AR, LTR for EN).

### US-10: Cross-Device Account Sync (5 SP)
> As a user, I want my data to stay in sync across web and mobile applications.

- **AC-1 (Centralized Single Source of Truth)**: Given meal or weight logged on web, when user opens session on mobile/another browser, then data reflects instantly via central Laravel API.

---

## 3. Data Model & API Interfaces

### Endpoints
- `GET /dashboard/daily-summary?date={YYYY-MM-DD}`
- `GET /reports/weekly-trends?start_date={date}&end_date={date}`
- `GET /reports/weight-history`

---

## 4. Acceptance Verification & QA Criteria

- [ ] Dashboard initial load ≤ 3s.
- [ ] SVG Progress Ring & Macro progress bars match Stitch Foundation styling (`#006B5F`).
- [ ] Full responsiveness across desktop, tablet, and mobile breakpoints.
