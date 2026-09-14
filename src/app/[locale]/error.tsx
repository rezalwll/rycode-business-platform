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
    <main className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="meta-label text-brand">ERROR / 500</p>
        <h1 className="mt-5 text-3xl font-bold">این صفحه بارگذاری نشد</h1>
        <p className="mt-3 text-muted-foreground">
          Something went wrong. Internal details were not exposed.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 h-11 rounded-md bg-brand px-6 text-sm font-bold text-brand-foreground"
        >
          تلاش دوباره / Try again
        </button>
      </div>
    </main>
  );
}
