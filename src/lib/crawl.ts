const JINA_SEARCH = "https://s.jina.ai";
const JINA_READER = "https://r.jina.ai";

const EVENT_SOURCES = [
  "site:eventbrite.com Puerto Plata events",
  "site:allevents.in Puerto Plata Dominican Republic",
  "site:facebook.com events Puerto Plata",
  "Puerto Plata Sosúa Cabarete events 2026",
  "eventos Puerto Plata República Dominicana",
];

export interface CrawlResult {
  query: string;
  content: string;
  fetchedAt: string;
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

async function jinaSearch(query: string): Promise<string> {
  const url = `${JINA_SEARCH}/${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: jinaHeaders(),
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error(`Jina search failed (${res.status}): ${query}`);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = (await res.json()) as { data?: string; content?: string };
    return json.data ?? json.content ?? JSON.stringify(json);
  }

  return res.text();
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

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = (await res.json()) as { data?: string; content?: string };
    return json.data ?? json.content ?? JSON.stringify(json);
  }

  return res.text();
}

export async function crawlEventListings(
  category?: string,
): Promise<CrawlResult[]> {
  const queries = category
    ? [
        `${category} events Puerto Plata North Coast Dominican Republic`,
        `site:allevents.in ${category} Puerto Plata`,
        `site:eventbrite.com ${category} Puerto Plata`,
      ]
    : EVENT_SOURCES;

  const results: CrawlResult[] = [];
  const limit = category ? 2 : 3;

  for (const query of queries.slice(0, limit)) {
    try {
      const content = await jinaSearch(query);
      if (content.trim().length > 100) {
        results.push({
          query,
          content: content.slice(0, 12000),
          fetchedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn(`Crawl skipped for "${query}":`, err);
    }
  }

  return results;
}

export async function crawlUrl(url: string): Promise<string> {
  return jinaRead(url);
}
