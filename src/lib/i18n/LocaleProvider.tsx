"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import en, { type Dictionary } from "./dictionaries/en";
import ar from "./dictionaries/ar";
import { updateLocale as updateLocaleOnServer } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export type Locale = "en" | "ar";

const dictionaries: Record<Locale, Dictionary> = { en, ar };

const LOCALE_STORAGE_KEY = "healthylife.locale";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  setLocale: (locale: Locale, opts?: { syncServer?: boolean }) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "ar" || stored === "en" ? stored : "en";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  useEffect(() => {
    // Same rationale as AuthGuard: localStorage isn't available during SSR,
    // so the persisted locale can only be read after mount without causing
    // a hydration mismatch (server always renders the "en" default).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(getInitialLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale, opts?: { syncServer?: boolean }) => {
      setLocaleState(next);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      if (opts?.syncServer && isAuthenticated) {
        // Persist the user's permanent preference server-side; failures are
        // non-fatal since the UI already reflects the change locally.
        updateLocaleOnServer(next).catch(() => {});
      }
    },
    [isAuthenticated],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      dict: dictionaries[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Shorthand for the active dictionary, mirroring a typical `t()` hook. */
export function useTranslation() {
  const { dict, locale, dir, setLocale } = useLocale();
  return { t: dict, locale, dir, setLocale };
}
