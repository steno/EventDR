import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import {
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
  storyCardImageSrc,
  storyCardMetaLine,
  wrapTextLines,
} from "./instagram-story-card-layout";

export { storyCardImageSrc, wrapTextLines } from "./instagram-story-card-layout";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`story card image failed: ${src}`));
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/**
 * 9:16 page-preview card for Instagram Stories (hero + title + place).
 * The event description is copied separately for the feed/Reel caption.
 */
export async function buildInstagramStoryPreviewBlob(
  event: Event,
  locale: Locale,
): Promise<Blob | null> {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = STORY_W;
  canvas.height = STORY_H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, STORY_W, STORY_H);
  bg.addColorStop(0, STORY_COLORS.gradientFrom);
  bg.addColorStop(1, STORY_COLORS.gradientTo);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, STORY_W, STORY_H);

  const meta = storyCardMetaLine(event, locale);
  const titleLines = wrapTextLines(event.title, 28, 3);
  const metaLines = wrapTextLines(meta, 36, 2);
  const cardH = storyCardHeight(titleLines.length, metaLines.length);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 18;
  roundedRect(ctx, CARD_X, CARD_Y, CARD_W, cardH, CARD_RADIUS);
  ctx.fillStyle = STORY_COLORS.card;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, CARD_X, CARD_Y, CARD_W, cardH, CARD_RADIUS);
  ctx.clip();

  const imageSrc = storyCardImageSrc(event.imageUrl);
  if (imageSrc) {
    try {
      const img = await loadImage(imageSrc);
      drawCover(ctx, img, CARD_X, CARD_Y, CARD_W, IMAGE_H);
    } catch {
      ctx.fillStyle = STORY_COLORS.imageFallback;
      ctx.fillRect(CARD_X, CARD_Y, CARD_W, IMAGE_H);
    }
  } else {
    ctx.fillStyle = STORY_COLORS.imageFallback;
    ctx.fillRect(CARD_X, CARD_Y, CARD_W, IMAGE_H);
  }

  ctx.fillStyle = STORY_COLORS.card;
  ctx.fillRect(CARD_X, CARD_Y + IMAGE_H, CARD_W, cardH - IMAGE_H);
  ctx.restore();

  ctx.fillStyle = STORY_COLORS.title;
  ctx.textAlign = "left";
  ctx.font = "800 52px system-ui, sans-serif";
  // Canvas fillText uses baseline; TEXT_PAD_TOP is glyph-top on the server.
  let textY = CARD_Y + IMAGE_H + TEXT_PAD_TOP + 48;
  for (const line of titleLines) {
    ctx.fillText(line, CARD_X + 48, textY, CARD_W - 96);
    textY += TITLE_LINE_STEP;
  }

  ctx.font = "600 34px system-ui, sans-serif";
  ctx.fillStyle = STORY_COLORS.meta;
  textY += TITLE_META_GAP;
  for (const line of metaLines) {
    ctx.fillText(line, CARD_X + 48, textY, CARD_W - 96);
    textY += META_LINE_STEP;
  }

  ctx.font = "600 30px system-ui, sans-serif";
  ctx.fillStyle = STORY_COLORS.site;
  ctx.fillText(
    "pop-event.com",
    CARD_X + 48,
    Math.min(textY + SITE_GAP, CARD_Y + cardH - SITE_PAD_BOTTOM),
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
