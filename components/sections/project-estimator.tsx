"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator, Check, Clock3, Layers3, Sparkles, Zap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

type ProjectKind = "corporate" | "ecommerce" | "saas" | "mobile" | "ai";
type AddonKey = "cms" | "bilingual" | "payments" | "companion" | "integrations";
type PaceKey = "standard" | "fast";

type KindOption = {
  id: ProjectKind;
  label: { ar: string; en: string };
  summary: { ar: string; en: string };
  baseWeeks: [number, number];
  baseBudget: [number, number];
  stack: string[];
};

const projectKinds: KindOption[] = [
  {
    id: "corporate",
    label: { ar: "موقع شركة / منصة تسويقية", en: "Marketing / Company Site" },
    summary: { ar: "موقع سريع بهوية بصرية قوية وتحسين SEO", en: "High-speed site with strong visual identity & SEO" },
    baseWeeks: [3, 5],
    baseBudget: [2500, 4500],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel / CDN"],
  },
  {
    id: "ecommerce",
    label: { ar: "متجر إلكتروني متكامل", en: "Custom E-Commerce" },
    summary: { ar: "كتالوج منتجات، سلة، دفع إلكتروني وإدارة طلبات", en: "Catalog, cart, online checkout & order management" },
    baseWeeks: [5, 8],
    baseBudget: [5000, 9000],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Payment Gateway"],
  },
  {
    id: "saas",
    label: { ar: "منصة ويب / تطبيق SaaS", en: "Web Platform / SaaS" },
    summary: { ar: "حسابات، صلاحيات أدوار، لوحات بيانات واشتراكات", en: "Auth, RBAC dashboards, analytics & subscriptions" },
    baseWeeks: [6, 10],
    baseBudget: [7500, 14000],
    stack: ["Next.js", "PostgreSQL", "Firebase Auth", "Docker"],
  },
  {
    id: "mobile",
    label: { ar: "تطبيق جوال iOS & Android", en: "iOS & Android Mobile App" },
    summary: { ar: "تطبيق متكامل للنشر على App Store وGoogle Play", en: "Cross-platform mobile app ready for both stores" },
    baseWeeks: [7, 11],
    baseBudget: [8000, 15000],
    stack: ["Flutter / React Native", "Firebase", "REST API", "Push Notifications"],
  },
  {
    id: "ai",
    label: { ar: "نظام ذكاء اصطناعي وأتمتة", en: "AI Workflow & Automation" },
    summary: { ar: "ربط نماذج ذكية ببياناتك وأتمتة المهام التشغيلية", en: "Custom AI assistants, semantic search & workflows" },
    baseWeeks: [4, 7],
    baseBudget: [4500, 8500],
    stack: ["Next.js", "Python & FastAPI", "Gemini / AI SDKs", "PostgreSQL"],
  },
];

const addonOptions: {
  key: AddonKey;
  label: { ar: string; en: string };
  weeks: number;
  budget: number;
}[] = [
  { key: "cms", label: { ar: "لوحة تحكم لإدارة المحتوى", en: "Built-in Admin CMS" }, weeks: 1, budget: 900 },
  { key: "bilingual", label: { ar: "دعم ثنائي اللغة RTL/LTR", en: "Bilingual RTL/LTR Support" }, weeks: 1, budget: 800 },
  { key: "payments", label: { ar: "بوابة دفع وفوترة إلكترونية", en: "Payments & Invoicing" }, weeks: 2, budget: 1500 },
  { key: "companion", label: { ar: "تكامل إشعارات أو تطبيق مرافق", en: "Real-time Push / Sync" }, weeks: 2, budget: 1800 },
  { key: "integrations", label: { ar: "ربط أنظمة خارجية وAPIs", en: "External API Integrations" }, weeks: 1, budget: 1100 },
];

export function ProjectEstimator({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const [kind, setKind] = useState<ProjectKind>("saas");
  const [addons, setAddons] = useState<AddonKey[]>(["cms", "bilingual"]);
  const [pace, setPace] = useState<PaceKey>("standard");

  const toggleAddon = (key: AddonKey) => {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const result = useMemo(() => {
    const selectedKind = projectKinds.find((k) => k.id === kind) ?? projectKinds[0];
    const selectedAddons = addonOptions.filter((a) => addons.includes(a.key));

    const extraWeeks = selectedAddons.reduce((sum, a) => sum + a.weeks, 0);
    const extraBudget = selectedAddons.reduce((sum, a) => sum + a.budget, 0);

    const paceTimeMultiplier = pace === "fast" ? 0.78 : 1;
    const paceCostMultiplier = pace === "fast" ? 1.2 : 1;

    const minWeeks = Math.max(2, Math.round((selectedKind.baseWeeks[0] + extraWeeks) * paceTimeMultiplier));
    const maxWeeks = Math.max(minWeeks + 1, Math.round((selectedKind.baseWeeks[1] + extraWeeks) * paceTimeMultiplier));

    const minBudget = Math.round(((selectedKind.baseBudget[0] + extraBudget) * paceCostMultiplier) / 100) * 100;
    const maxBudget = Math.round(((selectedKind.baseBudget[1] + extraBudget) * paceCostMultiplier) / 100) * 100;

    const addonLabels = selectedAddons.map((a) => (ar ? a.label.ar : a.label.en));
    const briefLines = ar
      ? [
          `نوع المشروع: ${selectedKind.label.ar}`,
          addonLabels.length > 0 ? `المزايا المطلوبة: ${addonLabels.join("، ")}` : "المزايا المطلوبة: النطاق الأساسي",
          `وتيرة التنفيذ: ${pace === "fast" ? "مسار متسارع" : "قياسي"}`,
          `التقدير الأولي: ${minWeeks}–${maxWeeks} أسابيع (${minBudget.toLocaleString("en-US")}$ – ${maxBudget.toLocaleString("en-US")}$)`,
          "الهدف والتفاصيل الإضافية:",
        ]
      : [
          `Project type: ${selectedKind.label.en}`,
          addonLabels.length > 0 ? `Requested capabilities: ${addonLabels.join(", ")}` : "Requested capabilities: Core scope",
          `Delivery pace: ${pace === "fast" ? "Fast-track" : "Standard"}`,
          `Initial estimate: ${minWeeks}–${maxWeeks} weeks ($${minBudget.toLocaleString("en-US")} – $${maxBudget.toLocaleString("en-US")})`,
          "Project goals & extra notes:",
        ];

    return {
      selectedKind,
      minWeeks,
      maxWeeks,
      minBudget,
      maxBudget,
      brief: briefLines.join("\n"),
    };
  }, [kind, addons, pace, ar]);

  return (
    <section id="estimator" className="section scroll-mt-20 border-t border-border bg-bg-elevated">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-widest rtl:tracking-normal text-primary">
              <Calculator className="size-3.5" aria-hidden />
              {ar ? "حاسبة تقدير المشروع" : "Interactive Scope Estimator"}
            </span>
            <h2 className="text-balance text-3xl font-semibold sm:text-4xl">
              {ar ? "قدّر نطاق مشروعك ووقته قبل أن تبدأ" : "Estimate timeline & scope before we talk"}
            </h2>
            <p className="max-w-2xl text-pretty text-muted">
              {ar
                ? "اختر نوع المنتج والمزايا الأساسية لتحصل على تصور فوري للمدة والتكلفة التقريبية، ثم أرسل الملخص جاهزاً لفريقنا بنقرة واحدة."
                : "Select your product type and key capabilities for an instant estimate range, then carry the formatted brief directly to our contact form."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} y={24}>
          <div className="gradient-border surface-card grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.25fr_0.85fr]">
            <div className="flex flex-col gap-7">
              {/* Step 1: Project kind */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal text-muted">
                  <Layers3 className="size-3.5 text-primary" aria-hidden />
                  <span>{ar ? "١. ما الذي تريد بناءه؟" : "1. What are we building?"}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {projectKinds.map((item) => {
                    const active = kind === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setKind(item.id)}
                        aria-pressed={active}
                        className={`flex flex-col items-start gap-1 rounded-xl border p-3.5 text-start transition-colors ${
                          active
                            ? "border-primary/60 bg-primary/10 text-text"
                            : "border-border bg-bg-elevated/70 text-muted hover:border-border-strong hover:text-text"
                        }`}
                      >
                        <span className="text-sm font-semibold text-text">
                          {ar ? item.label.ar : item.label.en}
                        </span>
                        <span className="text-xs leading-relaxed text-muted">
                          {ar ? item.summary.ar : item.summary.en}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Addons */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal text-muted">
                  <Sparkles className="size-3.5 text-accent" aria-hidden />
                  <span>{ar ? "٢. خصائص إضافية" : "2. Key capabilities"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {addonOptions.map((addon) => {
                    const active = addons.includes(addon.key);
                    return (
                      <button
                        key={addon.key}
                        type="button"
                        onClick={() => toggleAddon(addon.key)}
                        aria-pressed={active}
                        className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors ${
                          active
                            ? "border-accent/50 bg-accent/15 text-text"
                            : "border-border bg-bg-elevated/70 text-muted hover:text-text"
                        }`}
                      >
                        <span
                          className={`grid size-4 place-items-center rounded border ${
                            active
                              ? "border-accent bg-accent text-primary-fg"
                              : "border-border-strong bg-transparent"
                          }`}
                        >
                          {active ? <Check className="size-3" aria-hidden /> : null}
                        </span>
                        <span>{ar ? addon.label.ar : addon.label.en}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Pace */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider rtl:tracking-normal text-muted">
                  <Zap className="size-3.5 text-primary" aria-hidden />
                  <span>{ar ? "٣. سرعة الإطلاق" : "3. Delivery pace"}</span>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPace("standard")}
                    aria-pressed={pace === "standard"}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors ${
                      pace === "standard"
                        ? "border-primary/60 bg-primary/10 text-text"
                        : "border-border bg-bg-elevated/70 text-muted hover:text-text"
                    }`}
                  >
                    <span className="font-medium">{ar ? "مسار قياسي متوازن" : "Standard cadence"}</span>
                    <span className="text-xs text-muted">{ar ? "الأفضل قيمة" : "Best value"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPace("fast")}
                    aria-pressed={pace === "fast"}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-sm transition-colors ${
                      pace === "fast"
                        ? "border-primary/60 bg-primary/10 text-text"
                        : "border-border bg-bg-elevated/70 text-muted hover:text-text"
                    }`}
                  >
                    <span className="font-medium">{ar ? "مسار متسارع Priority" : "Fast-track priority"}</span>
                    <span className="text-xs text-muted">{ar ? "أسرع بـ ~٢٠٪" : "~20% faster"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Output summary panel */}
            <aside className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-bg-elevated p-6">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <span className="text-xs font-medium text-muted">
                    {ar ? "التقدير التفاعلي الفوري" : "Live scope summary"}
                  </span>
                  <Clock3 className="size-4 text-primary" aria-hidden />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted">
                      {ar ? "المدة المتوقعة للتنفيذ" : "Estimated timeline"}
                    </span>
                    <p className="text-2xl font-bold tabular-nums text-text sm:text-3xl">
                      {result.minWeeks}–{result.maxWeeks}{" "}
                      <span className="text-base font-medium text-muted">
                        {ar ? "أسابيع" : "weeks"}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted">
                      {ar ? "نطاق الاستثمار التقريبي" : "Indicative investment"}
                    </span>
                    <p className="text-2xl font-bold tabular-nums text-primary sm:text-3xl" dir="ltr">
                      ${result.minBudget.toLocaleString("en-US")} – ${result.maxBudget.toLocaleString("en-US")}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-border/80 pt-4">
                  <span className="text-xs font-medium text-muted">
                    {ar ? "المكدس المقترح:" : "Recommended stack:"}
                  </span>
                  <div dir="ltr" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-text">
                    {result.selectedKind.stack.map((tech, idx) => (
                      <span key={tech} className="inline-flex items-center gap-2">
                        {idx > 0 ? <span aria-hidden className="text-muted">·</span> : null}
                        <span>{tech}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-border pt-4">
                <Link
                  href={`/contact?brief=${encodeURIComponent(result.brief)}`}
                  className={buttonClass("primary", "lg", "w-full")}
                >
                  <span>{ar ? "اعتمد التقدير وتواصل معنا" : "Send this brief to our team"}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Link>
                <p className="text-[11px] leading-relaxed text-muted">
                  {ar
                    ? "الأرقام استرشادية وتُضبط بدقة بعد جلسة تحليل المتطلبات الأولى."
                    : "Ranges are indicative and finalized after a quick discovery review."}
                </p>
              </div>
            </aside>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
