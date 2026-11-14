import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Process({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.process.length === 0) return null;

  const t = await getTranslations({ locale, namespace: "process" });

  return (
    <section id="process" className="section scroll-mt-20">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />
        </Reveal>

        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.process.map((step, index) => (
            <li key={`${step.number}-${index}`} className="h-full">
              <Reveal delay={index * 0.08} y={34} className="h-full">
                <div className="gradient-border surface-card group relative flex h-full flex-col gap-3 overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40">
                  <span
                    aria-hidden
                    className="absolute -end-6 -top-6 text-6xl font-bold tabular-nums text-primary/10 transition-transform duration-500 group-hover:scale-110"
                  >
                    {step.number}
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-primary" dir="ltr">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-semibold">
                    <bdi>{pickLocale(step.title, locale)}</bdi>
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {pickLocale(step.description, locale)}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}