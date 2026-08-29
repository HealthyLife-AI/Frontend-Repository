import { apiClient } from "./client";
import type { FoodItem } from "./foods";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type LoggedMealItem = {
  id: number;
  meal_id?: number;
  food_id: number;
  food?: FoodItem;
  food_name?: string;
  amount_g: number;
  calories: number | string;
  protein_g: number | string;
  carbs_g: number | string;
  fat_g: number | string;
  [key: string]: unknown;
};

export type Meal = {
  id: number;
  date: string;
  meal_type: MealType;
  items: LoggedMealItem[];
  total_calories: number | string;
  total_protein: number | string;
  total_carbs: number | string;
  total_fats: number | string;
  [key: string]: unknown;
};

export type DailyMealsSummary = {
  date: string;
  meals: Meal[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fats: number;
};

export type AddFoodToMealPayload = {
  meal_type: MealType;
  date: string;
  food_id: number;
  amount_g: number;
};

export type UpdateMealItemPayload = {
  amount_g: number;
  meal_type?: MealType;
};

export async function getMealsForDate(date: string): Promise<DailyMealsSummary> {
  const { data } = await apiClient.get<any>("/meals", {
    params: { date },
  });

  let mealsList: Meal[] = [];
  if (Array.isArray(data)) {
    mealsList = data as Meal[];
  } else if (data && typeof data === "object") {
    if (Array.isArray(data.meals)) {
      mealsList = data.meals as Meal[];
    } else if (Array.isArray(data.data)) {
      mealsList = data.data as Meal[];
    }
  }

  // Calculate totals
  let total_calories = 0;
  let total_protein = 0;
  let total_carbs = 0;
  let total_fats = 0;

  mealsList.forEach((m) => {
    total_calories += Number(m.total_calories || 0);
    total_protein += Number(m.total_protein || 0);
    total_carbs += Number(m.total_carbs || 0);
    total_fats += Number(m.total_fats || 0);
  });

  return {
    date,
    meals: mealsList,
    total_calories: Math.round(total_calories),
    total_protein: Math.round(total_protein),
    total_carbs: Math.round(total_carbs),
    total_fats: Math.round(total_fats),
  };
}

export async function addFoodToMeal(payload: AddFoodToMealPayload): Promise<LoggedMealItem> {
  const { data } = await apiClient.post<any>("/meals", payload);
  if (data && typeof data === "object") {
    if (data.item) return data.item as LoggedMealItem;
    if (data.meal_item) return data.meal_item as LoggedMealItem;
    if (data.data) return data.data as LoggedMealItem;
  }
  return data as LoggedMealItem;
}

export async function updateMealItem(
  id: number,
  payload: UpdateMealItemPayload,
): Promise<LoggedMealItem> {
  const { data } = await apiClient.put<any>(`/meal-items/${id}`, payload);
  if (data && typeof data === "object") {
    if (data.item) return data.item as LoggedMealItem;
    if (data.meal_item) return data.meal_item as LoggedMealItem;
    if (data.data) return data.data as LoggedMealItem;
  }
  return data as LoggedMealItem;
}

export async function deleteMealItem(id: number): Promise<void> {
  await apiClient.delete(`/meal-items/${id}`);
}
