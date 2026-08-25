import type { ActivityLevel, Gender, Goal } from "@/lib/api/profile";

/**
 * FALLBACK ONLY — used when the API-calculated nutrition_target is
 * unavailable (e.g. offline, or before the first successful save).
 * The backend (POST/GET/PUT /profile) always returns the authoritative
 * nutrition_target — prefer that everywhere possible.
 */

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_CALORIE_ADJUSTMENT: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 500, // كانت 300 — لتطابق الباك اند
};

// Matches the ratios shown on the "Your Personalized Plan" mockup.
const MACRO_SPLIT = { protein: 0.3, carbs: 0.45, fats: 0.25 };

export type DailyTargets = {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fats_g: number;
  protein_pct: number;
  carbs_pct: number;
  fats_pct: number;
};

export function calculateDailyTargets(input: {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
}): DailyTargets {
  const { age, gender, heightCm, weightKg, activityLevel, goal } = input;

  // Mifflin-St Jeor BMR
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender === "male" ? base + 5 : gender === "female" ? base - 161 : base - 78;

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
  const calories = Math.max(
    gender === "female" ? 1200 : 1500, // كانت 1200 ثابتة للكل
    Math.round(tdee + GOAL_CALORIE_ADJUSTMENT[goal]),
  );

  const protein_g = Math.round((calories * MACRO_SPLIT.protein) / 4);
  const carbs_g = Math.round((calories * MACRO_SPLIT.carbs) / 4);
  const fats_g = Math.round((calories * MACRO_SPLIT.fats) / 9);

  return {
    calories,
    protein_g,
    carbs_g,
    fats_g,
    protein_pct: Math.round(MACRO_SPLIT.protein * 100),
    carbs_pct: Math.round(MACRO_SPLIT.carbs * 100),
    fats_pct: Math.round(MACRO_SPLIT.fats * 100),
  };
}

export function ftInToCm(ft: number, inch: number): number {
  return Math.round((ft * 12 + inch) * 2.54 * 10) / 10;
}

export function lbToKg(lb: number): number {
  return Math.round(lb * 0.453592 * 10) / 10;
}
