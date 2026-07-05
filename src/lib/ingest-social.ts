import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import { FACEBOOK_GROUPS, facebookGroupEventUrls, facebookGroupSearchQueries } from "@/lib/facebook-groups";
import { jinaRead, jinaSearch } from "@/lib/jina";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";

const SOCIAL_QUERIES = [
  "site:instagram.com events Puerto Plata Sosúa Cabarete",
  "site:instagram.com fiesta evento Cabarete República Dominicana",
  "site:instagram.com concierto Puerto Plata",
  "WhatsApp group events Cabarete Puerto Plata expat",
  "eventos WhatsApp Costa Norte República Dominicana",
  "site:facebook.com events Puerto Plata Costa Norte",
  ...facebookGroupSearchQueries(),
];

export async function ingestSocialEvents(locale: Locale = "en"): Promise<Event[]> {
  const results = await crawlEventListings();
  const groupReads = await Promise.all(
    [...FACEBOOK_GROUPS.map((group) => group.url), ...facebookGroupEventUrls()].map(
      async (url) => {
        const group = FACEBOOK_GROUPS.find((g) => url.startsWith(g.url));
        try {
          const content = await jinaRead(url);
          if (content.length < 80 || /log into facebook/i.test(content)) return null;
          return {
            query: group?.label ?? url,
            content: content.slice(0, 12000),
            fetchedAt: new Date().toISOString(),
            source: "url" as const,
          };
        } catch {
          return null;
        }
      },
    ),
  );
  const socialResults = await Promise.all(
    SOCIAL_QUERIES.slice(0, 8).map(async (query) => {
      try {
        const content = await jinaSearch(query);
        if (content.length < 80) return null;
        return {
          query,
          content: content.slice(0, 12000),
          fetchedAt: new Date().toISOString(),
          source: "search" as const,
        };
      } catch {
        return null;
      }
    }),
  );

  const combined = [
    ...results,
    ...groupReads.filter(Boolean),
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
