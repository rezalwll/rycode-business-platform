"use client";
import { BrandText } from "@/components/site/brand-text";

import { useReferenceLocale } from "./reference-locale";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
const screens = [
  {
    id: "meet",
    label: "Your website and app",
    file: "showcase-people.webp",
    alt: "Concept interface preview",
  },
  {
    id: "events",
    label: "Connected systems",
    file: "showcase-events.png",
    alt: "Concept interface preview",
  },
  {
    id: "activity",
    label: "Search and content",
    file: "showcase-activity.png",
    alt: "Concept interface preview",
  },
  {
    id: "messages",
    label: "Support and development",
    file: "showcase-messages.png",
    alt: "Concept interface preview",
  },
];
function ShowcaseScreen({ screen }: { screen: (typeof screens)[number] }) {
  const frameRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1, 0.7]);
  return (
    <BrandText><motion.figure
      ref={frameRef}
      id={`showcase-${screen.id}`}
      className="showcase-screen"
      aria-label={screen.label}
      {...(reduceMotion ? {} : { style: { scale, opacity } })}
    >
      {/* The original assets include the device frame and the complete app interface. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/coorda-template/${screen.file}`}
        width={280}
        height={565}
        alt={screen.alt}
        loading="lazy"
        draggable={false}
      />
    </motion.figure></BrandText>
  );
}
export default function AppShowcase() {
  const { copyText, href } = useReferenceLocale();
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const frames = sectionRef.current?.querySelectorAll<HTMLElement>(".showcase-screen");
    if (!frames) return;
    const visibleFrames = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleFrames.add(entry.target as HTMLElement);
          else visibleFrames.delete(entry.target as HTMLElement);
        });
        // Prefer the frame nearest the middle of the viewport when two are visible.
        const closest = [...visibleFrames].sort((a, b) => {
          const center = window.innerHeight / 2;
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          return (
            Math.abs(ar.top + ar.height / 2 - center) - Math.abs(br.top + br.height / 2 - center)
          );
        })[0]!;
        if (closest)
          setActive(screens.findIndex((screen) => closest.id === `showcase-${screen.id}`));
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 },
    );
    frames.forEach((frame) => observer.observe(frame));
    return () => observer.disconnect();
  }, []);
  const select = (index: number, focus = false) => {
    const frame = sectionRef.current?.querySelector<HTMLElement>(`#showcase-${screens[index]!.id}`);
    if (!frame) return;
    setActive(index);
    if (focus) buttonRefs.current[index]!?.focus({ preventScroll: true });
    // offsetTop uses the unscaled layout, so scroll animations don't move the destination.
    const column = frame.parentElement!;
    const top = column.getBoundingClientRect().top + window.scrollY + frame.offsetTop - 96;
    window.scrollTo({ top, behavior: reduceMotion ? "instant" : "smooth" });
  };
  return (
    <BrandText><section
      ref={sectionRef}
      id="app-showcase"
      className="app-showcase"
      aria-labelledby="showcase-title"
    >
      <div className="showcase-container">
        <div className="showcase-copy">
          <div className="showcase-sticky">
            <div className="showcase-heading">
              <motion.h2
                id="showcase-title"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65 }}
              >
                {copyText("Your product,")}
                <br />
                <mark>{copyText("built around")}</mark>
                {copyText(" the way")}
                <br />
                {copyText("you work")}
              </motion.h2>
              <nav className="showcase-navigation" aria-label="Service areas">
                {copyText(
                  screens.map((screen, index) => (
                    <button
                      key={screen.id}
                      ref={(element) => {
                        buttonRefs.current[index] = element;
                      }}
                      type="button"
                      aria-controls={`showcase-${screen.id}`}
                      {...(active === index ? { "aria-current": "step" } : {})}
                      onClick={() => select(index)}
                      onKeyDown={(event) => {
                        let next: number | undefined;
                        if (event.key === "ArrowDown" || event.key === "ArrowRight")
                          next = (index + 1) % screens.length;
                        if (event.key === "ArrowUp" || event.key === "ArrowLeft")
                          next = (index + screens.length - 1) % screens.length;
                        if (event.key === "Home") next = 0;
                        if (event.key === "End") next = screens.length - 1;
                        if (next !== undefined) {
                          event.preventDefault();
                          select(next, true);
                        }
                      }}
                    >
                      {copyText(screen.label)}
                    </button>
                  )),
                )}
              </nav>
            </div>
            <div className="showcase-cta">
              <p>
                {copyText("Websites, software and apps.")}
                <br />
                {copyText("Connected into a useful product.")}
              </p>
              <a href={href("/projects")} className="hero-cta">
                <span className="hero-cta-label">{copyText("Project studies")}</span>
                <span className="hero-cta-label hero-cta-label-copy" aria-hidden="true">
                  {copyText("Project studies")}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="showcase-visuals">
          {copyText(screens.map((screen) => <ShowcaseScreen key={screen.id} screen={screen} />))}
        </div>
      </div>
    </section></BrandText>
  );
}
