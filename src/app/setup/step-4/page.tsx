"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { SetupStepHeader } from "@/components/setup/SetupStepHeader";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";
import { saveHealthProfile, type Goal, type ProfilePayload } from "@/lib/api/profile";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

export default function SetupStep4Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const setup = useSetupStore();
  const [value, setValue] = useState<Goal | null>(setup.goal);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options: { value: Goal; icon: string; title: string; desc: string }[] = [
    { value: "lose", icon: "trending_down", title: t.setup.step4.lose, desc: t.setup.step4.loseDesc },
    { value: "maintain", icon: "balance", title: t.setup.step4.maintain, desc: t.setup.step4.maintainDesc },
    { value: "gain", icon: "fitness_center", title: t.setup.step4.gain, desc: t.setup.step4.gainDesc },
  ];

  const handleFinish = async () => {
    if (!value || !setup.age || !setup.gender || !setup.activityLevel) return;
    setup.setGoal(value);
    setSubmitting(true);
    setError(null);

    try {
      const payload: ProfilePayload =
        setup.heightUnit === "cm"
          ? {
              age: setup.age,
              gender: setup.gender,
              height_unit: "cm",
              height_cm: setup.heightCm ?? 0,
              weight_unit: "kg",
              weight_kg: setup.weightKg ?? 0,
              activity_level: setup.activityLevel,
              goal: value,
            }
          : {
              age: setup.age,
              gender: setup.gender,
              height_unit: "ft_in",
              height_ft: setup.heightFt ?? 0,
              height_in: setup.heightIn ?? 0,
              weight_unit: "lb",
              weight_lb: setup.weightLb ?? 0,
              activity_level: setup.activityLevel,
              goal: value,
            };

      await saveHealthProfile(payload);
      useAuthStore.getState().setHasHealthProfile(true);
      router.push("/setup/results");
    } catch (err) {
      setError(extractErrorMessage(err, t.common.errorGeneric));
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
        <SetupStepHeader
          step={4}
          total={4}
          labels={[
            t.setup.steps.profile,
            t.setup.steps.metrics,
            t.setup.steps.activity,
            t.setup.steps.goals,
          ]}
          title={t.setup.step4.title}
          subtitle={t.setup.step4.subtitle}
        />

        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4">
          {options.map((opt) => (
            <SelectCard
              key={opt.value}
              name="goal"
              value={opt.value}
              checked={value === opt.value}
              onChange={(v) => setValue(v as Goal)}
              icon={opt.icon}
              title={opt.title}
              description={opt.desc}
              layout="column"
            />
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-error-container px-4 py-2 text-center text-sm text-on-error-container">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/setup/step-3")}>
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            {t.common.back}
          </Button>
          <Button onClick={handleFinish} disabled={!value} loading={submitting}>
            {t.setup.step4.finish}
            <span className="material-symbols-outlined text-base">check</span>
          </Button>
        </div>
      </main>
    </AuthGuard>
  );
}
