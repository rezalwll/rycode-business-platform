import { ArrowUpLeft } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";

import { Link } from "@/i18n/navigation";
import { Container } from "./primitives";
import { LogoWordmark } from "./wordmark";
import { LogoMark } from "./logo";
import { FooterFluid } from "./footer-fluid";
import "./footer-fluid.css";
import { getFooterNav } from "@/lib/nav-content";
import type { Locale } from "@/i18n/routing";

export function SiteFooter({ locale }: { locale: Locale }) {
  const isFa = locale === "fa";
  const groups = getFooterNav(locale);
  return (
    <BrandText><footer id="site-footer" className="coorda-legacy-footer">
      <FooterFluid />
      <Container className="coorda-footer-content">
        <div className="coorda-footer-brand" dir="ltr">
          <span className="coorda-footer-wordmark">
            <LogoWordmark />
          </span>
          <span className="coorda-footer-identity">
            <LogoMark className="coorda-footer-mark" variant="default" alt="" />
            <small>rycode.ir</small>
          </span>
        </div>
        <div className="coorda-footer-body" dir={isFa ? "rtl" : "ltr"}>
          <div className="coorda-footer-intro">
            <div className="coorda-footer-intro-copy">
            <h2>
              {isFa
                ? "بگو کجای کار هستی"
                : "Tell us where you are today"}
            </h2>
            <p>
              {isFa
                ? "یک ایدهٔ تازه داری، پروژه‌ات متوقف شده یا سایتت نیاز به بهبود دارد؟ از همین‌جا دربارهٔ قدم بعدی حرف بزنیم"
                : "A new idea, an unfinished project or a site that needs improvement? Let’s talk about the next step."}
            </p>
            </div>
            <Link href="/start-project" className="coorda-button coorda-footer-cta" locale={locale}>
              {isFa ? "شروع یک گفت‌وگو" : "Start a conversation"}
              <ArrowUpLeft className="size-4 rtl:rotate-0 ltr:rotate-90" aria-hidden />
            </Link>
          </div>
          <nav aria-label={isFa ? "پیوندهای پایین سایت" : "Footer navigation"}>
            {groups.map((group) => (
              <div className="coorda-footer-nav-group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link href={item.href} locale={locale}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="coorda-footer-bottom" dir={isFa ? "rtl" : "ltr"}>
          <p>
            © {new Date().getFullYear()} RYCODE —{" "}
            {isFa ? "تمام حقوق محفوظ است" : "All rights reserved"}
          </p>
          <p>{isFa ? "ساخته‌شده در ایران" : "Built in Iran"}</p>
        </div>
      </Container>
    </footer></BrandText>
  );
}
