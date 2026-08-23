"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { SelectCard } from "@/components/ui/SelectCard";
import { useAuthStore } from "@/store/authStore";
import {
  getHealthProfile,
  saveHealthProfile,
  type ActivityLevel,
  type Gender,
  type Goal,
  type HealthProfile,
} from "@/lib/api/profile";
import { calculateDailyTargets, ftInToCm, lbToKg } from "@/lib/nutrition";
import { extractErrorMessage } from "@/lib/api/client";

export default function ProfilePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  // Form State
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState<string>("28");
  const [heightCm, setHeightCm] = useState<string>("175");
  const [heightFt, setHeightFt] = useState<string>("5");
  const [heightIn, setHeightIn] = useState<string>("9");
  const [weightKg, setWeightKg] = useState<string>("72.5");
  const [weightLb, setWeightLb] = useState<string>("160");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load existing profile from API
  useEffect(() => {
    getHealthProfile()
      .then((profile: HealthProfile) => {
        if (profile.gender) setGender(profile.gender);
        if (profile.age) setAge(String(profile.age));
        if (profile.activity_level) setActivityLevel(profile.activity_level);
        if (profile.goal) setGoal(profile.goal);

        if (profile.height_cm) {
          setHeightCm(String(profile.height_cm));
        }
        if (profile.weight_kg) {
          setWeightKg(String(profile.weight_kg));
        }
      })
      .catch(() => {
        // Safe fallback for new profiles
      })
      .finally(() => setLoading(false));
  }, []);

  // Live Calculated Targets
  const liveTargets = useMemo(() => {
    const ageNum = Number(age);
    const hCm =
      unitSystem === "metric"
        ? Number(heightCm)
        : ftInToCm(Number(heightFt), Number(heightIn));
    const wKg =
      unitSystem === "metric" ? Number(weightKg) : lbToKg(Number(weightLb));

    if (!ageNum || !hCm || !wKg || ageNum <= 0 || hCm <= 0 || wKg <= 0) {
      return null;
    }

    return calculateDailyTargets({
      age: ageNum,
      gender,
      heightCm: hCm,
      weightKg: wKg,
      activityLevel,
      goal,
    });
  }, [
    age,
    gender,
    unitSystem,
    heightCm,
    heightFt,
    heightIn,
    weightKg,
    weightLb,
    activityLevel,
    goal,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const ageNum = Number(age);
    if (!ageNum || ageNum < 10 || ageNum > 120) {
      setErrorMsg(t.common.errorGeneric);
      setSubmitting(false);
      return;
    }

    try {
      if (unitSystem === "metric") {
        await saveHealthProfile({
          age: ageNum,
          gender,
          height_unit: "cm",
          height_cm: Number(heightCm),
          weight_unit: "kg",
          weight_kg: Number(weightKg),
          activity_level: activityLevel,
          goal,
        });
      } else {
        await saveHealthProfile({
          age: ageNum,
          gender,
          height_unit: "ft_in",
          height_ft: Number(heightFt),
          height_in: Number(heightIn),
          weight_unit: "lb",
          weight_lb: Number(weightLb),
          activity_level: activityLevel,
          goal,
        });
      }

      useAuthStore.getState().setHasHealthProfile(true);
      setSuccessMsg(
        t.common.appName ? "Profile updated successfully! / تم تحديث الملف بنجاح" : "Success",
      );
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, t.common.errorGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-on-surface">
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-20 border-b border-outline-variant/60 bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-base rtl:rotate-180">
                arrow_back
              </span>
              <span>{t.dashboard.title}</span>
            </Link>

            <div className="flex items-center gap-3">
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* Main Canvas */}
        <main className="mx-auto max-w-6xl px-6 py-8 animate-fade-up">
          {/* Page Heading */}
          <div className="mb-8 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-on-surface md:text-3xl">
                {t.setup.steps.profile}
              </h1>
              <p className="text-sm text-on-surface-variant">
                {user?.full_name ? `${user.full_name} (${user.email})` : t.setup.step1.subtitle}
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 md:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-3.5 py-1 text-xs font-semibold text-on-primary-container">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                Active Account
              </span>
            </div>
          </div>

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
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left 2 Columns: Edit Form */}
              <div className="flex flex-col gap-6 lg:col-span-2">
                {/* Notification Alerts */}
                {successMsg && (
                  <div className="flex items-center gap-3 rounded-2xl bg-primary-container p-4 text-sm font-semibold text-on-primary-container border border-primary/20 animate-fade-up">
                    <span className="material-symbols-outlined text-xl text-primary">
                      check_circle
                    </span>
                    <span>{successMsg}</span>
                  </div>
                )}
                {errorMsg && (
                  <div className="flex items-center gap-3 rounded-2xl bg-error-container p-4 text-sm font-semibold text-on-error-container border border-error/20 animate-fade-up">
                    <span className="material-symbols-outlined text-xl text-error">
                      error
                    </span>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Section 1: Units & Gender */}
                <div className="rounded-2xl border border-outline-variant/50 bg-surface p-6 elevation-card">
                  <div className="mb-5 flex items-center justify-between border-b border-outline-variant/40 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-primary">
                        straighten
                      </span>
                      <h2 className="text-base font-bold text-on-surface">
                        Unit System & Biometrics
                      </h2>
                    </div>

                    {/* Unit Switcher Pills */}
                    <div className="flex rounded-xl bg-surface-container-high p-1">
                      <button
                        type="button"
                        onClick={() => setUnitSystem("metric")}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                          unitSystem === "metric"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Metric (cm/kg)
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnitSystem("imperial")}
                        className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                          unitSystem === "imperial"
                            ? "bg-surface text-primary shadow-sm"
                            : "text-on-surface-variant hover:text-on-surface"
                        }`}
                      >
                        Imperial (ft/lb)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      label={t.setup.step1.age}
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                    />

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-on-surface-variant">
                        {t.setup.step1.gender}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setGender("male")}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                            gender === "male"
                              ? "border-primary bg-primary-container text-on-primary-container shadow-sm"
                              : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">male</span>
                          {t.setup.step1.genderMale}
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender("female")}
                          className={`flex items-center justify-center gap-1.5 rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                            gender === "female"
                              ? "border-primary bg-primary-container text-on-primary-container shadow-sm"
                              : "border-outline-variant/60 bg-surface-container-lowest text-on-surface-variant hover:border-primary/40"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">female</span>
                          {t.setup.step1.genderFemale}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Height & Weight Inputs */}
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {unitSystem === "metric" ? (
                      <TextField
                        label={`${t.setup.step2.height} (${t.setup.step2.cm})`}
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        required
                      />
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <TextField
                          label={`${t.setup.step2.height} (ft)`}
                          type="number"
                          value={heightFt}
                          onChange={(e) => setHeightFt(e.target.value)}
                          required
                        />
                        <TextField
                          label="(in)"
                          type="number"
                          value={heightIn}
                          onChange={(e) => setHeightIn(e.target.value)}
                          required
                        />
                      </div>
                    )}

                    {unitSystem === "metric" ? (
                      <TextField
                        label={`${t.setup.step2.weight} (${t.setup.step2.kg})`}
                        type="number"
                        step="0.1"
                        value={weightKg}
                        onChange={(e) => setWeightKg(e.target.value)}
                        required
                      />
                    ) : (
                      <TextField
                        label={`${t.setup.step2.weight} (lb)`}
                        type="number"
                        step="0.1"
                        value={weightLb}
                        onChange={(e) => setWeightLb(e.target.value)}
                        required
                      />
                    )}
                  </div>
                </div>

                {/* Section 2: Activity Level */}
                <div className="rounded-2xl border border-outline-variant/50 bg-surface p-6 elevation-card">
                  <div className="mb-4 flex items-center gap-2 border-b border-outline-variant/40 pb-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      directions_run
                    </span>
                    <h2 className="text-base font-bold text-on-surface">
                      {t.setup.step3.title}
                    </h2>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <SelectCard
                      name="activityLevel"
                      value="sedentary"
                      checked={activityLevel === "sedentary"}
                      onChange={() => setActivityLevel("sedentary")}
                      icon="chair"
                      title={t.setup.step3.sedentary}
                      description={t.setup.step3.sedentaryDesc}
                    />
                    <SelectCard
                      name="activityLevel"
                      value="light"
                      checked={activityLevel === "light"}
                      onChange={() => setActivityLevel("light")}
                      icon="directions_walk"
                      title={t.setup.step3.light}
                      description={t.setup.step3.lightDesc}
                    />
                    <SelectCard
                      name="activityLevel"
                      value="moderate"
                      checked={activityLevel === "moderate"}
                      onChange={() => setActivityLevel("moderate")}
                      icon="fitness_center"
                      title={t.setup.step3.moderate}
                      description={t.setup.step3.moderateDesc}
                    />
                    <SelectCard
                      name="activityLevel"
                      value="active"
                      checked={activityLevel === "active"}
                      onChange={() => setActivityLevel("active")}
                      icon="directions_run"
                      title={t.setup.step3.active}
                      description={t.setup.step3.activeDesc}
                    />
                    <SelectCard
                      name="activityLevel"
                      value="very_active"
                      checked={activityLevel === "very_active"}
                      onChange={() => setActivityLevel("very_active")}
                      icon="bolt"
                      title={t.setup.step3.veryActive}
                      description={t.setup.step3.veryActiveDesc}
                    />
                  </div>
                </div>

                {/* Section 3: Goal */}
                <div className="rounded-2xl border border-outline-variant/50 bg-surface p-6 elevation-card">
                  <div className="mb-4 flex items-center gap-2 border-b border-outline-variant/40 pb-3">
                    <span className="material-symbols-outlined text-xl text-primary">
                      ads_click
                    </span>
                    <h2 className="text-base font-bold text-on-surface">
                      {t.setup.step4.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <SelectCard
                      name="goal"
                      value="lose"
                      checked={goal === "lose"}
                      onChange={() => setGoal("lose")}
                      icon="trending_down"
                      title={t.setup.step4.lose}
                      description={t.setup.step4.loseDesc}
                      layout="column"
                    />
                    <SelectCard
                      name="goal"
                      value="maintain"
                      checked={goal === "maintain"}
                      onChange={() => setGoal("maintain")}
                      icon="horizontal_rule"
                      title={t.setup.step4.maintain}
                      description={t.setup.step4.maintainDesc}
                      layout="column"
                    />
                    <SelectCard
                      name="goal"
                      value="gain"
                      checked={goal === "gain"}
                      onChange={() => setGoal("gain")}
                      icon="trending_up"
                      title={t.setup.step4.gain}
                      description={t.setup.step4.gainDesc}
                      layout="column"
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    fullWidth
                    loading={submitting}
                    className="bg-[#006B5F] hover:bg-[#00574d] text-white py-4 rounded-xl shadow-[0_4px_16px_rgba(0,107,95,0.35)] hover:shadow-[0_6px_22px_rgba(0,107,95,0.45)] text-base font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined me-1">save</span>
                    Save Profile & Target Changes
                  </Button>
                </div>
              </div>

              {/* Right Column: Live Target Preview */}
              <div className="flex flex-col gap-6">
                <div className="sticky top-24 rounded-2xl border border-outline-variant/50 bg-surface p-6 elevation-card">
                  <div className="mb-4 flex items-center justify-between border-b border-outline-variant/40 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-xl text-primary">
                        monitoring
                      </span>
                      <h2 className="text-base font-bold text-on-surface">
                        Live Targets Preview
                      </h2>
                    </div>
                    <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[10px] font-bold text-on-primary-container">
                      Real-time
                    </span>
                  </div>

                  {liveTargets ? (
                    <div className="flex flex-col gap-6">
                      {/* Calorie Ring Summary */}
                      <div className="rounded-xl bg-primary-container p-5 text-center text-on-primary-container">
                        <span className="material-symbols-outlined text-3xl text-primary">
                          local_fire_department
                        </span>
                        <p className="mt-1 text-xs font-semibold opacity-80">
                          {t.setup.results.calorieTarget}
                        </p>
                        <p className="mt-1 text-4xl font-bold tracking-tight text-[#006B5F]">
                          {liveTargets.calories.toLocaleString()}
                          <span className="text-sm font-semibold opacity-70 ms-1">
                            {t.setup.results.kcal}
                          </span>
                        </p>
                        <p className="mt-1 text-[11px] opacity-60">
                          Calculated via Mifflin-St Jeor formula
                        </p>
                      </div>

                      {/* Macro Breakdown Rows */}
                      <div className="flex flex-col gap-3">
                        {/* Protein */}
                        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-3.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-sm text-[#006B5F]">
                                fitness_center
                              </span>
                              {t.setup.results.protein}
                            </span>
                            <span className="text-on-surface font-bold">
                              {liveTargets.protein_g}g ({liveTargets.protein_pct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div
                              className="h-full bg-[#006B5F] transition-all duration-300"
                              style={{ width: `${liveTargets.protein_pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Carbs */}
                        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-3.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-sm text-tertiary">
                                agriculture
                              </span>
                              {t.setup.results.carbs}
                            </span>
                            <span className="text-on-surface font-bold">
                              {liveTargets.carbs_g}g ({liveTargets.carbs_pct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div
                              className="h-full bg-tertiary transition-all duration-300"
                              style={{ width: `${liveTargets.carbs_pct}%` }}
                            />
                          </div>
                        </div>

                        {/* Fats */}
                        <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-3.5">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span className="flex items-center gap-1.5 text-on-surface">
                              <span className="material-symbols-outlined text-sm text-secondary">
                                water_drop
                              </span>
                              {t.setup.results.fats}
                            </span>
                            <span className="text-on-surface font-bold">
                              {liveTargets.fats_g}g ({liveTargets.fats_pct}%)
                            </span>
                          </div>
                          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
                            <div
                              className="h-full bg-secondary transition-all duration-300"
                              style={{ width: `${liveTargets.fats_pct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Active Goal Pill */}
                      <div className="rounded-xl bg-surface-container-low p-3.5 text-center text-xs text-on-surface-variant">
                        Goal: <strong className="text-on-surface capitalize">{goal} weight</strong> — targets update dynamically as you tweak your biometrics.
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-on-surface-variant">
                      Enter valid biometrics to calculate targets.
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
