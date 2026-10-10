import { ArrowLeft } from "lucide-react";

import { Link } from "@/i18n/navigation";

const heroLinkBase =
  "group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border px-6 text-sm font-semibold transition-[background-color,border-color,color,transform,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#20bfb2]";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#f7fcfb] text-[#073b4c]">
      <div className="absolute -right-28 top-12 -z-10 size-[27rem] rounded-full bg-[#b9f4eb]/65 blur-3xl" />
      <div className="absolute -left-36 bottom-0 -z-10 size-[30rem] rounded-full bg-[#d9e9ff]/75 blur-3xl" />
      <div className="absolute left-[42%] top-[18%] -z-10 size-64 rounded-full bg-[#fff0bf]/55 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.22] [background-image:radial-gradient(rgba(7,59,76,0.22)_0.7px,transparent_0.7px)] [background-size:30px_30px]" />

      <div className="mx-auto grid min-h-[720px] w-full max-w-[1320px] items-center gap-12 px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-24 lg:pt-36">
        <div className="text-center lg:text-start">
          <div className="hero-fade-rise mb-6 inline-flex items-center gap-2 rounded-full border border-[#20bfb2]/20 bg-white/78 px-4 py-2 text-xs font-bold text-[#087b83] shadow-sm backdrop-blur">
            <span className="size-2 rounded-full bg-[#20bfb2] shadow-[0_0_0_5px_rgba(32,191,178,0.12)]" />
            شریک فنی برای ساخت و رشد کسب‌وکار
          </div>
          <h1 className="hero-fade-rise text-[clamp(2.35rem,5.1vw,5rem)] font-light leading-[1.2] tracking-[-0.04em] text-[#073b4c]">
            <span>ایده‌ها، </span>
            <span className="text-[#477580]">از دل سکوت</span>
            <br />
            <span className="text-[#477580]">به </span>
            <span className="text-[#0ba99d]">واقعیت</span>
            <span> می‌رسند.</span>
          </h1>

          <p className="hero-fade-rise hero-fade-rise-delay-1 mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#315d68]/76 sm:text-base sm:leading-8 lg:mx-0">
            برای کسب‌وکارهایی که بزرگ فکر می‌کنند، فضای دیجیتال می‌سازیم؛ از سایت و فروشگاه تا
            نرم‌افزار اختصاصی—با تمرکز، دقت و مهندسی واقعی.
          </p>

          <div className="hero-fade-rise hero-fade-rise-delay-2 mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-9 sm:w-auto sm:max-w-none sm:flex-row lg:justify-start">
            <Link
              href="/start-project"
              className={`${heroLinkBase} border-[#20bfb2] bg-[#5fe1d5] text-[#073b4c] shadow-[0_12px_34px_rgba(32,191,178,0.22)] hover:border-[#0ba99d] hover:bg-[#74eadf] hover:shadow-[0_16px_40px_rgba(32,191,178,0.28)]`}
            >
              شروع یک گفت‌وگو
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
            <Link
              href="/services"
              className={`${heroLinkBase} border-[#073b4c]/14 bg-white/75 text-[#174a58] shadow-sm backdrop-blur-sm hover:border-[#20bfb2]/55 hover:bg-white`}
            >
              سرویس‌ها را ببینید
            </Link>
          </div>
        </div>

        <div className="hero-fade-rise hero-fade-rise-delay-1 relative mx-auto w-full max-w-[610px] lg:mx-0">
          <div className="absolute -inset-5 -z-10 rotate-2 rounded-[2.25rem] bg-[#c9f5ef]" />
          <div className="absolute -inset-3 -z-10 -rotate-2 rounded-[2rem] bg-[#dfeaff]" />
          <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-white p-2.5 shadow-[0_28px_80px_rgba(7,59,76,0.16)]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-[#bdeee8]">
              <video
                className="size-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
              >
                <source src="/videos/rycode-hero.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-[#073b4c]/42 via-transparent to-white/8" />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/35 bg-white/82 px-4 py-3 text-[#073b4c] shadow-lg backdrop-blur-xl sm:inset-x-5 sm:bottom-5">
                <div>
                  <p className="font-latin text-[0.62rem] font-bold tracking-[0.16em] text-[#0b8e8b] uppercase">
                    RYCODE / BUILD
                  </p>
                  <p className="mt-1 text-xs font-semibold sm:text-sm">
                    از مسئله واقعی تا محصول قابل رشد
                  </p>
                </div>
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#5fe1d5] font-latin text-xs font-bold">
                  01
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -left-3 top-8 hidden rounded-2xl border border-white bg-[#fff4c9] px-4 py-3 text-xs font-bold text-[#6b5610] shadow-lg sm:block">
            طراحی روشن، مسیر شفاف
          </div>
        </div>
      </div>
    </section>
  );
}
