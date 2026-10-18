import type { MetadataRoute } from "next";
import { BRAND_ICON_SRC } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RYCODE — رای‌کد",
    short_name: "RYCODE",
    description: "Software engineering, digital products and technical growth.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f2f2",
    theme_color: "#f2f2f2",
    icons: [{ src: BRAND_ICON_SRC, sizes: "512x512", type: "image/png", purpose: "any" }],
  };
}
