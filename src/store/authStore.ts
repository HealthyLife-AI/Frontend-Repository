import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AuthUser = {
  id?: number | string;
  full_name?: string;
  email?: string;
  preferred_language?: "ar" | "en";
  [key: string]: unknown;
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  hasHealthProfile: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setHasHealthProfile: (value: boolean) => void;
  clear: () => void;
};

/**
 * The refresh token itself lives in an HttpOnly cookie set by the backend
 * (see /auth/refresh) — it is never accessible to, or stored by, the client.
 * Only the short-lived access token and basic user profile are persisted
 * here, purely to survive page reloads until a refresh call revalidates.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      hasHealthProfile: false,
      setAccessToken: (token) => set({ accessToken: token }),
      setUser: (user) => set({ user }),
      setHasHealthProfile: (value) => set({ hasHealthProfile: value }),
      clear: () => set({ accessToken: null, user: null, hasHealthProfile: false }),
    }),
    {
      name: "healthylife.auth",
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        hasHealthProfile: state.hasHealthProfile,
      }),
    },
  ),
);
