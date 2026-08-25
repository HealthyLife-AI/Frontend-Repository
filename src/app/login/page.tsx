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
          <div className="pointer-events-none absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -end-20 h-60 w-60 rounded-full bg-[#006B5F]/15 blur-2xl" />

          <div className="absolute top-8 start-8 z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#006B5F]">nutrition</span>
            <span className="text-xl font-bold text-[#006B5F]">{t.common.appName}</span>
          </div>

          <div className="relative h-full w-full max-w-lg flex items-center justify-center p-4 drop-shadow-lg">
            <img
              src="/images/brand-illustration.png"
              alt="HealthyLife AI Illustration"
              className="max-h-full max-w-full object-contain object-center"
            />
          </div>
        </div>

        {/* Form Panel */}
        <div className="relative flex flex-col justify-between bg-surface p-6 sm:p-12 overflow-y-auto">
          {/* Header Bar */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-lg font-bold text-[#006B5F] lg:hidden">
              <span className="material-symbols-outlined">nutrition</span>
              {t.common.appName}
            </div>
            <div className="ms-auto">
              <LanguageToggle />
            </div>
          </div>

          {/* Form Container */}
          <div className="mx-auto my-auto flex w-full max-w-[400px] flex-col gap-6 py-6 animate-fade-up">
            <div>
              <h1 className="text-2xl font-bold text-on-surface md:text-3xl">
                {t.auth.login.title}
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant md:text-base">
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
                    className="material-symbols-outlined text-outline hover:text-on-surface transition-colors"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? "visibility" : "visibility_off"}
                  </button>
                }
                {...register("password")}
              />

              {serverError && (
                <p className="rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container border border-error/20">
                  {serverError}
                </p>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isSubmitting}
                className="mt-2 bg-[#006B5F] hover:bg-[#00574d] active:bg-[#004038] text-white py-3.5 rounded-xl shadow-[0_4px_14px_rgba(0,107,95,0.30)] hover:shadow-[0_6px_20px_rgba(0,107,95,0.40)] transition-all duration-200"
              >
                {t.auth.login.submit}
              </Button>
            </form>

            <p className="text-center text-sm text-on-surface-variant">
              {t.auth.login.noAccount}{" "}
              <Link href="/register" className="font-semibold text-[#006B5F] hover:underline underline-offset-2">
                {t.auth.login.signUp}
              </Link>
            </p>
          </div>

          <div className="text-xs text-on-surface-variant/50 text-center lg:text-start">
            &copy; {new Date().getFullYear()} {t.common.appName}
          </div>
        </div>
      </div>
    </main>
  );
}
