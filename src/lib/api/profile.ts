import { apiClient } from "./client";

export type Gender = "male" | "female";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type Goal = "lose" | "maintain" | "gain";

export type MetricProfilePayload = {
  age: number;
  gender: Gender;
  height_unit?: "cm";
  height_cm: number;
  weight_unit?: "kg";
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: Goal;
  dietary_preference?: string | null;
  health_conditions?: string | null;
  allergies?: string | null;
};

export type ImperialProfilePayload = {
  age: number;
  gender: Gender;
  height_unit: "ft_in";
  height_ft: number;
  height_in: number;
  weight_unit: "lb";
  weight_lb: number;
  activity_level: ActivityLevel;
  goal: Goal;
  dietary_preference?: string | null;
  health_conditions?: string | null;
  allergies?: string | null;
};

export type ProfilePayload = MetricProfilePayload | ImperialProfilePayload;

export type HealthProfile = {
  id: number;
  age: number;
  gender: Gender;
  height_cm?: number;
  weight_kg?: number;
  activity_level: ActivityLevel;
  goal: Goal;
  [key: string]: unknown;
};

export type NutritionTarget = {
  id: number;
  health_profile_id: number;
  daily_calories: string; // decimal من لارافيل بيرجع كنص، حوّله لرقم عند العرض
  protein_g: string;
  carbs_g: string;
  fat_g: string;
  calculated_at: string;
};

export type ProfileWithNutrition = {
  profile: HealthProfile;
  nutrition_target: NutritionTarget;
};

/**
 * POST /profile — creates (or, per the SRS, updates) the user's health
 * profile. Accepts either metric fields (height_cm/weight_kg) or imperial
 * fields (height_ft+height_in/weight_lb), matching both examples in the
 * team's Postman collection.
 */
function unwrap(data: { profile: HealthProfile } | HealthProfile): HealthProfile {
  return typeof data === "object" && data !== null && "profile" in data
    ? (data as { profile: HealthProfile }).profile
    : (data as HealthProfile);
}

export async function saveHealthProfile(
  payload: ProfilePayload,
): Promise<ProfileWithNutrition> {
  const { data } = await apiClient.post<ProfileWithNutrition>("/profile", payload);
  return data;
}

export async function updateHealthProfile(
  payload: ProfilePayload,
): Promise<ProfileWithNutrition> {
  const { data } = await apiClient.put<ProfileWithNutrition>("/profile", payload);
  return data;
}

export async function getHealthProfile(): Promise<ProfileWithNutrition> {
  const { data } = await apiClient.get<ProfileWithNutrition>("/profile");
  return data;
}
