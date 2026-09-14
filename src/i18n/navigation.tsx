"use client";

import NextLink from "next/link";
import { usePathname as useNextPathname, useRouter as useNextRouter } from "next/navigation";
import type { ComponentProps } from "react";

import type { Locale } from "./routing";

function localeFromPathname(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";
}

function withoutLocalePrefix(pathname: string): string {
  if (pathname === "/en" || pathname === "/fa") return "/";
  if (pathname.startsWith("/en/") || pathname.startsWith("/fa/")) return pathname.slice(3);
  return pathname;
}

function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith("/")) return href;
  const path = withoutLocalePrefix(href);
  return locale === "en" ? `/en${path === "/" ? "" : path}` : path;
}

type LinkProps = Omit<ComponentProps<typeof NextLink>, "href"> & {
  href: string;
  locale?: Locale;
};

export function Link({ href, locale, ...props }: LinkProps) {
  const pathname = useNextPathname();
  const targetLocale = locale ?? localeFromPathname(pathname);
  return <NextLink href={localizeHref(href, targetLocale)} {...props} />;
}

export function usePathname(): string {
  return withoutLocalePrefix(useNextPathname());
}

export function useRouter() {
  const router = useNextRouter();
  const pathname = useNextPathname();
  const locale = localeFromPathname(pathname);
  const push: typeof router.push = (href, options) =>
    router.push(localizeHref(href, locale), options);
  const replace: typeof router.replace = (href, options) =>
    router.replace(localizeHref(href, locale), options);

  return { ...router, push, replace };
}
