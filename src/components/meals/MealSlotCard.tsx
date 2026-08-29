"use client";

import { useTranslation } from "@/lib/i18n/LocaleProvider";
import type { Meal, MealType, LoggedMealItem } from "@/lib/api/meals";

type MealSlotCardProps = {
  mealType: MealType;
  meal: Meal | undefined;
  onOpenSearch: (type: MealType) => void;
  onEditItem: (item: LoggedMealItem) => void;
};

const mealConfig: Record<MealType, { icon: string; gradient: string; light: string }> = {
  breakfast: {
    icon: "free_breakfast",
    gradient: "from-amber-500 to-orange-400",
    light: "bg-amber-50 text-amber-600",
  },
  lunch: {
    icon: "lunch_dining",
    gradient: "from-emerald-600 to-teal-500",
    light: "bg-emerald-50 text-emerald-700",
  },
  dinner: {
    icon: "dinner_dining",
    gradient: "from-indigo-500 to-violet-500",
    light: "bg-indigo-50 text-indigo-600",
  },
  snack: {
    icon: "cookie",
    gradient: "from-rose-400 to-pink-400",
    light: "bg-rose-50 text-rose-500",
  },
};

export function MealSlotCard({
  mealType,
  meal,
  onOpenSearch,
  onEditItem,
}: MealSlotCardProps) {
  const { t, locale } = useTranslation();

  const title = t.meals?.types?.[mealType] || mealType;
  const config = mealConfig[mealType] || { icon: "restaurant", gradient: "from-[#006B5F] to-teal-500", light: "bg-teal-50 text-teal-600" };
  const items = meal?.items || [];
  const totalCalories = Math.round(
    Number(
      meal?.total_calories ||
        items.reduce((sum, i) => sum + Number(i.calories_calculated || i.calories || 0), 0)
    )
  );

  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface overflow-hidden elevation-card transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,107,95,0.12)]">
      {/* Gradient accent top bar */}
      <div className={`h-0.5 w-full bg-gradient-to-r ${config.gradient}`} />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${config.light}`}>
            <span className="material-symbols-outlined text-xl">{config.icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{title}</h3>
            <p className="text-xs font-medium text-on-surface-variant">
              {totalCalories > 0 ? (
                <span className="text-[#006B5F] font-bold">{totalCalories} {t.setup?.results?.kcal}</span>
              ) : (
                <span className="opacity-50">{t.meals?.emptySlot}</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenSearch(mealType)}
          className="group flex items-center gap-1.5 rounded-xl border border-[#006B5F]/20 bg-[#006B5F]/5 px-3 py-2 text-xs font-bold text-[#006B5F] transition-all duration-200 hover:bg-[#006B5F] hover:text-white hover:border-transparent hover:shadow-[0_4px_12px_rgba(0,107,95,0.3)] active:scale-[0.97]"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:rotate-90">add</span>
          <span>{t.meals?.addFood}</span>
        </button>
      </div>

      {/* Items List */}
      <div className="px-4 pb-4 space-y-2">
        {items.length > 0 ? (
          items.map((item) => {
            const foodName = item.food
              ? locale === "ar"
                ? item.food.name_ar || item.food.name_en
                : item.food.name_en || item.food.name_ar
              : item.food_name || "Food Item";
            const itemCals = Math.round(Number(item.calories_calculated || item.calories || 0));
            const grams = Number(item.quantity_grams || item.amount_g || 0);
            const prot = Math.round(Number(item.protein_calculated || item.protein_g || 0));
            const carb = Math.round(Number(item.carbs_calculated || item.carbs_g || 0));
            const fat = Math.round(Number(item.fat_calculated || item.fat_g || 0));

            return (
              <div
                key={item.id}
                onClick={() => onEditItem(item)}
                className="group flex items-center justify-between gap-3 rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3 cursor-pointer transition-all duration-200 hover:border-[#006B5F]/40 hover:bg-[#006B5F]/5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-on-surface group-hover:text-[#006B5F] transition-colors truncate">
                    {foodName}
                  </p>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-on-surface-variant/70 font-medium">
                    <span className="font-bold">{grams}g</span>
                    <span className="opacity-40">·</span>
                    <span>P:{prot}g</span>
                    <span className="opacity-40">·</span>
                    <span>C:{carb}g</span>
                    <span className="opacity-40">·</span>
                    <span>F:{fat}g</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-extrabold text-[#006B5F] tabular-nums">
                    {itemCals}
                    <span className="text-[9px] font-normal text-on-surface-variant ms-0.5">kcal</span>
                  </span>
                  <span className="material-symbols-outlined text-sm text-on-surface-variant/30 group-hover:text-[#006B5F]/60 transition-colors">
                    edit
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-6 border border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant/40">
            <span className="material-symbols-outlined text-2xl">{config.icon}</span>
            <p className="text-xs">{t.meals?.emptySlot}</p>
          </div>
        )}
      </div>
    </div>
  );
}
