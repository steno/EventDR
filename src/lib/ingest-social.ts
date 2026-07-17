import { crawlEventListings } from "@/lib/crawl";
import { enrichCrawlResults } from "@/lib/enrich";
import {
  FACEBOOK_EVENT_PAGES,
  FACEBOOK_GROUPS,
  facebookEventPageUrls,
  facebookGroupEventUrls,
  facebookGroupSearchQueries,
} from "@/lib/facebook-groups";
import {
  INSTAGRAM_ACCOUNTS,
  instagramProfileUrls,
  instagramSearchQueries,
} from "@/lib/instagram-sources";
import { attachIngestImages } from "@/lib/ingest-images";
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
  ...instagramSearchQueries(),
  "WhatsApp group events Cabarete Puerto Plata expat",
  "eventos WhatsApp Costa Norte República Dominicana merengue bachata",
  "site:facebook.com events Puerto Plata Costa Norte",
  "site:facebook.com concierto merengue bachata típico Puerto Plata Sosúa",
  ...facebookGroupSearchQueries(),
];

async function readPublicSocialUrl(
  url: string,
  label: string,
): Promise<{
  query: string;
  content: string;
  fetchedAt: string;
  source: "url";
} | null> {
  try {
    const content = await scrapeUrl(url);
    if (content.length < 80) return null;
    if (/log into facebook|log in to instagram|create an account/i.test(content)) {
      return null;
    }
    return {
      query: label,
      content: content.slice(0, 12000),
      fetchedAt: new Date().toISOString(),
      source: "url" as const,
    };
  } catch {
    return null;
  }
}

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
      return readPublicSocialUrl(url, group?.label ?? page?.label ?? url);
    }),
  );

  const instagramReads = await Promise.all(
    instagramProfileUrls().map(async (url) => {
      const handle = url.replace(/\/$/, "").split("/").pop() ?? url;
      const account = INSTAGRAM_ACCOUNTS.find((a) => a.handle === handle);
      return readPublicSocialUrl(url, account?.label ?? `Instagram @${handle}`);
    }),
  );

  // Prefer Instagram + Facebook searches; keep volume bounded for cron time.
  const socialResults = await Promise.all(
    SOCIAL_QUERIES.slice(0, 14).map(async (query) => {
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
    ...instagramReads.filter(Boolean),
    ...socialResults.filter(Boolean),
  ];

  const enriched = await enrichCrawlResults(
    combined.filter((r): r is NonNullable<typeof r> => r != null),
    undefined,
    locale,
  );

  const pending = enriched.map((e) => ({
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

  // Source OG / JSON-LD / venue images so pending cards aren't emoji-only.
  return attachIngestImages(pending);
}
