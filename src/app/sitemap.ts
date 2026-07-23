import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/sitemap-urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries();

  return entries.map((entry) => ({
    url: entry.url,
    lastModified: entry.lastModified ?? new Date(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.alternates ? { alternates: entry.alternates } : {}),
  }));
}
