import { apiClient } from "./client";

export type Gender = "male" | "female" | "other";
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
  daily_calorie_target?: number;
  daily_protein_g?: number;
  daily_carbs_g?: number;
  daily_fats_g?: number;
  [key: string]: unknown;
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
): Promise<HealthProfile> {
  const { data } = await apiClient.post<{ profile: HealthProfile } | HealthProfile>(
    "/profile",
    payload,
  );
  return unwrap(data);
}

/**
 * GET /profile — not present in the current Postman collection. Included
 * defensively (e.g. to resume setup or show the review step) — confirm the
 * exact route with the backend team before relying on it in production.
 */
export async function getHealthProfile(): Promise<HealthProfile> {
  const { data } = await apiClient.get<{ profile: HealthProfile } | HealthProfile>(
    "/profile",
  );
  return unwrap(data);
}
