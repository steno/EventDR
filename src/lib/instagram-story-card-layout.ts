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
/**
 * Card bottom stays ~1564 (same as the nudged layout). Top extends up into the
 * old “POP Events” band; IMAGE_H grows by the same amount so the flyer fills
 * that space — the whole card is not shifted up.
 */
export const CARD_Y = 72;
export const CARD_RADIUS = 48;
/**
 * Hero slot inside the cream card. Tall enough for ~4:5 flyers; taller 9:16
 * art letterboxes (contain) instead of cover-cropping title/phone bands.
 */
export const IMAGE_H = 1148;
/** Padding from hero bottom to first title line (server = glyph top; canvas ≈ baseline). */
export const TEXT_PAD_TOP = 28;
export const TITLE_LINE_STEP = 60;
export const TITLE_META_GAP = 12;
export const META_LINE_STEP = 44;
export const SITE_GAP = 24;
export const SITE_LINE_H = 36;
export const SITE_PAD_BOTTOM = 36;

/**
 * Cream text block under the hero. Feed cards use title + site only
 * (`metaLines = 0`) so the flyer can fill more of the card width.
 */
export function storyCardTextHeight(
  titleLines: number,
  metaLines = 0,
): number {
  const titles = Math.max(1, Math.min(3, titleLines));
  const metas = Math.max(0, Math.min(2, metaLines));
  return (
    TEXT_PAD_TOP +
    titles * TITLE_LINE_STEP +
    (metas > 0 ? TITLE_META_GAP + metas * META_LINE_STEP : 0) +
    SITE_GAP +
    SITE_LINE_H +
    SITE_PAD_BOTTOM
  );
}

/**
 * Card height hugs title/footer — no empty cream under pop-event.com.
 * Callers should pass the wrapped title line count for this event.
 */
export function storyCardHeight(titleLines: number, metaLines = 0): number {
  return IMAGE_H + storyCardTextHeight(titleLines, metaLines);
}

/** Flyer-filled cream card height on the 9:16 story canvas. */
export const CARD_H = IMAGE_H;

/** Instagram feed still (4:5). Spotlight + /api/ig-card use this frame. */
export const FEED_CARD_W = STORY_W;
export const FEED_CARD_H = 1350;
/** Inset so a thin brand gradient shows around the cream card. */
export const FEED_CARD_PAD = 56;

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
