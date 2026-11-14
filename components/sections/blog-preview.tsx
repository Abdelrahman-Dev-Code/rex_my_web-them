import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Link } from "@/i18n/navigation";
import { pickLocale, type Post } from "@/content/site";
import type { Locale } from "@/i18n/routing";
import { buttonClass } from "@/components/ui/button";

export async function BlogPreview({
  posts,
  locale,
}: {
  posts: Post[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="section border-t border-border">
      <div className="container-page flex flex-col gap-10">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("homeTitle")}
            subtitle={t("homeSubtitle")}
          />
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-3">
          {latest.map((post, index) => (
            <li key={post.slug} className="h-full">
              <Reveal delay={index * 0.06} y={26} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="gradient-border surface-card group flex h-full flex-col gap-3 p-5 transition-colors duration-300 hover:bg-surface-2"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="font-medium text-primary">
                      {pickLocale(post.tag, locale)}
                    </span>
                    <span aria-hidden>·</span>
                    <time dateTime={post.date} dir="ltr" className="tabular-nums">
                      {post.date}
                    </time>
                  </div>
                  <h3 className="text-base font-semibold transition-colors group-hover:text-primary">
                    <bdi>{pickLocale(post.title, locale)}</bdi>
                  </h3>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                    {pickLocale(post.excerpt, locale)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-primary">
                    {t("readMore")}
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1 rtl:rotate-180"
                      aria-hidden
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          <Link href="/blog" className={buttonClass("outline", "md", "w-fit")}>
            {t("homeCta")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}