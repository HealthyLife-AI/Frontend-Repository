"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { getHealthProfile, type NutritionTarget } from "@/lib/api/profile";
import { listWeightLogs, type WeightLog } from "@/lib/api/weightLogs";

const CIRCUMFERENCE = 251.2;

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [target, setTarget] = useState<NutritionTarget | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([getHealthProfile(), listWeightLogs()]).then(([profileRes, logsRes]) => {
      if (profileRes.status === "fulfilled") {
        setTarget(profileRes.value.nutrition_target);
      }
      if (logsRes.status === "fulfilled" && Array.isArray(logsRes.value)) {
        setWeightLogs(logsRes.value);
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      useAuthStore.getState().clear();
      router.replace("/login");
    }
  };

  // القيم المستهدفة (حقيقية من الباك اند). "المستهلك" لسا 0 لحد ما سبرنت 3 يضيف تسجيل الوجبات.
  const dailyCalorieTarget = target ? Math.round(parseFloat(target.daily_calories)) : null;
  const proteinTarget = target ? Math.round(parseFloat(target.protein_g)) : null;
  const carbsTarget = target ? Math.round(parseFloat(target.carbs_g)) : null;
  const fatsTarget = target ? Math.round(parseFloat(target.fat_g)) : null;
  const consumedCalories = 0; // TODO: سبرنت 3 — يُحسب من الوجبات المسجّلة باليوم
  const ringOffset = dailyCalorieTarget
    ? CIRCUMFERENCE * (1 - Math.min(consumedCalories / dailyCalorieTarget, 1))
    : CIRCUMFERENCE;

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;

  // نبني مخطط بسيط من آخر 6 تسجيلات وزن حقيقية (بدل النقاط الثابتة السابقة)
  const trend = useMemo(() => {
    const points = weightLogs.slice(-6);
    if (points.length < 2) return null;

    const weights = points.map((p) => Number(p.weight_kg));
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;

    const coords = points.map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 45 - ((Number(p.weight_kg) - min) / range) * 35;
      return [x, y] as const;
    });

    const polyline = coords.map(([x, y]) => `${x},${y}`).join(" ");
    const area = `M0,50 ${coords.map(([x, y]) => `${x},${y}`).join(" ")} L100,50 Z`;

    return { coords, polyline, area };
  }, [weightLogs]);

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <aside className="hidden md:flex w-64 flex-col border-e border-outline-variant/60 bg-surface shrink-0 elevation-card">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006B5F] shadow-[0_2px_8px_rgba(0,107,95,0.35)]">
              <span className="material-symbols-outlined text-xl text-white">nutrition</span>
            </div>
            <span className="text-base font-bold text-on-surface">{t.common.appName}</span>
          </div>

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
              href="/profile"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors duration-150"
            >
              <span className="material-symbols-outlined">person</span>
              <span>{t.setup.steps.profile}</span>
            </Link>
          </nav>

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
          <header className="h-16 bg-surface/80 backdrop-blur-sm border-b border-outline-variant/60 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3">
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

          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-background">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-4xl animate-spin text-primary"
                  style={{ animationDuration: "1s" }}
                >
                  progress_activity
                </span>
                <p className="mt-3 text-sm">{t.common.loading}</p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5 animate-fade-up">
                {/* ── Left Column ─────────────────────────────────────── */}
                <div className="lg:w-2/3 flex flex-col gap-5">
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

                    {!target ? (
                      <div className="rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-6 text-center text-sm text-on-surface-variant">
                        <Link href="/profile" className="font-semibold text-[#006B5F] hover:underline">
                          {t.setup.steps.profile}
                        </Link>{" "}
                        — complete your health profile to see your daily targets.
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-2">
                        {/* Progress Ring */}
                        <div className="relative w-44 h-44 flex-shrink-0">
                          <div className="absolute inset-8 rounded-full bg-[#006B5F]/8 blur-xl" />
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50" cy="50" r="40" fill="transparent"
                              stroke="currentColor" strokeWidth="7"
                              className="text-surface-container-high"
                            />
                            <circle
                              cx="50" cy="50" r="40" fill="transparent"
                              stroke="url(#ringGradient)" strokeWidth="7"
                              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={ringOffset}
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
                            <span className="text-3xl font-bold text-[#006B5F]">{consumedCalories.toLocaleString()}</span>
                            <span className="text-xs text-on-surface-variant mt-0.5">
                              / {dailyCalorieTarget?.toLocaleString()} {t.setup.results.kcal}
                            </span>
                          </div>
                        </div>

                        {/* Macros — الهدف حقيقي، المستهلك 0 مؤقتًا (بانتظار سبرنت 3) */}
                        <div className="flex flex-col gap-5 w-full md:w-64">
                          <div className="animate-fade-up animate-fade-up-delay-1">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                              <span className="text-on-surface">{t.setup.results.protein}</span>
                              <span className="text-on-surface-variant tabular-nums">0g / {proteinTarget}g</span>
                            </div>
                            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-[#006B5F] rounded-full progress-fill" style={{ width: "0%" }} />
                            </div>
                          </div>

                          <div className="animate-fade-up animate-fade-up-delay-2">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                              <span className="text-on-surface">{t.setup.results.carbs}</span>
                              <span className="text-on-surface-variant tabular-nums">0g / {carbsTarget}g</span>
                            </div>
                            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-tertiary rounded-full progress-fill" style={{ width: "0%" }} />
                            </div>
                          </div>

                          <div className="animate-fade-up animate-fade-up-delay-3">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                              <span className="text-on-surface">{t.setup.results.fats}</span>
                              <span className="text-on-surface-variant tabular-nums">0g / {fatsTarget}g</span>
                            </div>
                            <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full progress-fill" style={{ width: "0%" }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right Column ─────────────────────────────────────── */}
                <div className="lg:w-1/3 flex flex-col gap-5">
                  <div className="bg-surface rounded-2xl p-6 border border-outline-variant/40 elevation-card transition-shadow duration-200 hover:elevation-card-hover flex flex-col">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-sm font-bold text-on-surface">{t.weight.title}</h3>
                        <p className="text-xs text-on-surface-variant mt-0.5">{t.weight.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#006B5F]">
                          {latestWeight ? Number(latestWeight.weight_kg).toFixed(1) : "--"}
                        </div>
                        <div className="text-xs text-on-surface-variant">{t.setup.step2.kg}</div>
                      </div>
                    </div>

                    <div className="h-28 w-full rounded-xl bg-surface-container-lowest border border-outline-variant/20 relative overflow-hidden">
                      {trend ? (
                        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                          <defs>
                            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#006B5F" stopOpacity="0.15" />
                              <stop offset="100%" stopColor="#006B5F" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={trend.area} fill="url(#areaGradient)" />
                          <polyline
                            fill="none"
                            points={trend.polyline}
                            stroke="#006B5F"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          {trend.coords.map(([x, y], i) => (
                            <circle key={i} cx={x} cy={y} r="2.5" fill="#006B5F" />
                          ))}
                        </svg>
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-on-surface-variant px-4 text-center">
                          {t.weight.empty}
                        </div>
                      )}
                    </div>

                    <Link href="/weight" className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-[#006B5F] hover:underline underline-offset-2">
                      {t.weight.history}
                      <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}