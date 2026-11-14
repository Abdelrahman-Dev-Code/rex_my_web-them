import type { MetadataRoute } from "next";
import { getHomeContent } from "@/lib/data";
import { siteUrl } from "@/lib/site";

const baseUrl = siteUrl;
const routes = [
  "",
  "/about",
  "/services",
  "/work",
  "/team",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getHomeContent("ar");
  const detailRoutes = [
    ...content.projects.map((project) => `/work/${project.slug}`),
    ...content.posts.map((post) => `/blog/${post.slug}`),
    ...content.team.map((member) => `/team/${member.slug}`),
  ];

  return (["ar", "en"] as const).flatMap((locale) =>
    [...routes, ...detailRoutes].map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.8,
      alternates: {
        languages: {
          ar: `${baseUrl}/ar${route}`,
          en: `${baseUrl}/en${route}`,
        },
      },
    })),
  );
}