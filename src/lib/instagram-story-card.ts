import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import {
  CARD_RADIUS,
  CARD_W,
  CARD_Y,
  IMAGE_H,
  STORY_COLORS,
  STORY_H,
  STORY_W,
  storyCardImageSrc,
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
 * 9:16 page-preview — cream card sized to the flyer (no letterbox bars).
 * Title/place go in the caption.
 */
export async function buildInstagramStoryPreviewBlob(
  event: Event,
  _locale: Locale,
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

  let cardW = CARD_W;
  let cardH = IMAGE_H;
  let img: HTMLImageElement | null = null;
  const imageSrc = storyCardImageSrc(event.imageUrl);
  if (imageSrc) {
    try {
      img = await loadImage(imageSrc);
      const scale = Math.min(CARD_W / img.naturalWidth, IMAGE_H / img.naturalHeight);
      cardW = Math.max(1, Math.round(img.naturalWidth * scale));
      cardH = Math.max(1, Math.round(img.naturalHeight * scale));
    } catch {
      img = null;
    }
  }

  const cardX = Math.round((STORY_W - cardW) / 2);
  const cardY =
    cardH === IMAGE_H ? CARD_Y : Math.round((STORY_H - cardH) / 2);
  const radius = Math.min(CARD_RADIUS, Math.floor(Math.min(cardW, cardH) / 8));

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 18;
  roundedRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.fillStyle = STORY_COLORS.card;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, cardX, cardY, cardW, cardH, radius);
  ctx.clip();
  if (img) {
    ctx.drawImage(img, cardX, cardY, cardW, cardH);
  } else {
    ctx.fillStyle = STORY_COLORS.imageFallback;
    ctx.fillRect(cardX, cardY, cardW, cardH);
  }
  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
