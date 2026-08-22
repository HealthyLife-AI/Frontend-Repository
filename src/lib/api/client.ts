import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/authStore";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://backend-repository-production.up.railway.app/api";

/**
 * Shared axios instance for all backend (Laravel) calls.
 *
 * Auth model (from the team's Postman collection):
 * - Access token: short-lived JWT, sent as `Authorization: Bearer <token>`.
 * - Refresh token: HttpOnly cookie, rotated one-time-use via POST /auth/refresh.
 *   `withCredentials: true` is required so that cookie is sent/received.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  if (typeof window !== "undefined") {
    const locale = window.localStorage.getItem("healthylife.locale") ?? "en";
    config.headers.set("X-Locale", locale);
  }
  return config;
});

// --- Silent refresh-on-401 -------------------------------------------------
// If multiple requests 401 at once, only refresh once and let the rest wait.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post("/auth/refresh")
      .then((res) => {
        const token = res.data?.authorization?.access_token ?? null;
        if (token) useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch(() => {
        useAuthStore.getState().clear();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    const isAuthRoute =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register") ||
      original?.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isAuthRoute
    ) {
      original._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.set("Authorization", `Bearer ${newToken}`);
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  },
);

/** Normalizes Laravel validation / error responses into a flat message. */
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined;
    if (data?.errors) {
      const first = Object.values(data.errors)[0]?.[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    if (error.message === "Network Error") {
      return "تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وحاول مجدداً.";
    }
  }
  return fallback;
}

export function isLockedError(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 429;
}
