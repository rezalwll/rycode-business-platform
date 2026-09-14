import { Link } from "@/i18n/navigation";
import { Container, MetaLabel } from "./primitives";
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
    <footer className="border-t border-white/12 bg-ink text-ink-foreground">
      <Container className="pt-14 pb-10">
        <div
          dir="ltr"
          className="flex items-end justify-between gap-6 border-b border-white/12 pb-10"
        >
          <span className="text-[clamp(3rem,10vw,8rem)] leading-[0.85] font-extrabold tracking-[-0.04em]">
            <span className="text-ink-foreground">RY</span>
            <span className="text-brand">CODE</span>
          </span>
          <MetaLabel className="hidden text-white/45 sm:inline-flex">rycode.ir</MetaLabel>
        </div>

        <div className="grid gap-12 py-14 lg:grid-cols-[1fr_2.2fr]">
          <p className="max-w-sm text-sm leading-8 text-ink-foreground/65">
            {isFa
              ? "رای‌کد شریک فنی کسب‌وکارها برای ساخت، توسعه و رشد محصولات دیجیتال است؛ از طراحی سایت و فروشگاه اینترنتی تا نرم‌افزار اختصاصی، یکپارچه‌سازی و سئو."
              : "RYCODE is a technical partner for building, improving and growing dependable digital products."}
          </p>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {groups.map((group) => (
              <div key={group.title}>
                <MetaLabel className="text-brand">{group.title}</MetaLabel>
                <ul className="mt-5 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-foreground/65 transition-colors hover:text-ink-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} RYCODE —{" "}
            {isFa ? "تمام حقوق محفوظ است." : "All rights reserved."}
          </p>
          <p>{isFa ? "ساخته‌شده در ایران" : "Built in Iran"}</p>
        </div>
      </Container>
    </footer>
  );
}
