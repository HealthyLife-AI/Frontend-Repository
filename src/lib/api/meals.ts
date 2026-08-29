import { apiClient } from "./client";
import type { FoodItem } from "./foods";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type LoggedMealItem = {
  id: number;
  meal_id?: number;
  food_id: number;
  food?: FoodItem;
  food_name?: string;
  quantity_grams: number | string;
  amount_g?: number; // fallback alias
  calories_calculated?: number | string;
  protein_calculated?: number | string;
  carbs_calculated?: number | string;
  fat_calculated?: number | string;
  calories?: number | string;
  protein_g?: number | string;
  carbs_g?: number | string;
  fat_g?: number | string;
  [key: string]: unknown;
};

export type Meal = {
  id: number;
  meal_date: string;
  meal_type: MealType;
  items: LoggedMealItem[];
  total_calories?: number | string;
  total_protein?: number | string;
  total_carbs?: number | string;
  total_fats?: number | string;
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
  meal_date: string;
  food_id: number;
  quantity_grams: number;
};

export type UpdateMealItemPayload = {
  quantity_grams?: number;
  meal_type?: MealType;
};

export async function getMealsForDate(date: string): Promise<DailyMealsSummary> {
  const { data } = await apiClient.get<any>("/meals", {
    params: { date },
  });

  let mealsList: Meal[] = [];
  if (data && typeof data === "object") {
    if (Array.isArray(data.meals)) {
      mealsList = data.meals as Meal[];
    }
  } else if (Array.isArray(data)) {
    mealsList = data as Meal[];
  }

  let total_calories = 0;
  let total_protein = 0;
  let total_carbs = 0;
  let total_fats = 0;

  if (data && data.daily_totals) {
    total_calories = Number(data.daily_totals.calories || 0);
    total_protein = Number(data.daily_totals.protein || 0);
    total_carbs = Number(data.daily_totals.carbs || 0);
    total_fats = Number(data.daily_totals.fat || data.daily_totals.fats || 0);
  } else {
    mealsList.forEach((m) => {
      if (Array.isArray(m.items)) {
        m.items.forEach((item) => {
          total_calories += Number(item.calories_calculated || item.calories || 0);
          total_protein += Number(item.protein_calculated || item.protein_g || 0);
          total_carbs += Number(item.carbs_calculated || item.carbs_g || 0);
          total_fats += Number(item.fat_calculated || item.fat_g || 0);
        });
      }
    });
  }

  return {
    date,
    meals: mealsList,
    total_calories: Math.round(total_calories),
    total_protein: Math.round(total_protein),
    total_carbs: Math.round(total_carbs),
    total_fats: Math.round(total_fats),
  };
}

export async function addFoodToMeal(payload: AddFoodToMealPayload): Promise<any> {
  const { data } = await apiClient.post<any>("/meals", payload);
  return data;
}

export async function updateMealItem(
  id: number,
  payload: UpdateMealItemPayload,
): Promise<any> {
  const { data } = await apiClient.put<any>(`/meal-items/${id}`, payload);
  return data;
}

export async function deleteMealItem(id: number): Promise<void> {
  await apiClient.delete(`/meal-items/${id}`);
}
