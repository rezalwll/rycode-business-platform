"use client";
import { BrandText } from "@/components/site/brand-text";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useReferenceLocale } from "./reference-locale";
import { serviceHighlights } from "@/content/service-model";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  LockKeyhole,
  MapPin,
  Mic,
  MoreHorizontal,
  Plus,
  Sparkles,
} from "lucide-react";

const titles = serviceHighlights.map(service => service.title.en);
const persianTitles = serviceHighlights.map(service => service.title.fa);

function Photo({
  name,
  className = "",
  alt = "",
}: {
  name: string;
  className?: string;
  alt?: string;
}) {
  // Native images preserve the exact crops used by these small interface previews.
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <BrandText><img
      className={className}
      src={`/coorda-template/${name}`}
      alt={alt}
      loading="lazy"
      draggable={false}
    /></BrandText>
  );
}

function Tags({ labels }: { labels: string[] }) {
  return (
    <BrandText><div className="preview-tags">
      {labels.map((label) => (
        <span key={label}>{label}</span>
      ))}
    </div></BrandText>
  );
}

function PeoplePreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="people-preview">
      {["person-nature.png", "person-lake.png"].map((image, index) => (
        <div className={`person-card person-card-${index}`} key={image}>
          <Photo name={image} className="person-photo" />
          <div className="person-info">
            <strong>{text("نمایی از محصول شما", "Your product preview")}</strong>
            <p>
              <MapPin size={10} /> {text("طراحی نمایشی · وب و موبایل", "Concept UI · web & mobile")}
            </p>
            <Tags labels={["UI", "UX", "Web"]} />
          </div>
        </div>
      ))}
    </div></BrandText>
  );
}

function EventPreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="event-preview preview-shell">
      <Photo name="event-hill.png" className="event-photo" />
      <div className="event-info">
        <p className="preview-small">{text("نمونهٔ رابط فروشگاه", "Store concept preview")}</p>
        <strong>{text("یک خرید ساده‌تر", "A smoother shopping experience")}</strong>
        <p className="event-description">
          {text(
            "از دیدن محصول تا ثبت سفارش؛ مسیری روشن برای مشتری و مدیریت ساده‌تر برای تیم",
            "From finding a product to placing an order, a clear journey for customers and easier operations for your team.",
          )}
        </p>
        <div className="event-attendees">
          <div className="avatar-stack">
            {[1, 2, 3].map((n) => (
              <Photo name={`avatar-${n}.png`} key={n} />
            ))}
            <span>+3</span>
          </div>
          <span>{text("طراحی مفهومی", "Concept UI")}</span>
        </div>
        <Tags labels={["Shop", "Orders", "UX"]} />
      </div>
    </div></BrandText>
  );
}

const activities = [
  { day: "20", image: "activity-sofia.png", text: "New order received" },
  { day: "18", image: "activity-beach.png", text: "Inventory update", upcoming: true },
  { day: "14", image: "activity-jake.png", text: "Report ready", locked: true },
  { day: "12", image: "activity-mia.jpg", text: "New service request" },
  { day: "10", image: "activity-alex.png", text: "Data connected" },
];

function ActivityPreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="activity-preview preview-shell">
      {activities.map((activity) => (
        <div className="activity-row" key={activity.day}>
          <div className="activity-date">
            {text("نمونه", "Demo")}
            <br />
            {activity.day}
          </div>
          <Photo name={activity.image} />
          <div className="activity-label">
            <strong>
              {text(
                [
                  "سفارش جدید",
                  "به‌روزرسانی موجودی",
                  "گزارش آماده",
                  "درخواست تازه",
                  "اطلاعات یکپارچه",
                ][activities.indexOf(activity)]!,
                activity.text,
              )}
            </strong>
            {activity.upcoming && <span>{text("در جریان", "In progress")}</span>}
          </div>
          {activity.locked || activity.upcoming ? (
            <span className="activity-lock">
              <LockKeyhole size={11} />
            </span>
          ) : (
            <ChevronRight size={13} />
          )}
        </div>
      ))}
      <div className="activity-footer">
        {text("بیشتر ببین", "View all")} <ArrowRight size={11} />
      </div>
    </div></BrandText>
  );
}

function ChatPreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="chat-preview preview-shell">
      <div className="chat-screen">
        <div className="chat-header">
          <ArrowLeft size={14} />
          <div className="chat-group-photo">
            <Photo name="activity-alex.png" />
            <Photo name="activity-beach.png" />
          </div>
          <div>
            <strong>{text("هماهنگی سیستم‌ها", "Connected systems")}</strong>
            <p>{text("نمونهٔ گردش کار", "Workflow preview")}</p>
          </div>
          <MoreHorizontal size={16} />
        </div>
        <div className="chat-messages">
          <div className="chat-incoming">
            <Photo name="activity-mia.jpg" />
            <div>
              <p>{text("اطلاعات سفارش به انبار رسیده؟", "Has the order reached inventory?")}</p>
              <p>{text("بله؛ وضعیت هم به‌روزرسانی شد", "Yes, the status has been updated.")}</p>
            </div>
          </div>
          <div className="chat-outgoing">
            <span>{text("نمونهٔ ارتباط خودکار", "Example automated message")}</span>
            <p>{text("همه‌چیز در یک مسیر مشخص", "Everything in one clear workflow")}</p>
          </div>
        </div>
        <div className="chat-compose">
          <span>
            <Plus size={16} />
          </span>
          <div>
            {text("پیام...", "Message...")} <Mic size={12} />
          </div>
        </div>
      </div>
    </div></BrandText>
  );
}

function AiPreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="ai-preview">
      <div className="ai-prompt">
        <p>{text("از جست‌وجو چطور مشتری بگیریم؟", "How can search bring the right customers?")}</p>
        <Photo name="ai-mountain.png" />
      </div>
      <div className="ai-planner">
        <p>
          {text("از جست‌وجو", "From search")}
          <br />
          {text("تا مشتری درست", "to the right audience")}
        </p>
        <span>
          <Sparkles size={17} />
        </span>
      </div>
      <div className="ai-members">
        <Photo name="person-lake.png" />
        <strong>SEO</strong>
        <p>
          {text("سئو و محتوا", "SEO & content")}
          <br />
          {text("در یک مسیر", "working together")}
        </p>
      </div>
    </div></BrandText>
  );
}

function DevicesPreview() {
  const { text, href } = useReferenceLocale();
  return (
    <BrandText><div className="devices-preview">
      <div className="device-illustration" aria-hidden="true">
        <div className="desktop-device">
          <div className="desktop-toolbar">
            <i />
            <i />
            <i />
          </div>
          <div className="desktop-skeleton">
            <span />
            <div>
              <i />
              <i />
            </div>
          </div>
        </div>
        <div className="phone-device">
          <div className="phone-notch" />
          <div className="phone-skeleton" />
        </div>
      </div>
      <span className="device-download">
        {text("ادامهٔ مسیر", "Keep moving")}
      </span>
    </div></BrandText>
  );
}

const previews = {
  web: EventPreview,
  seo: AiPreview,
  software: ActivityPreview,
  rescue: RescuePreview,
  automation: ChatPreview,
  data: DataPreview,
  support: DevicesPreview,
};

function DataPreview() {
  const { text } = useReferenceLocale();
  return <div className="data-tool-preview preview-shell">
    <p className="preview-small">{text("نمای مفهومی ابزار کاری", "Business tool concept")}</p>
    <strong>{text("فایل‌ها مرتب، گزارش‌ها یک‌جا", "Files organized, reports together")}</strong>
    <div className="data-tool-grid" dir="ltr">
      <span /><span>A</span><span>B</span><span>C</span>
      {[1, 2, 3, 4, 5].map(row => <div className="data-tool-row" key={row}><span>{row}</span><i /><i /><i /></div>)}
    </div>
    <Tags labels={["Excel", "Data", "Reports"]} />
  </div>;
}

function RescuePreview() {
  const { text } = useReferenceLocale();
  return <div className="rescue-tool-preview preview-shell">
    <img src="/images/editorial/web-experience.png" alt="" loading="lazy" draggable={false} />
    <p className="preview-small">{text("نمای مفهومی بازبینی پروژه", "Project review concept")}</p>
    {[text("بررسی وضعیت فعلی", "Review the current state"), text("حفظ بخش‌های سالم", "Keep what works"), text("رفع مشکل و ادامهٔ توسعه", "Fix issues and continue")].map((label, index) => <div key={label}><span>{index + 1}</span><strong>{label}</strong></div>)}
  </div>;
}
function FeatureCard({ index }: { index: number }) {
  const { locale, href, text } = useReferenceLocale();
  const service = serviceHighlights[index]!;
  const Preview = previews[service.preview];
  return (
    <BrandText><article className={`feature-card feature-card-${index + 1}`}>
      <div className="feature-card-heading">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <h3><a href={href(`/services/${service.slug}`)}>{service.title[locale]}</a></h3>
      </div>
      <p className="feature-card-summary">{service.summary[locale]}</p>
      <div className="feature-card-preview" aria-hidden="true"><Preview /></div>
      <span className="feature-card-tag" dir="ltr">{service.tag}</span>
      <div className="feature-card-actions">
        <a href={href(`/services/${service.slug}`)}>{text("جزئیات خدمت", "Explore service")} <ArrowUpRightIcon /></a>
        {service.related.map(related => <a className="feature-related-link" key={related.slug} href={href(`/services/${related.slug}`)}>{related.label[locale]}</a>)}
      </div>
    </article></BrandText>
  );
}

function ArrowUpRightIcon() {
  const { fa } = useReferenceLocale();
  return fa ? <ArrowLeft size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />;
}

export default function ReferenceFeatures() {
  const { text, href, fa } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);
  const move = (direction: number) => {
    setPaused(true);
    setIndex((current) => (current + direction + titles.length) % titles.length);
  };
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reduceMotion || paused || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % titles.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, visible]);
  return (
    <BrandText><section id="expertise" ref={sectionRef} className="features" aria-labelledby="features-title">
      <div className="features-container">
        <motion.div className="features-heading" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}>
          <h2 id="features-title">
            <span className="features-title-desktop">
              {text("برای کسب‌وکارت", "For your business")}<br />
              <mark>{text("سایت و نرم‌افزار", "websites & software")}</mark><br />
              {text("می‌سازیم، بهترش می‌کنیم", "built to keep moving forward")}
            </span>
            <span className="features-title-mobile">
              {text("برای کسب‌وکارت", "For your business")}<br />
              <mark>{text("سایت و نرم‌افزار", "websites & software")}</mark><br />
              {text("می‌سازیم، بهترش می‌کنیم", "built to keep moving forward")}
            </span>
          </h2>
          <a href={href("/services")} className="features-about-link">{text("همهٔ خدمات رایکد", "All RYCODE services")}</a>
        </motion.div>
        <div id="features-cards" className="features-gallery">
          <div className="features-desktop" aria-label={text("خدمات رایکد", "RYCODE services")}>
            <div className="features-ticker" style={{ animationPlayState: visible ? undefined : "paused" }}>
              {[0, 1].map(copy => <div className="features-ticker-group" key={copy} aria-hidden={copy === 1 ? true : undefined} inert={copy === 1 ? true : undefined}>
                {titles.map((title, cardIndex) => <FeatureCard index={cardIndex} key={title} />)}
              </div>)}
            </div>
          </div>
          <div className="features-slider" role="region" aria-roledescription="carousel" aria-label={text("خدمات رایکد", "RYCODE services")}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={event => { if (!event.currentTarget.contains(document.activeElement)) setPaused(false); }}
            onFocusCapture={() => setPaused(true)}
            onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}
            onKeyDown={event => {
              if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
            }}
            onTouchStart={event => { touchStart.current = event.touches[0]!.clientX; }}
            onTouchEnd={event => {
              if (touchStart.current === null) return;
              const delta = touchStart.current - event.changedTouches[0]!.clientX;
              if (Math.abs(delta) > 40) move(delta > 0 ? 1 : -1);
              touchStart.current = null;
            }}>
            <div className="features-slider-track" style={{ transform: `translateX(calc(-${index * 100}% - ${index * 16}px))` }}>
              {titles.map((title, cardIndex) => <div className="feature-slide" key={title} role="group" aria-roledescription="slide" aria-label={`${cardIndex + 1} / ${titles.length}: ${fa ? persianTitles[cardIndex] : title}`} aria-hidden={cardIndex !== index} inert={cardIndex !== index ? true : undefined}>
                <FeatureCard index={cardIndex} />
              </div>)}
            </div>
            <button type="button" className="features-arrow features-arrow-prev" aria-label={text("خدمت قبلی", "Previous service")} onClick={() => move(-1)}><ChevronLeft size={24} /></button>
            <button type="button" className="features-arrow features-arrow-next" aria-label={text("خدمت بعدی", "Next service")} onClick={() => move(1)}><ChevronRight size={24} /></button>
          </div>
        </div>
      </div>
    </section></BrandText>
  );
}
