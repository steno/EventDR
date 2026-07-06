import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (compatible; EventDR/1.0; +https://popevent.netlify.app)";
const FETCH_TIMEOUT_MS = 12_000;
const MAX_CONTENT_CHARS = 14_000;

export function isBraveSearchConfigured(): boolean {
  return Boolean(process.env.BRAVE_SEARCH_API_KEY?.trim());
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/json",
        ...(init?.headers ?? {}),
      },
      redirect: "follow",
      next: { revalidate: 0 },
    });
  } finally {
    clearTimeout(timer);
  }
}

function isEventSchema(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const type = (value as Record<string, unknown>)["@type"];
  if (typeof type === "string") return type === "Event" || type.includes("Event");
  if (Array.isArray(type)) return type.some((t) => String(t).includes("Event"));
  return false;
}

function collectJsonLdEvents(data: unknown, blocks: string[]): void {
  if (!data) return;

  if (Array.isArray(data)) {
    for (const item of data) collectJsonLdEvents(item, blocks);
    return;
  }

  if (typeof data !== "object") return;

  const record = data as Record<string, unknown>;
  if (isEventSchema(record)) {
    blocks.push(JSON.stringify(record, null, 2));
  }

  if (Array.isArray(record["@graph"])) {
    collectJsonLdEvents(record["@graph"], blocks);
  }
}

function extractJsonLdText(html: string): string {
  const blocks: string[] = [];
  const pattern =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

  for (const match of html.matchAll(pattern)) {
    try {
      collectJsonLdEvents(JSON.parse(match[1]), blocks);
    } catch {
      // skip invalid JSON-LD blocks
    }
  }

  return blocks.join("\n\n");
}

function htmlToText(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, iframe").remove();

  const main = $(
    "main, article, [role='main'], #content, .content, .events, .event-list",
  ).first();
  const text = (main.length ? main : $("body")).text();
  return text.replace(/\s+/g, " ").trim();
}

/** Fetch a URL and return plain text (plus JSON-LD Event blocks when present). */
export async function scrapeUrl(targetUrl: string): Promise<string> {
  const res = await fetchWithTimeout(targetUrl);
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}): ${targetUrl}`);
  }

  const html = await res.text();
  const jsonLd = extractJsonLdText(html);
  const text = htmlToText(html);
  const combined = [jsonLd, text].filter(Boolean).join("\n\n---\n\n");
  return combined.slice(0, MAX_CONTENT_CHARS);
}

/** Optional web search via Brave Search API (free tier: ~2k queries/month). */
export async function webSearch(query: string): Promise<string> {
  const key = process.env.BRAVE_SEARCH_API_KEY?.trim();
  if (!key) return "";

  const params = new URLSearchParams({ q: query, count: "10" });
  const res = await fetchWithTimeout(
    `https://api.search.brave.com/res/v1/web/search?${params}`,
    {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": key,
      },
    },
  );

  if (!res.ok) {
    throw new Error(`Brave search failed (${res.status}): ${query}`);
  }

  const json = (await res.json()) as {
    web?: { results?: { title?: string; url?: string; description?: string }[] };
  };
  const results = json.web?.results ?? [];
  if (results.length === 0) return "";

  return results
    .map(
      (r) =>
        `## ${r.title ?? "Untitled"}\n${r.url ?? ""}\n${r.description ?? ""}`,
    )
    .join("\n\n")
    .slice(0, MAX_CONTENT_CHARS);
}
