"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/i18n/routing";

/** The original RYCODE film, with accessible pause and reduced-motion handling. */
export function HeroFilm({ locale }: { locale: Locale }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const update = () => {
      if (paused || media.matches || document.hidden || !visible) element.pause();
      else void element.play()?.catch(() => {});
    };
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(([entry]) => {
            visible = Boolean(entry?.isIntersecting);
            update();
          });
    observer?.observe(element);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer?.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      element.pause();
    };
  }, [paused]);
  return (
    <>
      <video
        ref={video}
        className="coorda-hero-film"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster="/images/editorial/rycode-hero-poster.jpg"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/videos/rycode-hero.mp4" type="video/mp4" />
      </video>
      <button
        type="button"
        className="coorda-film-control"
        aria-label={
          locale === "fa"
            ? paused
              ? "پخش ویدیوی پس‌زمینه"
              : "توقف ویدیوی پس‌زمینه"
            : paused
              ? "Play background video"
              : "Pause background video"
        }
        aria-pressed={paused}
        onClick={() => setPaused(!paused)}
      >
        {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
      </button>
    </>
  );
}
