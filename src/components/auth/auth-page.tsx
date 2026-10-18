import { AuthCard } from "@/components/auth/auth-card";
import { BrandText } from "@/components/site/brand-text";
import { Logo } from "@/components/site/logo";
import { SiteShell } from "@/components/site/site-shell";
import type { Locale } from "@/i18n/routing";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Suspense } from "react";
import "@/components/public/inner-pages.css";

export function AuthPage({
  locale,
  mode,
}: {
  locale: Locale;
  mode: "login" | "register" | "forgot" | "reset";
}) {
  const fa = locale === "fa";
  return (
    <BrandText>
      <SiteShell locale={locale}>
        <div className="rycode-inner inner-account-page" dir={fa ? "rtl" : "ltr"}>
          <section className="inner-account">
            <div className="inner-account-brand">
              <Logo variant="adaptive" />
            </div>
            <Suspense
              fallback={
                <div className="inner-account-loading" role="status">
                  {fa ? "در حال آماده‌سازی فرم…" : "Preparing the form…"}
                </div>
              }
            >
              <AuthCard locale={locale} mode={mode} />
            </Suspense>
            <aside className="inner-account-note">
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
              <ul>
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
          </section>
        </div>
      </SiteShell>
    </BrandText>
  );
}
