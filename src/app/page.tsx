"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const { t } = useTranslation();

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <div className="flex h-full w-full flex-col md:flex-row">
        {/* Left Side: Brand Illustration — rich teal gradient panel */}
        <div className="relative flex h-[38vh] w-full items-center justify-center bg-brand-panel p-6 overflow-hidden md:h-full md:w-1/2">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -start-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -end-16 h-56 w-56 rounded-full bg-[#006B5F]/15 blur-2xl" />

          <div className="absolute top-6 start-6 z-10 hidden md:flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#006B5F]">nutrition</span>
            <span className="text-xl font-bold text-[#006B5F]">{t.common.appName}</span>
          </div>

          <div className="relative h-full w-full max-w-lg flex items-center justify-center p-4 drop-shadow-lg">
            <img
              src="/images/brand-illustration.png"
              alt="HealthyLife AI Illustration"
              className="max-h-full max-w-full object-contain object-center"
            />
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="relative flex flex-1 flex-col justify-between bg-surface-container-lowest p-6 md:p-12 md:w-1/2 overflow-y-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-lg font-bold text-[#006B5F] md:hidden">
              <span className="material-symbols-outlined">nutrition</span>
              {t.common.appName}
            </div>
            <div className="ms-auto">
              <LanguageToggle />
            </div>
          </div>

          {/* Core Content */}
          <div className="mx-auto my-auto flex w-full max-w-md flex-col gap-6 py-6 animate-fade-up">
            <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl lg:text-4xl leading-tight">
              {t.onboarding.tagline}
            </h1>
            <p className="text-sm text-on-surface-variant md:text-base leading-relaxed">
              {t.onboarding.subtext}
            </p>

            <div className="mt-4 flex flex-col gap-3 animate-fade-up animate-fade-up-delay-1">
              <Link href="/register" className="w-full">
                <Button
                  fullWidth
                  className="bg-[#006B5F] hover:bg-[#00574d] active:bg-[#004038] text-white py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,107,95,0.35)] hover:shadow-[0_6px_20px_rgba(0,107,95,0.45)] transition-all duration-200"
                >
                  {t.onboarding.getStarted}
                  <span className="material-symbols-outlined text-base ms-1 rtl:rotate-180">
                    arrow_forward
                  </span>
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-2 text-sm text-on-surface-variant">
                <span>{t.onboarding.haveAccount}</span>
                <Link href="/login" className="font-semibold text-[#006B5F] hover:underline underline-offset-2">
                  {t.onboarding.logIn}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-on-surface-variant/50 text-center md:text-start">
            &copy; {new Date().getFullYear()} {t.common.appName}
          </div>
        </div>
      </div>
    </main>
  );
}
