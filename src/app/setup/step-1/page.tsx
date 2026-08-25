"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { SetupStepHeader } from "@/components/setup/SetupStepHeader";
import { SelectCard } from "@/components/ui/SelectCard";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";
import type { Gender } from "@/lib/api/profile";

export default function SetupStep1Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const { age, gender, setStep1 } = useSetupStore();

  const [ageValue, setAgeValue] = useState(age ? String(age) : "");
  const [genderValue, setGenderValue] = useState<Gender | null>(gender);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const parsedAge = Number(ageValue);
    if (!ageValue || Number.isNaN(parsedAge) || parsedAge < 10 || parsedAge > 120) {
      setError("invalid_age");
      return;
    }
    if (!genderValue) {
      setError("invalid_gender");
      return;
    }
    setStep1({ age: parsedAge, gender: genderValue });
    router.push("/setup/step-2");
  };

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
        <SetupStepHeader
          step={1}
          total={4}
          labels={[
            t.setup.steps.profile,
            t.setup.steps.metrics,
            t.setup.steps.activity,
            t.setup.steps.goals,
          ]}
          title={t.setup.step1.title}
          subtitle={t.setup.step1.subtitle}
        />

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 elevation-card">
          <h2 className="mb-4 text-sm font-semibold text-on-surface">
            {t.setup.step1.sectionTitle}
          </h2>

          <div className="flex flex-col gap-6">
            <TextField
              label={t.setup.step1.age}
              type="number"
              icon="calendar_today"
              min={13}
              max={120}
              value={ageValue}
              onChange={(e) => setAgeValue(e.target.value)}
              error={error === "invalid_age" ? " " : undefined}
            />

            <div>
              <label className="mb-2 block text-xs font-medium text-on-surface-variant">
                {t.setup.step1.gender}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <SelectCard
                  name="gender"
                  value="female"
                  checked={genderValue === "female"}
                  onChange={(v) => setGenderValue(v as Gender)}
                  icon="female"
                  title={t.setup.step1.genderFemale}
                  layout="column"
                />
                <SelectCard
                  name="gender"
                  value="male"
                  checked={genderValue === "male"}
                  onChange={(v) => setGenderValue(v as Gender)}
                  icon="male"
                  title={t.setup.step1.genderMale}
                  layout="column"
                />

              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleNext}>
            {t.common.next}
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </Button>
        </div>
      </main>
    </AuthGuard>
  );
}
