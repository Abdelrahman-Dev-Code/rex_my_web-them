import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CursorSpotlight } from "@/components/motion/cursor-spotlight";
import { PageTransition } from "@/components/motion/page-transition";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { PaletteItem } from "@/components/layout/command-palette";
import { navItems, pickLocale } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { getPosts, getProjects, getServices, getSite, getTeam } from "@/lib/data";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: l, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl),
    ...pageMetadata({
      locale: l,
      path: "",
      title: t("title"),
      description: t("description"),
    }),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const [site, services, projects, posts, team, navT, searchT, studioT, legalT] =
    await Promise.all([
      getSite(),
      getServices(),
      getProjects(),
      getPosts(),
      getTeam(),
      getTranslations({ locale, namespace: "nav" }),
      getTranslations({ locale, namespace: "search" }),
      getTranslations({ locale, namespace: "studio" }),
      getTranslations({ locale, namespace: "legal" }),
    ]);

  const l = locale === "en" ? "en" : "ar";

  const paletteItems: PaletteItem[] = [
    ...navItems.map((item) => ({
      id: `nav-${item.key}`,
      label: navT(item.key),
      href: item.href,
      keywords: `nav ${item.key} ${item.href}`,
    })),
    ...services.map((service) => ({
      id: `service-${service.icon}`,
      label: pickLocale(service.title, l),
      hint: pickLocale(service.description, l),
      href: "/services",
      keywords: `${pickLocale(service.title, l)} ${pickLocale(service.description, l)} services`,
    })),
    ...projects.map((project) => ({
      id: `project-${project.slug}`,
      label: pickLocale(project.title, l),
      hint: pickLocale(project.category, l),
      href: `/work/${project.slug}`,
      keywords: `${pickLocale(project.title, l)} ${pickLocale(project.category, l)} work`,
    })),
    ...posts.map((post) => ({
      id: `post-${post.slug}`,
      label: pickLocale(post.title, l),
      hint: pickLocale(post.tag, l),
      href: `/blog/${post.slug}`,
      keywords: `${pickLocale(post.title, l)} ${pickLocale(post.tag, l)} blog`,
    })),
    ...team.map((member) => {
      const displayName = member.name ? pickLocale(member.name, l) : pickLocale(member.role, l);
      const displayRole = member.name ? `${pickLocale(member.role, l)} — ` : "";
      return {
        id: `team-${member.slug}`,
        label: displayName,
        hint: `${displayRole}${pickLocale(member.focus, l)}`,
        href: `/team/${member.slug}`,
        keywords: `${displayName} ${pickLocale(member.role, l)} ${pickLocale(member.focus, l)} ${member.stack.join(" ")} team`,
      };
    }),
    {
      id: "search",
      label: searchT("label"),
      href: "/search",
      keywords: "search بحث",
    },
    {
      id: "studio",
      label: studioT("title"),
      hint: studioT("subtitle"),
      href: "/studio",
      keywords: "studio cms admin لوحة التحكم الاستوديو",
    },
    {
      id: "privacy",
      label: legalT("privacy"),
      href: "/privacy",
      keywords: "privacy سياسة الخصوصية",
    },
    {
      id: "terms",
      label: legalT("terms"),
      href: "/terms",
      keywords: "terms الشروط",
    },
  ];

  return (
    <ThemeProvider>
      <html
        lang={locale}
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="h-full"
        suppressHydrationWarning
      >
        <body className="flex min-h-full flex-col antialiased">
          <NextIntlClientProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
            >
              {locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content"}
            </a>
            <CursorSpotlight />
            <PageTransition />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "Organization",
                      name: site.name.en,
                      alternateName: site.name.ar,
                      url: siteUrl,
                      email: site.email,
                      description: site.tagline.en,
                      sameAs: site.socials.map((social) => social.href),
                      contactPoint: [
                        {
                          "@type": "ContactPoint",
                          email: site.email,
                          contactType: "sales",
                          availableLanguage: ["ar", "en"],
                        },
                      ],
                    },
                    {
                      "@type": "WebSite",
                      name: site.name.en,
                      url: siteUrl,
                      inLanguage: ["ar", "en"],
                      potentialAction: {
                        "@type": "SearchAction",
                        target: {
                          "@type": "EntryPoint",
                          urlTemplate: `${siteUrl}/{locale}/search?q={search_term_string}`,
                        },
                        "query-input": "required name=search_term_string",
                      },
                    },
                  ],
                }),
              }}
            />
            <Header
              nav={navItems}
              siteName={site.name[l]}
              paletteItems={paletteItems}
            />
            <main id="main" className="flex-1 pt-16 md:pt-20">
              {children}
            </main>
            <Footer nav={navItems} locale={locale} site={site} />
          </NextIntlClientProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}