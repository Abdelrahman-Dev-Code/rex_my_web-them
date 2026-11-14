import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import type { HomeContent } from "@/lib/data";

export async function Hero({ content }: { content: HomeContent }) {
  const { locale, site } = content;
  const t = await getTranslations({ locale, namespace: "hero" });
  const workspaceSlug = site.name.en.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "studio";

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 grid-backdrop opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-44 start-1/2 -z-10 h-[28rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_26%,transparent),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 end-0 -z-10 size-96 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_14%,transparent),transparent)]"
      />

      <div className="container-page grid items-center gap-14 pt-8 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-12 lg:pb-24">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-accent rtl:tracking-normal">
            <span aria-hidden className="h-px w-5 bg-accent/70" />
            {t("badge")}
          </span>

          <h1 className="text-balance text-[clamp(2.25rem,4.2vw,3.85rem)] font-semibold leading-[1.15]">
            {t("title")}{" "}
            <span className="text-gradient">{t("titleAccent")}</span>
          </h1>

          <p className="max-w-xl text-pretty text-base text-muted sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic strength={0.22}>
              <LinkButton href="/contact" size="lg">
                {t("ctaPrimary")}
                <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              </LinkButton>
            </Magnetic>
            <Magnetic strength={0.22}>
              <LinkButton href="/work" size="lg" variant="outline">
                {t("ctaSecondary")}
              </LinkButton>
            </Magnetic>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_30%_30%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_60%),radial-gradient(circle_at_80%_80%,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_60%)]"
          />
          <Parallax speed={0.08} className="relative">
            <div dir="ltr" className="surface-card overflow-hidden p-0">
              <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-danger/80" />
                  <span className="size-2.5 rounded-full bg-amber-400/80" />
                  <span className="size-2.5 rounded-full bg-success/80" />
                  <span className="ms-2 text-xs text-muted">{workspaceSlug}/app/[locale]/page.tsx</span>
                </div>
                <span className="text-[11px] font-medium text-muted">TypeScript</span>
              </div>
              <pre className="overflow-x-auto p-5 text-[0.8rem] leading-6 text-muted">
                <code>{`export default async function Page({ params }) {
  const { locale } = await params;
  const content = await getHomeContent(locale);

  return (
    <main dir="${locale === "ar" ? "rtl" : "ltr"}">
      <Hero content={content} />
      <Services content={content} />
      <TechStack content={content} />
    </main>
  );
}`}</code>
              </pre>
              <div className="grid grid-cols-4 divide-x divide-border border-t border-border bg-bg-elevated/60 text-center text-[11px]">
                <div className="px-2 py-2.5">
                  <span className="block font-semibold text-text">Next.js 16</span>
                  <span className="text-muted">App Router</span>
                </div>
                <div className="px-2 py-2.5">
                  <span className="block font-semibold text-accent">RTL / LTR</span>
                  <span className="text-muted">Bilingual</span>
                </div>
                <div className="px-2 py-2.5">
                  <span className="block font-semibold text-text">Firebase</span>
                  <span className="text-muted">Firestore</span>
                </div>
                <div className="px-2 py-2.5">
                  <span className="block font-semibold text-primary">WCAG AA</span>
                  <span className="text-muted">Accessible</span>
                </div>
              </div>
            </div>
          </Parallax>
        </div>
      </div>

      <div className="container-page flex pb-10">
        <div className="flex items-center gap-2.5 text-xs text-muted">
          <span
            aria-hidden
            className="relative flex h-9 w-5 items-start justify-center rounded-full border border-border p-1"
          >
            <span className="size-1 rounded-full bg-primary motion-safe:animate-scroll-cue" />
          </span>
          {t("scroll")}
        </div>
      </div>
    </section>
  );
}