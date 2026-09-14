import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RYCODE — رای‌کد",
    short_name: "RYCODE",
    description: "Software engineering, digital products and technical growth.",
    start_url: "/",
    display: "standalone",
    background_color: "#f9f6ef",
    theme_color: "#e8751a",
    icons: [{ src: "/favicon.png", sizes: "64x64", type: "image/png" }],
  };
}
