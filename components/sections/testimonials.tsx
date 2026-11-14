"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { pickLocale, type Testimonial } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const t = useTranslations("testimonials");
  const locale = useLocale();
  const l = locale === "en" ? "en" : "ar";
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const safeIndex = index % items.length;
  const active = items[safeIndex];
  const hasAnyPlaceholder = items.some((item) => item.placeholder);

  const go = (direction: number) => {
    setIndex((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section
      className="section"
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(l === "ar" ? 1 : -1);
        if (e.key === "ArrowRight") go(l === "ar" ? -1 : 1);
      }}
    >
      <div className="container-page flex flex-col gap-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              eyebrow={t("eyebrow")}
              title={t("title")}
              subtitle={t("subtitle")}
            />
          </Reveal>

          {items.length > 1 ? (
            <Reveal delay={0.06} y={16}>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t("prev")}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t("next")}
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </button>
              </div>
            </Reveal>
          ) : null}
        </div>

        <Reveal y={24}>
          <figure
            key={safeIndex}
            aria-live="polite"
            className="gradient-border surface-card relative flex flex-col gap-5 overflow-hidden p-6 sm:p-8 motion-safe:animate-menu-in"
          >
            <Quote className="size-8 text-primary/40" aria-hidden />
            <blockquote className="text-pretty text-lg leading-relaxed text-text/90 sm:text-xl">
              {pickLocale(active.quote, l)}
            </blockquote>
            <figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-10 place-items-center rounded-full border border-border bg-bg-elevated text-xs font-bold text-primary"
                >
                  {active.initials}
                </span>
                <span className="text-sm font-medium text-text">
                  {pickLocale(active.role, l)}
                </span>
              </div>
              {active.placeholder ? (
                <span className="text-[11px] uppercase tracking-wider text-muted rtl:tracking-normal">
                  {t("placeholder")}
                </span>
              ) : null}
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {hasAnyPlaceholder ? <p className="text-xs text-muted">{t("notice")}</p> : <span />}
          {items.length > 1 ? (
            <ul className="flex items-center gap-2">
              {items.map((item, itemIndex) => (
                <li key={`${item.initials}-${itemIndex}`}>
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-label={`${itemIndex + 1}`}
                    aria-current={itemIndex === safeIndex}
                    className={`h-2 rounded-full transition-all ${
                      itemIndex === safeIndex
                        ? "w-6 bg-primary"
                        : "w-2 bg-border hover:bg-muted/50"
                    }`}
                  />
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}