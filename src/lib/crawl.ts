const JINA_SEARCH = "https://s.jina.ai";
const JINA_READER = "https://r.jina.ai";

import type { EventCategory } from "./types";
import {
  BROAD_QUERIES,
  CATEGORY_QUERIES,
  PRIORITY_CATEGORIES,
  getDirectUrlsForCategory,
  getQueriesForCategory,
} from "./category-queries";

export interface CrawlResult {
  query: string;
  content: string;
  fetchedAt: string;
  source: "search" | "url";
}

function jinaHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/json",
    "X-Return-Format": "markdown",
  };
  const key = process.env.JINA_API_KEY;
  if (key) {
    headers.Authorization = `Bearer ${key}`;
  }
  return headers;
}

async function parseJinaResponse(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = (await res.json()) as { data?: string; content?: string };
    return json.data ?? json.content ?? JSON.stringify(json);
  }
  return res.text();
}

async function jinaSearch(query: string): Promise<string> {
  const url = `${JINA_SEARCH}/${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: jinaHeaders(),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Jina search failed (${res.status}): ${query}`);
  }

  return parseJinaResponse(res);
}

async function jinaRead(targetUrl: string): Promise<string> {
  const url = `${JINA_READER}/${targetUrl}`;
  const res = await fetch(url, {
    headers: jinaHeaders(),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Jina read failed (${res.status}): ${targetUrl}`);
  }

  return parseJinaResponse(res);
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

  // Home feed: broad discovery + deep crawl for under-represented categories
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
