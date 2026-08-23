"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";
import { getHealthProfile, type HealthProfile } from "@/lib/api/profile";
import { calculateDailyTargets, ftInToCm, lbToKg } from "@/lib/nutrition";
import type { DailyTargets } from "@/lib/nutrition";

function MacroRow({
  icon,
  label,
  grams,
  pct,
  ofDailyTotal,
  colorClass,
}: {
  icon: string;
  label: string;
  grams: number;
  pct: number;
  ofDailyTotal: string;
  colorClass?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-outline-variant/50 bg-surface-container-lowest p-4 elevation-card">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${colorClass ?? "bg-primary-container"}`}>
        <span className="material-symbols-outlined text-xl text-on-primary-container">
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">
          {pct}% {ofDailyTotal}
        </p>
      </div>
      <p className="text-lg font-bold text-on-surface tabular-nums">{grams}g</p>
    </div>
  );
}

/** Derive targets from the API HealthProfile (uses server-side or client-side calc). */
function targetsFromProfile(profile: HealthProfile): DailyTargets | null {
  // Prefer server-calculated values if present
  if (
    profile.daily_calorie_target &&
    profile.daily_protein_g !== undefined &&
    profile.daily_carbs_g !== undefined &&
    profile.daily_fats_g !== undefined
  ) {
    const calories = profile.daily_calorie_target;
    const protein_g = profile.daily_protein_g ?? 0;
    const carbs_g = profile.daily_carbs_g ?? 0;
    const fats_g = profile.daily_fats_g ?? 0;
    const totalCals = protein_g * 4 + carbs_g * 4 + fats_g * 9;
    return {
      calories,
      protein_g,
      carbs_g,
      fats_g,
      protein_pct: totalCals > 0 ? Math.round((protein_g * 4 / totalCals) * 100) : 30,
      carbs_pct: totalCals > 0 ? Math.round((carbs_g * 4 / totalCals) * 100) : 45,
      fats_pct: totalCals > 0 ? Math.round((fats_g * 9 / totalCals) * 100) : 25,
    };
  }

  // Fall back to client-side Mifflin-St Jeor calculation
  const { age, gender, activity_level, goal } = profile;
  const heightCm = (profile.height_cm as number | undefined) ?? 170;
  const weightKg = (profile.weight_kg as number | undefined) ?? 70;
  if (!age || !gender || !activity_level || !goal) return null;
  return calculateDailyTargets({ age, gender, heightCm, weightKg, activityLevel: activity_level, goal });
}

export default function SetupResultsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useSetupStore();

  const [apiProfile, setApiProfile] = useState<HealthProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // If the setupStore is populated (just finished wizard), use it directly.
  const storeTargets = useMemo(() => {
    if (!setup.age || !setup.gender || !setup.activityLevel || !setup.goal) return null;
    const heightCm =
      setup.heightUnit === "cm"
        ? (setup.heightCm ?? 0)
        : ftInToCm(setup.heightFt ?? 0, setup.heightIn ?? 0);
    const weightKg =
      setup.weightUnit === "kg" ? (setup.weightKg ?? 0) : lbToKg(setup.weightLb ?? 0);
    return calculateDailyTargets({
      age: setup.age,
      gender: setup.gender,
      heightCm,
      weightKg,
      activityLevel: setup.activityLevel,
      goal: setup.goal,
    });
  }, [setup]);

  // If store is empty (e.g. navigated from dashboard sidebar), fetch from API.
  useEffect(() => {
    if (storeTargets) return; // Already have data from wizard flow
    setLoading(true);
    getHealthProfile()
      .then((profile) => setApiProfile(profile))
      .catch(() => setApiProfile(null))
      .finally(() => setLoading(false));
  }, [storeTargets]);

  const targets: DailyTargets | null = storeTargets ?? (apiProfile ? targetsFromProfile(apiProfile) : null);

  const handleEnterDashboard = () => {
    setup.reset();
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center animate-fade-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container shadow-[0_4px_16px_rgba(0,107,95,0.2)]">
            <span className="material-symbols-outlined text-3xl text-on-primary-container">
              auto_awesome
            </span>
          </div>
          <h1 className="text-2xl font-bold text-on-surface">
            {t.setup.results.title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-on-surface-variant">
            {t.setup.results.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl animate-spin" style={{ animationDuration: "1s" }}>
              progress_activity
            </span>
            <p className="text-sm">{t.common.loading}</p>
          </div>
        ) : targets ? (
          <div className="animate-fade-up animate-fade-up-delay-1">
            {/* Calorie Hero */}
            <div className="rounded-2xl bg-primary-container p-6 text-center text-on-primary-container elevation-card">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#006B5F]/15">
                <span className="material-symbols-outlined text-2xl text-[#006B5F]">
                  local_fire_department
                </span>
              </div>
              <p className="mt-3 text-sm font-medium opacity-80">
                {t.setup.results.calorieTarget}
              </p>
              <p className="text-5xl font-bold tracking-tight text-[#006B5F] mt-1">
                {targets.calories.toLocaleString()}
                <span className="text-xl font-semibold opacity-70 ms-1">{t.setup.results.kcal}</span>
              </p>
              <p className="mt-2 text-xs opacity-60">
                {t.setup.results.calorieSubtitle}
              </p>
            </div>

            {/* Macros */}
            <div className="mt-4 flex flex-col gap-3 animate-fade-up animate-fade-up-delay-2">
              <MacroRow
                icon="fitness_center"
                label={t.setup.results.protein}
                grams={targets.protein_g}
                pct={targets.protein_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
                colorClass="bg-[#d7efea]"
              />
              <MacroRow
                icon="agriculture"
                label={t.setup.results.carbs}
                grams={targets.carbs_g}
                pct={targets.carbs_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
                colorClass="bg-tertiary-container/50"
              />
              <MacroRow
                icon="water_drop"
                label={t.setup.results.fats}
                grams={targets.fats_g}
                pct={targets.fats_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
                colorClass="bg-secondary-container/40"
              />
            </div>
          </div>
        ) : (
          /* Fallback: no data at all */
          <div className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-8 text-center elevation-card">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              person_search
            </span>
            <p className="mt-3 text-sm font-semibold text-on-surface">{t.common.errorGeneric}</p>
            <p className="mt-1 text-xs text-on-surface-variant">
              Complete your health profile to see personalized targets.
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 animate-fade-up animate-fade-up-delay-3">
          <Button
            fullWidth
            onClick={handleEnterDashboard}
            className="bg-[#006B5F] hover:bg-[#00574d] text-white py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,107,95,0.30)] hover:shadow-[0_6px_20px_rgba(0,107,95,0.40)] transition-all duration-200"
          >
            {t.setup.results.enterDashboard}
            <span className="material-symbols-outlined text-base ms-1 rtl:rotate-180">
              arrow_forward
            </span>
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push("/setup/step-1")}
            className="rounded-xl border border-outline-variant/60"
          >
            <span className="material-symbols-outlined text-base me-1">tune</span>
            {t.setup.steps.profile}
          </Button>
        </div>
      </main>
    </AuthGuard>
  );
}
