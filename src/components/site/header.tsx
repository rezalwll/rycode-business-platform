"use client";

import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { primaryNav, type NavGroup, type PrimaryNavItem } from "@/lib/nav-content";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { Container, CtaLink } from "./primitives";
import { ThemeToggle } from "./theme-toggle";

const englishServiceMenu: NavGroup[] = [
  {
    title: "Build",
    items: [
      { label: "Websites and stores", href: "/services" },
      { label: "Custom software", href: "/services" },
      { label: "Existing product development", href: "/services" },
    ],
  },
  {
    title: "Grow",
    items: [
      { label: "Technical SEO", href: "/services" },
      { label: "SEO audit", href: "/seo-audit" },
      { label: "Integrations", href: "/integrations" },
    ],
  },
  {
    title: "Related paths",
    items: [
      { label: "Businesses and our solutions", href: "/solutions" },
      { label: "Projects", href: "/projects" },
      { label: "Installment payment", href: "/installment-purchase" },
    ],
  },
];

const englishProjectsMenu: NavGroup[] = [
  {
    title: "Portfolio",
    items: [
      { label: "All projects", href: "/projects" },
      { label: "Concept studies", href: "/projects" },
    ],
  },
  {
    title: "Built around the business",
    items: [
      { label: "Industries", href: "/industries" },
      { label: "Our solutions", href: "/solutions" },
    ],
  },
];

const englishCompanyMenu: NavGroup[] = [
  {
    title: "About and legal",
    items: [
      { label: "About us", href: "/about" },
      { label: "Terms of use", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];

const englishBusinessMenu: NavGroup[] = [
  {
    title: "Our solutions",
    items: [
      { label: "All solutions", href: "/solutions" },
      { label: "CRM and customer portals", href: "/solutions" },
      { label: "Commerce and ordering", href: "/solutions" },
      { label: "Booking and operations", href: "/solutions" },
      { label: "Warranty and after-sales", href: "/solutions" },
    ],
  },
  {
    title: "For businesses like yours",
    items: [
      { label: "All industries", href: "/industries" },
      { label: "Manufacturing", href: "/industries" },
      { label: "Commerce and export", href: "/industries" },
      { label: "Healthcare and clinics", href: "/industries" },
      { label: "Education and real estate", href: "/industries" },
    ],
  },
];

const englishPrimary: PrimaryNavItem[] = [
  { label: "Services", href: "/services", menu: englishServiceMenu },
  { label: "Projects", href: "/projects", menu: englishProjectsMenu },
  { label: "Blog", href: "/blog" },
  { label: "Support", href: "/services/ongoing-support" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact us", href: "/contact" },
  { label: "About us", href: "/about", menu: englishCompanyMenu },
  { label: "Get started", href: "/start-project", emphasis: true },
  {
    label: "Businesses and our solutions",
    href: "/solutions",
    menu: englishBusinessMenu,
  },
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
          "fixed inset-x-0 top-0 z-50 border-b text-[#073b4c] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-500",
          elevated
            ? "border-[#073b4c]/10 bg-white/88 shadow-[0_12px_42px_rgba(7,59,76,0.10)] backdrop-blur-2xl backdrop-saturate-150"
            : "border-[#073b4c]/7 bg-white/64 shadow-none backdrop-blur-xl",
        )}
      >
        <Container className="grid h-14 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 [direction:ltr] sm:h-[72px] lg:gap-7">
          <HeaderActions
            locale={locale}
            pathname={pathname}
            className="hidden min-w-0 justify-self-start 2xl:flex"
          />

          <Link href="/" aria-label="RYCODE" className="col-start-2 justify-self-center">
            <Logo className="text-[1.05rem]" />
          </Link>

          <nav
            aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}
            className="hidden min-w-0 items-center justify-self-end 2xl:flex"
            dir={isFa ? "rtl" : "ltr"}
          >
            <ul className="flex items-center gap-2 2xl:gap-4">
              {nav.map((item, index) => (
                <DesktopNavItem
                  key={`${item.id ?? item.href}-${index}`}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label={isFa ? "باز کردن منو" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "col-start-3 row-start-1 grid size-10 justify-self-end place-items-center rounded-xl border border-[#073b4c]/15 bg-white/75 text-[#073b4c] shadow-sm backdrop-blur-md transition-colors hover:border-[#20bfb2]/55 hover:bg-[#dff8f4] 2xl:hidden",
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

function DesktopNavItem({ item, pathname }: { item: PrimaryNavItem; pathname: string }) {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <li className="group relative">
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "relative flex items-center gap-1 whitespace-nowrap py-3 text-[0.7rem] font-medium transition-colors after:absolute after:inset-x-0 after:bottom-1 after:h-px after:origin-center after:scale-x-0 after:bg-[#5fe1d5] after:transition-transform hover:after:scale-x-100",
          item.emphasis
            ? "text-[#087b83]"
            : active
              ? "text-[#087b83] after:scale-x-100"
              : "text-[#214f5b]/70 hover:text-[#073b4c]",
        )}
      >
        {item.label}
        {item.menu && <ChevronDown className="size-3.5 text-[#214f5b]/40" aria-hidden />}
      </Link>

      {item.menu && (
        <div
          className="pointer-events-none invisible absolute end-0 top-full z-50 w-[min(82vw,850px)] translate-y-2 rounded-2xl border border-[#073b4c]/10 bg-white/96 p-5 text-[#073b4c] opacity-0 shadow-[0_24px_70px_rgba(7,59,76,0.16)] backdrop-blur-2xl transition-[opacity,transform,visibility] duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
          dir="rtl"
        >
          <div className="grid max-h-[min(70vh,520px)] grid-cols-2 gap-x-8 gap-y-6 overflow-y-auto pe-1 lg:grid-cols-3">
            {item.menu.map((group) => (
              <div key={group.title}>
                <p className="mb-3 text-[0.67rem] font-bold tracking-[0.14em] text-[#5fe1d5]">
                  {group.title}
                </p>
                <ul className="space-y-2">
                  {group.items.map((child, index) => (
                    <li key={`${child.id ?? child.href}-${child.label}-${index}`}>
                      <Link
                        href={child.href}
                        className="block rounded-lg px-2 py-1.5 text-[0.72rem] leading-5 text-[#214f5b]/68 transition-colors hover:bg-[#e8f9f6] hover:text-[#073b4c]"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </li>
  );
}

function HeaderActions({
  locale,
  pathname,
  className,
}: {
  locale: Locale;
  pathname: string;
  className?: string;
}) {
  const isFa = locale === "fa";

  return (
    <div className={cn("items-center gap-3", className)} dir="ltr">
      <ThemeToggle />
      <Link
        href={pathname}
        locale={isFa ? "en" : "fa"}
        hrefLang={isFa ? "en" : "fa"}
        aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
        className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#073b4c]/15 bg-white/70 px-3 font-latin text-[0.68rem] font-semibold tracking-[0.14em] text-[#214f5b]/70 shadow-sm backdrop-blur-md transition-colors hover:border-[#20bfb2]/55 hover:text-[#073b4c]"
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
  nav: PrimaryNavItem[];
  pathname: string;
  onClose: () => void;
}) {
  const isFa = locale === "fa";

  return (
    <div className="fixed inset-0 z-[60] 2xl:hidden" dir="ltr">
      <button
        type="button"
        aria-label={isFa ? "بستن منو" : "Close menu"}
        onClick={onClose}
        className="absolute inset-0 bg-[#021b24]/70 backdrop-blur-md"
      />

      <aside
        className="relative ml-auto flex h-full w-full max-w-[420px] flex-col border-l border-[#073b4c]/10 bg-[#f8fdfc]/98 text-[#073b4c] shadow-2xl backdrop-blur-2xl"
        dir={isFa ? "rtl" : "ltr"}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#073b4c]/10 px-6">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
            className="grid size-10 place-items-center rounded-xl border border-[#073b4c]/15 text-[#073b4c] transition-colors hover:border-[#20bfb2]/60 hover:bg-[#e8f9f6]"
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
                <li
                  key={`${item.id ?? item.href}-${index}`}
                  className="border-b border-[#073b4c]/10 py-1"
                >
                  <div className="flex items-center gap-3">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex min-w-0 flex-1 items-center gap-5 py-4 text-2xl font-semibold transition-colors",
                        item.emphasis
                          ? "text-[#087b83]"
                          : active
                            ? "text-[#087b83]"
                            : "text-[#153f4b]/85 hover:text-[#073b4c]",
                      )}
                    >
                      <span className="font-latin text-[0.65rem] tracking-[0.16em] text-[#214f5b]/38">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                    {item.menu && (
                      <details className="group/menu shrink-0">
                        <summary
                          aria-label={isFa ? `نمایش ${item.label}` : `Show ${item.label}`}
                          className="grid size-10 cursor-pointer list-none place-items-center rounded-lg border border-[#073b4c]/15 text-[#214f5b]/55 transition-colors hover:border-[#20bfb2]/55 hover:bg-[#e8f9f6] hover:text-[#087b83] [&::-webkit-details-marker]:hidden"
                        >
                          <ChevronDown className="size-5 transition-transform group-open/menu:rotate-180" />
                        </summary>
                        <div className="mb-3 mt-1 grid gap-5 border-s-2 border-[#5fe1d5]/25 ps-5">
                          {item.menu.map((group) => (
                            <div key={group.title}>
                              <p className="mb-2 text-[0.66rem] font-bold tracking-[0.14em] text-[#5fe1d5]">
                                {group.title}
                              </p>
                              <ul className="space-y-1">
                                {group.items.slice(0, 8).map((child, childIndex) => (
                                  <li
                                    key={`${child.id ?? child.href}-${child.label}-${childIndex}`}
                                  >
                                    <Link
                                      href={child.href}
                                      onClick={onClose}
                                      className="block py-1 text-sm leading-6 text-[#214f5b]/68 transition-colors hover:text-[#087b83]"
                                    >
                                      {child.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-[#073b4c]/10 bg-[#edfaf7] px-6 py-6">
          <div className="mb-5 flex items-center justify-between gap-3" dir="ltr">
            <ThemeToggle />
            <Link
              href={pathname}
              locale={isFa ? "en" : "fa"}
              hrefLang={isFa ? "en" : "fa"}
              onClick={onClose}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#073b4c]/15 bg-white px-3 font-latin text-xs tracking-[0.14em] text-[#214f5b]/75"
            >
              <Globe2 className="size-4" aria-hidden />
              {isFa ? "ENGLISH" : "فارسی"}
            </Link>
          </div>
          <CtaLink
            to="/start-project"
            variant="outline"
            className="w-full !rounded-full !border-[#20bfb2]/55 !bg-[#5fe1d5] !text-[#073b4c] hover:!border-[#20bfb2] hover:!bg-[#77e9df]"
          >
            {isFa ? "شروع یک پروژه" : "Start a project"}
          </CtaLink>
        </div>
      </aside>
    </div>
  );
}
