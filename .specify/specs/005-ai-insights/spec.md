# Specification: 005-ai-insights (Epic 5 — Sprint 5)

> **Status: Planned**
> **Target Milestone**: M3 (Intelligent Guidance & Operations)
> **Sprint**: Sprint 5 (1 wk, 8 Story Points)
> **Related FRs**: FR-08
> **Data Entities**: `AIInsight`, `HealthProfile`, `Meal`

---

## 1. Feature Summary & User Intent

Empower users with AI-generated, personalized nutrition guidance and health recommendations derived from analyzing their biometric health profile, daily nutrition targets, and historical meal logging patterns.

---

## 2. Requirements & User Stories

### US-08a: Generate AI Health Insights (8 SP)
> As a user, I want the system to analyze my health profile and meal history, so that I receive personalized recommendations to improve my eating habits.

- **AC-1 (Daily Insight Generation)**: Given a user with logged meals, when insight generation runs, then system analyzes macro balance, caloric deficit/surplus, and meal timing, returning at least one tailored actionable recommendation.
- **AC-2 (Performance SLA)**: Given an AI insight request, under normal load, then recommendation generates and displays within ≤ 5 seconds.
- **AC-3 (Personalization Rule)**: Given generated recommendation, when rendered, then advice directly references user's target goal (weight loss, maintenance, muscle gain) and recent dietary data.
- **AC-4 (Medical Disclaimer Gate)**: Given any AI insight card, when displayed, then it includes non-medical disclaimer ("HealthyLife AI provides nutrition guidance, not medical diagnosis").

### US-08b: View Personalized Recommendations (3 SP)
> As a user, I want to view my AI recommendations in a dedicated feed section, so that I can easily act on the advice given to me.

- **AC-1 (Insights Feed UI)**: Given a user on `/insights` or dashboard insight section, when loaded, then latest recommendations appear as structured cards with actionable tags.
- **AC-2 (History & Refresh)**: Given new meal logs or a new day, when refreshed, then updated recommendations generate and historical insights remain browsable.
- **AC-3 (Cold Start Guidance)**: Given a brand new user without logged meals, when viewing insights section, then system displays friendly prompt explaining that logging 2-3 meals unlocks personalized AI analysis.

---

## 3. Data Model & API Interfaces

### Endpoints
- `POST /ai/generate-insights`
- `GET /ai/insights/latest`
- `GET /ai/insights/history`

---

## 4. Constraints & Medical Boundaries

- AI recommendations rely strictly on approved nutritional guidelines and user-logged data.
- Recommendations MUST NOT generate medical prescriptions, treatment advice, or diagnostic statements.
