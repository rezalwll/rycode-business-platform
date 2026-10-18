"use client";
import { BrandText } from "@/components/site/brand-text";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteShell } from "@/components/site/site-shell";
import { localizedHref } from "./shared";
import "./inner-pages.css";

export function PublicFailurePage({
  kind,
  reset,
}: {
  kind: "not-found" | "error";
  reset?: () => void;
}) {
  const pathname = usePathname() ?? "/";
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fa";
  const fa = locale === "fa";
  return (
    <BrandText>
      <SiteShell locale={locale}>
        <div className="rycode-inner" dir={fa ? "rtl" : "ltr"}>
          <section className="inner-recovery inner-container">
            <div className="inner-recovery-card">
              <span className="inner-recovery-code" dir="ltr">
                {kind === "not-found" ? "404" : "Oops"}
              </span>
              <h1>
                {kind === "not-found"
                  ? fa
                    ? "این صفحه اینجا نیست"
                    : "This page is not here"
                  : fa
                    ? "این صفحه بارگذاری نشد"
                    : "This page could not load"}
              </h1>
              <p>
                {kind === "not-found"
                  ? fa
                    ? "شاید آدرس عوض شده؛ از خانه دوباره مسیرت را پیدا کن"
                    : "The address may have changed. Start again from the home page."
                  : fa
                    ? "یک بار دیگر امتحان کن؛ اگر ادامه داشت، از صفحهٔ تماس به ما بگو"
                    : "Please try again. If the problem continues, let us know through the contact page."}
              </p>
              {reset && (
                <button type="button" className="inner-button mx-2" onClick={reset}>
                  {fa ? "تلاش دوباره" : "Try again"}
                </button>
              )}
              <Link className="inner-button mx-2" href={localizedHref(locale, "/")}>
                {fa ? "برگردیم به خانه" : "Back to home"}
              </Link>
            </div>
          </section>
        </div>
      </SiteShell>
    </BrandText>
  );
}
