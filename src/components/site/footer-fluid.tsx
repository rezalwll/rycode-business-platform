"use client";

import { useEffect, useRef } from "react";
import type { FluidColor, FooterFluidController } from "./footer-fluid-engine";

/** The source fluid effect, scoped to footer bounds and loaded only when visible. */
export function FooterFluid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.closest("footer");
    if (!canvas || !host) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let inView = false;
    let disposed = false;
    let loading = false;
    let controller: FooterFluidController | null = null;
    const sync = () => {
      if (disposed) return;
      if (!inView || document.hidden || reducedMotion.matches || !finePointer.matches) {
        controller?.pause();
        return;
      }
      if (controller) {
        controller.resume();
        return;
      }
      if (loading) return;
      loading = true;
      void import("./footer-fluid-engine")
        .then(({ startFluidSimulation }) => {
          if (disposed) return;
          if (!inView || document.hidden || reducedMotion.matches || !finePointer.matches) {
            loading = false;
            return;
          }
          const style = getComputedStyle(host);
          const palette = [
            ["--accent-blue", "#66C0FF"],
            ["--accent-purple", "#6d4cdb"],
            ["--accent-orange", "#ff9c52"],
          ].map(([token, fallback]): FluidColor => {
            const value = style.getPropertyValue(token!).trim();
            const hex = /^#[\da-f]{6}$/iu.test(value) ? value : fallback!;
            return {
              r: parseInt(hex.slice(1, 3), 16) / 255,
              g: parseInt(hex.slice(3, 5), 16) / 255,
              b: parseInt(hex.slice(5, 7), 16) / 255,
            };
          });
          controller = startFluidSimulation(canvas, host, palette);
          // Visibility/preferences may have changed while the module was loading.
          if (inView && !document.hidden && !reducedMotion.matches && finePointer.matches)
            controller?.resume();
        })
        .catch(() => {
          /* Unsupported GPU/import keeps the ordinary white footer. */
        });
    };
    const observer =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry?.isIntersecting ?? false;
            sync();
          })
        : null;
    if (observer) observer.observe(host);
    else {
      inView = true;
      sync();
    }
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener("change", sync);
    finePointer.addEventListener("change", sync);
    return () => {
      disposed = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reducedMotion.removeEventListener("change", sync);
      finePointer.removeEventListener("change", sync);
      controller?.dispose();
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="coorda-footer-fluid" aria-hidden="true" tabIndex={-1} />
  );
}
