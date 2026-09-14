"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container, CtaLink, MetaLabel, TextLink } from "@/components/site/primitives";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-ink text-ink-foreground pt-20 pb-8 sm:pt-28">
      <BrandField />

      <Container className="relative">
        <div className="flex items-center justify-between gap-6 border-b border-white/12 pb-5">
          <MetaLabel index={1} className="text-white/60">
            RYCODE / DIGITAL STUDIO
          </MetaLabel>
          <MetaLabel className="hidden text-white/45 sm:inline-flex">
            BUILD / RESCUE / GROW
          </MetaLabel>
        </div>

        <div className="grid gap-14 py-14 sm:py-20 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:gap-16">
          <div className="reveal">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/65">
              <span className="size-1.5 rounded-full bg-brand shadow-[0_0_14px_var(--color-brand)]" />
              تیم فنی برای ایده‌های جدی
            </span>
            <h1 className="display-1 mt-7 max-w-[13ch]">
              ایده را از ذهنتان می‌آوریم روی <span className="text-brand">صفحه.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-white/60 sm:text-lg">
              سایت، فروشگاه یا نرم‌افزار اختصاصی‌تان را با یک تیم جمع‌وجور و دقیق می‌سازیم؛ از اولین
              طرح تا روزی که محصول واقعاً کار می‌کند.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <CtaLink to="/start-project">شروع یک گفت‌وگو</CtaLink>
              <CtaLink
                to="/services"
                variant="outline"
                className="border-white/20 text-white hover:border-white/50 hover:bg-white/5"
              >
                سرویس‌ها را ببینید
              </CtaLink>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/12 pt-5 text-xs text-white/45">
              <span>
                <strong className="text-white">۰۱</strong> شناخت مسئله
              </span>
              <span>
                <strong className="text-white">۰۲</strong> ساخت راه‌حل
              </span>
              <span>
                <strong className="text-white">۰۳</strong> رشد مداوم
              </span>
            </div>
          </div>

          <HeroShowcase />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/12 pt-5 text-xs text-white/45">
          <span dir="ltr" className="font-medium tracking-[0.16em]">
            RYCODE / 2026
          </span>
          <TextLink to="/technical-review" className="text-white/70">
            پروژه‌تان گیر کرده؟ بررسی‌اش کنیم
          </TextLink>
        </div>
      </Container>
    </section>
  );
}

function HeroShowcase() {
  return (
    <div className="relative min-h-[360px] sm:min-h-[470px]">
      <div className="absolute inset-x-0 top-7 h-[76%] rounded-[1.5rem] border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-sm sm:top-4">
        <div className="flex h-8 items-center gap-1.5 border-b border-white/10 px-3">
          <span className="size-2 rounded-full bg-[#ff6b4a]" />
          <span className="size-2 rounded-full bg-[#f8b84e]" />
          <span className="size-2 rounded-full bg-[#73c991]" />
          <span className="ms-3 h-4 flex-1 rounded-full bg-white/10" />
        </div>
        <div className="relative h-[calc(100%-2rem)] overflow-hidden rounded-b-[1rem]">
          <Image
            src="/images/rycode-hero-structure.png"
            alt="نمایش تصویری ساختن یک محصول دیجیتال از ایده تا سیستم"
            fill
            priority
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink/75 via-transparent to-brand/10" />
          <div className="absolute right-5 bottom-5 max-w-[13rem] rounded-xl border border-white/15 bg-ink/75 p-4 backdrop-blur-md">
            <MetaLabel className="text-brand">LIVE BUILD / 01</MetaLabel>
            <p className="mt-2 text-sm leading-6 text-white/80">یک سیستم واضح برای کارهای واقعی.</p>
          </div>
        </div>
      </div>
      <div className="float-slow absolute bottom-2 left-0 z-10 w-32 rounded-2xl border border-white/15 bg-[#22201d] p-2 shadow-2xl sm:left-8 sm:w-40">
        <div className="relative aspect-[0.72] overflow-hidden rounded-xl">
          <Image
            src="/images/rycode-project-rescue.png"
            alt="نمای نزدیک از یک رابط کاربری در حال بازسازی"
            fill
            className="object-cover"
          />
          <span className="absolute inset-x-2 bottom-2 rounded-md bg-ink/70 px-2 py-1 text-[0.6rem] text-white/75">
            MOBILE / PREVIEW
          </span>
        </div>
      </div>
      <div className="absolute top-0 left-6 z-10 hidden rounded-full border border-brand/50 bg-brand px-4 py-2 text-xs font-bold text-brand-foreground shadow-lg sm:block lg:left-12">
        ۱ ایده ← ۱ محصول واقعی
      </div>
    </div>
  );
}

/**
 * Signature interaction: abstract planes derived from the RYCODE mark geometry
 * drift a few pixels with the pointer. Restrained, disabled for reduced motion.
 */
function BrandField() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setOffset({ x, y });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-field absolute inset-0 opacity-50 [mask-image:radial-gradient(80%_70%_at_80%_0%,black,transparent)]" />

      <div
        className="absolute top-[12%] left-[-6%] hidden h-[52vh] w-[26vw] border border-hairline lg:block"
        style={{ transform: `translate3d(${offset.x * 8}px, ${offset.y * 8}px, 0)` }}
      />
      <div
        className="absolute top-[34%] left-[3%] hidden h-20 w-20 bg-brand lg:block"
        style={{ transform: `translate3d(${offset.x * -14}px, ${offset.y * -10}px, 0)` }}
      />
      <div
        className="absolute top-[18%] left-[12%] hidden h-36 w-36 border border-foreground/30 lg:block"
        style={{ transform: `translate3d(${offset.x * -6}px, ${offset.y * 12}px, 0)` }}
      />
      <div
        className="absolute top-1/3 left-[3%] hidden h-px w-[22vw] bg-foreground/20 lg:block"
        style={{ transform: `translate3d(${offset.x * 16}px, 0, 0)` }}
      />
    </div>
  );
}
