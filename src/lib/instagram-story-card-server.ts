import sharp from "sharp";
import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { SITE_URL } from "./site-url";
import {
  CARD_RADIUS,
  CARD_W,
  CARD_X,
  CARD_Y,
  FEED_CARD_H,
  FEED_CARD_PAD,
  FEED_CARD_W,
  IMAGE_H,
  STORY_COLORS,
  STORY_H,
  STORY_W,
} from "./instagram-story-card-layout";

export { FEED_CARD_H, FEED_CARD_W } from "./instagram-story-card-layout";

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

/**
 * Load flyer bytes over HTTP only. Do not `path.join(process.cwd(), …)` —
 * NFT/Turbopack then traces the whole repo into Netlify’s server handler and
 * deploy fails with “request body too large”. Pass `request.nextUrl.origin`
 * from `/api/ig-card` so localhost fetches the same host.
 */
async function loadImageBuffer(
  raw: string | undefined,
  origin = SITE_URL,
): Promise<Buffer | null> {
  const url = absoluteImageUrl(raw, origin);
  if (!url) return null;
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

/**
 * Largest box inside maxW×maxH that matches the flyer aspect — so the art can
 * fill the cream card with no letterbox bars (orange frame absorbs leftover).
 */
function cardSizeForFlyer(
  flyerW: number,
  flyerH: number,
  maxW: number,
  maxH: number,
): { width: number; height: number } {
  const fw = Math.max(1, flyerW);
  const fh = Math.max(1, flyerH);
  const scale = Math.min(maxW / fw, maxH / fh);
  return {
    width: Math.max(1, Math.round(fw * scale)),
    height: Math.max(1, Math.round(fh * scale)),
  };
}

async function flyerFillBuffer(
  raw: Buffer | null,
  width: number,
  height: number,
): Promise<Buffer> {
  if (!raw) {
    return sharp({
      create: {
        width,
        height,
        channels: 3,
        background: STORY_COLORS.card,
      },
    })
      .png()
      .toBuffer();
  }

  // Exact card size matches flyer AR — fill, no cream bars.
  return sharp(raw)
    .rotate()
    .resize(width, height, { fit: "fill" })
    .png()
    .toBuffer();
}

/**
 * Orange frame + cream-rounded flyer card sized to the art (no inner letterbox).
 */
async function composeBrandCard(opts: {
  event: Event;
  origin: string;
  canvasW: number;
  canvasH: number;
  maxCardW: number;
  maxCardH: number;
  /** Preferred top-left when the card is smaller than the max box (story). */
  preferCardX?: number;
  preferCardY?: number;
}): Promise<Buffer> {
  const raw = await loadImageBuffer(opts.event.imageUrl, opts.origin);
  let flyerW = opts.maxCardW;
  let flyerH = opts.maxCardH;
  if (raw) {
    try {
      const meta = await sharp(raw).rotate().metadata();
      if (meta.width && meta.height) {
        flyerW = meta.width;
        flyerH = meta.height;
      }
    } catch {
      /* use max box */
    }
  }

  const { width: cardW, height: cardH } = cardSizeForFlyer(
    flyerW,
    flyerH,
    opts.maxCardW,
    opts.maxCardH,
  );
  const cardX =
    opts.preferCardX != null && cardW === opts.maxCardW
      ? opts.preferCardX
      : Math.round((opts.canvasW - cardW) / 2);
  const cardY =
    opts.preferCardY != null && cardH === opts.maxCardH
      ? opts.preferCardY
      : Math.round((opts.canvasH - cardH) / 2);

  const radius = Math.min(CARD_RADIUS, Math.floor(Math.min(cardW, cardH) / 8));
  const hero = await flyerFillBuffer(raw, cardW, cardH);

  const roundMask = await sharp(
    roundedRectSvg(cardW, cardH, radius, "#fff"),
  )
    .png()
    .toBuffer();

  const roundedCard = await sharp(hero)
    .ensureAlpha()
    .composite([{ input: roundMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  const shadow = await sharp(
    roundedRectSvg(cardW, cardH, radius, "rgba(0,0,0,0.22)"),
  )
    .blur(18)
    .png()
    .toBuffer();

  const background = Buffer.from(`<svg width="${opts.canvasW}" height="${opts.canvasH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${STORY_COLORS.gradientFrom}"/>
      <stop offset="100%" stop-color="${STORY_COLORS.gradientTo}"/>
    </linearGradient>
  </defs>
  <rect width="${opts.canvasW}" height="${opts.canvasH}" fill="url(#bg)"/>
</svg>`);

  return sharp(background)
    .composite([
      { input: shadow, top: cardY + 18, left: cardX },
      { input: roundedCard, top: cardY, left: cardX },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
}

/**
 * Server-side 9:16 POP story card — flyer fills a cream card matched to its AR.
 */
export async function buildInstagramStoryCardPng(
  event: Event,
  _locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  return composeBrandCard({
    event,
    origin,
    canvasW: STORY_W,
    canvasH: STORY_H,
    maxCardW: CARD_W,
    maxCardH: IMAGE_H,
    preferCardX: CARD_X,
    preferCardY: CARD_Y,
  });
}

/**
 * Feed photo (4:5). Cream card matches flyer aspect — no cream letterbox bars.
 */
export async function buildInstagramFeedCardJpeg(
  event: Event,
  _locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  return composeBrandCard({
    event,
    origin,
    canvasW: FEED_CARD_W,
    canvasH: FEED_CARD_H,
    maxCardW: FEED_CARD_W - FEED_CARD_PAD * 2,
    maxCardH: FEED_CARD_H - FEED_CARD_PAD * 2,
  });
}

/** @deprecated Prefer buildInstagramStoryCardPng — kept name clarity for callers. */
export async function buildInstagramStoryCardJpeg(
  event: Event,
  locale: Locale,
  origin = SITE_URL,
): Promise<Buffer> {
  return buildInstagramStoryCardPng(event, locale, origin);
}
