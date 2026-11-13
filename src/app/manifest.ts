import type { MetadataRoute } from "next";
import { getBrandAssets } from "@/lib/brand-assets";

/** PWA manifest — Christmas icon set while the seasonal window is live. */
export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandAssets();
  return {
    name: "POP Events",
    short_name: "POP Events",
    description:
      "Events in the Puerto Plata region — North Coast Dominican Republic",
    id: "/",
    start_url: "/en",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    orientation: "any",
    lang: "en",
    categories: ["entertainment", "lifestyle", "social"],
    icons: [
      {
        src: brand.icon48,
        sizes: "48x48",
        type: "image/png",
        purpose: "any",
      },
      {
        src: brand.icon192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: brand.icon512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: brand.icon512Maskable,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
