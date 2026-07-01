import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";

const SOCIAL_QUERIES = [
  "site:instagram.com events Puerto Plata Sosúa Cabarete",
  "site:instagram.com fiesta evento Cabarete República Dominicana",
  "site:instagram.com concierto Puerto Plata",
  "WhatsApp group events Cabarete Puerto Plata expat",
  "eventos WhatsApp Costa Norte República Dominicana",
  "site:facebook.com events Puerto Plata Costa Norte",
];

export async function ingestSocialEvents(locale: Locale = "en"): Promise<Event[]> {
  const results = await crawlEventListings();
  const socialResults = await Promise.all(
    SOCIAL_QUERIES.slice(0, 4).map(async (query) => {
      try {
        const res = await fetch(
          `https://s.jina.ai/${encodeURIComponent(query)}`,
          {
            headers: {
              Accept: "application/json",
              ...(process.env.JINA_API_KEY
                ? { Authorization: `Bearer ${process.env.JINA_API_KEY}` }
                : {}),
            },
          },
        );
        if (!res.ok) return null;
        const json = (await res.json()) as { data?: string; content?: string };
        const content = json.data ?? json.content ?? "";
        if (content.length < 80) return null;
        return { query, content: content.slice(0, 12000), fetchedAt: new Date().toISOString(), source: "search" as const };
      } catch {
        return null;
      }
    }),
  );

  const combined = [
    ...results,
    ...socialResults.filter(Boolean),
  ];

  const enriched = await enrichCrawlResults(
    combined.filter((r): r is NonNullable<typeof r> => r != null),
    undefined,
    locale,
  );

  return enriched.map((e, i) => ({
    ...e,
    id: `ingest-${Date.now()}-${i}-${e.id}`,
    sourceType: e.sourceUrl?.includes("instagram")
      ? ("instagram" as const)
      : e.sourceUrl?.includes("whatsapp") || e.description.toLowerCase().includes("whatsapp")
        ? ("whatsapp" as const)
        : ("crawl" as const),
    status: "pending" as const,
    communitySubmitted: true,
  }));
}
