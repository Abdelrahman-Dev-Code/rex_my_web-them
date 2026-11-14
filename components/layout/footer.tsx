import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Mail } from "lucide-react";
import type { SiteMeta } from "@/lib/data";

type FooterProps = {
  nav: { key: string; href: string }[];
  locale: string;
  site: SiteMeta;
};

export async function Footer({ nav, locale, site }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const navT = await getTranslations({ locale, namespace: "nav" });
  const legalT = await getTranslations({ locale, namespace: "legal" });
  const name = site.name[locale === "en" ? "en" : "ar"];
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-elevated">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-fg"
            >
              CN
            </span>
            <span className="text-base font-semibold">{name}</span>
          </Link>
          <p className="max-w-xs text-sm text-muted">
            {site.tagline[locale === "en" ? "en" : "ar"]}
          </p>
          <p className="text-sm text-muted">
            {site.location[locale === "en" ? "en" : "ar"]}
          </p>
        </div>

        <nav aria-label={t("nav")} className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{t("nav")}</h2>
          {nav.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="w-fit text-sm text-muted transition-colors hover:text-text"
            >
              {navT(item.key)}
            </Link>
          ))}
          {["team", "blog"].map((key) => (
            <Link
              key={key}
              href={`/${key}`}
              className="w-fit text-sm text-muted transition-colors hover:text-text"
            >
              {navT(key)}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">{t("contact")}</h2>
          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
          >
            <Mail className="size-4" aria-hidden />
            <span dir="ltr">{site.email}</span>
          </a>
          <div className="flex flex-wrap gap-2 pt-2">
            {site.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:bg-surface hover:text-text"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col items-start justify-between gap-2 border-t border-border py-6 text-xs text-muted sm:flex-row sm:items-center">
        <p>
          © {year} {name}. {t("rights")}.
        </p>
        <nav
          aria-label={locale === "ar" ? "روابط قانونية" : "Legal links"}
          className="flex items-center gap-4"
        >
          <Link href="/privacy" className="transition-colors hover:text-text">
            {legalT("privacy")}
          </Link>
          <Link href="/terms" className="transition-colors hover:text-text">
            {legalT("terms")}
          </Link>
          <Link href="/studio" className="transition-colors hover:text-text">
            {locale === "ar" ? "الاستوديو" : "Studio"}
          </Link>
        </nav>
        <p>
          {t("madeWith")} · {locale === "ar" ? "بالعربية" : "in English"}
        </p>
      </div>
    </footer>
  );
}