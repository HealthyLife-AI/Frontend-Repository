"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div className="flex h-full w-full flex-col lg:flex-row">
        {/* Left Side: Brand Illustration */}
        <div className="relative hidden lg:flex lg:w-1/2 bg-[#d7efea] items-center justify-center p-8">
          <div className="absolute top-8 start-8 z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-[#006B5F]">nutrition</span>
            <span className="text-xl font-bold text-[#006B5F]">{t.common.appName}</span>
          </div>

          <div className="relative h-full w-full max-w-lg flex items-center justify-center p-4">
            <img
              src="/images/brand-illustration.png"
              alt="HealthyLife AI Illustration"
              className="max-h-full max-w-full object-contain object-center"
            />
          </div>
        </div>

        {/* Right Side: Register Form */}
        <div className="relative flex flex-1 flex-col justify-between bg-surface p-6 sm:p-12 lg:w-1/2 overflow-y-auto">
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
          <div className="mx-auto my-auto flex w-full max-w-[400px] flex-col gap-6 py-6">
            <div>
              <h1 className="text-2xl font-bold text-on-surface md:text-3xl">
                {t.auth.register.title}
              </h1>
              <p className="mt-2 text-sm text-on-surface-variant md:text-base">
                {t.auth.register.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
                    className="material-symbols-outlined text-outline hover:text-on-surface"
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
                <p className="rounded-lg bg-error-container px-4 py-2.5 text-sm text-on-error-container">
                  {serverError}
                </p>
              )}

              <Button type="submit" fullWidth loading={isSubmitting} className="mt-2 bg-[#006B5F] hover:bg-[#00574d] text-white py-3.5">
                {t.auth.register.submit}
              </Button>
            </form>

            <p className="text-center text-sm text-on-surface-variant">
              {t.auth.register.haveAccount}{" "}
              <Link href="/login" className="font-semibold text-[#006B5F] hover:underline">
                {t.auth.register.logIn}
              </Link>
            </p>
          </div>

          <div className="text-xs text-on-surface-variant/60 text-center lg:text-start">
            &copy; {new Date().getFullYear()} {t.common.appName}
          </div>
        </div>
      </div>
    </main>
  );
}
