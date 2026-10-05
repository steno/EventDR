import sharp from "sharp";
import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { SITE_URL } from "./site-url";
import {
  CARD_H,
  CARD_RADIUS,
  CARD_W,
  CARD_X,
  CARD_Y,
  IMAGE_H,
  STORY_COLORS,
  STORY_H,
  STORY_W,
  storyCardMetaLine,
  wrapTextLines,
} from "./instagram-story-card-layout";

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absoluteImageUrl(raw: string | undefined, origin = SITE_URL): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (value.startsWith("/")) return `${origin.replace(/\/$/, "")}${value}`;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return undefined;
    return parsed.toString();
  } catch {
    return undefined;
  }
}

async function fetchImageBuffer(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "POP-Events-StoryCard/1.0" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return null;
    const bytes = Buffer.from(await response.arrayBuffer());
    return bytes.length ? bytes : null;
  } catch {
    return null;
  }
}

function roundedRectSvg(
  width: number,
  height: number,
  radius: number,
  fill: string,
): Buffer {
  const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}"/>
</svg>`;
  return Buffer.from(svg);
}

function textOverlaySvg(title: string, meta: string): Buffer {
  const titleLines = wrapTextLines(title, 28, 3);
  const metaLines = wrapTextLines(meta, 36, 2);
  let y = IMAGE_H + 88;
  const titleSpans = titleLines
    .map((line) => {
      const span = `<text x="48" y="${y}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="52" font-weight="800" fill="${STORY_COLORS.title}">${escapeXml(line)}</text>`;
      y += 64;
      return span;
    })
    .join("\n");
  y += 16;
  const metaSpans = metaLines
    .map((line) => {
      const span = `<text x="48" y="${y}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="36" font-weight="600" fill="${STORY_COLORS.meta}">${escapeXml(line)}</text>`;
      y += 48;
      return span;
    })
    .join("\n");
  const siteY = CARD_H - 48;
  const svg = `<svg width="${CARD_W}" height="${CARD_H}" xmlns="http://www.w3.org/2000/svg">
  ${titleSpans}
  ${metaSpans}
  <text x="48" y="${siteY}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="32" font-weight="600" fill="${STORY_COLORS.site}">pop-event.com</text>
</svg>`;
  return Buffer.from(svg);
}

/**
 * Server-side 9:16 POP story card — same layout as Share → Instagram
 * (`buildInstagramStoryPreviewBlob`).
 */
export async function buildInstagramStoryCardPng(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  const meta = storyCardMetaLine(event, locale);
  const imageUrl = absoluteImageUrl(event.imageUrl, origin);

  let hero = await sharp({
    create: {
      width: CARD_W,
      height: IMAGE_H,
      channels: 3,
      background: STORY_COLORS.imageFallback,
    },
  })
    .png()
    .toBuffer();

  if (imageUrl) {
    const raw = await fetchImageBuffer(imageUrl);
    if (raw) {
      try {
        hero = await sharp(raw)
          .rotate()
          .resize(CARD_W, IMAGE_H, { fit: "cover", position: "centre" })
          .png()
          .toBuffer();
      } catch {
        /* keep fallback */
      }
    }
  }

  const cardBase = await sharp({
    create: {
      width: CARD_W,
      height: CARD_H,
      channels: 3,
      background: STORY_COLORS.card,
    },
  })
    .composite([
      { input: hero, top: 0, left: 0 },
      { input: textOverlaySvg(event.title, meta), top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  const roundMask = await sharp(roundedRectSvg(CARD_W, CARD_H, CARD_RADIUS, "#fff"))
    .png()
    .toBuffer();

  const roundedCard = await sharp(cardBase)
    .composite([{ input: roundMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Soft drop shadow under the card (matches canvas shadowBlur ~36).
  const shadow = await sharp(
    roundedRectSvg(CARD_W, CARD_H, CARD_RADIUS, "rgba(0,0,0,0.22)"),
  )
    .blur(18)
    .png()
    .toBuffer();

  const background = Buffer.from(`<svg width="${STORY_W}" height="${STORY_H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${STORY_COLORS.gradientFrom}"/>
      <stop offset="100%" stop-color="${STORY_COLORS.gradientTo}"/>
    </linearGradient>
  </defs>
  <rect width="${STORY_W}" height="${STORY_H}" fill="url(#bg)"/>
  <text x="${STORY_W / 2}" y="180" text-anchor="middle" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="42" font-weight="700" fill="${STORY_COLORS.brand}">POP Events</text>
</svg>`);

  return sharp(background)
    .composite([
      { input: shadow, top: CARD_Y + 18, left: CARD_X },
      { input: roundedCard, top: CARD_Y, left: CARD_X },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

/** @deprecated Prefer buildInstagramStoryCardPng — kept name clarity for callers. */
export async function buildInstagramStoryCardJpeg(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  return buildInstagramStoryCardPng(event, locale, origin);
}
