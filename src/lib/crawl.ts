import type { EventCategory } from "./types";
import {
  BROAD_QUERIES,
  PRIORITY_CATEGORIES,
  getDirectUrlsForCategory,
  getQueriesForCategory,
} from "./category-queries";
import { jinaRead, jinaSearch } from "./jina";

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
      source === "search" ? await jinaSearch(query) : await jinaRead(query);
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

export async function crawlEventListings(
  category?: EventCategory,
): Promise<CrawlResult[]> {
  if (category) {
    const queries = getQueriesForCategory(category);
    const urls = getDirectUrlsForCategory(category);
    return crawlMany(queries, urls, 5);
  }

  const broad = await crawlMany(BROAD_QUERIES, [], 4);

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
  return jinaRead(url);
}
