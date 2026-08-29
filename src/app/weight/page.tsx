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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WeightLogPage() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<WeightLog[]>([]);
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(todayIso());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    listWeightLogs()
      .then((res) => setLogs(Array.isArray(res) ? res : []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const weightKg = Number(weight);
    if (!weightKg || weightKg < 20 || weightKg > 500) {
      setError(t.common.errorGeneric);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const entry = await createWeightLog({ weight_kg: weightKg, recorded_date: date });
      setLogs((prev) => [entry, ...(Array.isArray(prev) ? prev : [])]);
      setWeight("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(extractErrorMessage(err, t.common.errorGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  // Build mini SVG trend
  const recentLogs = logs.slice(-8);
  const trendPath = (() => {
    if (recentLogs.length < 2) return null;
    const weights = recentLogs.map((l) => Number(l.weight_kg));
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min || 1;
    const coords = recentLogs.map((l, i) => {
      const x = (i / (recentLogs.length - 1)) * 100;
      const y = 40 - ((Number(l.weight_kg) - min) / range) * 32;
      return [x, y] as const;
    });
    return {
      polyline: coords.map(([x, y]) => `${x},${y}`).join(" "),
      area: `M0,48 ${coords.map(([x, y]) => `${x},${y}`).join(" ")} L100,48 Z`,
      coords,
      min,
      max,
    };
  })();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-outline-variant/40 bg-surface/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-3xl items-center gap-4 px-6">
            <Link
              href="/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant/40 bg-surface text-on-surface-variant transition-all duration-200 hover:border-[#006B5F]/40 hover:text-[#006B5F]"
            >
              <span className="material-symbols-outlined text-base rtl:rotate-180">arrow_back</span>
            </Link>
            <div>
              <h1 className="text-sm font-bold text-on-surface leading-tight">{t.weight.title}</h1>
              <p className="text-xs text-on-surface-variant">{t.weight.subtitle}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-6 py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Log Form */}
            <div className="lg:col-span-2">
              {/* Outer Double-Bezel Shell */}
              <div className="rounded-[1.75rem] bg-[#006B5F]/5 p-1.5 ring-1 ring-[#006B5F]/10">
                <div className="rounded-[1.25rem] bg-surface p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006B5F] to-[#00897B] shadow-[0_4px_12px_rgba(0,107,95,0.3)]">
                      <span className="material-symbols-outlined text-xl text-white">monitor_weight</span>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-on-surface">{t.weight.logWeight}</h2>
                      <p className="text-[11px] text-on-surface-variant">
                        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Weight Input */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                        {t.weight.weightKg}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          min={20}
                          max={500}
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="72.5"
                          required
                          className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 pe-12 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-[#006B5F] focus:outline-none focus:ring-2 focus:ring-[#006B5F]/20 transition-all"
                        />
                        <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant/60">
                          kg
                        </span>
                      </div>
                    </div>

                    {/* Date Input */}
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">
                        {t.weight.date}
                      </label>
                      <input
                        type="date"
                        value={date}
                        max={todayIso()}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface focus:border-[#006B5F] focus:outline-none focus:ring-2 focus:ring-[#006B5F]/20 transition-all"
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl bg-error-container/60 px-4 py-2.5 text-xs text-on-error-container border border-error/20">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="flex items-center gap-2 rounded-xl bg-primary-container px-4 py-2.5 text-xs font-semibold text-on-primary-container border border-[#006B5F]/20 animate-fade-up">
                        <span className="material-symbols-outlined text-base text-[#006B5F]">check_circle</span>
                        Entry saved!
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#006B5F] to-[#00897B] px-6 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(0,107,95,0.35)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,107,95,0.45)] active:scale-[0.98] disabled:opacity-60"
                    >
                      {submitting ? (
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                      ) : (
                        <span className="material-symbols-outlined text-base">add</span>
                      )}
                      {t.weight.submit}
                    </button>
                  </form>
                </div>
              </div>

              {/* Summary Stats */}
              {logs.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-outline-variant/30 bg-surface p-4 text-center elevation-card">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Latest</p>
                    <p className="mt-1 text-xl font-black text-[#006B5F]">{Number(logs[0]?.weight_kg).toFixed(1)}</p>
                    <p className="text-[10px] text-on-surface-variant">kg</p>
                  </div>
                  <div className="rounded-2xl border border-outline-variant/30 bg-surface p-4 text-center elevation-card">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Entries</p>
                    <p className="mt-1 text-xl font-black text-[#006B5F]">{logs.length}</p>
                    <p className="text-[10px] text-on-surface-variant">total</p>
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Trend Chart */}
              {trendPath && (
                <div className="rounded-2xl border border-outline-variant/30 bg-surface p-5 elevation-card">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-base text-[#006B5F]">trending_up</span>
                      <span className="text-xs font-bold text-on-surface">Progress Trend</span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">Last {recentLogs.length} entries</span>
                  </div>

                  <div className="relative h-24 overflow-hidden">
                    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 48">
                      <defs>
                        <linearGradient id="wAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#006B5F" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#006B5F" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>
                      <path d={trendPath.area} fill="url(#wAreaGrad)" />
                      <polyline
                        fill="none"
                        points={trendPath.polyline}
                        stroke="#006B5F"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {trendPath.coords.map(([x, y], i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="white" stroke="#006B5F" strokeWidth="1.5" />
                      ))}
                    </svg>
                  </div>

                  <div className="mt-2 flex justify-between text-[10px] text-on-surface-variant">
                    <span>Min: {trendPath.min.toFixed(1)} kg</span>
                    <span>Max: {trendPath.max.toFixed(1)} kg</span>
                  </div>
                </div>
              )}

              {/* Log List */}
              <div className="rounded-2xl border border-outline-variant/30 bg-surface elevation-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-outline-variant/30 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-[#006B5F]">history</span>
                    <span className="text-sm font-bold text-on-surface">{t.weight.history}</span>
                  </div>
                  {logs.length > 0 && (
                    <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[10px] font-bold text-on-primary-container">
                      {logs.length}
                    </span>
                  )}
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-3xl animate-spin text-[#006B5F]" style={{ animationDuration: "1s" }}>
                      progress_activity
                    </span>
                    <p className="mt-2 text-xs">{t.common.loading}</p>
                  </div>
                ) : logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">monitor_weight</span>
                    <p className="mt-2 text-xs">{t.weight.empty}</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-outline-variant/20 max-h-[400px] overflow-y-auto">
                    {logs.map((log, idx) => (
                      <li
                        key={log.id}
                        className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-surface-container-lowest group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006B5F]/8 text-[#006B5F]">
                            <span className="text-xs font-black">{idx + 1}</span>
                          </div>
                          <span className="text-xs text-on-surface-variant font-medium">
                            {formatDate(log.recorded_date)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-extrabold text-on-surface tabular-nums">
                            {Number(log.weight_kg).toFixed(1)}
                          </span>
                          <span className="text-[10px] font-semibold text-on-surface-variant">kg</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
