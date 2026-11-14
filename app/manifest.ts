import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CodeNest — كود نست",
    short_name: "CodeNest",
    description:
      "Arabic-first engineering team building digital products worth trusting.",
    start_url: "/ar",
    display: "standalone",
    background_color: "#07070b",
    theme_color: "#07070b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}