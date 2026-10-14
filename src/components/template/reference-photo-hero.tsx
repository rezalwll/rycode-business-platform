"use client";
import { BrandText } from "@/components/site/brand-text";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

// The supplied PhotoHero tree, frame and motion; only the page's content changes.
export default function ReferencePhotoHero({
  title,
  image,
  alt,
  abstract = false,
  children,
  className = "",
}: {
  title: string;
  image: string;
  alt: string;
  abstract?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const heading = (
    <motion.h1
      id="page-title"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      {title}
    </motion.h1>
  );
  return (
    <BrandText>
      <section
        id="top"
        className={`photo-hero${abstract ? " legal-hero" : ""}${className ? ` ${className}` : ""}`}
        aria-labelledby="page-title"
      >
        <div className="photo-hero-frame">
          {abstract ? (
            <div className="legal-abstract" aria-hidden="true" />
          ) : (
            <img className="photo-hero-image" src={image} alt={alt} fetchPriority="high" />
          )}
          {children ? (
            <div className="photo-hero-content">
              {heading}
              {children}
            </div>
          ) : (
            heading
          )}
        </div>
      </section>
    </BrandText>
  );
}
