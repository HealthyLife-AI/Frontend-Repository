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
import { login as loginRequest } from "@/lib/api/auth";
import { getHealthProfile } from "@/lib/api/profile";
import { extractErrorMessage, isLockedError } from "@/lib/api/client";
import { useAuthStore } from "@/store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const { t } = useTranslation();
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
      const data = await loginRequest(values);
      useAuthStore.getState().setAccessToken(data.authorization.access_token);
      if (data.user) useAuthStore.getState().setUser(data.user);

      try {
        await getHealthProfile();
        useAuthStore.getState().setHasHealthProfile(true);
        router.push("/dashboard");
      } catch {
        router.push("/setup/step-1");
      }
    } catch (err) {
      if (isLockedError(err)) {
        setServerError(t.auth.login.locked);
      } else {
        setServerError(extractErrorMessage(err, t.auth.login.invalidCredentials));
      }
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

          {/* Central Illustration with Ambient Glow */}
          <div className="relative h-full w-full max-w-md flex items-center justify-center p-4 drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
            <img
              src="/images/brand-illustration.png"
              alt="HealthyLife AI Illustration"
              className="max-h-[80%] max-w-full object-contain object-center"
            />

            {/* Floating Badge 1 (Top End) */}
            <div className="absolute top-12 end-6 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-slow border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006B5F]/15 text-[#006B5F]">
                <span className="material-symbols-outlined text-lg">verified_user</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">دخول آمن ومشفر</p>
                <p className="text-[9px] text-on-surface-variant font-medium">حماية 100% للبيانات</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom Start) */}
            <div className="absolute bottom-12 start-6 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-reverse border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">ذكاء اصطناعي تفاعلي</p>
                <p className="text-[9px] text-on-surface-variant font-medium">رؤى مخصصة يومياً</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
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
          <div className="mx-auto my-auto flex w-full max-w-[420px] flex-col gap-6 py-6 animate-fade-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">
                {t.auth.login.title}
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                {t.auth.login.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              <TextField
                label={t.auth.login.email}
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                error={errors.email && t.auth.validation.emailInvalid}
                {...register("email")}
              />

              <TextField
                label={t.auth.login.password}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
                className="mt-3 bg-[#006B5F] hover:bg-[#00574d] active:bg-[#004038] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#006B5F]/25 hover:shadow-xl hover:shadow-[#006B5F]/35 transition-all duration-200"
              >
                {t.auth.login.submit}
              </Button>
            </form>

            <div className="pt-2 text-center text-sm text-on-surface-variant border-t border-outline-variant/30">
              <span>{t.auth.login.noAccount} </span>
              <Link href="/register" className="font-bold text-[#006B5F] hover:underline underline-offset-4 ms-1">
                {t.auth.login.signUp}
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

