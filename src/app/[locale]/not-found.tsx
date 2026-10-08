import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-[#00364a] px-5 text-center text-white">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_22%_18%,rgba(95,225,213,0.18),transparent_25%),radial-gradient(circle_at_80%_78%,rgba(99,146,255,0.16),transparent_28%)]" />
      <div className="w-full max-w-xl rounded-2xl border border-white/15 bg-white/[0.06] p-8 shadow-[0_30px_90px_rgba(0,18,26,0.4)] backdrop-blur-md sm:p-12">
        <p className="meta-label text-[#5fe1d5]">ERROR / 404</p>
        <h1 className="mt-5 text-5xl font-light">صفحه پیدا نشد</h1>
        <p className="mt-4 text-white/62">The requested page does not exist or has moved.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-[#5fe1d5] px-6 text-sm font-bold text-[#00364a]"
        >
          بازگشت به خانه / Home
        </Link>
      </div>
    </main>
  );
}
