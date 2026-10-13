"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
const stories = [
  { slug: "jake", name: "Web design concept", poster: "webp" },
  { slug: "sofia", name: "Store concept", poster: "webp" },
  { slug: "mia", name: "Software concept", poster: "jpg" },
  { slug: "luna", name: "Integration concept", poster: "webp" },
  { slug: "sara", name: "Mobile concept", poster: "webp" },
  { slug: "alex", name: "Growth concept", poster: "webp" },
];
const loop = [stories[5]!, ...stories, ...stories.slice(0, 3)];
function StoryCard({
  story,
  playing,
  toggle,
  duplicate,
}: {
  story: (typeof stories)[number];
  playing: boolean;
  toggle: () => void;
  duplicate: boolean;
}) {
  const { copyText } = useReferenceLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => setFailed(true));
    else video.pause();
  }, [playing]);
  useEffect(() => {
    const pauseHidden = () => {
      if (document.hidden) videoRef.current?.pause();
    };
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, []);
  return (
    <BrandText><article
      className={`story-card${playing ? " is-playing" : ""}`}
      aria-hidden={duplicate || undefined}
    >
      <video
        ref={videoRef}
        src={`/coorda-template/story-${story.slug}.mp4`}
        poster={`/coorda-template/story-${story.slug}.${story.poster}`}
        preload="none"
        loop
        muted
        playsInline
        aria-hidden="true"
      />
      <div className="story-shade" />
      <button
        className="story-play"
        onClick={() => {
          setFailed(false);
          toggle();
        }}
        aria-label={`${playing ? "Pause" : "Play"} ${story.name} story`}
        aria-pressed={playing}
        tabIndex={duplicate ? -1 : 0}
      >
        <span>
          {copyText(
            playing ? <Pause size={24} strokeWidth={1.5} /> : <Play size={24} strokeWidth={1.5} />,
          )}
        </span>
      </button>
      <p className="story-user">
        <img
          src={`/coorda-template/story-${story.slug}-avatar.png`}
          width={32}
          height={32}
          alt=""
          loading="lazy"
        />
        {copyText(story.name)}
      </p>
      {copyText(
        failed && (
          <p className="story-error" role="status">
            {copyText("Video unavailable. Try again.")}
          </p>
        ),
      )}
    </article></BrandText>
  );
}
export default function Stories() {
  const { copyText } = useReferenceLocale();
  const reduceMotion = useReducedMotion();
  const carouselRef = useRef<HTMLDivElement>(null);
  const visible = useInView(carouselRef, { amount: 0.1 });
  const [position, setPosition] = useState(1);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState<number | null>(null);
  const busy = useRef(false);
  const pointerX = useRef<number | null>(null);
  const swiped = useRef(false);
  const current = (((position - 1) % stories.length) + stories.length) % stories.length;
  function step(direction: number) {
    if (busy.current) return;
    setPlaying(null);
    if (reduceMotion) {
      setPosition((value) => ((value - 1 + direction + stories.length) % stories.length) + 1);
      return;
    }
    busy.current = true;
    setPosition((value) => value + direction);
  }
  useEffect(() => {
    if (reduceMotion || paused || playing !== null || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden && !busy.current) {
        busy.current = true;
        setPosition((value) => value + 1);
      }
    }, 6000);
    return () => window.clearInterval(timer);
  }, [reduceMotion, paused, playing, visible]);
  useEffect(() => {
    if (!visible) setPlaying(null);
  }, [visible]);
  useEffect(() => {
    if (!instant) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setInstant(false)));
    return () => cancelAnimationFrame(frame);
  }, [instant]);
  function finishTransition() {
    busy.current = false;
    if (position === 0 || position === stories.length + 1) {
      setInstant(true);
      setPosition(position === 0 ? stories.length : 1);
    }
  }
  return (
    <BrandText><section id="stories" className="stories-section" aria-labelledby="stories-title">
      <h2 id="stories-title" className="page-section-heading">
        {copyText("A glimpse of")}
        <br />
        <mark>{copyText("what comes next")}</mark>
      </h2>
      <div
        ref={carouselRef}
        className="stories-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Placeholder visuals, not customer work"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            step(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onPointerDown={(event) => {
          swiped.current = false;
          pointerX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (pointerX.current !== null && Math.abs(event.clientX - pointerX.current) > 50) {
            swiped.current = true;
            step(event.clientX < pointerX.current ? 1 : -1);
          }
          pointerX.current = null;
        }}
        onPointerCancel={() => {
          pointerX.current = null;
        }}
      >
        <div
          className={`stories-track${instant || reduceMotion ? " is-instant" : ""}`}
          style={{ transform: `translateX(calc(-${position} * (var(--story-width) + 16px)))` }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) finishTransition();
          }}
        >
          {copyText(
            loop.map((story, index) => (
              <StoryCard
                key={`${story.slug}-${index}`}
                story={story}
                playing={playing === index}
                duplicate={index === 0 || index > stories.length}
                toggle={() => {
                  if (swiped.current) {
                    swiped.current = false;
                    return;
                  }
                  setPlaying((value) => (value === index ? null : index));
                }}
              />
            )),
          )}
        </div>
        <button
          className="story-arrow story-arrow-prev"
          aria-label="Previous story"
          onClick={() => step(-1)}
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>
        <button
          className="story-arrow story-arrow-next"
          aria-label="Next story"
          onClick={() => step(1)}
        >
          <ChevronRight size={24} strokeWidth={1.5} />
        </button>
        <span className="sr-only" aria-live={paused ? "polite" : "off"}>
          {copyText("Story ")}
          {copyText(current + 1)}
          {copyText(" of ")}
          {copyText(stories.length)}
          {copyText(": ")}
          {copyText(stories[current]!.name)}
        </span>
      </div>
    </section></BrandText>
  );
}
