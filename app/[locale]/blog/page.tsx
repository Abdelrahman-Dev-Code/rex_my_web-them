import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { Cta } from "@/components/sections/cta";
import { Link } from "@/i18n/navigation";
import { pickLocale } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { getHomeContent } from "@/lib/data";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "blog" });

  return pageMetadata({
    locale: l,
    path: "/blog",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const content = await getHomeContent(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="section">
        <div className="container-page flex flex-col gap-4">
          {content.posts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center text-sm text-muted">
              {locale === "ar" ? "لا توجد مقالات منشورة حالياً." : "No published posts yet."}
            </div>
          ) : (
            content.posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 0.06} y={24}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="gradient-border surface-card group flex flex-col gap-3 p-6 transition-colors duration-300 hover:bg-surface-2"
                >
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
                    <span className="font-medium text-primary">
                      {pickLocale(post.tag, locale)}
                    </span>
                    <span aria-hidden>·</span>
                    <time dateTime={post.date} dir="ltr" className="tabular-nums">
                      {post.date}
                    </time>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums">
                      {post.readingMinutes} {t("minRead")}
                    </span>
                    {post.placeholder ? (
                      <>
                        <span aria-hidden>·</span>
                        <span className="text-muted">{t("placeholder")}</span>
                      </>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-semibold transition-colors group-hover:text-primary">
                    <bdi>{pickLocale(post.title, locale)}</bdi>
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted">
                    {pickLocale(post.excerpt, locale)}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-primary">
                    {t("readMore")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <Cta content={content} />
    </>
  );
}