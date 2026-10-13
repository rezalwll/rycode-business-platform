import {
  Activity,
  ArrowUpRight,
  Boxes,
  Check,
  Code2,
  Database,
  Headphones,
  Layers3,
  LockKeyhole,
  PackageCheck,
  Search,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  UsersRound,
  Webhook,
} from "lucide-react";
import type { Locale } from "@/i18n/routing";

export type ProductSceneKind =
  "web" | "commerce" | "software" | "integration" | "growth" | "support" | "mobile" | "data";

export function serviceSceneKind(slug: string): ProductSceneKind {
  if (slug.includes("ecommerce")) return "commerce";
  if (slug.includes("mobile")) return "mobile";
  if (slug.includes("data-analytics")) return "data";
  if (slug.includes("web-development")) return "web";
  if (slug.includes("integration")) return "integration";
  if (slug.includes("seo")) return "growth";
  if (slug.includes("support") || slug.includes("rescue")) return "support";
  return "software";
}

/** Code-native illustrative interfaces, not real customer data or live controls. */
export function ProductScene({
  kind,
  locale,
  hero = false,
}: {
  kind: ProductSceneKind;
  locale: Locale;
  hero?: boolean;
}) {
  const fa = locale === "fa";
  const t = (p: string, e: string) => (fa ? p : e);
  const isChart = kind === "software" || kind === "growth" || kind === "data";
  return (
    <div
      className={`product-scene scene-${kind} ${hero ? "scene-hero" : ""}`}
      aria-hidden="true"
      dir={fa ? "rtl" : "ltr"}
    >
      <div className="scene-backdrop" />
      {kind === "integration" ? (
        <div className="scene-network">
          <svg viewBox="0 0 400 230" preserveAspectRatio="none" className="scene-network-lines">
            <path
              d="M200 115 C200 35 65 35 65 35 M200 115 C200 35 335 35 335 35 M200 115 C200 195 65 195 65 195 M200 115 C200 195 335 195 335 195"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="5 6"
            />
          </svg>
          <div className="scene-node scene-node-center">
            <Webhook />
            <strong>API</strong>
          </div>
          {[
            ["CRM", UsersRound],
            [t("فروشگاه", "Store"), ShoppingBag],
            [t("انبار", "Inventory"), Boxes],
            [t("داده", "Data"), Database],
          ].map(([label, Icon], i) => {
            const NodeIcon = Icon as typeof Database;
            return (
              <div key={i} className={`scene-node scene-node-${i}`}>
                <NodeIcon />
                <span>{label as string}</span>
              </div>
            );
          })}
          <span className="scene-network-status">
            <Check />
            {t("اطلاعات یکپارچه، کار کمتر", "Connected data, less busywork")}
          </span>
        </div>
      ) : kind === "mobile" ? (
        <div className="scene-app-preview">
          <div className="scene-app-card">
            <Check />
            <span>{t("اطلاع‌رسانی به‌موقع", "Timely notifications")}</span>
          </div>
          <div className="scene-phone scene-app-phone">
            <div className="scene-phone-notch" />
            <div className="scene-phone-head">
              <Smartphone />
              {t("اپلیکیشن شما", "Your app")}
            </div>
            <div className="scene-app-welcome">
              {t("سلام، خوش آمدی", "Welcome back")}
              <span>{t("همه‌چیز همین‌جاست", "Everything in one place")}</span>
            </div>
            <div className="scene-app-options">
              {[PackageCheck, UsersRound, Activity, Headphones].map((Icon, i) => (
                <span key={i}>
                  <Icon />
                  <i className="scene-ui-line" />
                </span>
              ))}
            </div>
            <div className="scene-phone-button">
              {t("رزرو نوبت", "Book an appointment")}
              <ArrowUpRight />
            </div>
            <span className="scene-phone-note">Android · iOS</span>
          </div>
          <div className="scene-app-card scene-app-card-bottom">
            <LockKeyhole />
            <span>{t("دسترسی ساده و امن", "Simple, secure access")}</span>
          </div>
        </div>
      ) : (
        <div className="scene-browser">
          <div className="scene-browser-bar">
            <span className="scene-browser-dots">
              <i />
              <i />
              <i />
            </span>
            <span>
              <LockKeyhole />
              rycode / {kind === "web" ? "website" : kind === "commerce" ? "store" : "workspace"}
            </span>
            <Layers3 />
          </div>
          <div className="scene-browser-content">
            {kind === "web" ? (
              <div className="scene-web-preview">
                <div className="scene-web-nav">
                  <span>ATELIER</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="scene-web-main">
                  <span className="scene-web-kicker">MADE FOR WHAT’S NEXT</span>
                  <strong>{t("یک تجربهٔ بهتر", "A better experience")}</strong>
                  <span className="scene-ui-line" />
                  <span className="scene-ui-line short" />
                  <span className="scene-web-pill">
                    {t("شروع مسیر", "Explore more")}
                    <ArrowUpRight />
                  </span>
                </div>
                <div className="scene-web-art">
                  <div />
                  <div />
                  <div />
                </div>
                <div className="scene-web-tiles">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            ) : kind === "commerce" ? (
              <div className="scene-store">
                <span className="scene-store-label">
                  <ShoppingBag />
                  {t("فروشگاه شما", "Your store")}
                </span>
                <div className="scene-store-product">
                  <div className="scene-store-object">
                    <PackageCheck />
                  </div>
                  <span>{t("محصول انتخاب‌شده", "Your next favourite")}</span>
                  <div className="scene-ui-line" />
                  <span className="scene-store-pill">
                    <ShoppingCart />
                    {t("افزودن به سبد", "Add to bag")}
                  </span>
                </div>
              </div>
            ) : kind === "support" ? (
              <div className="scene-support-preview">
                <div className="scene-support-title">
                  <Headphones />
                  <span>{t("مرکز پشتیبانی", "Support workspace")}</span>
                  <span className="scene-status-dot" />
                </div>
                <div className="scene-support-message">
                  <span>{t("درخواست جدید", "New request")}</span>
                  <strong>
                    {t("قدم بعدی محصول را با هم بسازیم", "Let’s build your product’s next chapter")}
                  </strong>
                  <div className="scene-ui-line" />
                </div>
                <div className="scene-support-checks">
                  {[
                    t("بررسی وضعیت", "Review"),
                    t("اولویت‌بندی", "Prioritise"),
                    t("رفع مشکل", "Resolve"),
                  ].map((label) => (
                    <span key={label}>
                      <Check />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="scene-sidebar">
                  <span className="scene-sidebar-logo">
                    R<span>Y</span>
                  </span>
                  {[Layers3, ShoppingBag, UsersRound, Activity].map((Icon, i) => (
                    <span className={i === 0 ? "selected" : ""} key={i}>
                      <Icon />
                      <i />
                    </span>
                  ))}
                </div>
                <div className="scene-dashboard">
                  <div className="scene-dashboard-heading">
                    <span>
                      {kind === "growth"
                        ? t("مسیر رشد", "Growth overview")
                        : kind === "data"
                          ? t("گزارش‌ها و تصمیم‌ها", "Reports & decisions")
                          : t("نمای کلی کسب‌وکار", "Business overview")}
                    </span>
                    <span>{t("نمای مفهومی", "Concept")}</span>
                  </div>
                  <div className="scene-metric-row">
                    {[
                      t("سفارش‌ها", "Orders"),
                      t("مشتریان", "Customers"),
                      t("گزارش‌ها", "Reports"),
                    ].map((label, i) => (
                      <div key={label}>
                        <span>{label}</span>
                        <div className="scene-metric-symbol">
                          {[ShoppingBag, UsersRound, Activity].map((Icon, j) =>
                            j === i ? <Icon key={j} /> : null,
                          )}
                          <span className="scene-ui-line" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="scene-chart">
                    <span>{t("دید روشن‌تر به داده‌ها", "A clearer view of your data")}</span>
                    <div className="scene-chart-grid" />
                    <svg viewBox="0 0 360 120" preserveAspectRatio="none">
                      <path
                        d="M0 104 C25 104 20 80 50 86 S85 88 110 65 S145 100 173 52 S205 60 235 36 S265 62 290 20 S330 24 360 8 L360 120 L0 120Z"
                        fill="currentColor"
                        opacity=".1"
                      />
                      <path
                        d="M0 104 C25 104 20 80 50 86 S85 88 110 65 S145 100 173 52 S205 60 235 36 S265 62 290 20 S330 24 360 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <div className="scene-table">
                    <div className="scene-ui-line" />
                    <div className="scene-ui-line" />
                    <div className="scene-ui-line" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {hero && (
        <>
          <div className="scene-phone">
            <div className="scene-phone-notch" />
            <div className="scene-phone-head">
              <ShoppingBag />
              {t("فروشگاه شما", "Your store")}
            </div>
            <div className="scene-phone-product">
              <div className="scene-headphones">
                <Headphones />
              </div>
            </div>
            <strong>{t("تجربهٔ خرید ساده‌تر", "Simply better shopping")}</strong>
            <div className="scene-ui-line" />
            <div className="scene-phone-button">
              {t("ثبت سفارش", "Place order")}
              <Check />
            </div>
            <span className="scene-phone-note">
              <LockKeyhole />
              {t("طراحی مفهومی", "Concept preview")}
            </span>
          </div>
          <div className="scene-floating-code">
            <Code2 />
            <span dir="ltr">built for your business</span>
            <Check />
          </div>
        </>
      )}
      {!hero && isChart && (
        <div className="scene-mini-card">
          <Search />
          <span>{t("از داده تا تصمیم", "From data to decisions")}</span>
          <ArrowUpRight />
        </div>
      )}
      {!hero && kind === "web" && (
        <div className="scene-mini-card">
          <Smartphone />
          <span>{t("در هر صفحه، درست", "Built for every screen")}</span>
          <Check />
        </div>
      )}
      <span className="scene-caption">{t("نمایش مفهومی", "Concept preview")}</span>
    </div>
  );
}
