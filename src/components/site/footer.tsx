import { ArrowUpLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Container } from "./primitives";
import { footerNav } from "@/lib/nav-content";
import type { Locale } from "@/i18n/routing";

const englishFooter = [
  {
    title: "Company",
    items: [
      { label: "About RYCODE", href: "/about" },
      { label: "Why RYCODE", href: "/why-rycode" },
      { label: "Process", href: "/process" },
      { label: "Technologies", href: "/technologies" },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Services", href: "/services" },
      { label: "Solutions", href: "/solutions" },
      { label: "Problems", href: "/problems" },
      { label: "Industries", href: "/industries" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Projects", href: "/projects" },
      { label: "Journal", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Start",
    items: [
      { label: "Start a project", href: "/start-project" },
      { label: "Technical review", href: "/technical-review" },
      { label: "SEO audit", href: "/seo-audit" },
      { label: "Client login", href: "/login" },
    ],
  },
] as const;

export function SiteFooter({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";
  const groups = isFa ? footerNav : englishFooter;

  return (
    <footer className="relative overflow-hidden bg-[#052f3c] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 88% 4%, rgba(95,225,213,0.16), transparent 28%), radial-gradient(circle at 4% 82%, rgba(125,200,255,0.1), transparent 26%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black, transparent 72%)",
        }}
        aria-hidden
      />

      <Container className="relative z-10 pt-12 pb-7 sm:pt-16">
        <div className="border-b border-white/12 pb-10 sm:pb-12">
          <div dir="ltr" className="flex items-end justify-between gap-6">
            <span className="text-[clamp(3.1rem,9vw,7.8rem)] leading-[0.8] font-extrabold tracking-[-0.055em]">
              <span className="text-white">RY</span>
              <span className="text-[#5fe1d5]">CODE</span>
            </span>
            <span className="hidden pb-1 text-[0.65rem] font-semibold tracking-[0.18em] text-white/36 uppercase sm:block">
              rycode.ir
            </span>
          </div>
        </div>

        <div className="grid gap-12 py-12 lg:grid-cols-[0.85fr_1.35fr] lg:gap-20 lg:py-14">
          <div className="lg:max-w-sm">
            <h2 className="max-w-[13ch] text-2xl font-bold leading-[1.5] tracking-[-0.025em] sm:text-[2rem]">
              {isFa
                ? "یک مسئله واقعی، یک راه‌حل دقیق."
                : "A real problem deserves a clear solution."}
            </h2>
            <p className="mt-4 text-sm leading-8 text-white/58">
              {isFa
                ? "از ساخت محصول جدید تا نجات یک پروژه نیمه‌کاره؛ مسئله را می‌فهمیم و مسیر اجرایی روشن برایش می‌سازیم."
                : "From building a new product to rescuing a stalled one, we turn the problem into a clear path forward."}
            </p>
            <Link
              href="/start-project"
              className="group mt-7 inline-flex h-11 items-center gap-3 rounded-full bg-[#5fe1d5] px-5 text-sm font-bold text-[#052f3c] transition-colors hover:bg-[#7aebe1]"
            >
              {isFa ? "شروع یک گفت‌وگو" : "Start a conversation"}
              <ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          <nav
            aria-label={isFa ? "پیوندهای پایین سایت" : "Footer navigation"}
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4"
          >
            {groups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-bold text-[#5fe1d5]">{group.title}</h3>
                <ul className="mt-5 space-y-3.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 text-sm text-white/54 transition-colors hover:text-white"
                      >
                        <span className="size-1 rounded-full bg-[#5fe1d5]/0 transition-colors group-hover:bg-[#5fe1d5]" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 text-xs text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} RYCODE —{" "}
            {isFa ? "تمام حقوق محفوظ است." : "All rights reserved."}
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5fe1d5]" />
            {isFa ? "ساخته‌شده در ایران" : "Built in Iran"}
          </p>
        </div>
      </Container>
    </footer>
  );
}
