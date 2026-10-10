import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const STATIC_PATHS = [
  "/",
  "/services",
  "/solutions",
  "/problems",
  "/industries",
  "/integrations",
  "/projects",
  "/blog",
  "/about",
  "/why-rycode",
  "/process",
  "/technologies",
  "/terms",
  "/privacy",
  "/contact",
  "/faq",
  "/start-project",
  "/technical-review",
  "/seo-audit",
  "/installment-purchase",
  "/en",
  "/en/services",
  "/en/about",
  "/en/contact",
  "/en/terms",
  "/en/privacy",
  "/en/installment-purchase",
];

const KIND_PREFIX: Record<string, string> = {
  service: "/services",
  solution: "/solutions",
  problem: "/problems",
  industry: "/industries",
  case_study: "/projects",
  integration: "/integrations",
};

export const Route = createFileRoute("/api/public/sitemap")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = new Set(STATIC_PATHS.map((p) => origin + p));

        const url = process.env["VITE_SUPABASE_URL"];
        const key = process.env["VITE_SUPABASE_PUBLISHABLE_KEY"];
        if (url && key) {
          const supabase = createClient(url, key, {
            auth: { persistSession: false },
            global: { headers: { apikey: key } },
          });
          const [content, articles] = await Promise.all([
            supabase.from("content_items").select("slug,kind").eq("status", "published"),
            supabase.from("articles").select("slug").eq("status", "published"),
          ]);
          for (const row of content.data ?? []) {
            const prefix = KIND_PREFIX[row.kind as string];
            if (prefix) urls.add(`${origin}${prefix}/${row.slug}`);
          }
          for (const row of articles.data ?? []) {
            urls.add(`${origin}/blog/${row.slug}`);
          }
        }

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
