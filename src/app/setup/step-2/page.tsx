"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { SetupStepHeader } from "@/components/setup/SetupStepHeader";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useSetupStore } from "@/store/setupStore";

function UnitToggle({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-outline-variant bg-surface-container p-1 text-xs font-semibold">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={clsx(
            "rounded-full px-3 py-1.5 transition-colors",
            value === opt.value
              ? "bg-primary text-on-primary"
              : "text-on-surface-variant",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function SetupStep2Page() {
  const { t } = useTranslation();
  const router = useRouter();
  const store = useSetupStore();

  const [heightUnit, setHeightUnit] = useState(store.heightUnit);
  const [weightUnit, setWeightUnit] = useState(store.weightUnit);
  const [heightCm, setHeightCm] = useState(store.heightCm ? String(store.heightCm) : "");
  const [heightFt, setHeightFt] = useState(store.heightFt ? String(store.heightFt) : "");
  const [heightIn, setHeightIn] = useState(store.heightIn ? String(store.heightIn) : "");
  const [weightKg, setWeightKg] = useState(store.weightKg ? String(store.weightKg) : "");
  const [weightLb, setWeightLb] = useState(store.weightLb ? String(store.weightLb) : "");

  const handleNext = () => {
    store.setStep2({
      heightUnit: heightUnit as "cm" | "ft_in",
      weightUnit: weightUnit as "kg" | "lb",
      heightCm: heightCm ? Number(heightCm) : null,
      heightFt: heightFt ? Number(heightFt) : null,
      heightIn: heightIn ? Number(heightIn) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      weightLb: weightLb ? Number(weightLb) : null,
    });
    router.push("/setup/step-3");
  };

  const canProceed =
    (heightUnit === "cm" ? !!heightCm : !!heightFt && heightIn !== "") &&
    (weightUnit === "kg" ? !!weightKg : !!weightLb);

  return (
    <AuthGuard>
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
        <SetupStepHeader
          step={2}
          total={4}
          labels={[
            t.setup.steps.profile,
            t.setup.steps.metrics,
            t.setup.steps.activity,
            t.setup.steps.goals,
          ]}
          title={t.setup.step2.title}
          subtitle={t.setup.step2.subtitle}
        />

        <div className="flex flex-col gap-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 elevation-card">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-on-surface-variant">
                {t.setup.step2.height}
              </label>
              <UnitToggle
                value={heightUnit}
                onChange={(v) => setHeightUnit(v as "cm" | "ft_in")}
                options={[
                  { value: "cm", label: t.setup.step2.cm },
                  { value: "ft_in", label: t.setup.step2.ftIn },
                ]}
              />
            </div>
            {heightUnit === "cm" ? (
              <TextField
                label=""
                type="number"
                placeholder="175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <TextField
                  label="ft"
                  type="number"
                  placeholder="5"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                />
                <TextField
                  label="in"
                  type="number"
                  placeholder="9"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-on-surface-variant">
                {t.setup.step2.weight}
              </label>
              <UnitToggle
                value={weightUnit}
                onChange={(v) => setWeightUnit(v as "kg" | "lb")}
                options={[
                  { value: "kg", label: t.setup.step2.kg },
                  { value: "lb", label: t.setup.step2.lbs },
                ]}
              />
            </div>
            {weightUnit === "kg" ? (
              <TextField
                label=""
                type="number"
                placeholder="78"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
              />
            ) : (
              <TextField
                label=""
                type="number"
                placeholder="172"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button variant="secondary" onClick={() => router.push("/setup/step-1")}>
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            {t.common.back}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed}>
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
