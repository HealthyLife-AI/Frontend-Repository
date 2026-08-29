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
import { type FoodItem } from "@/lib/api/foods";
import {
  getMealsForDate,
  type DailyMealsSummary,
  type MealType,
  type LoggedMealItem,
} from "@/lib/api/meals";
import { FoodSearchModal } from "@/components/meals/FoodSearchModal";
import { AddFoodModal } from "@/components/meals/AddFoodModal";
import { EditMealItemModal } from "@/components/meals/EditMealItemModal";
import { MealSlotCard } from "@/components/meals/MealSlotCard";

const CIRCUMFERENCE = 251.2;

function todayIso(): string {
  return new Date().toISOString().split("T")[0];
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const [target, setTarget] = useState<NutritionTarget | null>(null);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [dailyMeals, setDailyMeals] = useState<DailyMealsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [editingItem, setEditingItem] = useState<LoggedMealItem | null>(null);

  const fetchDashboardData = () => {
    const today = todayIso();
    Promise.allSettled([
      getHealthProfile(),
      listWeightLogs(),
      getMealsForDate(today),
    ]).then(([profileRes, logsRes, mealsRes]) => {
      if (profileRes.status === "fulfilled") {
        setTarget(profileRes.value.nutrition_target);
      }
      if (logsRes.status === "fulfilled" && Array.isArray(logsRes.value)) {
        setWeightLogs(logsRes.value);
      }
      if (mealsRes.status === "fulfilled") {
        setDailyMeals(mealsRes.value);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      useAuthStore.getState().clear();
      router.replace("/login");
    }
  };

  // Target values from backend API
  const dailyCalorieTarget = target ? Math.round(parseFloat(target.daily_calories)) : null;
  const proteinTarget = target ? Math.round(parseFloat(target.protein_g)) : null;
  const carbsTarget = target ? Math.round(parseFloat(target.carbs_g)) : null;
  const fatsTarget = target ? Math.round(parseFloat(target.fat_g)) : null;

  // Consumed values calculated live from API meals response
  const consumedCalories = dailyMeals?.total_calories || 0;
  const consumedProtein = dailyMeals?.total_protein || 0;
  const consumedCarbs = dailyMeals?.total_carbs || 0;
  const consumedFats = dailyMeals?.total_fats || 0;

  const ringOffset = dailyCalorieTarget
    ? CIRCUMFERENCE * (1 - Math.min(consumedCalories / dailyCalorieTarget, 1))
    : CIRCUMFERENCE;

  const proteinPct = proteinTarget ? Math.min(Math.round((consumedProtein / proteinTarget) * 100), 100) : 0;
  const carbsPct = carbsTarget ? Math.min(Math.round((consumedCarbs / carbsTarget) * 100), 100) : 0;
  const fatsPct = fatsTarget ? Math.min(Math.round((consumedFats / fatsTarget) * 100), 100) : 0;

  const latestWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1] : null;
  const previousWeight = weightLogs.length > 1 ? weightLogs[weightLogs.length - 2] : null;
  const weightDelta = latestWeight && previousWeight
    ? (Number(latestWeight.weight_kg) - Number(previousWeight.weight_kg)).toFixed(1)
    : null;

  const remainingCalories = dailyCalorieTarget
    ? Math.max(dailyCalorieTarget - consumedCalories, 0)
    : null;

  // Weight Trend Line
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

  // Handle open food search for meal slot
  const handleOpenSearch = (mealType: MealType) => {
    setActiveMealType(mealType);
    setSearchModalOpen(true);
  };

  const handleSelectFood = (food: FoodItem) => {
    setSearchModalOpen(false);
    setSelectedFood(food);
  };

  const mealSlots: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const mealsByType = useMemo(() => {
    const map: Record<string, any> = {};
    dailyMeals?.meals.forEach((m) => {
      map[m.meal_type] = m;
    });
    return map;
  }, [dailyMeals]);

  const navLinks = [
    { href: "/dashboard", icon: "space_dashboard", label: t.dashboard.title, active: true },
    { href: "/weight", icon: "monitor_weight", label: t.weight.title },
    { href: "/profile", icon: "manage_accounts", label: t.setup.steps.profile },
  ];

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* ── Premium Sidebar ─────────────────────────────────────────── */}
        <aside className="hidden md:flex w-64 flex-col border-e border-outline-variant/40 bg-surface shrink-0 relative">
          {/* Subtle top accent line */}
          <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-r from-[#006B5F] via-[#4cd5bf] to-transparent" />

          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-5 border-b border-outline-variant/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006B5F] to-[#00897B] p-1.5 shadow-[0_4px_12px_rgba(0,107,95,0.35)]">
              <img src="/images/logo.png" alt="HealthyLife AI" className="h-full w-full object-contain" />
            </div>
            <div>
              <span className="text-sm font-bold text-on-surface leading-tight block">{t.common.appName}</span>
              <span className="text-[10px] text-on-surface-variant/70 font-medium">AI Nutrition</span>
            </div>
          </div>

          {/* User info card */}
          {user && (
            <div className="mx-3 mt-4 rounded-2xl bg-gradient-to-br from-[#006B5F]/8 to-[#006B5F]/4 border border-[#006B5F]/10 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#006B5F] to-[#00897B] text-xs font-black text-white shadow-sm">
                  {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-on-surface truncate">{user.full_name || user.email}</p>
                  <p className="text-[10px] text-on-surface-variant/70 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group ${
                  link.active
                    ? "bg-gradient-to-r from-[#006B5F]/12 to-[#006B5F]/5 text-[#006B5F] font-semibold relative"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                {link.active && (
                  <div className="absolute start-0 top-1/4 bottom-1/4 w-0.5 rounded-e-full bg-[#006B5F]" />
                )}
                <span className={`material-symbols-outlined text-xl ${link.active ? "text-[#006B5F]" : "group-hover:text-on-surface"}`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-outline-variant/30 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-error-container/40 hover:text-error transition-all duration-200"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              <span>{t.dashboard.logout}</span>
            </button>
          </div>
        </aside>

        {/* ── Main Content ─────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex md:hidden h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#006B5F] to-[#00897B] p-1.5 shadow-md">
                <img src="/images/logo.png" alt="HealthyLife AI" className="h-full w-full object-contain" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-on-surface leading-tight">
                  {user?.full_name ? `مرحباً، ${user.full_name.split(" ")[0]}! 👋` : t.dashboard.title}
                </h1>
                <p className="text-[11px] text-on-surface-variant" suppressHydrationWarning>
                  {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center justify-center h-9 w-9 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 bg-background">
            {loading ? (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-on-surface-variant gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-[#006B5F]/20" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-[#006B5F] animate-spin" />
                </div>
                <p className="text-sm font-medium">{t.common.loading}</p>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-fade-up">
                {/* ── Summary Stats Row ─────────────────────────────────── */}
                {target && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Calories */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#006B5F] to-[#004D44] p-4 text-white col-span-2 lg:col-span-1 relative overflow-hidden">
                      <div className="absolute -top-4 -end-4 h-20 w-20 rounded-full bg-white/5" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Calories</p>
                      <p className="mt-1 text-3xl font-black tabular-nums">{consumedCalories.toLocaleString()}</p>
                      <p className="text-xs text-white/60">of {dailyCalorieTarget?.toLocaleString()} kcal</p>
                    </div>
                    {/* Protein */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 p-4 elevation-card">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Protein</p>
                      <p className="mt-1 text-2xl font-black text-[#006B5F] tabular-nums">{Math.round(consumedProtein)}<span className="text-xs font-normal text-on-surface-variant ms-1">g</span></p>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div className="h-full bg-[#006B5F] rounded-full progress-fill" style={{ width: `${proteinPct}%` }} />
                      </div>
                    </div>
                    {/* Carbs */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 p-4 elevation-card">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Carbs</p>
                      <p className="mt-1 text-2xl font-black text-amber-500 tabular-nums">{Math.round(consumedCarbs)}<span className="text-xs font-normal text-on-surface-variant ms-1">g</span></p>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div className="h-full bg-amber-400 rounded-full progress-fill" style={{ width: `${carbsPct}%` }} />
                      </div>
                    </div>
                    {/* Fats */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 p-4 elevation-card">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Fats</p>
                      <p className="mt-1 text-2xl font-black text-indigo-500 tabular-nums">{Math.round(consumedFats)}<span className="text-xs font-normal text-on-surface-variant ms-1">g</span></p>
                      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                        <div className="h-full bg-indigo-400 rounded-full progress-fill" style={{ width: `${fatsPct}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Main Grid ─────────────────────────────────────────── */}
                <div className="flex flex-col lg:flex-row gap-5">
                  {/* Left Column */}
                  <div className="lg:w-2/3 flex flex-col gap-5">
                    {/* Calorie Ring Card */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 overflow-hidden elevation-card">
                      {/* Card Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/20">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006B5F] text-xl">local_fire_department</span>
                          <h2 className="text-sm font-bold text-on-surface">{t.setup.results.calorieTarget}</h2>
                        </div>
                        <button
                          onClick={() => handleOpenSearch("breakfast")}
                          className="group flex items-center gap-1.5 rounded-xl border border-[#006B5F]/20 bg-[#006B5F]/5 px-3.5 py-2 text-xs font-bold text-[#006B5F] transition-all duration-200 hover:bg-[#006B5F] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(0,107,95,0.3)] active:scale-[0.97]"
                        >
                          <span className="material-symbols-outlined text-base transition-transform group-hover:rotate-90">add</span>
                          {t.meals?.addFood}
                        </button>
                      </div>

                      <div className="p-6">
                        {!target ? (
                          <div className="rounded-2xl border border-dashed border-outline-variant/40 p-8 text-center">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">person_add</span>
                            <p className="mt-3 text-sm text-on-surface-variant">
                              <Link href="/profile" className="font-bold text-[#006B5F] hover:underline underline-offset-2">
                                أكمل ملفك الصحي
                              </Link>{" "}
                              لرؤية أهدافك اليومية
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
                            {/* Progress Ring */}
                            <div className="relative w-44 h-44 flex-shrink-0">
                              <div className="absolute inset-8 rounded-full bg-[#006B5F]/8 blur-2xl" />
                              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                <circle
                                  cx="50" cy="50" r="40" fill="transparent"
                                  stroke="currentColor" strokeWidth="8"
                                  className="text-surface-container-high"
                                />
                                <circle
                                  cx="50" cy="50" r="40" fill="transparent"
                                  stroke="url(#ringGrad)" strokeWidth="8"
                                  strokeDasharray={CIRCUMFERENCE} strokeDashoffset={ringOffset}
                                  strokeLinecap="round"
                                  className="ring-animated"
                                />
                                <defs>
                                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#4cd5bf" />
                                    <stop offset="100%" stopColor="#006B5F" />
                                  </linearGradient>
                                </defs>
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-[#006B5F] tabular-nums" suppressHydrationWarning>
                                  {consumedCalories.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-on-surface-variant font-medium mt-0.5" suppressHydrationWarning>
                                  / {dailyCalorieTarget?.toLocaleString()} kcal
                                </span>
                                {remainingCalories !== null && (
                                  <span className="mt-1 rounded-full bg-primary-container/60 px-2 py-0.5 text-[9px] font-bold text-[#006B5F]">
                                    {remainingCalories} متبقٍ
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Macro Bars */}
                            <div className="flex flex-col gap-4 w-full md:w-64">
                              <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-[#006B5F]" />
                                    {t.setup.results.protein}
                                  </span>
                                  <span className="text-on-surface-variant tabular-nums">{Math.round(consumedProtein)}g / {proteinTarget}g</span>
                                </div>
                                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                  <div className="h-full bg-[#006B5F] rounded-full progress-fill" style={{ width: `${proteinPct}%` }} />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                                    {t.setup.results.carbs}
                                  </span>
                                  <span className="text-on-surface-variant tabular-nums">{Math.round(consumedCarbs)}g / {carbsTarget}g</span>
                                </div>
                                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                  <div className="h-full bg-amber-400 rounded-full progress-fill" style={{ width: `${carbsPct}%` }} />
                                </div>
                              </div>

                              <div>
                                <div className="flex justify-between text-xs font-semibold mb-1.5">
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-2 w-2 rounded-full bg-indigo-400" />
                                    {t.setup.results.fats}
                                  </span>
                                  <span className="text-on-surface-variant tabular-nums">{Math.round(consumedFats)}g / {fatsTarget}g</span>
                                </div>
                                <div className="h-2.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-400 rounded-full progress-fill" style={{ width: `${fatsPct}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Meal Slots */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006B5F]">restaurant_menu</span>
                          <h2 className="text-base font-bold text-on-surface">{t.meals?.title}</h2>
                        </div>
                        <span className="text-xs text-on-surface-variant/60 font-medium" suppressHydrationWarning>
                          {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mealSlots.map((type) => (
                          <MealSlotCard
                            key={type}
                            mealType={type}
                            meal={mealsByType[type]}
                            onOpenSearch={handleOpenSearch}
                            onEditItem={(item) => setEditingItem(item)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="lg:w-1/3 flex flex-col gap-4">
                    {/* Quick Actions */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 p-5 elevation-card">
                      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">Quick Actions</h3>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/weight"
                          className="group flex items-center gap-3 rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition-all hover:border-[#006B5F]/40 hover:bg-[#006B5F]/5 hover:text-[#006B5F]"
                        >
                          <span className="material-symbols-outlined text-xl text-on-surface-variant group-hover:text-[#006B5F] transition-colors">monitor_weight</span>
                          <div className="flex-1">
                            <p className="text-xs font-bold">{t.weight.logWeight}</p>
                            {latestWeight && (
                              <p className="text-[10px] text-on-surface-variant">{t.weight.latest}: {Number(latestWeight.weight_kg).toFixed(1)} kg</p>
                            )}
                          </div>
                          <span className="material-symbols-outlined text-sm text-on-surface-variant/40 rtl:rotate-180 group-hover:text-[#006B5F] transition-colors">arrow_forward_ios</span>
                        </Link>

                        <Link
                          href="/profile"
                          className="group flex items-center gap-3 rounded-xl border border-outline-variant/25 bg-surface-container-lowest px-4 py-3 text-sm font-semibold text-on-surface transition-all hover:border-[#006B5F]/40 hover:bg-[#006B5F]/5 hover:text-[#006B5F]"
                        >
                          <span className="material-symbols-outlined text-xl text-on-surface-variant group-hover:text-[#006B5F] transition-colors">manage_accounts</span>
                          <div className="flex-1">
                            <p className="text-xs font-bold">{t.setup.steps.profile}</p>
                            <p className="text-[10px] text-on-surface-variant">{target ? "Profile saved ✓" : "Complete your profile"}</p>
                          </div>
                          <span className="material-symbols-outlined text-sm text-on-surface-variant/40 rtl:rotate-180 group-hover:text-[#006B5F] transition-colors">arrow_forward_ios</span>
                        </Link>
                      </div>
                    </div>

                    {/* Weight Card */}
                    <div className="rounded-2xl bg-surface border border-outline-variant/30 p-5 elevation-card">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#006B5F]">insights</span>
                          <h3 className="text-sm font-bold text-on-surface">{t.weight.title}</h3>
                        </div>
                        {latestWeight && (
                          <div className="text-right">
                            <div className="text-lg font-black text-[#006B5F]">
                              {Number(latestWeight.weight_kg).toFixed(1)}
                              <span className="text-xs font-normal text-on-surface-variant ms-1">kg</span>
                            </div>
                            {weightDelta && (
                              <div className={`text-[10px] font-bold ${Number(weightDelta) <= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                                {Number(weightDelta) > 0 ? "+" : ""}{weightDelta} kg
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="h-24 w-full rounded-xl bg-surface-container-lowest border border-outline-variant/15 relative overflow-hidden">
                        {trend ? (
                          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 50">
                            <defs>
                              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#006B5F" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#006B5F" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <path d={trend.area} fill="url(#areaGrad)" />
                            <polyline
                              fill="none"
                              points={trend.polyline}
                              stroke="#006B5F"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {trend.coords.map(([x, y], i) => (
                              <circle key={i} cx={x} cy={y} r="2.5" fill="white" stroke="#006B5F" strokeWidth="1.5" />
                            ))}
                          </svg>
                        ) : (
                          <div className="flex h-full items-center justify-center flex-col gap-1 text-on-surface-variant/40">
                            <span className="material-symbols-outlined text-2xl">show_chart</span>
                            <p className="text-[10px]">{t.weight.empty}</p>
                          </div>
                        )}
                      </div>

                      <Link href="/weight" className="mt-3 flex items-center justify-end gap-1 text-xs font-bold text-[#006B5F] hover:underline underline-offset-2 transition-all">
                        {t.weight.history}
                        <span className="material-symbols-outlined text-sm rtl:rotate-180">arrow_forward</span>
                      </Link>
                    </div>

                    {/* Tip Card */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#006B5F]/10 to-[#4cd5bf]/5 border border-[#006B5F]/15 p-5">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[#006B5F]/15 text-[#006B5F]">
                          <span className="material-symbols-outlined text-base">lightbulb</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#006B5F]">نصيحة اليوم</p>
                          <p className="mt-1 text-[11px] text-on-surface-variant leading-relaxed">
                            احرص على شرب ٨ أكواب من الماء يومياً. الترطيب الجيد يدعم عملية الأيض ويساعد على حرق السعرات.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <FoodSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        mealType={activeMealType}
        onSelectFood={handleSelectFood}
      />

      <AddFoodModal
        food={selectedFood}
        mealType={activeMealType}
        date={todayIso()}
        onClose={() => setSelectedFood(null)}
        onSuccess={fetchDashboardData}
      />

      <EditMealItemModal
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSuccess={fetchDashboardData}
      />
    </AuthGuard>
  );
}