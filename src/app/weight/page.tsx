"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import {
  createWeightLog,
  listWeightLogs,
  type WeightLog,
} from "@/lib/api/weightLogs";
import { extractErrorMessage } from "@/lib/api/client";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function WeightLogPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(todayIso());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listWeightLogs()
      .then((res) => {
        setLogs(Array.isArray(res) ? res : []);
      })
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightKg = Number(weight);
    if (!weightKg || weightKg <= 0 || weightKg > 500) {
      setError(t.common.errorGeneric);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const entry = await createWeightLog({ weight_kg: weightKg, recorded_date: date });
      setLogs((prev) => [entry, ...(Array.isArray(prev) ? prev : [])]);
      setWeight("");
    } catch (err) {
      setError(extractErrorMessage(err, t.common.errorGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <main className="mx-auto min-h-screen max-w-lg px-6 py-12">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-1 text-sm text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          {t.dashboard.title}
        </Link>

        <h1 className="text-2xl font-bold text-on-surface">{t.weight.title}</h1>
        <p className="mt-1 text-sm text-on-surface-variant">{t.weight.subtitle}</p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 elevation-card"
        >
          <h2 className="text-sm font-semibold text-on-surface">
            {t.weight.logWeight}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <TextField
              label={t.weight.weightKg}
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              required
            />
            <TextField
              label={t.weight.date}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" loading={submitting}>
            {t.weight.submit}
          </Button>
        </form>

        <h2 className="mt-8 mb-3 text-sm font-semibold text-on-surface">
          {t.weight.history}
        </h2>
        {loading ? (
          <p className="text-sm text-on-surface-variant">{t.common.loading}</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-on-surface-variant">{t.weight.empty}</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {logs.map((log) => (
              <li
                key={log.id}
                className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm"
              >
                <span className="text-on-surface-variant">
                  {log.recorded_date}
                </span>
                <span className="font-semibold text-on-surface">
                  {log.weight_kg} {t.setup.step2.kg}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AuthGuard>
  );
}
