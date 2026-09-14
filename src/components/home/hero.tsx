import Image from "next/image";
import { Container, CtaLink, MetaLabel } from "@/components/site/primitives";

export function Hero() {
  return (
    <section className="relative flex min-h-[560px] overflow-hidden bg-background text-foreground dark:bg-ink dark:text-white sm:min-h-[620px] lg:min-h-[680px]">
      <Image
        src="/images/rycode-hero-structure.png"
        alt="تصویر انتزاعی از اتصال ایده‌ها به یک محصول دیجیتال"
        fill
        priority
        sizes="100vw"
        className="ken-burns object-cover object-[66%_center] opacity-45 saturate-50 motion-reduce:animate-none dark:opacity-100 dark:saturate-100"
      />
      <div className="absolute inset-0 bg-background/55 dark:bg-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(248,245,240,0.32)_0%,rgba(248,245,240,0.62)_45%,rgba(248,245,240,0.96)_100%)] dark:bg-[linear-gradient(180deg,rgba(19,18,16,0.36)_0%,rgba(19,18,16,0.12)_38%,rgba(19,18,16,0.88)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,245,240,0.72)_0%,transparent_58%,rgba(248,245,240,0.36)_100%)] dark:bg-[linear-gradient(90deg,rgba(19,18,16,0.56)_0%,transparent_58%,rgba(19,18,16,0.18)_100%)]" />
      <Container className="relative z-10 flex min-h-[560px] flex-1 items-center justify-center py-20 sm:min-h-[620px] lg:min-h-[680px]">
        <div className="max-w-3xl text-center">
          <MetaLabel className="text-foreground/60 dark:text-white/70">
            RYCODE · SOFTWARE ENGINEERING · TEHRAN
          </MetaLabel>
          <h1 className="mt-5 text-[clamp(2.5rem,5.8vw,5rem)] font-extrabold leading-[1.08] tracking-[-0.04em] text-foreground dark:text-white">
            ایده‌هایی که باید
            <br />
            <span className="text-brand">واقعی کار کنند</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-foreground/70 dark:text-white/75 sm:mt-6 sm:text-base sm:leading-8">
            سایت، فروشگاه و نرم‌افزاری می‌سازیم که فقط قشنگ نباشد؛ درست کار کند، قابل اعتماد باشد و
            با کسب‌وکارتان رشد کند.
          </p>
          <div className="mx-auto mt-7 flex max-w-md flex-col justify-center gap-3 sm:mt-8 sm:max-w-none sm:flex-row">
            <CtaLink to="/start-project" className="w-full sm:w-auto">
              شروع یک گفت‌وگو
            </CtaLink>
            <CtaLink
              to="/services"
              variant="outline"
              className="w-full border-foreground/35 text-foreground hover:border-foreground hover:bg-foreground/5 dark:border-white/45 dark:text-white dark:hover:border-white dark:hover:bg-white/10 sm:w-auto"
            >
              سرویس‌ها را ببینید
            </CtaLink>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-7 z-10 hidden justify-center lg:flex">
        <div className="flex flex-col items-center gap-3 text-[0.62rem] font-medium tracking-[0.22em] text-foreground/50 uppercase dark:text-white/60">
          Scroll to explore
          <span className="hero-scroll-cue h-12 w-px bg-foreground/50 dark:bg-white/70" />
        </div>
      </div>
    </section>
  );
}
