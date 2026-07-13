import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");
const appDir = join(root, "src", "app");
const jpegLogoPath = join(root, "popevent-images", "pop-home-logo.jpeg");
const transparentLogoPath = join(root, "popevent-images", "poplogo.png");
const headerLogoOut = join(root, "public", "poplogo-safe.png");

const whiteBackground = { r: 255, g: 255, b: 255, alpha: 1 };

// Prefer a transparent source image when available. Your `pop-home-logo.jpeg`
// has no alpha channel, so it would bake in a black background.
let logoPath = transparentLogoPath;
try {
  const meta = await sharp(jpegLogoPath).metadata();
  if (meta.hasAlpha) logoPath = jpegLogoPath;
} catch {
  // Ignore and keep transparentLogoPath
}

async function pngFromLogoFixedSize(width, height, outPath) {
  await sharp(logoPath)
    .resize(width, height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(outPath);
  console.log(`wrote ${outPath.replace(root + "/", "")}`);
}

const transparentBackground = { r: 0, g: 0, b: 0, alpha: 0 };
const wordmarkTopY = 320;

/** Tight square crop around the colorful P (excludes the POPEVENT wordmark). */
async function extractPMarkSquare() {
  const { data, info } = await sharp(logoPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      if (a > 20 && sat > 0.25 && max > 60 && y <= wordmarkTopY) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const pad = 6;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(width - 1, maxX + pad);
  maxY = Math.min(wordmarkTopY, maxY + pad);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const side = Math.max(cropWidth, cropHeight);
  const padTop = Math.round((side - cropHeight) / 2);
  const padLeft = Math.round((side - cropWidth) / 2);

  return sharp(logoPath)
    .extract({ left: minX, top: minY, width: cropWidth, height: cropHeight })
    .extend({
      top: padTop,
      bottom: side - cropHeight - padTop,
      left: padLeft,
      right: side - cropWidth - padLeft,
      background: transparentBackground,
    })
    .png()
    .toBuffer();
}

/** Cropped colorful "P" mark (no wordmark), scaled to a square icon. */
async function pMark(size, background = whiteBackground) {
  const square = await extractPMarkSquare();
  const inset = Math.round(size * 0.06);
  const inner = size - inset * 2;
  let pipeline = sharp(square);

  if (background.alpha === 1) {
    pipeline = pipeline.flatten({ background });
  }

  return pipeline
    .resize(inner, inner, {
      fit: "contain",
      background,
    })
    .extend({
      top: inset,
      bottom: inset,
      left: inset,
      right: inset,
      background,
    })
    .png()
    .toBuffer();
}

async function pwaIconFile(size, out, { inset = 0, background = whiteBackground } = {}) {
  const inner = size - inset * 2;
  const mark = await pMark(inner, background);
  await sharp(mark)
    .extend({
      top: inset,
      bottom: inset,
      left: inset,
      right: inset,
      background,
    })
    .png()
    .toFile(join(iconsDir, out));
  console.log(`wrote ${out}`);
}

mkdirSync(iconsDir, { recursive: true });
mkdirSync(appDir, { recursive: true });

// PWA / home-screen icons: single P mark on white.
await pwaIconFile(192, "icon-192.png");
await pwaIconFile(512, "icon-512.png");
await pwaIconFile(512, "icon-512-maskable.png", { inset: 52 });

// Site header logo (used by AppHeader) — full wordmark.
await pngFromLogoFixedSize(184, 166, headerLogoOut);

// Google SERP + browser favicon: square P mark, 48px minimum recommended size.
// Keep the logo's dark backdrop (no white letterboxing) for small tab icons.
const favicon48 = await pMark(48, transparentBackground);
writeFileSync(join(iconsDir, "icon-48.png"), favicon48);
console.log("wrote icon-48.png");

const favicon32 = await pMark(32, transparentBackground);
const favicon16 = await pMark(16, transparentBackground);
writeFileSync(join(appDir, "icon.png"), favicon48);
console.log("wrote src/app/icon.png");

const faviconIco = await pngToIco([favicon16, favicon32, favicon48]);
writeFileSync(join(appDir, "favicon.ico"), faviconIco);
writeFileSync(join(root, "public", "favicon.ico"), faviconIco);
console.log("wrote src/app/favicon.ico");
console.log("wrote public/favicon.ico");
