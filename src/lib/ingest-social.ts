import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import {
  FACEBOOK_EVENT_PAGES,
  FACEBOOK_GROUPS,
  facebookEventPageUrls,
  facebookGroupEventUrls,
  facebookGroupSearchQueries,
} from "@/lib/facebook-groups";
import { scrapeUrl, webSearch } from "@/lib/scrape";
import type { Event } from "@/lib/types";
import type { Locale } from "@/i18n/config";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function ingestEventId(event: Event): string {
  const base = event.id
    .replace(/^ingest-\d+-\d+-/, "")
    .replace(/^ai-\d+-/, "");
  return `ingest-${slugify(base || event.title)}`;
}

const SOCIAL_QUERIES = [
  "site:instagram.com events Puerto Plata Sosúa Cabarete",
  "site:instagram.com fiesta evento Cabarete República Dominicana",
  "site:instagram.com concierto Puerto Plata",
  "site:instagram.com graaneventsplanners OR cabaretejazz OR nonasgrillkitchen",
  "WhatsApp group events Cabarete Puerto Plata expat",
  "eventos WhatsApp Costa Norte República Dominicana merengue bachata",
  "site:facebook.com events Puerto Plata Costa Norte",
  "site:facebook.com concierto merengue bachata típico Puerto Plata Sosúa",
  ...facebookGroupSearchQueries(),
];

export async function ingestSocialEvents(locale: Locale = "en"): Promise<Event[]> {
  const results = await crawlEventListings();
  const facebookUrls = [
    ...FACEBOOK_GROUPS.map((group) => group.url),
    ...facebookGroupEventUrls(),
    ...facebookEventPageUrls(),
  ];
  const groupReads = await Promise.all(
    facebookUrls.map(async (url) => {
        const group = FACEBOOK_GROUPS.find((g) => url.startsWith(g.url));
        const page = FACEBOOK_EVENT_PAGES.find((p) => url.startsWith(p.url));
        try {
          const content = await scrapeUrl(url);
          if (content.length < 80 || /log into facebook/i.test(content)) return null;
          return {
            query: group?.label ?? page?.label ?? url,
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
        const content = await webSearch(query);
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

  return enriched.map((e) => ({
    ...e,
    id: ingestEventId(e),
    sourceType: e.sourceUrl?.includes("instagram")
      ? ("instagram" as const)
      : e.sourceUrl?.includes("whatsapp") || e.description.toLowerCase().includes("whatsapp")
        ? ("whatsapp" as const)
        : ("crawl" as const),
    status: "pending" as const,
    communitySubmitted: true,
  }));
}
