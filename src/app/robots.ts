import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/api/events",
        "/api/venues",
        "/api/app-version",
      ],
      disallow: [
        "/api/",
        "/en/moderate",
        "/es/moderate",
        "/fr/moderate",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
