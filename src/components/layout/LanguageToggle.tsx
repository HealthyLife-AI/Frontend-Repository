"use client";

import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/LocaleProvider";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border border-outline-variant bg-surface-container-lowest p-1 text-xs font-semibold",
        className,
      )}
    >
      {(["en", "ar"] as const).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code, { syncServer: true })}
          className={clsx(
            "rounded-full px-3 py-1.5 transition-colors",
            locale === code
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant hover:text-on-surface",
          )}
        >
          {code === "en" ? "EN" : "AR"}
        </button>
      ))}
    </div>
  );
}
