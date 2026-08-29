"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/TextField";
import { register as registerRequest } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const schema = z
  .object({
    full_name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const data = await registerRequest({
        ...values,
        preferred_language: locale,
      });
      useAuthStore.getState().setAccessToken(data.authorization.access_token);
      if (data.user) useAuthStore.getState().setUser(data.user);
      router.push("/setup/step-1");
    } catch (err) {
      setServerError(extractErrorMessage(err, t.common.errorGeneric));
    }
  };

  return (
    <main className="flex h-screen w-full overflow-hidden bg-background">
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {/* Brand Illustration Panel */}
        <div className="relative hidden lg:flex bg-brand-panel items-center justify-center p-8 overflow-hidden">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -end-20 h-60 w-60 rounded-full bg-[#006B5F]/20 blur-2xl" />

          {/* Top Brand Logo */}
          <Link href="/" className="absolute top-8 start-8 z-10 flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-white p-0.5 shadow-md ring-1 ring-[#006B5F]/20 transition-transform duration-200 group-hover:scale-105">
              <img src="/images/logo.png" alt="HealthyLife AI Logo" className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#006B5F]">{t.common.appName}</span>
          </Link>

          {/* Central Illustration with Ambient Glow & Floating AI Chips */}
          <div className="relative h-full w-full max-w-md flex items-center justify-center p-4 drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
            <img
              src="/images/brand-illustration.png"
              alt="HealthyLife AI Illustration"
              className="max-h-[80%] max-w-full object-contain object-center"
            />

            {/* Floating Badge 1 (Top End) */}
            <div className="absolute top-10 end-4 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-slow border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006B5F]/15 text-[#006B5F]">
                <span className="material-symbols-outlined text-lg">workspace_premium</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">خطط تغذية مخصصة</p>
                <p className="text-[9px] text-on-surface-variant font-medium">مصممة بالذكاء الاصطناعي</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Start) */}
            <div className="absolute bottom-10 start-4 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-reverse border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <span className="material-symbols-outlined text-lg">monitoring</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">متابعة فورية للماكروز</p>
                <p className="text-[9px] text-on-surface-variant font-medium">طاقة وتوازن مستدام</p>
              </div>
            </div>
          </div>
        </div>

        {/* Register Form Panel */}
        <div className="relative flex flex-col justify-between bg-surface p-6 sm:p-12 overflow-y-auto">
          {/* Header Navigation Bar with Home Button */}
          <div className="flex items-center justify-between w-full pb-4">
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-[#006B5F] lg:hidden">
              <div className="h-8 w-8 rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-[#006B5F]/20 overflow-hidden flex items-center justify-center">
                <img src="/images/logo.png" alt="HealthyLife AI Logo" className="h-full w-full object-contain" />
              </div>
              <span>{t.common.appName}</span>
            </Link>

            {/* Return to Home Button & Language Controls */}
            <div className="ms-auto flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" className="text-xs sm:text-sm font-semibold text-on-surface-variant hover:text-[#006B5F] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline-variant/30 hover:border-[#006B5F]/40 transition-all">
                  <span className="material-symbols-outlined text-base rtl:rotate-180">arrow_back</span>
                  <span>{t.common.backToHome || "العودة للرئيسية"}</span>
                </Button>
              </Link>
              <LanguageToggle />
            </div>
          </div>

          {/* Main Form Container */}
          <div className="mx-auto my-auto flex w-full max-w-[420px] flex-col gap-5 py-4 animate-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {t.auth.register.title}
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                {t.auth.register.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5" noValidate>
              <TextField
                label={t.auth.register.fullName}
                type="text"
                placeholder="Alex Morgan"
                autoComplete="name"
                error={errors.full_name && t.auth.validation.fullNameRequired}
                {...register("full_name")}
              />
              <TextField
                label={t.auth.register.email}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email && t.auth.validation.emailInvalid}
                {...register("email")}
              />
              <TextField
                label={t.auth.register.password}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                error={errors.password && t.auth.validation.passwordMin}
                trailingAction={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="material-symbols-outlined text-outline hover:text-on-surface transition-colors p-1"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </button>
                }
                {...register("password")}
              />
              <TextField
                label={t.auth.register.confirmPassword}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                error={
                  errors.password_confirmation &&
                  t.auth.register.passwordMismatch
                }
                {...register("password_confirmation")}
              />

              {serverError && (
                <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container border border-error/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span>
                  <span>{serverError}</span>
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isSubmitting}
                className="mt-2 bg-[#006B5F] hover:bg-[#00574d] active:bg-[#004038] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#006B5F]/25 hover:shadow-xl hover:shadow-[#006B5F]/35 transition-all duration-200"
              >
                {t.auth.register.submit}
              </Button>
            </form>

            <div className="pt-2 text-center text-sm text-on-surface-variant border-t border-outline-variant/30">
              <span>{t.auth.register.haveAccount} </span>
              <Link href="/login" className="font-bold text-[#006B5F] hover:underline underline-offset-4 ms-1">
                {t.auth.register.logIn}
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-on-surface-variant/60 text-center lg:text-start pt-4">
            &copy; {new Date().getFullYear()} {t.common.appName}. All rights reserved.
          </div>
        </div>
      </div>
    </main>
  );
}

