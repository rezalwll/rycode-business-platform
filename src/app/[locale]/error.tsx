"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("RYCODE route error", { message: error.message, digest: error.digest });
  }, [error]);

  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[#f7fcfb] px-5 text-center text-[#073b4c]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_18%,rgba(95,225,213,0.26),transparent_25%),radial-gradient(circle_at_80%_78%,rgba(99,146,255,0.16),transparent_28%)]" />
      <div className="w-full max-w-xl rounded-2xl border border-white/90 bg-white/80 p-8 shadow-[0_30px_90px_rgba(7,59,76,0.14)] backdrop-blur-md sm:p-12">
        <p className="meta-label text-[#087b83]">ERROR / 500</p>
        <h1 className="mt-5 text-3xl font-light">این صفحه بارگذاری نشد</h1>
        <p className="mt-3 text-[#315d68]/78">
          Something went wrong. Internal details were not exposed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 h-11 rounded-full bg-[#5fe1d5] px-6 text-sm font-bold text-[#073b4c]"
        >
          تلاش دوباره / Try again
        </button>
      </div>
    </main>
  );
}
