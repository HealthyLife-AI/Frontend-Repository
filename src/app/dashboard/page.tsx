"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";
import { logout } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      useAuthStore.getState().clear();
      router.replace("/login");
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-e border-outline-variant bg-surface shrink-0">
          <div className="flex items-center gap-3 px-6 py-5 border-b border-outline-variant">
            <span className="material-symbols-outlined text-2xl text-[#006B5F]">nutrition</span>
            <span className="text-lg font-bold text-[#006B5F]">{t.common.appName}</span>
          </div>

          <nav className="flex-1 space-y-1 px-4 py-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg bg-surface-container px-4 py-3 text-sm font-semibold text-[#006B5F]"
            >
              <span className="material-symbols-outlined">space_dashboard</span>
              <span>{t.dashboard.title}</span>
            </Link>
            <Link
              href="/weight"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">monitor_weight</span>
              <span>{t.weight.title}</span>
            </Link>
            <Link
              href="/setup/step-1"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">tune</span>
              <span>{t.setup.steps.profile}</span>
            </Link>
          </nav>

          <div className="border-t border-outline-variant p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-error hover:bg-error-container/20 transition-colors"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>{t.dashboard.logout}</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="h-16 bg-surface border-b border-outline-variant flex items-center justify-between px-6 shrink-0">
            <div>
              <h1 className="text-lg font-bold text-on-surface">
                {user?.full_name ? `${t.common.appName} - ${user.full_name}` : t.dashboard.title}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button
                onClick={handleLogout}
                className="md:hidden flex items-center justify-center p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </header>

          {/* Dashboard Canvas */}
          <div className="flex-1 overflow-y-auto p-6 bg-surface-container-lowest">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
              {/* Left Column */}
              <div className="lg:w-2/3 flex flex-col gap-6">
                {/* Daily Calorie Progress Hero Card */}
                <div className="bg-surface rounded-xl p-6 border border-outline-variant/40 elevation-card">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-on-surface">{t.setup.results.calorieTarget}</h2>
                    <Link href="/weight">
                      <Button className="bg-[#006B5F] hover:bg-[#00574d] text-white text-xs px-4 py-2">
                        <span className="material-symbols-outlined text-sm">add</span>
                        {t.weight.logWeight}
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-2">
                    {/* Progress Ring */}
                    <div className="relative w-44 h-44 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-surface-container-high stroke-current"
                          cx="50"
                          cy="50"
                          fill="transparent"
                          r="40"
                          strokeWidth="8"
                        />
                        <circle
                          className="text-[#006B5F] stroke-current"
                          cx="50"
                          cy="50"
                          fill="transparent"
                          r="40"
                          strokeWidth="8"
                          strokeDasharray="251.2"
                          strokeDashoffset="70"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-[#006B5F]">1,650</span>
                        <span className="text-xs text-on-surface-variant mt-0.5">/ 2,100 {t.setup.results.kcal}</span>
                      </div>
                    </div>

                    {/* Macros Progress */}
                    <div className="flex flex-col gap-5 w-full md:w-64">
                      {/* Protein */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-on-surface">{t.setup.results.protein}</span>
                          <span className="text-on-surface-variant">95g / 140g</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-[#006B5F] rounded-full" style={{ width: "68%" }} />
                        </div>
                      </div>

                      {/* Carbs */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-on-surface">{t.setup.results.carbs}</span>
                          <span className="text-on-surface-variant">180g / 230g</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary rounded-full" style={{ width: "78%" }} />
                        </div>
                      </div>

                      {/* Fats */}
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-on-surface">{t.setup.results.fats}</span>
                          <span className="text-on-surface-variant">45g / 65g</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
                          <div className="h-full bg-secondary rounded-full" style={{ width: "65%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:w-1/3 flex flex-col gap-6">
                {/* Weight Trend Card */}
                <div className="bg-surface rounded-xl p-6 border border-outline-variant/40 elevation-card flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base font-bold text-on-surface">{t.weight.title}</h3>
                    <div className="text-xl font-bold text-[#006B5F]">
                      72.4 <span className="text-xs font-normal text-on-surface-variant">{t.setup.step2.kg}</span>
                    </div>
                  </div>

                  <div className="h-28 w-full bg-surface-container-lowest rounded-lg border border-outline-variant/30 relative overflow-hidden flex items-end p-2">
                    <svg className="w-full h-full text-[#006B5F]" preserveAspectRatio="none" viewBox="0 0 100 50">
                      <polyline
                        fill="none"
                        points="0,40 20,35 40,38 60,25 80,28 100,20"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <Link href="/weight" className="mt-4 inline-block text-end">
                    <span className="text-xs font-semibold text-[#006B5F] hover:underline">
                      {t.weight.history} &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
