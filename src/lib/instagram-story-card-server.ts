import { existsSync } from "node:fs";
import path from "node:path";
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
  META_LINE_STEP,
  SITE_GAP,
  SITE_PAD_BOTTOM,
  STORY_COLORS,
  STORY_H,
  STORY_W,
  TEXT_PAD_TOP,
  TITLE_LINE_STEP,
  TITLE_META_GAP,
  storyCardHeight,
  storyCardMetaLine,
  wrapTextLines,
} from "./instagram-story-card-layout";

/**
 * Vendored Inter TTFs — Netlify/Linux has no usable system fonts for sharp SVG
 * `<text>`, which rendered as tofu boxes on spotlight cards. sharp's `fontfile`
 * path bypasses fontconfig discovery.
 */
const FONTS_DIR = path.join(process.cwd(), "assets", "fonts");
const FONT_BOLD = path.join(FONTS_DIR, "Inter-Bold.ttf");
const FONT_SEMIBOLD = path.join(FONTS_DIR, "Inter-SemiBold.ttf");

function escapePango(value: string): string {
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

function resolveFont(file: string): string {
  if (!existsSync(file)) {
    throw new Error(`IG card font missing: ${file}`);
  }
  return file;
}

/** Pango size is 1024ths of a point; at 72dpi that ≈ CSS pixels. */
async function renderTextLine(opts: {
  text: string;
  fontfile: string;
  px: number;
  color: string;
  maxWidth: number;
}): Promise<{ buffer: Buffer; width: number; height: number }> {
  const size = Math.round(opts.px * 1024);
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${opts.color}" size="${size}">${escapePango(opts.text)}</span>`,
      font: "Inter",
      fontfile: opts.fontfile,
      width: opts.maxWidth,
      rgba: true,
      dpi: 72,
      align: "left",
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { buffer: data, width: info.width ?? 0, height: info.height ?? 0 };
}

type CompositeInput = { input: Buffer; top: number; left: number };

async function cardTextComposites(
  title: string,
  meta: string,
  cardH: number,
): Promise<CompositeInput[]> {
  const bold = resolveFont(FONT_BOLD);
  const semibold = resolveFont(FONT_SEMIBOLD);
  const textWidth = CARD_W - 96;
  const layers: CompositeInput[] = [];

  let y = IMAGE_H + TEXT_PAD_TOP;
  for (const line of wrapTextLines(title, 28, 3)) {
    const rendered = await renderTextLine({
      text: line,
      fontfile: bold,
      px: 52,
      color: STORY_COLORS.title,
      maxWidth: textWidth,
    });
    layers.push({ input: rendered.buffer, top: y, left: 48 });
    y += TITLE_LINE_STEP;
  }

  y += TITLE_META_GAP;
  for (const line of wrapTextLines(meta, 36, 2)) {
    const rendered = await renderTextLine({
      text: line,
      fontfile: semibold,
      px: 34,
      color: STORY_COLORS.meta,
      maxWidth: textWidth,
    });
    layers.push({ input: rendered.buffer, top: y, left: 48 });
    y += META_LINE_STEP;
  }

  const site = await renderTextLine({
    text: "pop-event.com",
    fontfile: semibold,
    px: 30,
    color: STORY_COLORS.site,
    maxWidth: textWidth,
  });
  layers.push({
    input: site.buffer,
    top: Math.min(y + SITE_GAP, cardH - SITE_PAD_BOTTOM - site.height),
    left: 48,
  });

  return layers;
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
  const titleLines = wrapTextLines(event.title, 28, 3);
  const metaLines = wrapTextLines(meta, 36, 2);
  const cardH = storyCardHeight(titleLines.length, metaLines.length);
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

  const textLayers = await cardTextComposites(event.title, meta, cardH);

  const cardBase = await sharp({
    create: {
      width: CARD_W,
      height: cardH,
      channels: 3,
      background: STORY_COLORS.card,
    },
  })
    .composite([{ input: hero, top: 0, left: 0 }, ...textLayers])
    .png()
    .toBuffer();

  const roundMask = await sharp(roundedRectSvg(CARD_W, cardH, CARD_RADIUS, "#fff"))
    .png()
    .toBuffer();

  const roundedCard = await sharp(cardBase)
    .composite([{ input: roundMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Soft drop shadow under the card (matches canvas shadowBlur ~36).
  const shadow = await sharp(
    roundedRectSvg(CARD_W, cardH, CARD_RADIUS, "rgba(0,0,0,0.22)"),
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
</svg>`);

  return sharp(background)
    .composite([
      { input: shadow, top: CARD_Y + 18, left: CARD_X },
      { input: roundedCard, top: CARD_Y, left: CARD_X },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

/**
 * Feed photo (4:5). Instagram rejects the full 9:16 share card on a feed post.
 * Crops the story frame to the card (photo + title + meta), dropping empty
 * gradient below. Top is clamped so a top-aligned card still fits.
 */
export const FEED_CARD_W = STORY_W;
export const FEED_CARD_H = 1350;
const FEED_CARD_TOP = Math.max(0, CARD_Y + CARD_H - FEED_CARD_H);

export async function buildInstagramFeedCardJpeg(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  const story = await buildInstagramStoryCardPng(event, locale, origin);
  return sharp(story)
    .extract({
      left: 0,
      top: FEED_CARD_TOP,
      width: FEED_CARD_W,
      height: FEED_CARD_H,
    })
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
