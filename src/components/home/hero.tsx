import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";

const heroLinkBase =
  "group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border px-6 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

export function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[640px] overflow-hidden bg-[#00364a] text-white sm:min-h-[720px]"
    >
      <video
        className="absolute inset-0 -z-30 size-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/videos/rycode-hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 -z-20 bg-[#002f40]/14" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(0,25,36,0.12)_0%,rgba(0,35,48,0)_50%,rgba(0,20,28,0.38)_100%)]" />

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 flex-col items-center justify-center px-5 pb-20 pt-28 text-center sm:px-8 sm:pb-24 sm:pt-32">
        <h1 className="hero-fade-rise max-w-[1120px] text-[clamp(2.15rem,5vw,4.9rem)] font-light leading-[1.22] tracking-[-0.035em] text-white">
          <span>ایده‌ها، </span>
          <span className="text-white/48">از دل سکوت</span>
          <br />
          <span className="text-white/48">به </span>
          <span className="text-[#5fe1d5]">واقعیت</span>
          <span> می‌رسند.</span>
        </h1>

        <p className="hero-fade-rise hero-fade-rise-delay-1 mt-6 max-w-2xl text-sm leading-8 text-white/68 sm:text-base sm:leading-8">
          برای کسب‌وکارهایی که بزرگ فکر می‌کنند، فضای دیجیتال می‌سازیم؛ از سایت و فروشگاه تا
          نرم‌افزار اختصاصی—با تمرکز، دقت و مهندسی واقعی.
        </p>

        <div className="hero-fade-rise hero-fade-rise-delay-2 mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:max-w-none sm:flex-row">
          <Link
            href="/start-project"
            className={`${heroLinkBase} border-[#5fe1d5]/70 bg-[#5fe1d5]/15 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_8px_32px_rgba(95,225,213,0.14)] backdrop-blur-md hover:border-[#5fe1d5] hover:bg-[#5fe1d5]/25`}
          >
            شروع یک گفت‌وگو
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/services"
            className={`${heroLinkBase} border-white/20 bg-black/8 text-white/78 backdrop-blur-sm hover:border-white/45 hover:bg-black/15 hover:text-white`}
          >
            سرویس‌ها را ببینید
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-7 hidden justify-center lg:flex" aria-hidden="true">
        <span className="hero-scroll-cue h-12 w-px bg-[#5fe1d5]" />
      </div>
    </section>
  );
}
