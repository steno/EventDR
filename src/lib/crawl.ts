import type { EventCategory } from "./types";
import {
  BROAD_QUERIES,
  PRIORITY_CATEGORIES,
  REGION_DIRECT_URLS,
  getDirectUrlsForCategory,
  getQueriesForCategory,
} from "./category-queries";
import { rotatingSlice } from "./ingest-rotation";
import { scrapeUrl, webSearch } from "./scrape";

/**
 * Categories folded into every fast crawl. Institutional events are announced
 * in short windows (a chamber forum is publicised ~2 weeks ahead), so business
 * cannot wait for its turn in the rotation.
 */
const FAST_PINNED_CATEGORIES: EventCategory[] = ["business"];

/** Extra priority categories added per fast run, rotating week to week. */
const FAST_ROTATION_SLICE = 2;

/** Searches taken from each category folded into a fast crawl. */
const FAST_CATEGORY_SEARCH_LIMIT = 3;

/**
 * Priority categories a fast crawl covers this week. Fast mode used to skip
 * category crawls entirely, so business/sports/culture queries never ran on the
 * weekly cron — only on a manual full ingest.
 */
export function fastCrawlCategories(now?: Date): EventCategory[] {
  const pool = PRIORITY_CATEGORIES.filter(
    (cat) => !FAST_PINNED_CATEGORIES.includes(cat),
  );
  return [...FAST_PINNED_CATEGORIES, ...rotatingSlice(pool, FAST_ROTATION_SLICE, now)];
}

export interface CrawlResult {
  query: string;
  content: string;
  fetchedAt: string;
  source: "search" | "url";
}

async function crawlOne(
  query: string,
  source: "search" | "url",
): Promise<CrawlResult | null> {
  try {
    const content =
      source === "search" ? await webSearch(query) : await scrapeUrl(query);
    if (content.trim().length < 80) return null;
    return {
      query,
      content: content.slice(0, 14000),
      fetchedAt: new Date().toISOString(),
      source,
    };
  } catch (err) {
    console.warn(`Crawl skipped for "${query}":`, err);
    return null;
  }
}

async function crawlMany(
  searches: string[],
  urls: string[],
  searchLimit: number,
): Promise<CrawlResult[]> {
  const tasks: Promise<CrawlResult | null>[] = [
    ...searches.slice(0, searchLimit).map((q) => crawlOne(q, "search")),
    ...urls.map((u) => crawlOne(u, "url")),
  ];

  const settled = await Promise.allSettled(tasks);
  const results: CrawlResult[] = [];

  for (const result of settled) {
    if (result.status === "fulfilled" && result.value) {
      results.push(result.value);
    }
  }

  return results;
}

export interface CrawlOptions {
  fast?: boolean;
  /** Categories to fold into a fast crawl. Defaults to this week's rotation. */
  categories?: EventCategory[];
}

export async function crawlEventListings(
  category?: EventCategory,
  options?: CrawlOptions,
): Promise<CrawlResult[]> {
  if (category) {
    const queries = getQueriesForCategory(category);
    const urls = getDirectUrlsForCategory(category);
    return crawlMany(queries, urls, options?.fast ? 3 : 5);
  }

  // Fast mode: broad crawl plus a slice of categories — searches run in
  // parallel, so the added cost is Brave quota rather than wall clock, which
  // is what keeps this under Netlify's ~26–30s gateway limit.
  if (options?.fast) {
    const categories = options.categories ?? fastCrawlCategories();
    const searches = [
      ...BROAD_QUERIES.slice(0, 3),
      ...categories.flatMap((cat) =>
        getQueriesForCategory(cat).slice(0, FAST_CATEGORY_SEARCH_LIMIT),
      ),
    ];
    const urls = new Set(REGION_DIRECT_URLS);
    for (const cat of categories) {
      for (const url of getDirectUrlsForCategory(cat)) urls.add(url);
    }
    return crawlMany(searches, [...urls], searches.length);
  }

  const broad = await crawlMany(BROAD_QUERIES, REGION_DIRECT_URLS, 4);

  const priorityCrawls = await Promise.all(
    PRIORITY_CATEGORIES.map(async (cat) => {
      const queries = getQueriesForCategory(cat);
      const urls = getDirectUrlsForCategory(cat);
      return crawlMany(queries, urls, 2);
    }),
  );

  const seen = new Set<string>();
  const combined: CrawlResult[] = [];

  for (const batch of [broad, ...priorityCrawls]) {
    for (const result of batch) {
      const key = result.query.slice(0, 80);
      if (!seen.has(key)) {
        seen.add(key);
        combined.push(result);
      }
    }
  }

  return combined;
}

export async function crawlUrl(url: string): Promise<string> {
  return scrapeUrl(url);
}
