"use client";

import { useTranslation } from "@/lib/i18n/LocaleProvider";
import type { Meal, MealType, LoggedMealItem } from "@/lib/api/meals";

type MealSlotCardProps = {
  mealType: MealType;
  meal: Meal | undefined;
  onOpenSearch: (type: MealType) => void;
  onEditItem: (item: LoggedMealItem) => void;
};

const mealIcons: Record<MealType, string> = {
  breakfast: "free_breakfast",
  lunch: "lunch_dining",
  dinner: "dinner_dining",
  snack: "cookie",
};

export function MealSlotCard({
  mealType,
  meal,
  onOpenSearch,
  onEditItem,
}: MealSlotCardProps) {
  const { t, locale } = useTranslation();

  const title = t.meals?.types?.[mealType] || mealType;
  const icon = mealIcons[mealType] || "restaurant";
  const items = meal?.items || [];
  const totalCalories = Math.round(
    Number(
      meal?.total_calories ||
        items.reduce((sum, i) => sum + Number(i.calories_calculated || i.calories || 0), 0)
    )
  );

  return (
    <div className="rounded-2xl border border-outline-variant/40 bg-surface p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Slot */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#006B5F]/10 text-[#006B5F]">
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">{title}</h3>
            <p className="text-xs text-on-surface-variant font-medium">
              {totalCalories > 0 ? `${totalCalories} ${t.setup?.results?.kcal}` : t.meals?.emptySlot}
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenSearch(mealType)}
          className="flex items-center gap-1 text-xs font-bold text-[#006B5F] bg-[#006B5F]/10 hover:bg-[#006B5F] hover:text-white px-3 py-1.5 rounded-xl transition-all"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>{t.meals?.addFood}</span>
        </button>
      </div>

      {/* Items List */}
      <div className="mt-3 space-y-2">
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
                className="flex items-center justify-between p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-[#006B5F]/40 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-base text-on-surface-variant/60 group-hover:text-[#006B5F]">
                    edit_note
                  </span>
                  <div>
                    <p className="text-xs font-bold text-on-surface group-hover:text-[#006B5F] transition-colors">
                      {foodName}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium">
                      {grams}g • P: {prot}g • C: {carb}g • F: {fat}g
                    </p>
                  </div>
                </div>

                <span className="text-xs font-extrabold text-[#006B5F] tabular-nums">
                  {itemCals} <span className="text-[10px] font-normal text-on-surface-variant">kcal</span>
                </span>
              </div>
            );
          })
        ) : (
          <div className="py-4 text-center text-xs text-on-surface-variant/50 border border-dashed border-outline-variant/30 rounded-xl">
            {t.meals?.emptySlot}
          </div>
        )}
      </div>
    </div>
  );
}
