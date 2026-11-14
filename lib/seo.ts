import type { Metadata } from "next";

export type Locale = "ar" | "en";

export function toLocale(value: string): Locale {
  return value === "en" ? "en" : "ar";
}

export function localePath(locale: string, path: string): string {
  return `/${toLocale(locale)}${path}`;
}

export function alternatesFor(locale: string, path: string) {
  const l = toLocale(locale);
  return {
    canonical: `/${l}${path}`,
    languages: {
      ar: `/ar${path}`,
      en: `/en${path}`,
    },
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  type = "website",
}: {
  locale: string;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
}): Metadata {
  const l = toLocale(locale);

  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      type,
      title,
      description,
      locale: l === "ar" ? "ar_SA" : "en_US",
      url: `/${l}${path}`,
      images: [
        {
          url: "/og-cover.jpg",
          width: 1200,
          height: 675,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-cover.jpg"],
    },
  };
}

export function breadcrumbItems(
  locale: string,
  items: { name: string; path: string }[],
) {
  const l = toLocale(locale);

  return items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `/${l}${item.path}`,
  }));
}

export function breadcrumbJsonLd(
  locale: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems(locale, items),
  };
}