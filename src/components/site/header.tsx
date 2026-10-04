"use client";

import { Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { primaryNav, type NavLink } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { Container, CtaLink } from "./primitives";
import { ThemeToggle } from "./theme-toggle";

const englishPrimary: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isFa = locale === "fa";
  const nav = isFa ? primaryNav : englishPrimary;
  const isHome = pathname === "/";
  const elevated = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b text-white transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
          elevated
            ? "border-white/12 bg-[#052f3c]/78 shadow-[0_12px_42px_rgba(1,25,34,0.18)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-transparent bg-transparent shadow-none backdrop-blur-none",
        )}
      >
        <Container className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 [direction:ltr] sm:h-[72px] lg:gap-7">
          <HeaderActions
            locale={locale}
            pathname={pathname}
            elevated={elevated}
            className="hidden min-w-0 justify-self-start xl:flex"
          />

          <Link href="/" aria-label="RYCODE" className="col-start-2 justify-self-center">
            <Logo variant="light" className="text-[1.05rem]" />
          </Link>

          <nav
            aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}
            className="hidden min-w-0 items-center justify-self-end xl:flex"
            dir={isFa ? "rtl" : "ltr"}
          >
            <ul className="flex items-center gap-5 2xl:gap-7">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block whitespace-nowrap py-3 text-[0.78rem] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-[#5fe1d5] after:transition-transform hover:after:scale-x-100",
                        active
                          ? "text-[#9cf5ec] after:scale-x-100"
                          : "text-white/70 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="col-start-1 row-start-1 flex items-center gap-2 justify-self-start xl:hidden">
            <CtaLink
              to="/start-project"
              variant="outline"
              className={cn(
                "hidden h-10 px-4 text-xs sm:inline-flex !rounded-full !border-[#5fe1d5]/55 !text-white backdrop-blur-md hover:!border-[#5fe1d5] hover:!bg-[#5fe1d5]/22",
                elevated ? "!bg-[#5fe1d5]/16" : "!bg-[#5fe1d5]/10",
              )}
            >
              {isFa ? "شروع پروژه" : "Start a project"}
            </CtaLink>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={isFa ? "باز کردن منو" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "col-start-3 row-start-1 grid size-10 justify-self-end place-items-center rounded-xl border border-white/25 bg-white/6 text-white backdrop-blur-md transition-colors hover:border-[#5fe1d5]/70 hover:bg-[#5fe1d5]/12 xl:hidden",
            )}
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </Container>
      </header>

      {mobileOpen && (
        <MobileMenu
          locale={locale}
          nav={nav}
          pathname={pathname}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

function HeaderActions({
  locale,
  pathname,
  elevated,
  className,
}: {
  locale: Locale;
  pathname: string;
  elevated: boolean;
  className?: string;
}) {
  const isFa = locale === "fa";

  return (
    <div className={cn("items-center gap-3", className)} dir="ltr">
      <CtaLink
        to="/start-project"
        variant="outline"
        className={cn(
          "h-10 whitespace-nowrap px-5 text-xs !rounded-full !border-[#5fe1d5]/55 !text-white backdrop-blur-md hover:!border-[#5fe1d5] hover:!bg-[#5fe1d5]/22",
          elevated ? "!bg-[#5fe1d5]/16" : "!bg-[#5fe1d5]/10",
        )}
      >
        {isFa ? "شروع پروژه" : "Start a project"}
      </CtaLink>
      <ThemeToggle variant="light" />
      <Link
        href={pathname}
        locale={isFa ? "en" : "fa"}
        hrefLang={isFa ? "en" : "fa"}
        aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/25 bg-white/5 px-3 font-latin text-[0.68rem] font-semibold tracking-[0.14em] text-white/70 backdrop-blur-md transition-colors hover:border-[#5fe1d5]/60 hover:text-white"
      >
        <Globe2 className="size-3.5" aria-hidden />
        {isFa ? "EN" : "FA"}
      </Link>
    </div>
  );
}

function MobileMenu({
  locale,
  nav,
  pathname,
  onClose,
}: {
  locale: Locale;
  nav: NavLink[];
  pathname: string;
  onClose: () => void;
}) {
  const isFa = locale === "fa";

  return (
    <div className="fixed inset-0 z-[60] xl:hidden" dir="ltr">
      <button
        type="button"
        aria-label={isFa ? "بستن منو" : "Close menu"}
        onClick={onClose}
        className="absolute inset-0 bg-[#021b24]/70 backdrop-blur-md"
      />

      <aside
        className="relative ml-auto flex h-full w-full max-w-[420px] flex-col border-l border-[#5fe1d5]/15 bg-[#073b4c]/96 text-white shadow-2xl backdrop-blur-2xl"
        dir={isFa ? "rtl" : "ltr"}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6">
          <Logo variant="light" />
          <button
            type="button"
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
            className="grid size-10 place-items-center border border-white/25 text-white transition-colors hover:border-white/60"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav
          aria-label={isFa ? "منوی موبایل" : "Mobile navigation"}
          className="flex-1 overflow-y-auto px-6 py-6"
        >
          <ul>
            {nav.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href} className="border-b border-white/10">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-5 py-5 text-2xl font-semibold transition-colors",
                      active ? "text-[#5fe1d5]" : "text-white/85 hover:text-white",
                    )}
                  >
                    <span className="font-latin text-[0.65rem] tracking-[0.16em] text-white/35">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 px-6 py-6">
          <div className="mb-5 flex items-center justify-between gap-3" dir="ltr">
            <ThemeToggle variant="light" />
            <Link
              href={pathname}
              locale={isFa ? "en" : "fa"}
              hrefLang={isFa ? "en" : "fa"}
              onClick={onClose}
              className="inline-flex h-9 items-center gap-2 border border-white/25 px-3 font-latin text-xs tracking-[0.14em] text-white/75"
            >
              <Globe2 className="size-4" aria-hidden />
              {isFa ? "ENGLISH" : "فارسی"}
            </Link>
          </div>
          <CtaLink
            to="/start-project"
            variant="outline"
            className="w-full !rounded-full !border-[#5fe1d5]/55 !bg-[#5fe1d5]/14 !text-white hover:!border-[#5fe1d5] hover:!bg-[#5fe1d5]/22"
          >
            {isFa ? "شروع یک پروژه" : "Start a project"}
          </CtaLink>
        </div>
      </aside>
    </div>
  );
}
