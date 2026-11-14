"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette, type PaletteItem } from "./command-palette";
import { buttonClass } from "@/components/ui/button";

type HeaderProps = {
  nav: { key: string; href: string }[];
  siteName: string;
  paletteItems: PaletteItem[];
};

export function Header({ nav, siteName, paletteItems }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ scrolled: false, hidden: false, lastY: 0, raf: 0 });

  useEffect(() => {
    const state = stateRef.current;

    const update = () => {
      state.raf = 0;
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }

      const nextScrolled = y > 24;
      const goingDown = y > state.lastY;
      const nextHidden = y > 520 && goingDown;
      state.lastY = y;

      if (nextScrolled !== state.scrolled) {
        state.scrolled = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (nextHidden !== state.hidden) {
        state.hidden = nextHidden;
        setHidden(nextHidden);
      }
    };

    const onScroll = () => {
      if (!state.raf) {
        state.raf = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (state.raf) {
        window.cancelAnimationFrame(state.raf);
      }
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-300",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "border-b border-border bg-bg/80 shadow-lg shadow-black/10 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-bg/90 via-bg/50 to-transparent",
      )}
    >
      <div
        className={cn(
          "container-page flex items-center justify-between gap-6 transition-[height] duration-300",
          scrolled ? "h-16" : "h-16 md:h-20",
        )}
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5 whitespace-nowrap" aria-label={t("nav.home")}>
          <span
            aria-hidden
            className={cn(
              "grid place-items-center bg-primary font-bold text-primary-fg transition-all duration-300",
              scrolled ? "size-8 rounded-lg text-xs" : "size-9 rounded-xl text-sm",
            )}
          >
            CN
          </span>
          <span className="text-base font-semibold tracking-tight whitespace-nowrap md:text-lg">
            {siteName}
          </span>
        </Link>

        <nav aria-label={t("common.menu")} className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative whitespace-nowrap shrink-0 px-3.5 py-2 text-sm transition-colors",
                  active
                    ? "text-text font-medium"
                    : "text-muted hover:text-text",
                )}
              >
                {t(`nav.${item.key}`)}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent transition-transform duration-300",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <CommandPalette items={paletteItems} />
          <LocaleSwitcher />
          <ThemeToggle />
          <Link
            href="/contact"
            className={buttonClass("primary", scrolled ? "sm" : "md", "hidden whitespace-nowrap shrink-0 sm:inline-flex")}
          >
            {t("nav.contact")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("common.close") : t("common.menu")}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface hover:text-text md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
        <div
          ref={barRef}
          className="h-full origin-left scale-x-0 bg-gradient-to-r from-primary to-accent rtl:origin-right"
        />
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="motion-safe:animate-menu-in border-t border-border bg-bg/95 backdrop-blur-md md:hidden"
        >
          <nav className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm text-muted hover:bg-surface hover:text-text"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className={buttonClass("primary", "md", "mt-2 w-full")}
            >
              {t("nav.contact")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}