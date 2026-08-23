# Specification: 001-foundation-auth (Epic 1 — Sprint 1)

> **Status: Implemented**
> **Target Milestone**: M1 (User Identity & Personalization)
> **Sprint**: Sprint 1 (1.5 wks, 10 Story Points)
> **Related FRs**: FR-01a, FR-01b, FR-01c, FR-09
> **Data Entities**: `User`, `UserToken`

---

## 1. Feature Summary & User Intent

Deliver project foundation, localization framework (ar/en, LTR/RTL), and secure user authentication (Register, Login, Logout) allowing users to create accounts and securely access their personalized Health & Nutrition platform.

---

## 2. Requirements & User Stories

### US-01a: User Registration (5 SP)
> As a new user, I want to create an account using my email and password, so that I can securely access the HealthyLife AI platform.

- **AC-1 (Successful Registration)**: Given a visitor on the registration screen, when they submit a unique email and valid password (≥8 chars), then the system creates the account via `POST /auth/register`, stores `access_token`, and redirects to `/setup/step-1`.
- **AC-2 (Duplicate Email)**: Given a visitor submitting registration, when the email is already registered, then the system rejects submission with a clear localized message ("This email is already registered").
- **AC-3 (Password Strength)**: Given a visitor entering password, when password is under 8 characters, then system blocks form submission and highlights the validation error.

### US-01b: User Login & Localization (5 SP)
> As a registered user, I want to log in with my credentials and choose my preferred language (Arabic or English), so that I can access my account in my language.

- **AC-1 (Successful Login)**: Given a registered user on login screen, when they enter valid email and password, then `POST /auth/login` returns JWT `access_token`, user profile is stored, and user navigates to `/dashboard` (if profile exists) or `/setup/step-1`.
- **AC-2 (Invalid Credentials)**: Given invalid login credentials, when submitted, then system displays localized error message without exposing whether email or password was wrong.
- **AC-3 (Language & RTL Toggle)**: Given any user on any screen, when they toggle language (AR/EN), then interface instantly switches text direction (RTL/LTR) and language dictionary, and syncs preference to server via `PATCH /user/locale`.
- **AC-4 (Account Lockout)**: Given 5 consecutive failed login attempts, when the 5th attempt fails, then server locks account for 15 minutes (HTTP 429).

---

## 3. Data Model & API Interfaces

### Endpoints
- `POST /auth/register` (`full_name`, `email`, `password`, `password_confirmation`, `preferred_language`)
- `POST /auth/login` (`email`, `password`)
- `POST /auth/logout` (Bearer Auth)
- `POST /auth/refresh` (Cookie Auth)
- `PATCH /user/locale` (`preferred_language: "ar" | "en"`)

---

## 4. Current Implementation Verification

- [x] Client Auth Store (`src/store/authStore.ts`) persisting access token and user state.
- [x] API Client (`src/lib/api/client.ts`) sending `Authorization: Bearer <token>` and `X-Locale`.
- [x] Onboarding Screen (`src/app/page.tsx`) with Split-Screen layout.
- [x] Login Page (`src/app/login/page.tsx`) and Register Page (`src/app/register/page.tsx`).
- [x] `LocaleProvider` (`src/lib/i18n/LocaleProvider.tsx`) handling AR/EN and `<html dir>`.
