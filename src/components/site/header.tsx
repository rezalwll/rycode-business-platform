"use client";
import { BrandText } from "@/components/site/brand-text";

import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

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

      {mobileOpen && (
        <MobileMenu
          locale={locale}
          nav={nav}
          pathname={pathname}
          onClose={() => setMobilePath(null)}
          returnFocusRef={mobileTrigger}
        />
      )}
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
      <div className="flex items-center gap-0.5">
        <Link
          href={item.href}
          aria-current={active ? "page" : undefined}
          onFocus={() => {
            if (item.menu) onOpen();
            else onClose();
          }}
          onClick={onClose}
          className={cn(
            "rycode-primary-link relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[0.75rem] font-medium transition-colors",
            item.emphasis
              ? overlay
                ? "text-white"
                : "text-foreground"
              : active
                ? overlay
                  ? "text-white after:scale-x-100"
                  : "text-foreground after:scale-x-100 dark:text-white"
                : overlay
                  ? "text-white/75 hover:text-white"
                  : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
        {item.menu && (
          <button
            ref={triggerRef}
            type="button"
            aria-label={showLabel}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className={cn(
              "grid size-7 place-items-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
              overlay
                ? "text-white/80 hover:bg-white/10"
                : "text-foreground hover:bg-surface-2 dark:text-white/80 dark:hover:bg-white/10",
            )}
          >
            <ChevronDown
              className={cn("size-3.5 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>
        )}
      </div>

      {item.menu && (
        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-label={showLabel}
          className={cn(
            "absolute right-0 top-full z-50 max-w-[calc(100vw-3rem)] pt-2",
            !open && "hidden",
            servicesMenu ? "w-[360px]" : groups === 1 ? "w-72" : groups === 2 ? "w-[520px]" : "w-[860px]",
          )}
          dir={locale === "fa" ? "rtl" : "ltr"}
        >
          {servicesMenu ? <ServicesMenu locale={locale} onClose={onClose} /> : <div
            className={cn(
              "grid max-h-[min(70vh,560px)] gap-6 overflow-y-auto rounded-xl border border-border bg-surface p-6 text-foreground shadow-[0_20px_60px_rgba(0,0,0,0.14)]",
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
                <p
                  className={cn(
                    "text-xs font-semibold text-foreground dark:text-foreground",
                    group.id === "service-resources"
                      ? "shrink-0"
                      : "mb-2 border-b border-border pb-2",
                  )}
                >
                  {group.title}
                </p>
                <ul
                  className={
                    group.id === "service-resources" ? "flex flex-wrap gap-2" : "space-y-2"
                  }
                >
                  {group.items.map((child, index) => (
                    <li key={`${child.id ?? child.href}-${child.label}-${index}`}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        className="block rounded-lg px-2 py-2 text-xs leading-5 text-foreground/80 transition-colors hover:bg-brand-soft hover:text-brand-foreground focus-visible:bg-brand-soft focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        {child.label}
                      </Link>
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

function ServicesMenu({ locale, onClose, mobile = false }: {
  locale: Locale;
  onClose: () => void;
  mobile?: boolean;
}) {
  return <div className={cn("rycode-services-menu", mobile && "rycode-services-menu-mobile")}>
    <ul className="rycode-services-menu-list">
      {serviceHighlights.map(service => <li key={service.id}>
        <Link href={`/services/${service.slug}`} onClick={onClose} className="rycode-services-menu-link">{service.title[locale]}</Link>
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
    <BrandText><div className={cn("items-center gap-3", className)} dir="ltr">
      <ThemeToggle locale={locale} variant={overlay ? "light" : "default"} />
      <Link
        href={pathname}
        locale={isFa ? "en" : "fa"}
        hrefLang={isFa ? "en" : "fa"}
        aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full px-3 font-latin text-[0.68rem] font-semibold tracking-[0.12em] transition-colors",
          overlay
            ? "bg-transparent text-white/75 hover:bg-white/10 hover:text-white"
            : "bg-transparent text-foreground/70 hover:bg-surface-2 hover:text-foreground",
        )}
      >
        <Globe2 className="size-3.5" aria-hidden />
        {isFa ? "EN" : "FA"}
      </Link>
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
  const [expanded, setExpanded] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = returnFocusRef.current;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [returnFocusRef]);

  return (
    <BrandText><div className="fixed inset-0 z-[60] xl:hidden" dir="ltr">
      <button
        type="button"
        aria-label={isFa ? "بستن منو" : "Close menu"}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
      />

      <aside
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
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex min-w-0 flex-1 items-center gap-4 py-3 text-base font-medium transition-colors",
                        item.emphasis
                          ? "text-foreground dark:text-foreground"
                          : active
                            ? "text-foreground dark:text-foreground"
                            : "text-foreground/85 hover:text-foreground",
                      )}
                    >
                      <span className="font-latin text-[0.65rem] tracking-[0.16em] text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                    {item.menu && (
                      <button
                        type="button"
                        aria-label={isFa ? `نمایش ${item.label}` : `Show ${item.label}`}
                        aria-expanded={expanded === item.href}
                        aria-controls={`mobile-submenu-${index}`}
                        onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                        className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-foreground/70 transition-colors hover:bg-brand-soft"
                      >
                        <ChevronDown
                          aria-hidden
                          className={cn(
                            "size-4 transition-transform",
                            expanded === item.href && "rotate-180",
                          )}
                        />
                      </button>
                    )}
                  </div>
                  {item.menu && (
                    <div
                      id={`mobile-submenu-${index}`}
                      hidden={expanded !== item.href}
                      className={cn(
                        "mb-3 mt-1 gap-4 rounded-xl border border-border bg-transparent p-3",
                        expanded === item.href ? "grid" : "hidden",
                      )}
                    >
                      {item.href === "/services" ? <ServicesMenu locale={locale} onClose={onClose} mobile /> : item.menu.map((group) => (
                        <div key={group.title}>
                          <p className="mb-2 text-xs font-semibold text-foreground dark:text-foreground">
                            {group.title}
                          </p>
                          <ul className="space-y-1">
                            {group.items.map((child, childIndex) => (
                              <li key={`${child.id ?? child.href}-${child.label}-${childIndex}`}>
                                <Link
                                  href={child.href}
                                  onClick={onClose}
                                  className="block rounded-md px-2 py-2 text-sm leading-6 text-foreground/80 transition-colors hover:bg-surface hover:text-foreground"
                                >
                                  {child.label}
                                </Link>
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
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 font-latin text-xs tracking-[0.14em] text-foreground/80"
            >
              <Globe2 className="size-4" aria-hidden />
              {isFa ? "ENGLISH" : "فارسی"}
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
      </aside>
    </div></BrandText>
  );
}
