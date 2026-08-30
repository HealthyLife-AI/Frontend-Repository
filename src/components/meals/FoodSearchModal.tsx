"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { searchFoods, type FoodItem } from "@/lib/api/foods";
import type { MealType } from "@/lib/api/meals";

type FoodSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  onSelectFood: (food: FoodItem) => void;
};

export function FoodSearchModal({
  isOpen,
  onClose,
  mealType,
  onSelectFood,
}: FoodSearchModalProps) {
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(() => {
      searchFoods(query)
        .then((items) => setResults(items))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const mealTypeTitle = t.meals?.types?.[mealType] || mealType;

  const mealIcons: Record<string, string> = {
    breakfast: "free_breakfast",
    lunch: "lunch_dining",
    dinner: "dinner_dining",
    snack: "cookie",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-surface flex flex-col max-h-[85vh] overflow-hidden shadow-2xl border border-outline-variant/20">
        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-outline-variant/50" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#006B5F] to-[#00897B] shadow-[0_3px_10px_rgba(0,107,95,0.3)]">
              <span className="material-symbols-outlined text-lg text-white">{mealIcons[mealType] || "restaurant"}</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-on-surface">{t.meals?.addFood}</h2>
              <p className="text-[11px] text-on-surface-variant font-medium">{mealTypeTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="px-5 py-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute start-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-xl">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.meals?.searchPlaceholder}
              autoFocus
              className="w-full rounded-2xl border border-outline-variant/40 bg-surface-container-lowest py-3 ps-11 pe-10 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#006B5F] focus:outline-none focus:ring-2 focus:ring-[#006B5F]/20 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-lg">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl animate-spin text-[#006B5F]">progress_activity</span>
              <p className="text-xs mt-2">{t.common?.loading}</p>
            </div>
          ) : results.length > 0 ? (
            results.map((food) => {
              const name = locale === "ar" ? food.name_ar || food.name : food.name || food.name_ar;
              const cals = Math.round(Number(food.calories_per_100g || 0));
              const prot = Math.round(Number(food.protein_per_100g || 0));
              const carb = Math.round(Number(food.carbs_per_100g || 0));
              const fat = Math.round(Number(food.fat_per_100g || 0));

              return (
                <button
                  key={food.id}
                  onClick={() => onSelectFood(food)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border border-outline-variant/25 bg-surface-container-lowest hover:border-[#006B5F]/50 hover:bg-[#006B5F]/5 transition-all duration-200 group text-start"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-on-surface group-hover:text-[#006B5F] transition-colors truncate">
                      {name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-on-surface-variant font-medium">
                      <span className="rounded-full bg-primary-container px-2 py-0.5 text-on-primary-container font-bold">{cals} kcal</span>
                      <span>P {prot}g</span>
                      <span>·</span>
                      <span>C {carb}g</span>
                      <span>·</span>
                      <span>F {fat}g</span>
                      <span className="text-on-surface-variant/50">/ 100g</span>
                    </div>
                  </div>
                  <div className="ms-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-outline-variant/30 bg-surface text-[#006B5F] group-hover:bg-[#006B5F] group-hover:text-white group-hover:border-transparent transition-all">
                    <span className="material-symbols-outlined text-base rtl:rotate-180">add</span>
                  </div>
                </button>
              );
            })
          ) : query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">search_off</span>
              <p className="mt-2 text-sm font-semibold">{t.meals?.noResults}</p>
              <p className="mt-1 text-xs opacity-60">Try a different search term</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant/50">
              <span className="material-symbols-outlined text-5xl text-[#006B5F]/25">restaurant_menu</span>
              <p className="mt-3 text-xs text-center max-w-[200px] leading-relaxed">
                {t.meals?.searchPlaceholder}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
