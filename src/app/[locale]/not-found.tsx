import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <p className="meta-label text-brand">ERROR / 404</p>
        <h1 className="mt-5 text-5xl font-extrabold">صفحه پیدا نشد</h1>
        <p className="mt-4 text-muted-foreground">
          The requested page does not exist or has moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-md bg-brand px-6 text-sm font-bold text-brand-foreground"
        >
          بازگشت به خانه / Home
        </Link>
      </div>
    </main>
  );
}
