"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * Guards a route on the client: waits for the persisted zustand store to
 * rehydrate, then redirects to /login if there's no access token. A silent
 * 401 -> refresh handled in the axios interceptor covers expiry mid-session.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Deliberate one-time sync from localStorage after mount: this has to
    // run in an effect (not as a lazy useState initializer) because SSR has
    // no access to localStorage, and rendering the persisted locale directly
    // on the client's first pass would mismatch the server-rendered HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !accessToken) {
      router.replace("/login");
    }
  }, [hydrated, accessToken, router]);

  if (!hydrated || !accessToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary">
          progress_activity
        </span>
      </div>
    );
  }

  return <>{children}</>;
}
