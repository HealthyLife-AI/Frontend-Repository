"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { SetupStepHeader } from "@/components/setup/SetupStepHeader";
import { SelectCard } from "@/components/ui/SelectCard";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";
import type { ActivityLevel } from "@/lib/api/profile";

export default function SetupStep3Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const { activityLevel, setActivityLevel } = useSetupStore();
  const [value, setValue] = useState<ActivityLevel | null>(activityLevel);

  const options: { value: ActivityLevel; icon: string; title: string; desc: string }[] = [
    { value: "sedentary", icon: "chair", title: t.setup.step3.sedentary, desc: t.setup.step3.sedentaryDesc },
    { value: "light", icon: "directions_walk", title: t.setup.step3.light, desc: t.setup.step3.lightDesc },
    { value: "moderate", icon: "directions_run", title: t.setup.step3.moderate, desc: t.setup.step3.moderateDesc },
    { value: "active", icon: "fitness_center", title: t.setup.step3.active, desc: t.setup.step3.activeDesc },
    { value: "very_active", icon: "sports_gymnastics", title: t.setup.step3.veryActive, desc: t.setup.step3.veryActiveDesc },
  ];

  const handleNext = () => {
    if (!value) return;
    setActivityLevel(value);
    router.push("/setup/step-4");
  };

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
        <SetupStepHeader
          step={3}
          total={4}
          labels={[
            t.setup.steps.profile,
            t.setup.steps.metrics,
            t.setup.steps.activity,
            t.setup.steps.goals,
          ]}
          title={t.setup.step3.title}
          subtitle={t.setup.step3.subtitle}
        />

        <div className="flex flex-col gap-3">
          {options.map((opt) => (
            <SelectCard
              key={opt.value}
              name="activity_level"
              value={opt.value}
              checked={value === opt.value}
              onChange={(v) => setValue(v as ActivityLevel)}
              icon={opt.icon}
              title={opt.title}
              description={opt.desc}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/setup/step-2")}>
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            {t.common.back}
          </Button>
          <Button onClick={handleNext} disabled={!value}>
            {t.common.nextStep}
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Button>
        </div>
      </main>
    </AuthGuard>
  );
}
