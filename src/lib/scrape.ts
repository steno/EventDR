import * as cheerio from "cheerio";

import { SITE_URL } from "./site-url";

const USER_AGENT =
  `Mozilla/5.0 (compatible; EventDR/1.0; +${SITE_URL})`;
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

function summarizeAddress(address: unknown, lines: string[]): void {
  if (typeof address === "string") {
    lines.push(`Address: ${address}`);
    return;
  }
  if (!address || typeof address !== "object") return;

  const addr = address as Record<string, unknown>;
  if (typeof addr.streetAddress === "string") {
    lines.push(`Address: ${addr.streetAddress}`);
  }
  if (typeof addr.addressLocality === "string") {
    lines.push(`City: ${addr.addressLocality}`);
  }
}

function summarizeJsonLdImage(image: unknown): string | undefined {
  if (typeof image === "string" && image.trim()) return image.trim();
  if (Array.isArray(image)) {
    for (const item of image) {
      const found = summarizeJsonLdImage(item);
      if (found) return found;
    }
    return undefined;
  }
  if (image && typeof image === "object") {
    const url = (image as Record<string, unknown>).url;
    if (typeof url === "string" && url.trim()) return url.trim();
  }
  return undefined;
}

function summarizeJsonLdEvent(record: Record<string, unknown>): string {
  const lines: string[] = [];
  if (typeof record.name === "string") lines.push(`Event: ${record.name}`);
  if (typeof record.startDate === "string") lines.push(`Date: ${record.startDate}`);
  if (typeof record.description === "string") {
    lines.push(`Description: ${record.description.slice(0, 300)}`);
  }
  if (typeof record.url === "string") lines.push(`URL: ${record.url}`);

  const imageUrl = summarizeJsonLdImage(record.image);
  if (imageUrl) lines.push(`Image: ${imageUrl}`);

  const loc = record.location;
  if (loc && typeof loc === "object") {
    const place = loc as Record<string, unknown>;
    if (typeof place.name === "string") lines.push(`Venue: ${place.name}`);
    summarizeAddress(place.address, lines);
  }

  return lines.join("\n");
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
    blocks.push(summarizeJsonLdEvent(record));
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

function extractOpenGraphImage(html: string): string | undefined {
  const $ = cheerio.load(html);
  const selectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:url"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
  ];
  for (const sel of selectors) {
    const content = $(sel).first().attr("content")?.trim();
    if (content) return content;
  }
  return undefined;
}

/** Fetch a URL and return plain text (plus JSON-LD Event blocks when present). */
export async function scrapeUrl(targetUrl: string): Promise<string> {
  const res = await fetchWithTimeout(targetUrl);
  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}): ${targetUrl}`);
  }

  const html = await res.text();
  const jsonLd = extractJsonLdText(html);
  const ogImage = extractOpenGraphImage(html);
  const text = htmlToText(html);
  const combined = [
    jsonLd,
    ogImage ? `Image: ${ogImage}` : "",
    text,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");
  return combined.slice(0, MAX_CONTENT_CHARS);
}

/** Optional web search via Brave Search API (~$5/mo free credits ≈ 1k queries). */
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
