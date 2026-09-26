import type { Locale } from "@/i18n/config";
import type { Event } from "./types";
import { formatEventPlace } from "./event-location";
import { formatEventDateRange } from "./format-date";

const STORY_W = 1080;
const STORY_H = 1920;
const CARD_PAD = 72;
const CARD_W = STORY_W - CARD_PAD * 2;
const CARD_X = CARD_PAD;
const CARD_Y = 300;
const CARD_H = 1180;
const CARD_RADIUS = 48;
const IMAGE_H = 640;

/** Same-origin (or /events|/og path) so the canvas is not tainted. */
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
 * The event URL is copied separately so the user can add a Link sticker.
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
  bg.addColorStop(0, "#f97316");
  bg.addColorStop(1, "#be123c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, STORY_W, STORY_H);

  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = "700 42px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("POP Events", STORY_W / 2, 180);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.22)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 18;
  roundedRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.fillStyle = "#fff7ed";
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRect(ctx, CARD_X, CARD_Y, CARD_W, CARD_H, CARD_RADIUS);
  ctx.clip();

  const imageSrc = storyCardImageSrc(event.imageUrl);
  if (imageSrc) {
    try {
      const img = await loadImage(imageSrc);
      drawCover(ctx, img, CARD_X, CARD_Y, CARD_W, IMAGE_H);
    } catch {
      ctx.fillStyle = "#fed7aa";
      ctx.fillRect(CARD_X, CARD_Y, CARD_W, IMAGE_H);
    }
  } else {
    ctx.fillStyle = "#fed7aa";
    ctx.fillRect(CARD_X, CARD_Y, CARD_W, IMAGE_H);
  }

  ctx.fillStyle = "#fff7ed";
  ctx.fillRect(CARD_X, CARD_Y + IMAGE_H, CARD_W, CARD_H - IMAGE_H);
  ctx.restore();

  const when = formatEventDateRange(event.date, locale, {
    endDate: event.endDate,
    short: true,
  });
  const meta = [when, event.time, formatEventPlace(event)]
    .filter((part) => part && String(part).trim())
    .join(" · ");

  ctx.fillStyle = "#7c2d12";
  ctx.textAlign = "left";
  ctx.font = "800 52px system-ui, sans-serif";
  const titleLines = wrapTextLines(event.title, 28, 3);
  let textY = CARD_Y + IMAGE_H + 88;
  for (const line of titleLines) {
    ctx.fillText(line, CARD_X + 48, textY, CARD_W - 96);
    textY += 64;
  }

  ctx.font = "600 36px system-ui, sans-serif";
  ctx.fillStyle = "#9a3412";
  const metaLines = wrapTextLines(meta, 36, 2);
  textY += 16;
  for (const line of metaLines) {
    ctx.fillText(line, CARD_X + 48, textY, CARD_W - 96);
    textY += 48;
  }

  ctx.font = "600 32px system-ui, sans-serif";
  ctx.fillStyle = "#c2410c";
  ctx.fillText("pop-event.com", CARD_X + 48, CARD_Y + CARD_H - 48);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
