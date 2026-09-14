import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Keep Persian as the clean, unprefixed canonical locale while the App Router
 * continues to use a `[locale]` segment internally. Using next-intl's generic
 * `as-needed` middleware here causes a rewrite/redirect loop on Next.js 16 for
 * the default locale, so the two deterministic locale rules live here.
 */
export default function proxy(request: NextRequest) {
  if (request.headers.get("x-rycode-locale-rewrite") === "1") {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname === "/fa" || pathname.startsWith("/fa/")) {
    url.pathname = pathname === "/fa" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return NextResponse.next();
  }

  url.pathname = pathname === "/" ? "/fa" : `/fa${pathname}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-rycode-locale-rewrite", "1");
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|health|sitemap.xml|robots.txt|.*\\..*).*)"],
};
