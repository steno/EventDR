import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();

  // Only emit lastmod where we actually know it. Stamping every URL with the
  // build time made all 800+ entries claim a same-second edit, which Google
  // treats as noise and ignores for the whole site.
  return entries.map((entry) => ({
    url: entry.url,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.alternates ? { alternates: entry.alternates } : {}),
  }));
}
