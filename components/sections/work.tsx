import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/sections/project-card";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Work({ content }: { content: HomeContent }) {
  const { locale } = content;
  const t = await getTranslations({ locale, namespace: "work" });

  return (
    <section id="work" className="section scroll-mt-20 border-y border-border bg-bg-elevated">
      <div className="container-page flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            subtitle={t("subtitle")}
          />
        </Reveal>

        <ul className="grid gap-4 md:grid-cols-2">
          {content.projects.map((project, index) => {
            const firstResult = project.results[0];
            return (
              <li key={project.slug} className="h-full">
                <Reveal delay={index * 0.07} y={36} className="h-full">
                  <ProjectCard
                    title={pickLocale(project.title, locale)}
                    summary={pickLocale(project.summary, locale)}
                    category={pickLocale(project.category, locale)}
                    year={project.year}
                    viewLabel={t("viewCase")}
                    placeholderLabel={t("placeholderBadge")}
                    isPlaceholder={project.placeholder}
                    highlight={
                      firstResult
                        ? {
                            value: firstResult.value,
                            label: pickLocale(firstResult.label, locale),
                          }
                        : undefined
                    }
                    href={`/work/${project.slug}`}
                  />
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}