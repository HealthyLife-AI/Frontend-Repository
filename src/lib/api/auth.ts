import { apiClient } from "./client";
import type { AuthUser } from "@/store/authStore";

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  preferred_language?: "ar" | "en";
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user?: AuthUser;
  authorization: {
    access_token: string;
    token_type?: string;
    expires_in?: number;
  };
};

/**
 * POST /auth/register
 * Auto-logs the user in on success: returns an access_token and sets the
 * refresh_token HttpOnly cookie.
 */
export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<AuthResponse>(
    "/auth/register",
    payload,
  );
  return data;
}

/**
 * POST /auth/login
 * Returns 429 after 5 consecutive failed attempts (account locked 15 min).
 */
export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
  return data;
}

/** POST /auth/logout — revokes the refresh token and invalidates the JWT. */
export async function logout() {
  await apiClient.post("/auth/logout");
}

/**
 * POST /auth/refresh — rotates the (cookie-based) refresh token and returns
 * a new access token. Called automatically by the axios interceptor on 401,
 * but exported in case a screen needs to trigger it explicitly.
 */
export async function refresh() {
  const { data } = await apiClient.post<AuthResponse>("/auth/refresh");
  return data;
}

/** PATCH /user/locale — persists the user's permanent language preference. */
export async function updateLocale(preferred_language: "ar" | "en") {
  const { data } = await apiClient.patch("/user/locale", {
    preferred_language,
  });
  return data;
}
