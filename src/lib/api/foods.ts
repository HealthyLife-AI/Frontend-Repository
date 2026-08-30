import { apiClient } from "./client";

export type FoodItem = {
  id: number;
  name_ar: string;
  name: string;
  calories_per_100g: number | string;
  protein_per_100g: number | string;
  carbs_per_100g: number | string;
  fat_per_100g: number | string;
  serving_unit?: string;
  category_id?: number;
  [key: string]: unknown;
};

export async function searchFoods(query: string): Promise<FoodItem[]> {
  if (!query || query.trim().length === 0) return [];

  const { data } = await apiClient.get<any>("/foods", {
    params: { q: query.trim() },
  });

  if (Array.isArray(data)) {
    return data as FoodItem[];
  }
  if (data && typeof data === "object") {
    if (Array.isArray(data.foods)) {
      return data.foods as FoodItem[];
    }
    if (Array.isArray(data.data)) {
      return data.data as FoodItem[];
    }
  }
  return [];
}
