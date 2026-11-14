import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Search } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import {
  navItems,
  pickLocale,
  techGroups,
} from "@/content/site";
import { routing } from "@/i18n/routing";
import { alternatesFor } from "@/lib/seo";
import { getHomeContent } from "@/lib/data";

type GroupKey = "pages" | "services" | "projects" | "posts" | "team" | "skills";

type SearchItem = {
  href: string;
  title: string;
  description: string;
  group: GroupKey;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[\u064B-\u0652\u0670\u0640]/g, "")
    .replace(/\s+/g, " ")
    .trim();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "search" });

  return {
    title: t("label"),
    description: t("noQuery"),
    alternates: alternatesFor(l, "/search"),
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "search" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const { q } = await searchParams;
  const content = await getHomeContent(locale);

  const query = (q ?? "").trim();
  const normalized = normalize(query);

  const items: SearchItem[] = [
    ...navItems.map((item) => ({
      href: item.href,
      title: navT(item.key),
      description: navT(item.key),
      group: "pages" as const,
    })),
    ...content.services.map((service) => ({
      href: "/services",
      title: pickLocale(service.title, locale),
      description: pickLocale(service.description, locale),
      group: "services" as const,
    })),
    ...content.projects.map((project) => ({
      href: `/work/${project.slug}`,
      title: pickLocale(project.title, locale),
      description: pickLocale(project.summary, locale),
      group: "projects" as const,
    })),
    ...content.posts.map((post) => ({
      href: `/blog/${post.slug}`,
      title: pickLocale(post.title, locale),
      description: pickLocale(post.excerpt, locale),
      group: "posts" as const,
    })),
    ...content.team.map((member) => {
      const displayName = member.name
        ? `${pickLocale(member.name, locale)} — ${pickLocale(member.role, locale)}`
        : pickLocale(member.role, locale);
      return {
        href: `/team/${member.slug}`,
        title: displayName,
        description: pickLocale(member.focus, locale),
        group: "team" as const,
      };
    }),
    ...content.techStack.map((tech) => {
      const group = techGroups.find((item) => item.key === tech.group);
      return {
        href: "/about#tech",
        title: tech.name,
        description: `${group ? pickLocale(group.title, locale) : ""} — ${pickLocale(tech.category, locale)} — ${pickLocale(tech.description, locale)}`,
        group: "skills" as const,
      };
    }),
  ];

  const results = normalized
    ? items.filter((item) =>
        normalize(`${item.title} ${item.description}`).includes(normalized),
      )
    : [];

  const groups: { key: GroupKey; label: string }[] = [
    { key: "pages", label: t("pages") },
    { key: "services", label: t("services") },
    { key: "projects", label: t("projects") },
    { key: "posts", label: t("posts") },
    { key: "team", label: t("team") },
    { key: "skills", label: t("skills") },
  ];

  return (
    <>
      <PageHero
        eyebrow={t("label")}
        title={t("label")}
        subtitle={normalized ? `${t("results")} — ${results.length}` : t("noQuery")}
      />

      <section className="section">
        <div className="container-page flex flex-col gap-8">
          <Reveal>
            <form
              action={`/${locale}/search`}
              method="get"
              role="search"
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                  aria-hidden
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  aria-label={t("query")}
                  placeholder={t("placeholder")}
                  className="h-12 w-full rounded-full border border-border bg-bg-elevated ps-11 pe-4 text-sm text-text placeholder:text-muted/70 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>
              <button
                type="submit"
                className="h-12 rounded-full bg-primary px-6 text-sm font-medium text-primary-fg transition-opacity hover:opacity-90"
              >
                {t("submit")}
              </button>
            </form>
          </Reveal>

          {normalized && results.length === 0 ? (
            <Reveal>
              <p
                role="status"
                className="rounded-xl border border-border bg-bg-elevated px-4 py-6 text-center text-sm text-muted"
              >
                {t("empty")}
              </p>
            </Reveal>
          ) : null}

          {groups.map((group, groupIndex) => {
            const groupItems = results.filter((item) => item.group === group.key);
            if (groupItems.length === 0) return null;

            return (
              <div key={group.key} className="flex flex-col gap-3">
                <Reveal delay={groupIndex * 0.04} y={16}>
                  <h2 className="flex items-baseline gap-2 border-b border-border pb-2 text-sm font-semibold text-text">
                    {group.label}
                    <span className="text-xs font-normal tabular-nums text-muted">
                      {groupItems.length}
                    </span>
                  </h2>
                </Reveal>
                <ul className="flex flex-col gap-2">
                  {groupItems.map((item, index) => (
                    <li key={`${group.key}-${item.href}-${index}`}>
                      <Reveal delay={index * 0.03} y={14}>
                        <Link
                          href={item.href}
                          className="surface-card group flex items-start justify-between gap-4 p-4 transition-colors hover:bg-surface-2"
                        >
                          <span className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-text">
                              <bdi>{item.title}</bdi>
                            </span>
                            <span className="line-clamp-2 text-xs leading-relaxed text-muted">
                              {item.description}
                            </span>
                          </span>
                          <ArrowRight
                            className="mt-1 size-4 shrink-0 text-muted transition-transform group-hover:translate-x-1 rtl:rotate-180"
                            aria-hidden
                          />
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}