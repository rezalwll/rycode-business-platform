import { AuthCard } from "@/components/auth/auth-card";
import { Container } from "@/components/site/primitives";
import { SiteShell } from "@/components/site/site-shell";
import type { Locale } from "@/i18n/routing";
import { LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Suspense } from "react";

export function AuthPage({
  locale,
  mode,
}: {
  locale: Locale;
  mode: "login" | "register" | "forgot" | "reset";
}) {
  return (
    <SiteShell locale={locale}>
      <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-[#f7fcfb] text-[#073b4c]">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,#effbf7,#f5f8ff_60%,#fff8e4)] dark:bg-[linear-gradient(105deg,#102d35,#14283d_60%,#302d22)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_15%,rgba(95,225,213,0.25),transparent_24%),radial-gradient(circle_at_82%_82%,rgba(99,146,255,0.16),transparent_28%)]" />
        <div className="absolute inset-0 -z-10 opacity-[0.12] [background-image:linear-gradient(rgba(7,59,76,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(7,59,76,.4)_1px,transparent_1px)] [background-size:44px_44px]" />
        <Container className="grid min-h-[calc(100vh-72px)] gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(400px,0.72fr)] lg:items-center lg:gap-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="flex items-center gap-3 text-xs font-semibold tracking-[0.16em] text-[#087b83] uppercase">
              <span className="h-px w-8 bg-[#20bfb2]" />
              RYCODE / WORKSPACE
            </p>
            <h2 className="mt-6 text-[clamp(2rem,4vw,4.25rem)] font-light leading-[1.2] tracking-[-0.035em]">
              {locale === "fa"
                ? "فضای امنی برای ادامهٔ مسیر پروژه‌تان."
                : "A secure workspace for the next stage of your project."}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-8 text-[#315d68]/78 sm:text-base sm:leading-9">
              {locale === "fa"
                ? "درخواست‌ها، تصمیم‌ها و وضعیت کار را یک‌جا دنبال کنید؛ بدون زنجیره‌های پراکندهٔ پیام و فایل."
                : "Keep requests, decisions and delivery status together—without fragmented message and file chains."}
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  fa: "دسترسی کنترل‌شده",
                  en: "Controlled access",
                },
                { icon: LockKeyhole, fa: "اطلاعات خصوصی", en: "Private by design" },
                { icon: Sparkles, fa: "مسیر شفاف", en: "Clear progress" },
              ].map((item) => (
                <div
                  key={item.en}
                  className="rounded-xl border border-white/90 bg-white/70 p-4 shadow-sm backdrop-blur-sm"
                >
                  <item.icon className="size-5 text-[#5fe1d5]" aria-hidden />
                  <p className="mt-3 text-xs font-semibold text-[#315d68]/85">
                    {locale === "fa" ? item.fa : item.en}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Suspense
            fallback={
              <div className="h-[34rem] w-full animate-pulse rounded-2xl border border-white/90 bg-white/70 shadow-sm" />
            }
          >
            <AuthCard locale={locale} mode={mode} />
          </Suspense>
        </Container>
      </section>
    </SiteShell>
  );
}
