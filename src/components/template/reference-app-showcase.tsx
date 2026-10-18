"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import { BrandText } from "@/components/site/brand-text";
import { getCatalogEntries, getCatalogVisual, type CatalogEntry } from "@/content/catalog";
import { useReferenceLocale } from "./reference-locale";
import { projectStudyPhase, projectStudySpring } from "./project-study-motion";
import "./project-studies.css";

const categories: Record<string, { fa: string; en: string }> = {
  "dealer-ordering-concept": { fa: "نرم‌افزار اختصاصی", en: "Custom software" },
  "ecommerce-redesign-concept": { fa: "فروشگاه اینترنتی", en: "Ecommerce" },
  "after-sales-concept": { fa: "خدمات پس از فروش", en: "After-sales service" },
};

function ProjectStudy({ project }: { project: CatalogEntry }) {
  const { locale, href, text } = useReferenceLocale();
  const frameRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  // Stable layout measurements, not the tilted image's changing bounding box.
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const dimensions = useMotionValue({ viewport: 0, height: 0 });
  const targetRotation = useTransform(() => {
    const { viewport, height } = dimensions.get();
    return projectStudyPhase(scrollYProgress.get(), viewport, height);
  });
  const targetEdge = useTransform(targetRotation, Math.abs);
  // Smooth the two channels independently: scale must not abruptly reverse
  // velocity at the flat/full-size point or when scroll direction changes.
  const rotation = useSpring(targetRotation, projectStudySpring);
  const edge = useSpring(targetEdge, projectStudySpring);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || reduceMotion) return;
    const measure = () => dimensions.set({ viewport: window.innerHeight, height: frame.getBoundingClientRect().height });
    measure();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(frame);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [dimensions, reduceMotion]);
  const visual = getCatalogVisual(project);
  if (!visual) return null;
  const titleId = `study-${project.slug}-title`;
  const summaryId = `study-${project.slug}-summary`;
  const style = {
    "--case-rotation": reduceMotion ? 0 : rotation,
    "--case-edge": reduceMotion ? 0 : edge,
  } as MotionStyle;

  return (
    <article ref={frameRef} className="project-study-item" id={`study-${project.slug}`}>
      <motion.div className="project-study-motion" style={style}>
        <a className="project-study-card" href={href(`/projects/${project.slug}`)} aria-labelledby={titleId} aria-describedby={summaryId}>
          <Image className="project-study-image" src={visual.src} alt={visual.alt[locale]} fill sizes="(max-width: 809px) calc(100vw - 40px), (max-width: 1259px) calc(100vw - 60px), 1200px" />
          <div className="project-study-content">
            <span className="project-study-category">{categories[project.slug]?.[locale] ?? project.eyebrow[locale]}</span>
            <h3 id={titleId}>{project.title[locale]}</h3>
            <p id={summaryId}>{project.summary[locale]}</p>
          </div>
          <span className="project-study-arrow" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1.7} /></span>
        </a>
      </motion.div>
      {project.conceptual && <span className="sr-only">{text("مطالعهٔ مفهومی، نه پروژهٔ یک مشتری واقعی", "Concept study, not a real client project")}</span>}
    </article>
  );
}

export default function AppShowcase() {
  const { locale, href, text } = useReferenceLocale();
  const projects = getCatalogEntries("projects");
  return (
    <BrandText>
      <section id="app-showcase" className="project-studies" dir={locale === "fa" ? "rtl" : "ltr"} aria-labelledby="showcase-title">
        <div className="project-studies-container">
          <header className="project-studies-heading">
            <span className="project-studies-eyebrow">{text("نمونه‌ها و مطالعات", "Work & studies")}</span>
            <h2 id="showcase-title">{text("از یک نیاز واقعی", "From a real need")}<br />{text("تا یک ", "to a ")}<span>{text("محصول کاربردی", "useful product")}</span></h2>
            <p>{text("از سفارش‌گیری و فروش آنلاین تا خدمات پس از فروش؛ ببین برای هر نیاز، چه راهکاری می‌شه ساخت", "From ordering and online sales to after-sales service. Explore how a business need can become a useful product.")}</p>
            {projects.length > 0 && projects.every(project => project.conceptual) && <small>{text("این نمونه‌ها، مطالعات مفهومی‌اند؛ نه پروژه یا نتیجهٔ منتسب به مشتری واقعی", "These are concept studies, not claims about real clients or delivered results")}</small>}
          </header>
          <div className="project-studies-list">
            {projects.map(project => <ProjectStudy key={project.slug} project={project} />)}
          </div>
          <a href={href("/projects")} className="project-studies-all">{text("همهٔ نمونه‌ها و مطالعات", "All work & studies")}<ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </section>
    </BrandText>
  );
}
