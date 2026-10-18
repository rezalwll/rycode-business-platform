"use client";
import { BrandText } from "@/components/site/brand-text";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useReferenceLocale } from "./reference-locale";

export default function ReferenceHero() {
  const { text, href } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !document.hidden) void video.play().catch(() => {});
      else video.pause();
    });
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else if (video.getBoundingClientRect().bottom > 0) void video.play().catch(() => {});
    };
    observer.observe(video);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [reduceMotion]);

  const appear = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" as const, delay: reduceMotion ? 0 : delay },
  });

  return (
    <BrandText><section id="top" aria-label={text("معرفی رایکد", "RYCODE introduction")} className="hero">
      <div className="hero-frame">
        <div className="hero-scene" aria-hidden="true">
          <video
            ref={videoRef}
            className="hero-video"
            src={reduceMotion ? undefined : "/videos/rycode-hero.mp4"}
            poster="/images/editorial/rycode-hero-poster.jpg"
            autoPlay={!reduceMotion}
            muted
            loop
            playsInline
            preload="metadata"
            tabIndex={-1}
          />
        </div>
        <div className="hero-content">
          <motion.h1
            {...appear(0.1)}
            className="hero-title rycode-hero-title"
            aria-label={text("ایده‌ها، از دل سکوت به واقعیت می‌رسند", "Ideas born in silence become reality")}
          >
            <span className="hero-title-desktop">
              <span className="hero-title-line">
                <span>{text("ایده‌ها، ", "Ideas ")}</span>
                <span className="hero-title-soft">{text("از دل سکوت", "born in silence")}</span>
              </span>
              <span className="hero-title-line">
                <span className="hero-title-soft">{text("به ", "become ")}</span>
                <span className="hero-title-accent">{text("واقعیت", "reality")}</span>
                <span>{text(" می‌رسند", "")}</span>
              </span>
            </span>
          </motion.h1>
          <motion.p {...appear(0.22)} className="hero-subtitle rycode-hero-subtitle">
            {text(
              "برای کسب‌وکارهایی که بزرگ فکر می‌کنند، فضای دیجیتال می‌سازیم؛ از سایت و فروشگاه تا نرم‌افزار اختصاصی با تمرکز، دقت و مهندسی.",
              "We build digital experiences for businesses that think big, from websites and stores to custom software with focus, care and engineering.",
            )}
          </motion.p>
          <motion.a {...appear(0.34)} href={href("/start-project")} className="hero-cta">
            <span className="hero-cta-label">
              {text("شروع یک گفت‌وگو", "Start a conversation")}
            </span>
            <span className="hero-cta-label hero-cta-label-copy" aria-hidden="true">
              {text("شروع یک گفت‌وگو", "Start a conversation")}
            </span>
          </motion.a>
        </div>
      </div>
    </section></BrandText>
  );
}
