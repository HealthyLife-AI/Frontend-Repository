# Specification: 006-admin-testing-deployment (Epic 6 — Sprint 6)

> **Status: Planned**
> **Target Milestone**: M3 (Intelligent Guidance & Operations)
> **Sprint**: Sprint 6 (1 wk, 21 Story Points)
> **Related FRs**: FR-11a, FR-11b, FR-11c, NFR-04, NFR-05, NFR-11
> **Data Entities**: `User`, `FoodCategory`, `Food`

---

## 1. Feature Summary & User Intent

Provide an Administrator Control Panel to manage user accounts and the central food database, execute End-to-End system testing to guarantee reliability (≤1% failure rate), deploy to production with automated daily backups (RPO ≤ 24h), and finalize technical documentation.

---

## 2. Requirements & User Stories

### US-11: Manage Users and Food Database (Admin Panel) (8 SP)
> As a system administrator, I want to manage user accounts, food categories, and food items through an admin panel, so that platform data stays accurate.

- **AC-1 (User Management)**: Given an authenticated Administrator in `/admin/users`, when viewing users, then admin can search, activate, or deactivate user accounts.
- **AC-2 (Food & Category Management)**: Given an admin in `/admin/foods`, when adding, editing, or deleting a food item or category, then changes persist and update public search results immediately.
- **AC-3 (RBAC Security Guard)**: Given a non-admin user attempting to access `/admin/*` routes or API endpoints, when requested, then system denies access (HTTP 403 Forbidden) and logs security attempt.

### US-21: End-to-End System Testing (8 SP)
> As the development team, I want to run functional, integration, and regression tests across all modules, so that the platform is reliable and free of critical defects.

- **AC-1 (Full MVP Test Coverage)**: Given complete MVP build, when E2E and integration test suites execute, then Auth, Profile, Meals, Dashboard, and AI modules pass all test cases.
- **AC-2 (Reliability Metric)**: Given test suite execution under load, then system operations maintain a failure rate of ≤ 1% (NFR-04).
- **AC-3 (Defect Zero Gate)**: Given surfaced defects, when evaluated, then all critical and high-severity bugs are resolved before production release.

### US-22: Deployment & Documentation (5 SP)
> As the development team, I want to deploy to production and finalize technical documentation.

- **AC-1 (Production SLA)**: Given deployed production environment, when active, then system maintains ≥ 99% availability (NFR-05).
- **AC-2 (Automated Daily Backups)**: Given live production database, then automated daily backups run every 24 hours with RPO ≤ 24h and RTO ≤ 2h (NFR-11).
- **AC-3 (Documentation Handover)**: Given release completion, then updated API specifications, deployment guides, and user manuals are delivered.

---

## 3. Data Model & API Interfaces

### Endpoints
- `GET /admin/users`
- `PATCH /admin/users/{id}/status`
- `POST /admin/foods`
- `PUT /admin/foods/{id}`
- `DELETE /admin/foods/{id}`
- `POST /admin/food-categories`

---

## 4. Acceptance Verification & Security Controls

- [ ] Strict Role-Based Access Control (RBAC) enforced on all `/admin` routes.
- [ ] 0 critical or high severity defects prior to tag release.
- [ ] Automated daily backup job verified.
