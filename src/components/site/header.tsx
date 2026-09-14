"use client";

import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  industries,
  primaryNav,
  serviceGroups,
  solutionGroups,
  type NavGroup,
  type NavLink,
} from "@/lib/nav-content";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { Container, CtaLink } from "./primitives";
import { ThemeToggle } from "./theme-toggle";

type MenuKey = "services" | "solutions" | "industries" | null;

const englishPrimary: NavLink[] = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/solutions" },
  { label: "Industries", href: "/industries" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/blog" },
  { label: "About", href: "/about" },
];

const englishServices: NavGroup[] = [
  {
    title: "Build",
    items: [
      { label: "Web platforms", href: "/services" },
      { label: "Ecommerce", href: "/services" },
      { label: "Custom software", href: "/services" },
    ],
  },
  {
    title: "Improve",
    items: [
      { label: "Project rescue", href: "/technical-review" },
      { label: "Performance", href: "/problems" },
      { label: "Continuous support", href: "/services" },
    ],
  },
  {
    title: "Connect",
    items: [
      { label: "APIs", href: "/integrations" },
      { label: "Integrations", href: "/integrations" },
      { label: "Business data", href: "/solutions" },
    ],
  },
  {
    title: "Grow",
    items: [
      { label: "Technical SEO", href: "/services" },
      { label: "Content systems", href: "/services" },
      { label: "SEO audit", href: "/seo-audit" },
    ],
  },
];

const englishSolutions: NavGroup[] = [
  {
    title: "Customers",
    items: [
      { label: "CRM", href: "/solutions" },
      { label: "Customer portals", href: "/solutions" },
      { label: "Lead management", href: "/solutions" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Ordering systems", href: "/solutions" },
      { label: "Dashboards", href: "/solutions" },
      { label: "Internal workflows", href: "/solutions" },
    ],
  },
  {
    title: "Platforms",
    items: [
      { label: "Marketplaces", href: "/solutions" },
      { label: "Learning platforms", href: "/solutions" },
      { label: "Booking systems", href: "/solutions" },
    ],
  },
];

export function SiteHeader({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isFa = locale === "fa";
  const nav = isFa ? primaryNav : englishPrimary;
  const services = isFa ? serviceGroups : englishServices;
  const solutions = isFa ? solutionGroups : englishSolutions;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobile]);

  return (
    <header
      className={cn(
        "sticky top-3 z-50 px-3 transition-[background-color,border-color] duration-300",
      )}
      onMouseLeave={() => setOpen(null)}
    >
      <Container
        className={cn(
          "flex h-[68px] items-center justify-between gap-6 rounded-full border px-4 shadow-lg backdrop-blur-xl transition-colors sm:px-6",
          scrolled ? "border-border bg-background/90" : "border-border/70 bg-background/75",
        )}
      >
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="RYCODE" className="shrink-0">
            <Logo />
          </Link>

          <nav
            aria-label={isFa ? "ناوبری اصلی" : "Primary navigation"}
            className="hidden items-center gap-1 lg:flex"
          >
            {nav.map((item) => {
              const key: MenuKey =
                item.href === "/services"
                  ? "services"
                  : item.href === "/solutions"
                    ? "solutions"
                    : item.href === "/industries"
                      ? "industries"
                      : null;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <div key={item.href} onMouseEnter={() => setOpen(key)}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                      active ? "text-foreground" : "text-foreground/70",
                    )}
                  >
                    {item.label}
                    {key && (
                      <ChevronDown
                        aria-hidden
                        className={cn(
                          "size-3.5 transition-transform",
                          open === key && "rotate-180",
                        )}
                      />
                    )}
                  </Link>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={pathname}
            locale={isFa ? "en" : "fa"}
            className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            aria-label={isFa ? "Switch to English" : "تغییر زبان به فارسی"}
            hrefLang={isFa ? "en" : "fa"}
          >
            <Globe className="size-3.5" aria-hidden />
            {isFa ? "EN" : "FA"}
          </Link>
          <ThemeToggle className="hidden md:inline-flex" />
          <Link
            href="/login"
            className="hidden px-3 text-sm font-medium text-foreground/80 hover:text-foreground md:inline-flex"
          >
            {isFa ? "ورود مشتری" : "Client login"}
          </Link>
          <CtaLink to="/start-project" className="hidden h-10 px-5 sm:inline-flex">
            {isFa ? "شروع پروژه" : "Start a project"}
          </CtaLink>
          <button
            type="button"
            onClick={() => setMobile(true)}
            aria-label={isFa ? "منو" : "Menu"}
            aria-expanded={mobile}
            className="grid size-10 place-items-center rounded-md border border-border lg:hidden"
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </Container>

      {open && (
        <div className="absolute inset-x-3 top-[calc(100%+0.75rem)] hidden rounded-[1.5rem] border border-border bg-surface/95 shadow-2xl backdrop-blur-xl lg:block">
          <Container className="py-10">
            {open === "services" && <MegaColumns groups={services} />}
            {open === "solutions" && <MegaColumns groups={solutions} />}
            {open === "industries" && (
              <div className="grid grid-cols-4 gap-x-8 gap-y-3">
                {industries.map((name) => (
                  <Link
                    key={name}
                    href="/industries"
                    className="rule-top py-3 text-sm text-foreground/80 transition-colors hover:text-brand"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            )}
          </Container>
        </div>
      )}

      {mobile && (
        <MobileNav
          locale={locale}
          nav={nav}
          services={services}
          solutions={solutions}
          onClose={() => setMobile(false)}
        />
      )}
    </header>
  );
}

function MegaColumns({ groups }: { groups: NavGroup[] }) {
  return (
    <div className="grid grid-cols-4 gap-8 xl:grid-cols-5">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">{group.title}</p>
          <ul className="mt-4 space-y-2.5">
            {group.items.map((item) => (
              <li key={`${group.title}-${item.label}`}>
                <Link
                  href={item.href}
                  className="text-sm text-foreground/75 transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MobileNav({
  locale,
  nav,
  services,
  solutions,
  onClose,
}: {
  locale: Locale;
  nav: NavLink[];
  services: NavGroup[];
  solutions: NavGroup[];
  onClose: () => void;
}) {
  const [section, setSection] = useState<string | null>(null);
  const isFa = locale === "fa";
  const drawers = [
    { key: "services", label: isFa ? "خدمات" : "Services", groups: services },
    { key: "solutions", label: isFa ? "راهکارها" : "Solutions", groups: solutions },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background lg:hidden">
      <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
        <Logo />
        <button
          type="button"
          onClick={onClose}
          aria-label={isFa ? "بستن" : "Close"}
          className="grid size-10 place-items-center rounded-md border border-border"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {drawers.map((drawer) => (
          <div key={drawer.key} className="border-b border-border">
            <button
              type="button"
              onClick={() => setSection(section === drawer.key ? null : drawer.key)}
              className="flex w-full items-center justify-between py-4 text-start text-lg font-semibold"
            >
              {drawer.label}
              <ChevronDown
                aria-hidden
                className={cn(
                  "size-4 transition-transform",
                  section === drawer.key && "rotate-180",
                )}
              />
            </button>
            {section === drawer.key && (
              <div className="pb-4">
                {drawer.groups.map((group) => (
                  <div key={group.title} className="mb-4">
                    <p className="text-xs font-bold tracking-[0.12em] text-brand uppercase">
                      {group.title}
                    </p>
                    <ul className="mt-2 space-y-2">
                      {group.items.map((item) => (
                        <li key={`${group.title}-${item.label}`}>
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className="block text-sm text-muted-foreground"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {nav
          .filter((item) => item.href !== "/services" && item.href !== "/solutions")
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block border-b border-border py-4 text-lg font-semibold"
            >
              {item.label}
            </Link>
          ))}
      </div>

      <div className="shrink-0 space-y-3 border-t border-border px-5 py-5">
        <CtaLink to="/start-project" className="w-full">
          {isFa ? "شروع پروژه" : "Start a project"}
        </CtaLink>
        <CtaLink to="/technical-review" variant="outline" className="w-full">
          {isFa ? "درخواست بررسی فنی" : "Technical review"}
        </CtaLink>
        <div className="flex items-center justify-between pt-2">
          <ThemeToggle />
          <Link href="/login" onClick={onClose} className="text-sm font-medium">
            {isFa ? "ورود مشتری" : "Client login"}
          </Link>
        </div>
      </div>
    </div>
  );
}
