"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LocaleProvider";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Button } from "@/components/ui/Button";

export default function OnboardingPage() {
  const { t } = useTranslation();

  // Interactive Live Preview Calculator State
  const [selectedGoal, setSelectedGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [weightKg, setWeightKg] = useState<number>(72);

  // Live estimated calorie calculation (Mifflin-St Jeor preview approximation)
  const baseKcal = Math.round(weightKg * 22 * 1.35);
  const goalAdjustment = selectedGoal === "lose" ? -400 : selectedGoal === "gain" ? +350 : 0;
  const targetCalories = baseKcal + goalAdjustment;

  const proteinGrams = Math.round((targetCalories * 0.3) / 4);
  const carbsGrams = Math.round((targetCalories * 0.45) / 4);
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);

  return (
    <div className="min-h-screen w-full bg-background text-on-background flex flex-col font-sans antialiased selection:bg-[#006B5F]/20">
      {/* ── Top Header Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full glass-card border-b border-outline-variant/20 px-4 md:px-8 py-3 transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-10 w-10 overflow-hidden items-center justify-center rounded-xl bg-white p-0.5 shadow-md ring-1 ring-[#006B5F]/20 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="HealthyLife AI Logo"
                className="h-full w-full object-contain rounded-lg"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#006B5F]">
              {t.common.appName}
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
            <a href="#features" className="hover:text-[#006B5F] transition-colors">
              {t.onboarding.nav?.features || "المميزات"}
            </a>
            <a href="#calculator" className="hover:text-[#006B5F] transition-colors">
              {t.onboarding.nav?.calculator || "التجربة التفاعلية"}
            </a>
            <a href="#why-us" className="hover:text-[#006B5F] transition-colors">
              {t.onboarding.nav?.howItWorks || "كيف يعمل"}
            </a>
          </nav>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="text-sm font-semibold text-on-surface hover:text-[#006B5F]">
                {t.onboarding.logIn}
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#006B5F] hover:bg-[#00574d] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                {t.onboarding.getStarted}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section (Split Dual Panel with Floating AI Badges) ─── */}
      <section className="relative w-full overflow-hidden py-8 md:py-16 px-4 md:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Hero Text & CTA Panel */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-up">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#006B5F]/10 px-3.5 py-1.5 text-xs font-semibold text-[#006B5F] border border-[#006B5F]/20">
              {t.onboarding.hero?.badge || "✨ الجيل الجديد من التغذية بالذكاء الاصطناعي"}
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface leading-[1.15]">
              {t.onboarding.hero?.headingLine1 || "تغذية صحية وذكية،"}{" "}
              <span className="bg-gradient-to-r from-[#006B5F] via-[#00897B] to-[#4CD5BF] bg-clip-text text-transparent">
                {t.onboarding.hero?.headingLine2 || "مُصممة بالذكاء الاصطناعي لأجلك"}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl">
              {t.onboarding.hero?.subtitle || t.onboarding.tagline}
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#006B5F] hover:bg-[#00574d] text-white text-base font-semibold px-8 py-4 rounded-xl shadow-lg shadow-[#006B5F]/25 hover:shadow-xl hover:shadow-[#006B5F]/35 transition-all duration-200">
                  {t.onboarding.hero?.ctaPrimary || t.onboarding.getStarted}
                  <span className="material-symbols-outlined ms-2 text-xl rtl:rotate-180">
                    arrow_forward
                  </span>
                </Button>
              </Link>
              <a href="#calculator" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto border-[#006B5F]/30 text-[#006B5F] hover:bg-[#006B5F]/5 text-base font-semibold px-6 py-4 rounded-xl">
                  <span className="material-symbols-outlined me-2 text-xl">calculate</span>
                  {t.onboarding.hero?.ctaSecondary || "جرب الحاسبة الحية"}
                </Button>
              </a>
            </div>

            {/* Trust Points */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-on-surface-variant/80 border-t border-outline-variant/30">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006B5F]">check_circle</span>
                <span>{t.onboarding.hero?.trustNoCard || "بدون بطاقة إئتمان"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006B5F]">verified</span>
                <span>{t.onboarding.hero?.trustScience || "معادلات علمية معتمدة"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#006B5F]">translate</span>
                <span>{t.onboarding.hero?.trustArSupport || "دعم العربي والإنجليزي"}</span>
              </div>
            </div>
          </div>

          {/* Hero Brand Illustration Panel with Dynamic AI Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px] lg:min-h-[460px] rounded-3xl bg-brand-panel p-6 overflow-hidden shadow-xl border border-white/60">
            {/* Ambient Lighting & Glow Blobs */}
            <div className="pointer-events-none absolute -top-16 -start-16 h-64 w-64 rounded-full bg-white/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -end-16 h-64 w-64 rounded-full bg-[#006B5F]/20 blur-2xl" />

            {/* Illustration */}
            <div className="relative z-10 max-w-xs sm:max-w-sm drop-shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <img
                src="/images/brand-illustration.png"
                alt="HealthyLife AI Illustration"
                className="h-auto w-full object-contain"
              />
            </div>

            {/* Floating Badge 1 (Top Start) */}
            <div className="absolute top-6 start-6 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-slow border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                <span className="material-symbols-outlined text-lg">local_fire_department</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">
                  {t.onboarding.floatingBadges?.targetCal || "الهدف: 2,100 سعرة"}
                </p>
                <p className="text-[9px] text-on-surface-variant font-medium">مُحسّنة طوال اليوم</p>
              </div>
            </div>

            {/* Floating Badge 2 (Bottom End) */}
            <div className="absolute bottom-6 end-6 z-20 glass-card px-3.5 py-2.5 rounded-2xl shadow-lg flex items-center gap-2.5 animate-float-reverse border border-white/80">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#006B5F]/15 text-[#006B5F]">
                <span className="material-symbols-outlined text-lg">fitness_center</span>
              </div>
              <div>
                <p className="text-[11px] font-bold text-on-surface">
                  {t.onboarding.floatingBadges?.proteinRatio || "140g بروتين"}
                </p>
                <p className="text-[9px] text-on-surface-variant font-medium">تغطي احتياجك العضلي</p>
              </div>
            </div>

            {/* Floating Badge 3 (Center Floating Chip) */}
            <div className="absolute top-1/2 -translate-y-1/2 end-4 z-20 glass-card px-3 py-1.5 rounded-full shadow-md flex items-center gap-2 border border-white/80">
              <span className="material-symbols-outlined text-sm text-[#006B5F]">sparkles</span>
              <span className="text-[10px] font-bold text-[#006B5F]">
                {t.onboarding.floatingBadges?.aiScore || "تقييم AI: 98% توازن"}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── Live Interactive AI Nutrition Preview Section ───────────── */}
      <section id="calculator" className="w-full bg-surface-container-lowest py-16 px-4 md:px-8 border-y border-outline-variant/20">
        <div className="mx-auto max-w-5xl">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block rounded-full bg-[#006B5F]/10 px-3 py-1 text-xs font-semibold text-[#006B5F] mb-3">
              {t.onboarding.calculatorPreview?.sectionBadge || "أداة تفاعلية"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">
              {t.onboarding.calculatorPreview?.title || "شاهد كيف يحسب الذكاء الاصطناعي هدفك مباشرة"}
            </h2>
            <p className="text-sm sm:text-base text-on-surface-variant mt-2">
              {t.onboarding.calculatorPreview?.subtitle || "قم بتعديل وزنك الحالي وهدفك لتستكشف كيف يحسب محرك الذكاء الاصطناعي احتياجك اليومي المثالي."}
            </p>
          </div>

          {/* Interactive Calculator Card */}
          <div className="rounded-3xl bg-background p-6 sm:p-10 shadow-xl border border-outline-variant/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
                  {t.onboarding.calculatorPreview?.selectGoal || "اختر هدفك الرئيسي"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGoal("lose")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedGoal === "lose"
                        ? "border-[#006B5F] bg-[#006B5F]/10 text-[#006B5F] shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-[#006B5F]/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">trending_down</span>
                    <span>{t.onboarding.calculatorPreview?.goalLose || "خسارة الدهون"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGoal("maintain")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedGoal === "maintain"
                        ? "border-[#006B5F] bg-[#006B5F]/10 text-[#006B5F] shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-[#006B5F]/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">drag_handle</span>
                    <span>{t.onboarding.calculatorPreview?.goalMaintain || "الحفاظ على الوزن"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedGoal("gain")}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-semibold transition-all ${
                      selectedGoal === "gain"
                        ? "border-[#006B5F] bg-[#006B5F]/10 text-[#006B5F] shadow-sm"
                        : "border-outline-variant/40 bg-surface-container-lowest text-on-surface-variant hover:border-[#006B5F]/40"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl mb-1">trending_up</span>
                    <span>{t.onboarding.calculatorPreview?.goalGain || "بناء العضلات"}</span>
                  </button>
                </div>
              </div>

              {/* Weight Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  <span>{t.onboarding.calculatorPreview?.weightLabel || "الوزن الحالي (كجم)"}</span>
                  <span className="text-base font-extrabold text-[#006B5F] lowercase">{weightKg} kg</span>
                </div>
                <input
                  type="range"
                  min={45}
                  max={130}
                  step={1}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-[#006B5F]"
                />
                <div className="flex justify-between text-[10px] text-on-surface-variant/60 mt-1">
                  <span>45 kg</span>
                  <span>85 kg</span>
                  <span>130 kg</span>
                </div>
              </div>
            </div>

            {/* Dynamic Results Display */}
            <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-[#006B5F] to-[#004D44] p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="pointer-events-none absolute -end-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-xl" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                    {t.onboarding.calculatorPreview?.resultTitle || "الهدف اليومي الموصى به من AI"}
                  </span>
                  <span className="material-symbols-outlined text-white/70">auto_awesome</span>
                </div>

                {/* Calorie Output */}
                <div className="flex items-baseline gap-2 my-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{targetCalories.toLocaleString()}</span>
                  <span className="text-sm font-semibold text-white/90">{t.onboarding.calculatorPreview?.kcalUnit || "سعرة / يوم"}</span>
                </div>
                <p className="text-[11px] text-white/75 mb-6">
                  {t.onboarding.calculatorPreview?.resultSubtitle || "محسوبة بمعادلة Mifflin-St Jeor + معاملات النشاط الذكية"}
                </p>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/20">
                <div className="rounded-xl bg-white/15 p-2.5 text-center">
                  <p className="text-[10px] text-white/80 uppercase font-semibold">{t.onboarding.calculatorPreview?.proteinLabel || "بروتين"}</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">{proteinGrams}g</p>
                </div>
                <div className="rounded-xl bg-white/15 p-2.5 text-center">
                  <p className="text-[10px] text-white/80 uppercase font-semibold">{t.onboarding.calculatorPreview?.carbsLabel || "كربوهيدرات"}</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">{carbsGrams}g</p>
                </div>
                <div className="rounded-xl bg-white/15 p-2.5 text-center">
                  <p className="text-[10px] text-white/80 uppercase font-semibold">{t.onboarding.calculatorPreview?.fatsLabel || "دهون"}</p>
                  <p className="text-sm sm:text-base font-bold text-white mt-0.5">{fatsGrams}g</p>
                </div>
              </div>

              {/* CTA Link inside Result */}
              <Link href="/register" className="mt-6 w-full">
                <Button className="w-full bg-white text-[#006B5F] hover:bg-white/90 font-bold py-3 text-xs sm:text-sm rounded-xl shadow-md transition-all">
                  {t.onboarding.calculatorPreview?.unlockFullPlan || "احصل على خطتك الشخصية الكاملة"}
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── Features Bento Grid Showcase ────────────────────────────── */}
      <section id="features" className="w-full py-16 md:py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block rounded-full bg-[#006B5F]/10 px-3.5 py-1.5 text-xs font-semibold text-[#006B5F] mb-3">
              {t.onboarding.features?.sectionBadge || "لماذا هيلثي لايف AI؟"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-on-surface">
              {t.onboarding.features?.title || "كل ما تحتاجه لحياة مفعمة بالحيوية والنشاط"}
            </h2>
            <p className="text-base text-on-surface-variant mt-3">
              {t.onboarding.features?.subtitle || "مصمم بأسلوب متناغم يجمع بين الوضوح، الدقة العلمية، وسهولة الاستخدام."}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: AI Engine (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 rounded-3xl bg-surface-container-lowest p-8 shadow-md border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#006B5F]/10 text-[#006B5F]">
                  <span className="material-symbols-outlined text-2xl">psychology</span>
                </div>
                <span className="text-xs font-bold text-[#006B5F] bg-[#006B5F]/10 px-2.5 py-1 rounded-full">
                  AI Biometrics
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {t.onboarding.features?.aiEngineTitle || "محرك الذكاء الاصطناعي الحيوي"}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.onboarding.features?.aiEngineDesc || "يحسب معدل الأيض الأساسي BMR والاحتياج اليومي TDEE وفقاً لعمرك، جنسك، وقياساتك ومستوى نشاطك."}
                </p>
              </div>
            </div>

            {/* Card 2: Weight & Progress Trend */}
            <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-md border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-6">
                <span className="material-symbols-outlined text-2xl">show_chart</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {t.onboarding.features?.trackerTitle || "تتبع مسار الوزن والتقدم"}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.onboarding.features?.trackerDesc || "تحليل بصري سلس ينقي التذبذبات اليومية ليعرض لك التغير الحقيقي في تركيبة جسمك بثبات."}
                </p>
              </div>
            </div>

            {/* Card 3: Instant Macro Breakdown */}
            <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-md border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-600 mb-6">
                <span className="material-symbols-outlined text-2xl">pie_chart</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {t.onboarding.features?.macroTitle || "توزيع فوري للمغذيات"}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.onboarding.features?.macroDesc || "تقسيم مثالي للبروتينات، الكربوهيدرات، والدهون الصحية المصممة لدعم طاقتك طوال اليوم."}
                </p>
              </div>
            </div>

            {/* Card 4: Security & Privacy (Spans 2 columns on lg) */}
            <div className="lg:col-span-2 rounded-3xl bg-surface-container-lowest p-8 shadow-md border border-outline-variant/30 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                  <span className="material-symbols-outlined text-2xl">shield_lock</span>
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-500/10 px-2.5 py-1 rounded-full">
                  Bank-Grade Encryption
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-2">
                  {t.onboarding.features?.privacyTitle || "أمان وخصوصية تامة"}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {t.onboarding.features?.privacyDesc || "بياناتك الحيوية والصحية تشفر وتُحفظ وفق أعلى معايير الخصوصية والأمان الرقمي."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Impact Metrics & Statistics Bar ─────────────────────────── */}
      <section className="w-full bg-[#006B5F] text-white py-14 px-4 md:px-8">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">
              {t.onboarding.metrics?.tracked || "+50,000"}
            </p>
            <p className="text-sm font-medium text-white/80">
              {t.onboarding.metrics?.trackedLabel || "وجبة محللة بالذكاء الاصطناعي"}
            </p>
          </div>
          <div className="p-4 border-y md:border-y-0 md:border-x border-white/20">
            <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">
              {t.onboarding.metrics?.accuracy || "99.4%"}
            </p>
            <p className="text-sm font-medium text-white/80">
              {t.onboarding.metrics?.accuracyLabel || "دقة الحسابات الحيوية"}
            </p>
          </div>
          <div className="p-4">
            <p className="text-4xl sm:text-5xl font-black tracking-tight mb-1">
              {t.onboarding.metrics?.rating || "4.9 / 5"}
            </p>
            <p className="text-sm font-medium text-white/80">
              {t.onboarding.metrics?.ratingLabel || "تقييم رضا المستخدمين"}
            </p>
          </div>
        </div>
      </section>

      {/* ── Testimonials Spotlight ─────────────────────────────────── */}
      <section className="w-full py-16 px-4 md:px-8 bg-surface-container-lowest">
        <div className="mx-auto max-w-4xl rounded-3xl bg-background p-8 md:p-12 shadow-lg border border-outline-variant/30 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center gap-1 text-amber-500 mb-4">
            <span className="material-symbols-outlined text-xl">star</span>
            <span className="material-symbols-outlined text-xl">star</span>
            <span className="material-symbols-outlined text-xl">star</span>
            <span className="material-symbols-outlined text-xl">star</span>
            <span className="material-symbols-outlined text-xl">star</span>
          </div>
          <p className="text-base sm:text-xl font-medium text-on-surface italic max-w-2xl mx-auto leading-relaxed">
            "{t.onboarding.testimonial?.quote || "غير هيلثي لايف AI أسلوب تغذيتي تماماً! بدلاً من تطبيقات التتبع المعقدة، حصلت على أهداف دقيقة ومتناغمة مع نشاطي اليومي وطاقتي."}"
          </p>
          <div className="mt-6 flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-[#006B5F] text-white flex items-center justify-center text-lg font-bold shadow-md mb-2">
              س
            </div>
            <p className="text-sm font-bold text-on-surface">{t.onboarding.testimonial?.author || "سارة م."}</p>
            <p className="text-xs text-on-surface-variant font-medium">{t.onboarding.testimonial?.role || "مهتمة باللياقة والصحة العامة"}</p>
          </div>
        </div>
      </section>

      {/* ── Modern Footer ───────────────────────────────────────────── */}
      <footer className="w-full bg-background border-t border-outline-variant/30 py-8 px-4 md:px-8 text-xs text-on-surface-variant">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-6 w-6 rounded-md bg-white p-0.5 shadow-sm ring-1 ring-[#006B5F]/20 overflow-hidden flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="HealthyLife AI Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-bold text-on-surface">{t.common.appName}</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-center sm:text-start">
            {t.onboarding.footer?.tagline || "تمكين الحياة الصحية باستخدام تكنولوجيا الذكاء الاصطناعي الذكية."}
          </p>
        </div>
      </footer>
    </div>
  );
}

