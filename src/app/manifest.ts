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
    icons: [{ src: "/favicon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
