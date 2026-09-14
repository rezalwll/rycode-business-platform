import type { MetadataRoute } from "next";

function baseUrl(): URL {
  try {
    return new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://rycode.ir");
  } catch {
    return new URL("https://rycode.ir");
  }
}

export default function robots(): MetadataRoute.Robots {
  const origin = baseUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/en/admin", "/dashboard", "/en/dashboard", "/api/", "/files/"],
    },
    sitemap: new URL("/sitemap.xml", origin).toString(),
    host: origin.origin,
  };
}
