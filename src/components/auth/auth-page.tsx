import { AuthCard } from "@/components/auth/auth-card";
import { BrandText } from "@/components/site/brand-text";
import { Container } from "@/components/site/primitives";
import { SiteShell } from "@/components/site/site-shell";
import type { Locale } from "@/i18n/routing";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";

export function AuthPage({
  locale,
  mode,
}: {
  locale: Locale;
  mode: "login" | "register" | "forgot" | "reset";
}) {
  const fa = locale === "fa";
  return (
    <BrandText><SiteShell locale={locale}>
      <section className="coorda-auth-page">
        <Container>
          <div className="coorda-contact-grid">
            <aside className="coorda-contact-panel">
              <Image
                src="/images/editorial/rycode-hero-poster.jpg"
                alt=""
                fill
                sizes="(min-width: 768px) 46vw, 90vw"
                preload
              />
              <p className="coorda-eyebrow">RYCODE / WORKSPACE</p>
              <h2>
                {fa
                  ? "فضای امنی برای ادامهٔ مسیر پروژه‌ات"
                  : "A secure workspace for your project’s next chapter"}
              </h2>
              <p>
                {fa
                  ? "درخواست‌ها، تصمیم‌ها و وضعیت کار را یک‌جا دنبال کن؛ بدون زنجیره‌های پراکندهٔ پیام و فایل"
                  : "Keep requests, decisions and delivery status together, without fragmented messages and files."}
              </p>
              <ul className="coorda-auth-benefits">
                {[
                  { icon: ShieldCheck, fa: "دسترسی کنترل‌شده", en: "Controlled access" },
                  { icon: LockKeyhole, fa: "اطلاعات خصوصی", en: "Private by design" },
                  { icon: Sparkles, fa: "مسیر شفاف", en: "Clear progress" },
                ].map((item) => (
                  <li key={item.en}>
                    <item.icon aria-hidden />
                    {item[locale]}
                  </li>
                ))}
              </ul>
            </aside>
            <Suspense fallback={<div className="coorda-auth-card min-h-[34rem]" />}>
              <AuthCard locale={locale} mode={mode} />
            </Suspense>
          </div>
        </Container>
      </section>
    </SiteShell></BrandText>
  );
}
