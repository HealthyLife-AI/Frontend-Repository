"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { updateMealItem, deleteMealItem, type LoggedMealItem } from "@/lib/api/meals";
import { extractErrorMessage } from "@/lib/api/client";

type EditMealItemModalProps = {
  item: LoggedMealItem | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function EditMealItemModal({
  item,
  onClose,
  onSuccess,
}: EditMealItemModalProps) {
  const { t, locale } = useTranslation();
  const [amountGrams, setAmountGrams] = useState<number>(100);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setAmountGrams(Number(item.quantity_grams || item.amount_g || 100));
      setSubmitting(false);
      setDeleting(false);
      setError(null);
    }
  }, [item]);

  if (!item) return null;

  const foodName =
    item.food
      ? locale === "ar"
        ? item.food.name_ar || item.food.name_en
        : item.food.name_en || item.food.name_ar
      : item.food_name || "Food Item";

  const handleUpdate = async () => {
    if (amountGrams <= 0) return;
    setSubmitting(true);
    setError(null);

    try {
      await updateMealItem(item.id, { quantity_grams: amountGrams });
      onSuccess();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, t.common?.errorGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      await deleteMealItem(item.id);
      onSuccess();
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, t.common?.errorGeneric));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl border border-outline-variant/30 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
          <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006B5F]">edit</span>
            <span>{foodName}</span>
          </h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Edit Portion Slider */}
        <div className="py-5 flex flex-col gap-4">
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
          </div>

          {error && (
            <p className="rounded-xl bg-error-container p-3 text-xs text-on-error-container border border-error/20">
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-outline-variant/30">
          <Button
            variant="ghost"
            onClick={handleDelete}
            loading={deleting}
            className="text-error hover:bg-error-container/30 text-xs px-3 rounded-xl"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {t.meals?.deleteItem}
          </Button>

          <div className="ms-auto flex items-center gap-2">
            <Button variant="secondary" onClick={onClose} className="rounded-xl text-xs">
              {t.common?.cancel}
            </Button>
            <Button
              onClick={handleUpdate}
              loading={submitting}
              className="bg-[#006B5F] hover:bg-[#00574d] text-white font-bold rounded-xl text-xs"
            >
              {t.common?.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
