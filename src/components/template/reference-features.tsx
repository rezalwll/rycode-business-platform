"use client";

import Image from "next/image";
import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { BrandText } from "@/components/site/brand-text";
import { serviceCards } from "@/content/service-cards";
import { useReferenceLocale } from "./reference-locale";
import { advanceFeatureMarquee, FEATURE_SPEED } from "./feature-marquee-motion";

const FeatureCard = memo(function FeatureCard({ index, duplicate = false }: { index: number; duplicate?: boolean }) {
  const { locale, href, text, fa } = useReferenceLocale();
  const service = serviceCards[index]!;
  return <article className="feature-card capability-card" dir={fa ? "rtl" : "ltr"}
    data-card-id={service.id} data-category={service.categoryId}
    style={{ "--feature-accent": service.accent } as CSSProperties}>
    <div className="feature-card-heading">
      <div className="capability-card-label"><span>{String(index + 1).padStart(2, "0")}</span><span>{service.categoryTitle[locale]}</span></div>
      <h3><a tabIndex={duplicate ? -1 : undefined} href={href(`/services/${service.slug}`)}>{service.title[locale]}</a></h3>
    </div>
    <p className="feature-card-summary">{service.summary[locale]}</p>
    <div className="capability-card-image" aria-hidden="true">
      <Image src={service.image} alt="" width={640} height={360} sizes="(max-width: 809px) 80vw, 280px" loading="lazy" draggable={false} />
    </div>
    <span className="feature-card-tag" dir="ltr">{service.tag}</span>
    <div className="feature-card-actions">
      <a className="capability-card-link" tabIndex={duplicate ? -1 : undefined} href={href(`/services/${service.slug}`)}
        aria-label={`${text("بیشتر دربارهٔ", "More about")} ${service.categoryTitle[locale]}`}>
        <span className="capability-card-link-copy"><span>{text("بیشتر دربارهٔ", "More about")}</span><strong>{service.linkTitle[locale]}</strong></span>
        <span className="capability-card-link-arrow" aria-hidden="true">{fa ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}</span>
      </a>
    </div>
  </article>;
});

/** Two equal sequences, including their trailing gap, wrap at an exact pixel boundary. */
export function FeatureTicker({ visible, reducedMotion }: { visible: boolean; reducedMotion: boolean }) {
  const { text } = useReferenceLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const hovered = useRef(false);
  const motionState = useRef({ offset: 0, speed: FEATURE_SPEED });
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;
    const desktop = window.matchMedia("(min-width: 810px)");
    let frame: number | null = null;
    let previousTime: number | null = null;
    let period = group.getBoundingClientRect().width;
    const paint = () => { track.style.transform = `translate3d(-${motionState.current.offset}px, 0, 0)`; };
    const stop = () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
    };
    const tick = (now: number) => {
      const elapsed = previousTime === null ? 0 : now - previousTime;
      previousTime = now;
      motionState.current = advanceFeatureMarquee(motionState.current, elapsed, period, hovered.current);
      paint();
      frame = window.requestAnimationFrame(tick);
    };
    const sync = () => {
      stop();
      period = group.getBoundingClientRect().width;
      if (reducedMotion || !desktop.matches) {
        motionState.current.offset = 0;
        track.style.transform = "none";
      }
      // Focus pauses for keyboard reading; pointer hover only lowers velocity.
      if (visible && !reducedMotion && !focused && desktop.matches && !document.hidden && period > 0) {
        motionState.current.offset %= period;
        paint();
        frame = window.requestAnimationFrame(tick);
      }
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
    observer?.observe(group);
    window.addEventListener("resize", sync);
    desktop.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      stop();
      observer?.disconnect();
      window.removeEventListener("resize", sync);
      desktop.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [visible, reducedMotion, focused]);

  return <div ref={viewportRef} className="features-desktop" dir="ltr" aria-label={text("خدمات رایکد", "RYCODE services")}
    onMouseEnter={() => { hovered.current = true; }}
    onMouseLeave={() => { hovered.current = false; }}
    onFocusCapture={event => {
      setFocused(true);
      const card = (event.target as HTMLElement).closest<HTMLElement>(".capability-card");
      if (!reducedMotion && card && groupRef.current?.contains(card) && trackRef.current) {
        const left = card.getBoundingClientRect().left;
        const groupLeft = groupRef.current.getBoundingClientRect().left;
        motionState.current.offset = Math.max(0, left - groupLeft - 24);
        trackRef.current.style.transform = `translate3d(-${motionState.current.offset}px, 0, 0)`;
        event.currentTarget.scrollLeft = 0;
      }
    }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
    <div ref={trackRef} className="features-ticker">
      {[0, 1].map(copy => <div ref={copy === 0 ? groupRef : undefined} className="features-ticker-group" key={copy}
        aria-hidden={copy === 1 ? true : undefined}
        // Copies remain clickable, but never add duplicate keyboard stops.
        onMouseDown={copy === 1 ? event => event.preventDefault() : undefined}>
        {serviceCards.map((card, index) => <FeatureCard key={card.id} index={index} duplicate={copy === 1} />)}
      </div>)}
    </div>
  </div>;
}

export default function ReferenceFeatures() {
  const { text, href, locale } = useReferenceLocale();
  const reduceMotion = Boolean(useReducedMotion());
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<number | null>(null);
  const move = (direction: number) => {
    setPaused(true);
    setIndex(current => (current + direction + serviceCards.length) % serviceCards.length);
  };
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 809px)");
    let timer: number | null = null;
    const stop = () => { if (timer !== null) window.clearInterval(timer); timer = null; };
    const sync = () => {
      stop();
      if (reduceMotion || paused || !visible || !mobile.matches) return;
      timer = window.setInterval(() => {
        if (!document.hidden) setIndex(current => (current + 1) % serviceCards.length);
      }, hovered ? 20000 : 5000);
    };
    mobile.addEventListener("change", sync);
    sync();
    return () => { stop(); mobile.removeEventListener("change", sync); };
  }, [reduceMotion, paused, visible, hovered]);
  return <BrandText><section id="expertise" ref={sectionRef} className="features features-expanded" aria-labelledby="features-title">
    <div className="features-container">
      <motion.div className="features-heading" initial={reduceMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65 }}>
        <h2 id="features-title">
          <span className="features-title-desktop">{text("برای کسب‌وکارت", "For your business")}<br /><mark>{text("سایت و نرم‌افزار", "websites & software")}</mark><br />{text("می‌سازیم، بهترش می‌کنیم", "built to keep moving forward")}</span>
          <span className="features-title-mobile">{text("برای کسب‌وکارت", "For your business")}<br /><mark>{text("سایت و نرم‌افزار", "websites & software")}</mark><br />{text("می‌سازیم، بهترش می‌کنیم", "built to keep moving forward")}</span>
        </h2>
        <a href={href("/services")} className="features-about-link">{text("همهٔ خدمات رایکد", "All RYCODE services")}</a>
      </motion.div>
      <div id="features-cards" className="features-gallery">
        <FeatureTicker visible={visible} reducedMotion={reduceMotion} />
        <div className="features-slider" dir="ltr" role="region" aria-roledescription="carousel" aria-label={text("خدمات رایکد", "RYCODE services")}
          onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
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
            {serviceCards.map((card, cardIndex) => <div className="feature-slide" key={card.id} role="group" aria-roledescription="slide" aria-label={`${cardIndex + 1} / ${serviceCards.length}: ${card.title[locale]}`} aria-hidden={cardIndex !== index} inert={cardIndex !== index ? true : undefined}>
              <FeatureCard index={cardIndex} />
            </div>)}
          </div>
          <button type="button" className="features-arrow features-arrow-prev" aria-label={text("خدمت قبلی", "Previous service")} onClick={() => move(-1)}><ChevronLeft size={24} /></button>
          <button type="button" className="features-arrow features-arrow-next" aria-label={text("خدمت بعدی", "Next service")} onClick={() => move(1)}><ChevronRight size={24} /></button>
        </div>
      </div>
    </div>
  </section></BrandText>;
}
