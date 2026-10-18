"use client";
import { BrandText } from "@/components/site/brand-text";

import {
  ArrowRight, Blocks, Bot, ChartNoAxesCombined, ChevronDown, CircleHelp,
  CodeXml, FileSpreadsheet, Globe2, Headset, Menu, Route, ScanLine,
  ShieldCheck, UsersRound, Wrench, X, type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getPrimaryNav, type PrimaryNavItem } from "@/lib/nav-content";
import { serviceHighlights } from "@/content/service-offerings";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { Container } from "./primitives";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [mobilePath, setMobilePath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<{ href: string; pinned: boolean } | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const isFa = locale === "fa";
  const nav = getPrimaryNav(locale);
  const isHome = pathname === "/";
  const elevated = scrolled || !isHome;
  const overlay = isHome && !scrolled;
  const menuPath = `${locale}:${pathname}`;
  const mobileOpen = mobilePath === menuPath;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setDesktopOpen(null);
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const closeOnResize = () => {
      setDesktopOpen(null);
      setMobilePath(null);
    };
    document.addEventListener("pointerdown", closeOutside);
    desktop.addEventListener("change", closeOnResize);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      desktop.removeEventListener("change", closeOnResize);
    };
  }, []);

  return (
    <BrandText><>
      <header
        ref={headerRef}
        className={cn(
          "rycode-header fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-shadow duration-300",
          overlay
            ? "reference-overlay-header border-white/15 bg-black/15 text-white"
            : "border-border bg-surface/95 text-foreground",
          elevated ? "shadow-[0_5px_20px_rgba(0,0,0,0.04)]" : "shadow-none",
        )}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[70] focus:bg-surface focus:p-3"
        >
          {isFa ? "رفتن به محتوای اصلی" : "Skip to content"}
        </a>
        <Container className="rycode-header-inner relative grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-4 [direction:ltr] sm:h-[72px] xl:max-w-[1440px] xl:gap-5">
          <HeaderActions
            locale={locale}
            pathname={pathname}
            overlay={overlay}
            className="hidden min-w-0 justify-self-start sm:flex"
          />
          <div className="sm:hidden" />

          <Link
            href="/"
            aria-label="RYCODE"
            onClick={() => setDesktopOpen(null)}
            className="justify-self-center"
          >
            <Logo variant={overlay ? "light" : "adaptive"} className="text-[1.05rem]" />
          </Link>

          <nav
            aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}
            className="hidden min-w-0 items-center justify-self-end xl:flex"
            dir={isFa ? "rtl" : "ltr"}
          >
            <ul className="flex min-w-0 flex-nowrap items-center gap-1">
              {nav
                .filter((item) => !item.emphasis)
                .map((item, index) => (
                  <DesktopNavItem
                    key={`${item.id ?? item.href}-${index}`}
                    item={item}
                    pathname={pathname}
                    overlay={overlay}
                    locale={locale}
                    open={desktopOpen?.href === item.href}
                    pinned={desktopOpen?.href === item.href && desktopOpen.pinned}
                    onOpen={() =>
                      setDesktopOpen((current) =>
                        current?.href === item.href ? current : { href: item.href, pinned: false },
                      )
                    }
                    onToggle={() =>
                      setDesktopOpen((current) =>
                        current?.href === item.href && current.pinned
                          ? null
                          : { href: item.href, pinned: true },
                      )
                    }
                    onClose={() =>
                      setDesktopOpen((current) => (current?.href === item.href ? null : current))
                    }
                  />
                ))}
            </ul>
          </nav>

          <button
            ref={mobileTrigger}
            type="button"
            onClick={() => {
              setDesktopOpen(null);
              setMobilePath(menuPath);
            }}
            aria-controls="site-mobile-menu"
            aria-label={isFa ? "باز کردن منو" : "Open menu"}
            aria-expanded={mobileOpen}
            className={cn(
              "grid size-10 place-items-center justify-self-end rounded-md border transition-colors xl:hidden",
              overlay
                ? "border-white/35 bg-transparent text-white hover:border-white/75 hover:bg-white/10"
                : "border-border bg-surface text-foreground hover:border-brand hover:bg-brand-soft",
            )}
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </Container>
      </header>

      <AnimatePresence initial={false}>{mobileOpen && (
        <MobileMenu
          key="mobile-navigation"
          locale={locale}
          nav={nav}
          pathname={pathname}
          onClose={() => setMobilePath(null)}
          returnFocusRef={mobileTrigger}
        />
      )}</AnimatePresence>
    </></BrandText>
  );
}

function DesktopNavItem({
  item,
  pathname,
  overlay,
  locale,
  open,
  pinned,
  onOpen,
  onToggle,
  onClose,
}: {
  item: PrimaryNavItem;
  pathname: string;
  overlay: boolean;
  locale: Locale;
  open: boolean;
  pinned: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onClose: () => void;
}) {
  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const groups = item.menu?.length ?? 0;
  const servicesMenu = item.href === "/services";
  const showLabel = locale === "fa" ? `زیرمنوی ${item.label}` : `${item.label} submenu`;

  return (
    <BrandText><li
      className="relative flex h-[72px] items-center"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && item.menu) onOpen();
      }}
      onPointerLeave={() => {
        if (!pinned && !panelRef.current?.contains(document.activeElement)) onClose();
      }}
      onBlur={(event) => {
        if (pinned && !event.relatedTarget) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node)) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          triggerRef.current?.focus();
        }
        if (event.key === "ArrowDown" && item.menu) {
          event.preventDefault();
          onOpen();
          requestAnimationFrame(() =>
            panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(),
          );
        }
      }}
    >
      {item.menu ? (
        <button
          ref={triggerRef}
          type="button"
          aria-label={showLabel}
          aria-expanded={open}
          aria-controls={panelId}
          aria-current={active ? "page" : undefined}
          onClick={onToggle}
          className={cn(
            "rycode-primary-link inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.75rem] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
            overlay ? "text-white/80 focus-visible:outline-white" : "text-foreground focus-visible:outline-brand",
          )}
        >
          <span>{item.label}</span>
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      ) : (
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          onFocus={onClose}
          onClick={onClose}
          className={cn(
            "rycode-primary-link relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.75rem] font-medium transition-colors",
            overlay ? "text-white/75 hover:text-white" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      )}

      {item.menu && (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label={showLabel}
          aria-hidden={!open}
          inert={!open ? true : undefined}
          data-state={open ? "open" : "closed"}
          className={cn(
            "rycode-desktop-submenu absolute right-0 top-full z-50 max-w-[calc(100vw-3rem)] pt-2",
            servicesMenu ? "w-[400px]" : groups === 1 ? "w-72" : groups === 2 ? "w-[520px]" : "w-[860px]",
          )}
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {servicesMenu ? <ServicesMenu locale={locale} pathname={pathname} onClose={onClose} /> : <div
            className={cn(
              "rycode-submenu-surface grid gap-4",
              groups === 1
                ? "grid-cols-1"
                : groups === 2
                  ? "grid-cols-2"
                  : groups >= 4
                    ? "grid-cols-4"
                    : "grid-cols-3",
            )}
          >
            {item.menu.map((group) => (
              <div
                key={group.title}
                className={
                  group.id === "service-resources"
                    ? "col-span-4 flex items-center justify-between gap-6 border-t border-border pt-4"
                    : undefined
                }
              >
                {group.id !== "about-links" && <p
                  className={cn(
                    "text-xs font-semibold text-foreground dark:text-foreground",
                    group.id === "service-resources"
                      ? "shrink-0"
                      : "mb-2 border-b border-border pb-2",
                  )}
                >
                  {group.title}
                </p>}
                <ul
                  className={
                    group.id === "service-resources" ? "flex flex-wrap gap-2" : "rycode-submenu-list"
                  }
                >
                  {group.items.map((child, index) => (
                    <li key={`${child.id ?? child.href}-${child.label}-${index}`}>
                      <SubmenuLink
                        href={child.href}
                        onClick={onClose}
                        current={pathname === child.href}
                      >
                        {child.label}
                      </SubmenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>}
        </div>
      )}
    </li></BrandText>
  );
}

const submenuIcons: Record<string, LucideIcon> = {
  "/services/web-development": ScanLine,
  "/services/seo-growth": ChartNoAxesCombined,
  "/services/custom-software": CodeXml,
  "/services/project-rescue": Wrench,
  "/services/api-integration": Bot,
  "/services/data-analytics": FileSpreadsheet,
  "/services/ongoing-support": Headset,
  "/about": UsersRound,
  "/about#approach": ShieldCheck,
  "/about#process": Route,
  "/about#technology": Blocks,
  "/faq": CircleHelp,
};

function SubmenuLink({ href, children, onClick, current, className }: {
  href: PrimaryNavItem["href"];
  children: ReactNode;
  onClick: () => void;
  current: boolean;
  className?: string;
}) {
  const Icon = submenuIcons[href] ?? ArrowRight;
  return <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined} className={cn("rycode-submenu-link", className)}>
    <span className="rycode-submenu-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.65} /></span>
    <span className="rycode-submenu-label">{children}</span>
    <ArrowRight className="rycode-submenu-arrow" size={14} aria-hidden="true" />
  </Link>;
}

function ServicesMenu({ locale, pathname, onClose, mobile = false }: {
  locale: Locale;
  pathname: string;
  onClose: () => void;
  mobile?: boolean;
}) {
  return <div className={cn("rycode-submenu-surface rycode-services-menu", mobile && "rycode-services-menu-mobile")}>
    <ul className="rycode-services-menu-list">
      {serviceHighlights.map(service => <li key={service.id}>
        <SubmenuLink href={`/services/${service.slug}`} onClick={onClose} current={pathname === `/services/${service.slug}`} className="rycode-services-menu-link">{service.title[locale]}</SubmenuLink>
      </li>)}
    </ul>
  </div>;
}

function HeaderActions({
  locale,
  pathname,
  overlay,
  className,
}: {
  locale: Locale;
  pathname: string;
  overlay: boolean;
  className?: string;
}) {
  const isFa = locale === "fa";

  return (
    <BrandText><div
      className={cn(
        "rycode-header-tools inline-flex items-center gap-1 rounded-full border p-1 backdrop-blur-md",
        overlay
          ? "border-white/20 bg-white/[0.08] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
          : "border-border/80 bg-surface/80 text-foreground shadow-[0_8px_24px_rgba(38,48,74,0.06)]",
        className,
      )}
      dir="ltr"
    >
      <Link
        href={pathname}
        locale={isFa ? "en" : "fa"}
        hrefLang={isFa ? "en" : "fa"}
        aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
        title={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
        className={cn(
          "group inline-flex h-9 items-center gap-2 rounded-full px-3 font-latin text-[0.68rem] font-bold tracking-[0.14em] transition-colors",
          overlay
            ? "text-white/75 hover:bg-white/10 hover:text-white"
            : "text-foreground/70 hover:bg-brand-soft hover:text-foreground",
        )}
      >
        <Globe2 className="size-3.5 transition-transform duration-200 group-hover:rotate-12" aria-hidden />
        {isFa ? "EN" : "FA"}
      </Link>
      <span aria-hidden className={cn("h-5 w-px", overlay ? "bg-white/20" : "bg-border")} />
      <ThemeToggle locale={locale} variant={overlay ? "light" : "default"} />
    </div></BrandText>
  );
}

function MobileMenu({
  locale,
  nav,
  pathname,
  onClose,
  returnFocusRef,
}: {
  locale: Locale;
  nav: PrimaryNavItem[];
  pathname: string;
  onClose: () => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const isFa = locale === "fa";
  const present = useIsPresent();
  const reduceMotion = useReducedMotion();
  const [expanded, setExpanded] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!present) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [present, returnFocusRef]);

  return (
    <BrandText><motion.div
      className="fixed inset-0 z-[60] xl:hidden"
      dir="ltr"
      aria-hidden={!present}
      inert={!present ? true : undefined}
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : .18, ease: [.22, 1, .36, 1] }}
      style={{ pointerEvents: present ? "auto" : "none" }}
    >
      <button
        type="button"
        aria-label={isFa ? "بستن منو" : "Close menu"}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <motion.aside
        ref={dialogRef}
        id="site-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={isFa ? "منوی سایت" : "Site menu"}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
          if (event.key !== "Tab") return;
          const controls = Array.from(
            dialogRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ??
              [],
          ).filter((element) => !element.closest("[hidden]"));
          const first = controls[0];
          const last = controls.at(-1);
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        className="relative ml-auto flex h-dvh w-full max-w-[420px] flex-col border-l border-border bg-surface text-foreground shadow-2xl"
        dir={isFa ? "rtl" : "ltr"}
        initial={reduceMotion ? false : { x: 24 }}
        animate={{ x: 0 }}
        exit={{ x: 24 }}
        transition={{ duration: reduceMotion ? 0 : .24, ease: [.22, 1, .36, 1] }}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <Logo />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={isFa ? "بستن" : "Close"}
            className="grid size-10 place-items-center rounded-xl border border-border transition-colors hover:bg-brand-soft"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        <nav
          aria-label={isFa ? "منوی موبایل" : "Mobile navigation"}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-3"
        >
          <ul>
            {nav.map((item, index) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li
                  key={`${item.id ?? item.href}-${index}`}
                  className="border-b border-border py-1"
                >
                  <div className="flex items-center gap-3">
                    {item.menu ? (
                      <button
                        type="button"
                        aria-label={isFa ? `نمایش ${item.label}` : `Show ${item.label}`}
                        aria-expanded={expanded === item.href}
                        aria-controls={`mobile-submenu-${index}`}
                        onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                        className="flex min-w-0 flex-1 items-center gap-4 rounded-lg py-3 text-base font-medium text-foreground transition-colors hover:bg-brand-soft"
                      >
                        <span className="font-latin text-[0.65rem] tracking-[0.16em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.label}</span>
                        <ChevronDown aria-hidden className={cn("ms-auto size-4 shrink-0 transition-transform", expanded === item.href && "rotate-180")} />
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className="flex min-w-0 flex-1 items-center gap-4 py-3 text-base font-medium text-foreground/85 transition-colors hover:text-foreground"
                      >
                        <span className="font-latin text-[0.65rem] tracking-[0.16em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                  {item.menu && (
                    <div
                      id={`mobile-submenu-${index}`}
                      hidden={expanded !== item.href}
                      className={cn(
                        "rycode-mobile-submenu mb-3 mt-1 gap-4 rounded-xl border border-border bg-transparent p-2",
                        expanded === item.href ? "grid" : "hidden",
                      )}
                    >
                      {item.href === "/services" ? <ServicesMenu locale={locale} pathname={pathname} onClose={onClose} mobile /> : item.menu.map((group) => (
                        <div key={group.title}>
                          {group.id !== "about-links" && <p className="mb-2 text-xs font-semibold text-foreground dark:text-foreground">
                            {group.title}
                          </p>}
                          <ul className="rycode-submenu-list">
                            {group.items.map((child, childIndex) => (
                              <li key={`${child.id ?? child.href}-${child.label}-${childIndex}`}>
                                <SubmenuLink
                                  href={child.href}
                                  onClick={onClose}
                                  current={pathname === child.href}
                                >
                                  {child.label}
                                </SubmenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-border bg-brand-soft px-5 py-4">
          <div className="mb-3 flex items-center justify-between gap-3" dir="ltr">
            <ThemeToggle locale={locale} />
            <Link
              href={pathname}
              locale={isFa ? "en" : "fa"}
              hrefLang={isFa ? "en" : "fa"}
              onClick={onClose}
              aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-3 font-latin text-xs font-semibold tracking-[0.14em] text-foreground/80 transition-colors hover:border-brand hover:bg-brand-soft"
            >
              <Globe2 className="size-4" aria-hidden />
              {isFa ? "EN" : "FA"}
            </Link>
          </div>
          <Link
            href="/start-project"
            onClick={onClose}
            className="inline-flex h-10 w-full items-center justify-center rounded-full border border-brand/55 bg-brand text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand/90"
          >
            {isFa ? "شروع یک پروژه" : "Start a project"}
          </Link>
        </div>
      </motion.aside>
    </motion.div></BrandText>
  );
}
