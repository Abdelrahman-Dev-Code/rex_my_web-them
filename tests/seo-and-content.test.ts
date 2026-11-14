import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { pickLocale, projects, services, site, team } from "@/content/site";
import { alternatesFor, breadcrumbItems, pageMetadata, toLocale } from "@/lib/seo";

describe("SEO & localization helpers", () => {
  it("normalizes unsupported locales to Arabic default", () => {
    expect(toLocale("en")).toBe("en");
    expect(toLocale("ar")).toBe("ar");
    expect(toLocale("fr")).toBe("ar");
  });

  it("builds hreflang alternates and canonical paths", () => {
    expect(alternatesFor("ar", "/work")).toEqual({
      canonical: "/ar/work",
      languages: { ar: "/ar/work", en: "/en/work" },
    });
  });

  it("produces OpenGraph locale metadata and share card image accurately", () => {
    const arMeta = pageMetadata({
      locale: "ar",
      path: "/services",
      title: "الخدمات",
      description: "وصف الخدمات",
    });
    expect(arMeta.openGraph?.locale).toBe("ar_SA");
    expect(arMeta.openGraph?.images).toBeDefined();
    expect(arMeta.twitter?.images).toEqual(["/og-cover.jpg"]);

    const enMeta = pageMetadata({
      locale: "en",
      path: "/services",
      title: "Services",
      description: "Services overview",
    });
    expect(enMeta.openGraph?.locale).toBe("en_US");
  });

  it("disallows studio admin routes and api endpoints in robots.txt", () => {
    const config = robots();
    const rule = Array.isArray(config.rules) ? config.rules[0] : config.rules;
    expect(rule.disallow).toEqual(["/ar/studio", "/en/studio", "/api/"]);
  });

  it("builds 1-indexed Schema.org breadcrumb items", () => {
    const items = breadcrumbItems("en", [
      { name: "Home", path: "" },
      { name: "Work", path: "/work" },
    ]);
    expect(items[0].position).toBe(1);
    expect(items[1].item).toBe("/en/work");
  });

  it("keeps fallback bilingual data complete for both locales", () => {
    expect(pickLocale(site.name, "ar")).toBeTruthy();
    expect(pickLocale(site.name, "en")).toBeTruthy();
    expect(services.length).toBeGreaterThanOrEqual(4);
    expect(projects.every((p) => p.slug && p.title.ar && p.title.en)).toBe(true);
    expect(
      team.every((m) => m.slug && m.name?.ar && m.name?.en && m.role.ar && m.role.en),
    ).toBe(true);
  });
});
