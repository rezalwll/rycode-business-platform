"use client";
import { BrandText } from "@/components/site/brand-text";

import { motion, useReducedMotion } from "motion/react";

// The supplied PhotoHero tree, frame and motion; only the page's content changes.
export default function ReferencePhotoHero({ title, image, alt, abstract = false }: {
  title: string; image: string; alt: string; abstract?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return <BrandText><section id="top" className={`photo-hero${abstract ? ' legal-hero' : ''}`} aria-labelledby="page-title">
    <div className="photo-hero-frame">
      {abstract ? <div className="legal-abstract" aria-hidden="true" /> : <img className="photo-hero-image" src={image} alt={alt} fetchPriority="high" />}
      <motion.h1 id="page-title" initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>{title}</motion.h1>
    </div>
  </section></BrandText>;
}
