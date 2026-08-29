"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import type { FoodItem } from "@/lib/api/foods";
import { addFoodToMeal, type MealType } from "@/lib/api/meals";
import { extractErrorMessage } from "@/lib/api/client";

type AddFoodModalProps = {
  food: FoodItem | null;
  mealType: MealType;
  date: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddFoodModal({
  food,
  mealType,
  date,
  onClose,
  onSuccess,
}: AddFoodModalProps) {
  const { t, locale } = useTranslation();
  const [amountGrams, setAmountGrams] = useState<number>(100);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (food) {
      setAmountGrams(100);
      setSubmitting(false);
      setError(null);
    }
  }, [food]);

  if (!food) return null;

  const foodName = locale === "ar" ? food.name_ar || food.name_en : food.name_en || food.name_ar;

  const factor = amountGrams / 100;
  const calculatedCals = Math.round(Number(food.calories_per_100g || 0) * factor);
  const calculatedProtein = Math.round(Number(food.protein_per_100g || 0) * factor);
  const calculatedCarbs = Math.round(Number(food.carbs_per_100g || 0) * factor);
  const calculatedFats = Math.round(Number(food.fat_per_100g || 0) * factor);

  const handleAdd = async () => {
    if (amountGrams <= 0) return;
    setSubmitting(true);
    setError(null);

    try {
      await addFoodToMeal({
        meal_type: mealType,
        meal_date: date,
        food_id: food.id,
        quantity_grams: amountGrams,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, t.common?.errorGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl border border-outline-variant/30 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006B5F]">restaurant</span>
            <span>{foodName}</span>
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Portion Input & Live Calculations */}
        <div className="py-5 flex flex-col gap-5">
          {/* Amount slider & input */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-on-surface-variant mb-2">
              <span>{t.meals?.amountGrams}</span>
              <span className="text-base font-extrabold text-[#006B5F]">{amountGrams}g</span>
            </div>
            <input
              type="range"
              min={10}
              max={600}
              step={5}
              value={amountGrams}
              onChange={(e) => setAmountGrams(Number(e.target.value))}
              className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-[#006B5F]"
            />
            <div className="flex justify-between text-[10px] text-on-surface-variant/60 mt-1">
              <span>50g</span>
              <span>200g</span>
              <span>500g</span>
            </div>
          </div>

          {/* Live Calculated Nutritional Breakdown */}
          <div className="rounded-2xl bg-gradient-to-br from-[#006B5F] to-[#004D44] p-5 text-white shadow-md relative overflow-hidden">
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-xs font-medium text-white/80 uppercase">السعرات المحسوبة</span>
              <span className="text-3xl font-black">{calculatedCals.toLocaleString()} <span className="text-xs font-normal">kcal</span></span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
              <div className="rounded-xl bg-white/15 p-2">
                <p className="text-[10px] text-white/80 uppercase font-semibold">{t.setup?.results?.protein}</p>
                <p className="text-sm font-bold text-white">{calculatedProtein}g</p>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <p className="text-[10px] text-white/80 uppercase font-semibold">{t.setup?.results?.carbs}</p>
                <p className="text-sm font-bold text-white">{calculatedCarbs}g</p>
              </div>
              <div className="rounded-xl bg-white/15 p-2">
                <p className="text-[10px] text-white/80 uppercase font-semibold">{t.setup?.results?.fats}</p>
                <p className="text-sm font-bold text-white">{calculatedFats}g</p>
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-xl bg-error-container p-3 text-xs text-on-error-container border border-error/20">
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/30">
          <Button variant="secondary" onClick={onClose} className="flex-1 rounded-xl">
            {t.common?.cancel}
          </Button>
          <Button
            onClick={handleAdd}
            loading={submitting}
            className="flex-1 bg-[#006B5F] hover:bg-[#00574d] text-white font-bold rounded-xl"
          >
            {t.meals?.addFood}
          </Button>
        </div>
      </div>
    </div>
  );
}
