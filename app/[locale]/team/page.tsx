import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/content/site";
import { alternatesFor } from "@/lib/seo";
import { getHomeContent } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "team" });

  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: alternatesFor(l, "/team"),
  };
}

export default async function TeamPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "team" });
  const content = await getHomeContent(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page flex flex-col gap-8">
          {content.team.some((member) => member.placeholder) ? (
            <Reveal>
              <p className="rounded-xl border border-border bg-bg-elevated px-4 py-3 text-xs leading-relaxed text-muted">
                {t("notice")}
              </p>
            </Reveal>
          ) : null}

          {content.team.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              {locale === "ar" ? "لا توجد ملفات أعضاء مضافة حالياً." : "No team profiles added yet."}
            </div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {content.team.map((member, index) => {
                const accents = [
                  "border-primary/35 bg-primary/10 text-primary",
                  "border-accent/35 bg-accent/10 text-accent",
                  "border-sky-400/35 bg-sky-400/10 text-sky-600 dark:text-sky-400",
                  "border-amber-400/35 bg-amber-400/10 text-amber-600 dark:text-amber-400",
                ];
                const displayName = member.name
                  ? pickLocale(member.name, locale)
                  : pickLocale(member.role, locale);
                const displayRole = member.name ? pickLocale(member.role, locale) : null;
                return (
                  <li key={member.slug} className="h-full">
                    <Reveal delay={index * 0.06} y={26} className="h-full">
                      <article className="gradient-border surface-card group relative flex h-full flex-col gap-4 p-6 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2">
                        <div className="flex items-start justify-between gap-3">
                          <span
                            aria-hidden
                            className={`grid size-12 place-items-center rounded-2xl border text-sm font-bold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${
                              accents[index % accents.length]
                            }`}
                          >
                            {member.initials}
                          </span>
                          {member.placeholder ? (
                            <span className="text-[11px] uppercase tracking-wider rtl:tracking-normal text-muted">
                              {t("placeholder")}
                            </span>
                          ) : null}
                        </div>
                        <div className="flex flex-col gap-1">
                          <h2 className="text-base font-semibold text-text">
                            <bdi>{displayName}</bdi>
                          </h2>
                          {displayRole ? (
                            <p className="text-xs font-medium text-primary">
                              <bdi>{displayRole}</bdi>
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm leading-relaxed text-muted">
                            {pickLocale(member.focus, locale)}
                          </p>
                        </div>
                        {member.stack.length > 0 ? (
                          <div
                            dir="ltr"
                            className="mt-auto flex flex-wrap items-center gap-x-1.5 gap-y-0.5 border-t border-border/70 pt-3 text-[11px] text-muted"
                          >
                            {member.stack.slice(0, 3).map((item, stackIdx) => (
                              <span key={item} className="inline-flex items-center gap-1.5">
                                {stackIdx > 0 ? <span aria-hidden>·</span> : null}
                                <span>{item}</span>
                              </span>
                            ))}
                          </div>
                        ) : null}
                        <Link
                          href={`/team/${member.slug}`}
                          aria-label={displayRole ? `${displayName} — ${displayRole}` : displayName}
                          className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2"
                        />
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}