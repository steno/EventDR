/**
 * Source and validate event images during ingest.
 * Prefer page OG / JSON-LD images (uploaded to Storage when possible),
 * then curated event maps, then curated venue images.
 */
import * as cheerio from "cheerio";
import { getEventImageUrl } from "@/lib/event-images";
import { getVenueImageUrl } from "@/lib/venue-images";
import { uploadEventImageBytes } from "@/lib/firebase/images";
import { imageSearch } from "@/lib/scrape";
import { SITE_URL } from "@/lib/site-url";
import type { Event } from "@/lib/types";

const USER_AGENT = `Mozilla/5.0 (compatible; EventDR/1.0; +${SITE_URL})`;
const FETCH_TIMEOUT_MS = 10_000;
const MIN_IMAGE_BYTES = 8_192;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_EVENTS_TO_SOURCE = 20;
const SOURCE_CONCURRENCY = 3;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

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
        Accept: "text/html,application/xhtml+xml,image/*,*/*;q=0.8",
        ...(init?.headers ?? {}),
      },
      redirect: "follow",
    });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeImageMime(raw: string | null): string | null {
  if (!raw) return null;
  const mime = raw.split(";")[0]?.trim().toLowerCase() ?? "";
  if (mime === "image/jpg" || mime === "image/pjpeg") return "image/jpeg";
  if (mime === "image/x-png") return "image/png";
  return ALLOWED_MIME.has(mime) ? mime : null;
}

function extensionForMime(mime: string): "jpg" | "png" | "webp" | null {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

function looksLikeImageBytes(buf: Buffer): boolean {
  if (buf.length < 12) return false;
  // JPEG
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
  // PNG
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  ) {
    return true;
  }
  // WebP (RIFF....WEBP)
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  ) {
    return true;
  }
  return false;
}

function absoluteUrl(candidate: string, baseUrl: string): string | null {
  try {
    const url = new URL(candidate, baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

function pushUnique(list: string[], value: string | null | undefined): void {
  if (!value || list.includes(value)) return;
  list.push(value);
}

function collectJsonLdImages(data: unknown, out: string[]): void {
  if (!data) return;
  if (Array.isArray(data)) {
    for (const item of data) collectJsonLdImages(item, out);
    return;
  }
  if (typeof data !== "object") return;

  const record = data as Record<string, unknown>;
  const type = record["@type"];
  const isEvent =
    (typeof type === "string" && type.includes("Event")) ||
    (Array.isArray(type) && type.some((t) => String(t).includes("Event")));

  if (isEvent && record.image != null) {
    const image = record.image;
    if (typeof image === "string") pushUnique(out, image);
    else if (Array.isArray(image)) {
      for (const item of image) {
        if (typeof item === "string") pushUnique(out, item);
        else if (item && typeof item === "object") {
          const url = (item as Record<string, unknown>).url;
          if (typeof url === "string") pushUnique(out, url);
        }
      }
    } else if (typeof image === "object") {
      const url = (image as Record<string, unknown>).url;
      if (typeof url === "string") pushUnique(out, url);
    }
  }

  if (Array.isArray(record["@graph"])) {
    collectJsonLdImages(record["@graph"], out);
  }
}

/** Extract candidate image URLs from an event / ticket page. */
export function extractImageCandidatesFromHtml(
  html: string,
  pageUrl: string,
): string[] {
  const $ = cheerio.load(html);
  const raw: string[] = [];

  const metaProps = [
    'meta[property="og:image"]',
    'meta[property="og:image:url"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
    'link[rel="image_src"]',
  ];
  for (const sel of metaProps) {
    const el = $(sel).first();
    const content = el.attr("content") ?? el.attr("href");
    if (content) pushUnique(raw, content.trim());
  }

  $('script[type="application/ld+json"]').each((_, el) => {
    const text = $(el).html();
    if (!text) return;
    try {
      collectJsonLdImages(JSON.parse(text), raw);
    } catch {
      // skip invalid JSON-LD
    }
  });

  return raw
    .map((c) => absoluteUrl(c, pageUrl))
    .filter((u): u is string => Boolean(u));
}

export async function extractImageCandidatesFromUrl(
  pageUrl: string,
): Promise<string[]> {
  try {
    const res = await fetchWithTimeout(pageUrl, {
      headers: { Accept: "text/html,application/xhtml+xml" },
    });
    if (!res.ok) return [];
    const html = await res.text();
    if (html.length < 80) return [];
    if (/log into facebook|log in to instagram|create an account/i.test(html)) {
      return [];
    }
    return extractImageCandidatesFromHtml(html, pageUrl);
  } catch {
    return [];
  }
}

/** Fetch and validate a remote image; returns bytes + mime when usable. */
export async function fetchValidImageBytes(
  imageUrl: string,
): Promise<{ bytes: Buffer; contentType: string; extension: string } | null> {
  try {
    const res = await fetchWithTimeout(imageUrl, {
      headers: { Accept: "image/jpeg,image/png,image/webp,image/*,*/*;q=0.8" },
    });
    if (!res.ok) return null;

    const contentType = normalizeImageMime(res.headers.get("content-type"));
    if (!contentType) return null;

    const extension = extensionForMime(contentType);
    if (!extension) return null;

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < MIN_IMAGE_BYTES || buf.length > MAX_IMAGE_BYTES) {
      return null;
    }
    if (!looksLikeImageBytes(buf)) return null;

    return { bytes: buf, contentType, extension };
  } catch {
    return null;
  }
}

async function pickValidatedUploadedImage(
  eventId: string,
  candidates: string[],
  maxTry = 5,
): Promise<string | undefined> {
  for (const candidate of candidates.slice(0, maxTry)) {
    const valid = await fetchValidImageBytes(candidate);
    if (!valid) continue;

    const uploaded = await uploadEventImageBytes(
      eventId,
      valid.bytes,
      valid.contentType,
      valid.extension,
    );
    if (uploaded.ok) return uploaded.url;

    // Storage unavailable — keep validated remote URL (better than no image).
    if (uploaded.reason === "storage_unavailable") return candidate;
  }
  return undefined;
}

/**
 * Resolve a durable imageUrl for an ingested event.
 * Prefer page OG / JSON-LD, then Brave image search, then curated maps.
 * Uploads to Firebase Storage when available; otherwise keeps a validated remote URL.
 */
export async function sourceEventImageUrl(
  eventId: string,
  pageUrls: (string | undefined)[],
  searchHint?: string,
): Promise<string | undefined> {
  const curated = getEventImageUrl(eventId);
  if (curated) return curated;

  const pages = [...new Set(pageUrls.filter(Boolean))] as string[];
  const candidates: string[] = [];

  for (const page of pages) {
    const found = await extractImageCandidatesFromUrl(page);
    for (const url of found) pushUnique(candidates, url);
  }

  const fromPage = await pickValidatedUploadedImage(eventId, candidates);
  if (fromPage) return fromPage;

  // Marketplace pages often 403 — fall back to Brave image search.
  const hint = searchHint?.trim();
  if (hint) {
    const searched = await imageSearch(
      `${hint} Dominican Republic Puerto Plata photo`,
      8,
    );
    const fromSearch = await pickValidatedUploadedImage(eventId, searched, 6);
    if (fromSearch) return fromSearch;
  }

  return undefined;
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]!);
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    () => worker(),
  );
  await Promise.all(workers);
  return results;
}

/**
 * Attach sourced / curated images to ingested events.
 * Validates AI-provided imageUrl; otherwise sources from page / venue.
 */
export async function attachIngestImages(events: Event[]): Promise<Event[]> {
  const needsWork = events.filter((e) => !getEventImageUrl(e.id));
  const toProcess = needsWork.slice(0, MAX_EVENTS_TO_SOURCE);
  const processedIds = new Set(toProcess.map((e) => e.id));

  const resolved = await mapWithConcurrency(
    toProcess,
    SOURCE_CONCURRENCY,
    async (event) => {
      // Validate enrich-provided URL first (may be hallucinated).
      if (event.imageUrl?.trim()) {
        const valid = await fetchValidImageBytes(event.imageUrl.trim());
        if (valid) {
          const uploaded = await uploadEventImageBytes(
            event.id,
            valid.bytes,
            valid.contentType,
            valid.extension,
          );
          if (uploaded.ok) {
            return { id: event.id, imageUrl: uploaded.url };
          }
          if (uploaded.reason === "storage_unavailable") {
            return { id: event.id, imageUrl: event.imageUrl.trim() };
          }
        }
      }

      const fromPage = await sourceEventImageUrl(
        event.id,
        [event.sourceUrl, event.ticketUrl],
        `${event.title} ${event.venue ?? ""} ${event.location}`,
      );
      if (fromPage) return { id: event.id, imageUrl: fromPage };

      if (event.venueSlug) {
        const venueImg = getVenueImageUrl(event.venueSlug);
        if (venueImg) return { id: event.id, imageUrl: venueImg };
      }
      return { id: event.id, imageUrl: undefined as string | undefined };
    },
  );

  const byId = new Map(resolved.map((s) => [s.id, s.imageUrl]));

  return events.map((event) => {
    const curated = getEventImageUrl(event.id);
    if (curated) return { ...event, imageUrl: curated };

    if (processedIds.has(event.id)) {
      const imageUrl = byId.get(event.id);
      if (imageUrl) return { ...event, imageUrl };
      // Drop invalid enrich imageUrl so cards don't 404.
      if (!event.imageUrl) return event;
      return { ...event, imageUrl: undefined };
    }

    if (event.venueSlug && !event.imageUrl?.trim()) {
      const venueImg = getVenueImageUrl(event.venueSlug);
      if (venueImg) return { ...event, imageUrl: venueImg };
    }

    return event;
  });
}
