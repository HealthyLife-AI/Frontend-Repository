"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";
import { calculateDailyTargets, ftInToCm, lbToKg } from "@/lib/nutrition";

function MacroRow({
  icon,
  label,
  grams,
  pct,
  ofDailyTotal,
}: {
  icon: string;
  label: string;
  grams: number;
  pct: number;
  ofDailyTotal: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
      <span className="material-symbols-outlined text-2xl text-tertiary">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-xs text-on-surface-variant">
          {pct}% {ofDailyTotal}
        </p>
      </div>
      <p className="text-lg font-bold text-on-surface">{grams}g</p>
    </div>
  );
}

export default function SetupResultsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useSetupStore();

  const targets = useMemo(() => {
    if (!setup.age || !setup.gender || !setup.activityLevel || !setup.goal) {
      return null;
    }
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

  const handleEnterDashboard = () => {
    setup.reset();
    router.push("/dashboard");
  };

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6 py-12">
        <div className="mb-8 text-center">
          <span className="material-symbols-outlined text-4xl text-primary">
            auto_awesome
          </span>
          <h1 className="mt-3 text-2xl font-bold text-on-surface">
            {t.setup.results.title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-on-surface-variant">
            {t.setup.results.subtitle}
          </p>
        </div>

        {targets ? (
          <>
            <div className="rounded-xl bg-primary-container p-6 text-center text-on-primary-container elevation-card">
              <span className="material-symbols-outlined text-3xl">
                local_fire_department
              </span>
              <p className="mt-2 text-sm opacity-90">
                {t.setup.results.calorieTarget}
              </p>
              <p className="text-4xl font-bold">
                {targets.calories.toLocaleString()}{" "}
                <span className="text-lg font-medium">{t.setup.results.kcal}</span>
              </p>
              <p className="mt-1 text-xs opacity-80">
                {t.setup.results.calorieSubtitle}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <MacroRow
                icon="fitness_center"
                label={t.setup.results.protein}
                grams={targets.protein_g}
                pct={targets.protein_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
              />
              <MacroRow
                icon="agriculture"
                label={t.setup.results.carbs}
                grams={targets.carbs_g}
                pct={targets.carbs_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
              />
              <MacroRow
                icon="water_drop"
                label={t.setup.results.fats}
                grams={targets.fats_g}
                pct={targets.fats_pct}
                ofDailyTotal={t.setup.results.ofDailyTotal}
              />
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-on-surface-variant">
            {t.common.errorGeneric}
          </p>
        )}

        <Button fullWidth className="mt-8" onClick={handleEnterDashboard}>
          {t.setup.results.enterDashboard}
          <span className="material-symbols-outlined text-base">
            arrow_forward
          </span>
        </Button>
      </main>
    </AuthGuard>
  );
}
