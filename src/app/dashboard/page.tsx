"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      useAuthStore.getState().clear();
      router.replace("/login");
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="hidden md:flex w-64 flex-col border-e border-outline-variant/60 bg-surface shrink-0 elevation-card">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006B5F] shadow-[0_2px_8px_rgba(0,107,95,0.35)]">
              <span className="material-symbols-outlined text-xl text-white">nutrition</span>
            </div>
            <span className="text-base font-bold text-on-surface">{t.common.appName}</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-5">
            <Link
              href="/dashboard"
              className="sidebar-active flex items-center gap-3 rounded-xl px-4 py-3 text-sm"
            >
              <span className="material-symbols-outlined text-[#006B5F]">space_dashboard</span>
              <span>{t.dashboard.title}</span>
            </Link>
            <Link
              href="/weight"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150"
            >
              <span className="material-symbols-outlined">monitor_weight</span>
              <span>{t.weight.title}</span>
            </Link>
            <Link
              href="/setup/results"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150"
            >
              <span className="material-symbols-outlined">person</span>
              <span>{t.setup.steps.profile}</span>
            </Link>
          </nav>

          {/* Logout */}
          <div className="border-t border-outline-variant/60 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-error hover:bg-error-container/30 transition-colors duration-150"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>{t.dashboard.logout}</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-surface/80 backdrop-blur-sm border-b border-outline-variant/60 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile logo */}
              <div className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg bg-[#006B5F]">
                <span className="material-symbols-outlined text-lg text-white">nutrition</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-on-surface leading-tight">
                  {user?.full_name ? user.full_name : t.dashboard.title}
                </h1>
                {user?.full_name && (
                  <p className="text-xs text-on-surface-variant">{t.common.appName}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center justify-center p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </header>

          {/* Dashboard Canvas */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-background">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5 animate-fade-up">

              {/* ── Left Column ─────────────────────────────────────── */}
              <div className="lg:w-2/3 flex flex-col gap-5">

                {/* Daily Calorie Progress Hero Card */}
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/40 elevation-card transition-shadow duration-200 hover:elevation-card-hover">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-base font-bold text-on-surface">{t.setup.results.calorieTarget}</h2>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <Link href="/weight">
                      <button className="flex items-center gap-1.5 rounded-xl bg-[#006B5F] px-4 py-2 text-xs font-semibold text-white shadow-[0_2px_8px_rgba(0,107,95,0.30)] hover:bg-[#00574d] hover:shadow-[0_4px_12px_rgba(0,107,95,0.40)] transition-all duration-200">
                        <span className="material-symbols-outlined text-sm">add</span>
                        {t.weight.logWeight}
                      </button>
                    </Link>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-2">
                    {/* Progress Ring */}
                    <div className="relative w-44 h-44 flex-shrink-0">
                      {/* Glow effect */}
                      <div className="absolute inset-8 rounded-full bg-[#006B5F]/8 blur-xl" />
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        {/* Track */}
                        <circle
                          cx="50" cy="50" r="40" fill="transparent"
                          stroke="currentColor" strokeWidth="7"
                          className="text-surface-container-high"
                        />
                        {/* Fill */}
                        <circle
                          cx="50" cy="50" r="40" fill="transparent"
                          stroke="url(#ringGradient)" strokeWidth="7"
                          strokeDasharray="251.2" strokeDashoffset="70"
                          strokeLinecap="round"
                          className="ring-animated"
                        />
                        <defs>
                          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4cd5bf" />
                            <stop offset="100%" stopColor="#006B5F" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-[#006B5F]">1,650</span>
                        <span className="text-xs text-on-surface-variant mt-0.5">/ 2,100 {t.setup.results.kcal}</span>
                      </div>
                    </div>

                    {/* Macros Progress */}
                    <div className="flex flex-col gap-5 w-full md:w-64">
                      {/* Protein */}
                      <div className="animate-fade-up animate-fade-up-delay-1">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-on-surface">{t.setup.results.protein}</span>
                          <span className="text-on-surface-variant tabular-nums">95g / 140g</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-[#006B5F] rounded-full progress-fill" style={{ width: "68%" }} />
                        </div>
                      </div>

                      {/* Carbs */}
                      <div className="animate-fade-up animate-fade-up-delay-2">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-on-surface">{t.setup.results.carbs}</span>
                          <span className="text-on-surface-variant tabular-nums">180g / 230g</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary rounded-full progress-fill" style={{ width: "78%" }} />
                        </div>
                      </div>

                      {/* Fats */}
                      <div className="animate-fade-up animate-fade-up-delay-3">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-on-surface">{t.setup.results.fats}</span>
                          <span className="text-on-surface-variant tabular-nums">45g / 65g</span>
                        </div>
                        <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full progress-fill" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* ── Right Column ─────────────────────────────────────── */}
              <div className="lg:w-1/3 flex flex-col gap-5">

                {/* Weight Trend Card */}
                <div className="bg-surface rounded-2xl p-6 border border-outline-variant/40 elevation-card transition-shadow duration-200 hover:elevation-card-hover flex flex-col">
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{t.weight.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{t.weight.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#006B5F]">72.4</div>
                      <div className="text-xs text-on-surface-variant">{t.setup.step2.kg}</div>
                    </div>
                  </div>

                  {/* Trend Chart with area fill */}
                  <div className="h-28 w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 relative overflow-hidden">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#006B5F" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#006B5F" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Area fill */}
                      <path
                        d="M0,40 20,35 40,38 60,25 80,28 100,20 L100,50 L0,50 Z"
                        fill="url(#areaGradient)"
                      />
                      {/* Line */}
                      <polyline
                        fill="none"
                        points="0,40 20,35 40,38 60,25 80,28 100,20"
                        stroke="#006B5F"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Dots */}
                      {[[0,40],[20,35],[40,38],[60,25],[80,28],[100,20]].map(([x,y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="#006B5F" />
                      ))}
                    </svg>
                  </div>

                  <Link href="/weight" className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-[#006B5F] hover:underline underline-offset-2">
                    {t.weight.history}
                    <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
