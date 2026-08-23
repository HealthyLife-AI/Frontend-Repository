# HealthyLife AI — Project Constitution & Governance

> **Standing Rules & Architectural Contract**
> Derived directly from `PRD.md` (§7 Technical Reality & Constraints, §8 Global Non-Functional Requirements).
> Every specification (`spec.md`), technical plan (`plan.md`), and task (`tasks.md`) MUST conform to this constitution.

---

## 1. Primary Principles & Governance

1. **Spec as the Single Source of Truth**: All feature requirements originate from `PRD.md` and are formalized in `.specify/specs/`. Code must match specifications; any discrepancy requires updating the specification first.
2. **Calm Data Aesthetic**: Interface design strictly adheres to the Stitch Design System ("Calm Data" philosophy, soft-tinted surfaces, `#006B5F` primary teal, rounded 16px cards, pill-shaped action buttons).
3. **Bi-directional i18n & RTL First**: Full native support for Arabic (RTL) and English (LTR). Layouts, text directions, icon orientation, and line-heights (15-20% boost for Arabic) must be handled dynamically via `<html dir>` and `LocaleProvider`.
4. **Decoupled Centralized API Contract**: The frontend (`healthylife-ai-web`) is a Next.js client consuming a separately owned Laravel API (`https://backend-repository-production.up.railway.app/api`). Backend contracts must be verified before implementing dependent frontend epics.
5. **Zero-Trust Security & Privacy**: User data is strictly isolated and protected via JWT authentication and role-based access. Only minimum necessary data is collected and processed.

---

## 2. Technology Stack & Architectural Constraints

| Component | Architecture & Technology | Configuration / Rule |
|---|---|---|
| **Web Frontend** | **Next.js 16 (App Router, TypeScript, Tailwind CSS v4)** | React Server Components where appropriate, Client Components for interactive UI (`"use client"`). |
| **Styling & Tokens** | **Tailwind CSS v4** | Tokens defined in `src/app/globals.css`. Primary color: `#006B5F`. Standard container widths `max-w-md`, `max-w-lg`, etc. |
| **Backend API** | **Laravel API** | Centralized backend deployed at `https://backend-repository-production.up.railway.app/api`. |
| **Authentication** | **JWT (Bearer Token) + HttpOnly Refresh Cookie** | Access token passed in `Authorization: Bearer <token>`. 15-min account lockout after 5 consecutive failed logins (429 response). |
| **Localization (i18n)** | **Custom `LocaleProvider`** | Dictionary-based (`ar.ts`, `en.ts`), persisted via `PATCH /user/locale`. |
| **Typography & Icons** | **Inter (Google Fonts) + Material Symbols Outlined** | Inter loaded via `next/font/google`. Material Symbols configured with `crossOrigin="anonymous"`. |

---

## 3. Global Non-Functional Requirements (NFRs)

These non-functional requirements apply across **all** modules and sprints:

| ID | Category | Requirement Description | Measurement & Target |
|---|---|---|---|
| **NFR-01** | **Performance** | System response time, screen loading, and throughput | ≤ 3s response time @ ≤100 concurrent users; primary screens load in ≤ 5s; AI/nutrition calc ≤ 5s. |
| **NFR-02** | **Security** | Auth, authorization, data protection in transit | JWT bearer auth, RBAC, HTTPS/TLS 1.2+, 15-min lockout after 5 failed logins (HTTP 429). |
| **NFR-03** | **Usability** | Ease of learning and task completion | ≥90% unassisted task completion; user registration + health profile completed in ≤ 5 minutes. |
| **NFR-04** | **Reliability** | Consistent operation, atomic operations | ≤1% failure rate on critical operations; no duplicate or partial records. |
| **NFR-05** | **Availability** | System uptime and maintenance | ≥99% availability during normal hours; planned maintenance announced ≥24h in advance. |
| **NFR-06** | **Scalability** | Architecture growth capability | Scalable from 100 to 10,000 active users; up to 200 concurrent requests; 1,000,000 meal records. |
| **NFR-07** | **Maintainability** | Clean, modular, testable codebase | Modular file structure, TypeScript strict mode, ≥80% unit test coverage on critical components. |
| **NFR-08** | **Compatibility** | Platform & browser support | Chrome, Edge, Firefox, Safari (current + 2 previous versions); responsive across mobile, tablet, and desktop. |
| **NFR-09** | **Data Integrity** | Input validation before persistence | Strict type, range, format, and uniqueness validation on both client and server before saving. |
| **NFR-10** | **Privacy** | Data minimization & access control | Collect minimal necessary health data; access restricted by authenticated role. |
| **NFR-11** | **Backup & Recovery** | Protection against data loss | Automated daily backups; RPO ≤ 24h; RTO ≤ 2h; periodic restoration tests. |
| **NFR-12** | **Accessibility** | Inclusive UI & navigation | Labels/alt-text on controls, keyboard navigation support, WCAG 2.1 AA compliance where applicable. |

---

## 4. Definition of Done (DoD) Checklist

Before any epic or story is marked complete:
- [ ] Code is merged into `main` and passes CI builds (`npx tsc --noEmit` and `npm run build` pass with 0 errors).
- [ ] All Given/When/Then acceptance criteria pass.
- [ ] Unit tests written for core business logic (≥80% coverage on critical modules).
- [ ] Verified in both Arabic (RTL) and English (LTR).
- [ ] Zero open critical or high-priority defects.
- [ ] Relevant documentation updated.
