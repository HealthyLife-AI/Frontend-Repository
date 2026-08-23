# HealthyLife AI — Project Roadmap & Traceability Matrix

> **Auxiliary Documentation File**
> Derived from `PRD.md` (§10 Roadmap & Sprints, §13 Traceability Matrix).

---

## 1. Milestones Overview

| Milestone | Sprints | Focus Area | Status |
|---|---|---|---|
| **M1 — User Identity & Personalization** | Sprint 1–2 | Authentication, Biometrics, Calorie & Macro Calculations | **Implemented** (Live Next.js + Laravel API) |
| **M2 — Nutrition Tracking, Progress & Platform Reach** | Sprint 3–4 | Food Database, Meal Logging, Dashboard & Weekly Trends | **Planned** (Sprint 3 & 4) |
| **M3 — Intelligent Guidance & Operations** | Sprint 5–6 | AI Health Insights, Admin Panel, E2E Testing & Deployment | **Planned** (Sprint 5 & 6) |

---

## 2. Sprint Breakdown & Story Points

| Sprint | Epic / Focus Area | Feature Directory | Story Points | Status |
|---|---|---|---|---|
| **Sprint 1** | Foundation & Authentication | `specs/001-foundation-auth/` | 10 SP | Implemented |
| **Sprint 2** | User & Health Profile | `specs/002-health-profile/` | 11 SP | Implemented |
| **Sprint 3** | Food Database & Meal Tracking | `specs/003-food-meal-tracking/` | 16 SP | Planned |
| **Sprint 4** | Dashboard & Reporting | `specs/004-dashboard-reporting/` | 15 SP | Planned |
| **Sprint 5** | AI Health Insights | `specs/005-ai-insights/` | 8 SP | Planned |
| **Sprint 6** | Admin, Testing & Deployment | `specs/006-admin-testing-deployment/` | 21 SP | Planned |
| **Cross-cutting** | Platform NFRs & Security | Managed via `.specify/constitution.md` | 34 SP | Standing Rules |

---

## 3. Full Traceability Matrix

| Functional Req (FR) | User Stories | Sprint | Spec Kit Directory | Status |
|---|---|---|---|---|
| FR-01a, FR-01b, FR-01c | US-01a, US-01b | Sprint 1 | `.specify/specs/001-foundation-auth/` | Implemented |
| FR-02b | US-02 | Sprint 2 | `.specify/specs/002-health-profile/` | Implemented |
| FR-03 | US-03 | Sprint 2 | `.specify/specs/002-health-profile/` | Implemented |
| FR-12 | US-12 | Sprint 2 | `.specify/specs/002-health-profile/` | Implemented |
| FR-04 | US-04 | Sprint 3 | `.specify/specs/003-food-meal-tracking/` | Planned |
| FR-05a/b/c, FR-06 | US-05 | Sprint 3 | `.specify/specs/003-food-meal-tracking/` | Planned |
| FR-07 | US-07, US-07b | Sprint 4 | `.specify/specs/004-dashboard-reporting/` | Planned |
| FR-09 | US-09 | Sprint 4 (verify) | `.specify/specs/004-dashboard-reporting/` | Verified |
| FR-10 | US-10 | Sprint 4 | `.specify/specs/004-dashboard-reporting/` | Planned |
| FR-08 | US-08a, US-08b | Sprint 5 | `.specify/specs/005-ai-insights/` | Planned |
| FR-11a/b/c | US-11 | Sprint 6 | `.specify/specs/006-admin-testing-deployment/` | Planned |
| NFR-04, NFR-05, NFR-11 | US-21, US-22 | Sprint 6 | `.specify/specs/006-admin-testing-deployment/` | Planned |
