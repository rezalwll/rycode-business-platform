import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RYCODE — رای‌کد",
    short_name: "RYCODE",
    description: "Software engineering, digital products and technical growth.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7fcfb",
    theme_color: "#5fe1d5",
    icons: [{ src: "/brand/rycode-favicon.png", sizes: "512x512", type: "image/png" }],
  };
}
