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
      return;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-xl rounded-3xl bg-surface p-6 shadow-2xl border border-outline-variant/30 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006B5F]">search</span>
              <span>{t.meals?.addFood} — {mealTypeTitle}</span>
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {t.meals?.searchPlaceholder}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative mt-4">
          <span className="material-symbols-outlined absolute start-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-xl">
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.meals?.searchPlaceholder}
            autoFocus
            className="w-full rounded-2xl border border-outline-variant/50 bg-surface-container-lowest py-3.5 ps-11 pe-10 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-[#006B5F] focus:outline-none focus:ring-2 focus:ring-[#006B5F]/20 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-2 pe-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl animate-spin text-[#006B5F]">
                progress_activity
              </span>
              <p className="text-xs mt-2">{t.common?.loading}</p>
            </div>
          ) : results.length > 0 ? (
            results.map((food) => {
              const name = locale === "ar" ? food.name_ar || food.name_en : food.name_en || food.name_ar;
              const cals = Math.round(Number(food.calories_per_100g || 0));
              const prot = Math.round(Number(food.protein_per_100g || 0));
              const carb = Math.round(Number(food.carbs_per_100g || 0));
              const fat = Math.round(Number(food.fat_per_100g || 0));

              return (
                <div
                  key={food.id}
                  onClick={() => onSelectFood(food)}
                  className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant/30 bg-surface-container-lowest hover:border-[#006B5F] hover:bg-[#006B5F]/5 cursor-pointer transition-all duration-150 group"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-on-surface group-hover:text-[#006B5F] transition-colors">
                      {name}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant/80">
                      <span>{cals} {t.setup?.results?.kcal} / 100g</span>
                      <span>•</span>
                      <span>P: {prot}g</span>
                      <span>C: {carb}g</span>
                      <span>F: {fat}g</span>
                    </div>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#006B5F]/10 text-[#006B5F] group-hover:bg-[#006B5F] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-lg rtl:rotate-180">add</span>
                  </div>
                </div>
              );
            })
          ) : query.trim() ? (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2 text-on-surface-variant/50">
                search_off
              </span>
              <p className="text-sm font-semibold">{t.meals?.noResults}</p>
            </div>
          ) : (
            <div className="text-center py-12 text-on-surface-variant/60">
              <span className="material-symbols-outlined text-4xl mb-2 text-[#006B5F]/40">
                restaurant_menu
              </span>
              <p className="text-xs">{t.meals?.searchPlaceholder}</p>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
          <Button variant="secondary" onClick={onClose} className="rounded-xl text-xs">
            {t.common?.cancel}
          </Button>
        </div>
      </div>
    </div>
  );
}
