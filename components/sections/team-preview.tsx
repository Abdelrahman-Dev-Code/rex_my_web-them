import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { pickLocale, type Member } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/button";

const roleAccents = [
  "border-primary/35 bg-primary/10 text-primary",
  "border-accent/35 bg-accent/10 text-accent",
  "border-sky-400/35 bg-sky-400/10 text-sky-600 dark:text-sky-400",
  "border-amber-400/35 bg-amber-400/10 text-amber-600 dark:text-amber-400",
];

export async function TeamPreview({
  members,
  locale,
}: {
  members: Member[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "team" });
  if (members.length === 0) return null;

  return (
    <section className="section border-y border-border bg-bg-elevated">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("homeTitle")}
            subtitle={t("homeSubtitle")}
          />
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, index) => {
            const displayName = member.name ? pickLocale(member.name, locale) : pickLocale(member.role, locale);
            const displayRole = member.name ? pickLocale(member.role, locale) : null;
            return (
              <li key={member.slug} className="h-full">
                <Reveal delay={index * 0.05} y={24} className="h-full">
                  <Link
                    href={`/team/${member.slug}`}
                    className="gradient-border surface-card group flex h-full flex-col gap-4 p-5 transition-colors duration-300 hover:border-primary/40 hover:bg-surface-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        aria-hidden
                        className={`grid size-11 place-items-center rounded-2xl border text-sm font-bold transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 ${
                          roleAccents[index % roleAccents.length]
                        }`}
                      >
                        {member.initials}
                      </span>
                      <ArrowRight
                        className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                        aria-hidden
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold text-text">
                        <bdi>{displayName}</bdi>
                      </h3>
                      {displayRole ? (
                        <p className="text-xs font-medium text-primary">
                          <bdi>{displayRole}</bdi>
                        </p>
                      ) : null}
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
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
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal>
          <Link href="/team" className={buttonClass("outline", "md", "w-fit")}>
            {t("homeCta")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}