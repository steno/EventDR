import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { formatEventPlace } from "./event-location";
import { formatEventDateRange } from "./format-date";

/** Shared 9:16 Instagram story / Reel card layout (matches Share → Instagram). */
export const STORY_W = 1080;
export const STORY_H = 1920;
export const CARD_PAD = 72;
export const CARD_W = STORY_W - CARD_PAD * 2;
export const CARD_X = CARD_PAD;
export const CARD_Y = 300;
export const CARD_H = 1180;
export const CARD_RADIUS = 48;
export const IMAGE_H = 640;

export const STORY_COLORS = {
  gradientFrom: "#f97316",
  gradientTo: "#be123c",
  brand: "rgba(255,255,255,0.92)",
  card: "#fff7ed",
  imageFallback: "#fed7aa",
  title: "#7c2d12",
  meta: "#9a3412",
  site: "#c2410c",
} as const;

export function wrapTextLines(
  text: string,
  maxCharsPerLine: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || maxLines < 1) return [];

  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      current = next;
      continue;
    }
    if (current) lines.push(current);
    current = word;
    if (lines.length >= maxLines) {
      current = "";
      break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);

  if (lines.length === maxLines) {
    const consumed = lines.join(" ");
    const full = words.join(" ");
    if (full.length > consumed.length) {
      const last = lines[maxLines - 1] ?? "";
      lines[maxLines - 1] =
        last.length > 1 ? `${last.replace(/[.,;:–—-]?$/, "")}…` : "…";
    }
  }
  return lines;
}

export function storyCardMetaLine(event: Event, locale: Locale): string {
  const when = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });
  return [when, event.time, formatEventPlace(event)]
    .filter((part) => part && String(part).trim())
    .join(" · ");
}

/** Same-origin (or /events|/og path) so the browser canvas is not tainted. */
export function storyCardImageSrc(imageUrl?: string): string | null {
  if (!imageUrl?.trim()) return null;
  const raw = imageUrl.trim();
  if (raw.startsWith("/")) return raw;
  try {
    const url = new URL(raw);
    if (
      url.pathname.startsWith("/events/") ||
      url.pathname.startsWith("/og/") ||
      url.pathname.startsWith("/venues/")
    ) {
      return `${url.pathname}${url.search}`;
    }
    if (typeof window !== "undefined" && url.origin === window.location.origin) {
      return `${url.pathname}${url.search}`;
    }
  } catch {
    return null;
  }
  return null;
}
