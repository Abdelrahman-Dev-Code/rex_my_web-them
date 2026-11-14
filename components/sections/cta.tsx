import { getTranslations } from "next-intl/server";
import { Mail, MessageCircle } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import type { HomeContent } from "@/lib/data";

export async function Cta({ content }: { content: HomeContent }) {
  const { locale, site } = content;
  const t = await getTranslations({ locale, namespace: "cta" });
  const ft = await getTranslations({ locale, namespace: "form" });
  const whatsappHref = `https://wa.me/${site.whatsapp}`;

  return (
    <section id="contact" className="section scroll-mt-20">
      <div className="container-page">
        <Reveal y={40} blur>
          <div className="surface-card group relative overflow-hidden p-8 sm:p-12">
            <div
              aria-hidden
              className="absolute -end-24 -top-24 size-72 rounded-full bg-primary/20 blur-3xl transition-transform duration-700 group-hover:scale-125"
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -start-16 size-64 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative flex flex-col gap-6">
              <h2 className="max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
                {t("title")}
              </h2>
              <p className="max-w-xl text-pretty text-muted sm:text-lg">{t("subtitle")}</p>
              <div className="flex flex-wrap items-center gap-3">
                <Magnetic strength={0.2}>
                  <a href={`mailto:${site.email}`} className={buttonClass("primary", "lg")}>
                    <Mail className="size-4" aria-hidden />
                    {t("primary")}
                  </a>
                </Magnetic>
                <Magnetic strength={0.2}>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={buttonClass("outline", "lg")}
                  >
                    <MessageCircle className="size-4" aria-hidden />
                    {t("secondary")}
                  </a>
                </Magnetic>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
                <span dir="ltr">{site.email}</span>
                <CopyButton
                  value={site.email}
                  label={ft("copyEmail")}
                  copiedLabel={ft("copiedEmail")}
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}