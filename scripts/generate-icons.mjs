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

/** Cropped colorful "P" mark (no wordmark). */
async function pMark(size, background = whiteBackground) {
  const { width, height } = await sharp(logoPath).metadata();
  const cropHeight = Math.round(height * 0.72);
  return sharp(logoPath)
    .extract({ left: 0, top: 0, width, height: cropHeight })
    .resize(size, size, {
      fit: "contain",
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
const favicon48 = await pMark(48);
writeFileSync(join(iconsDir, "icon-48.png"), favicon48);
console.log("wrote icon-48.png");

const favicon32 = await pMark(32);
const favicon16 = await pMark(16);
writeFileSync(join(appDir, "icon.png"), favicon48);
console.log("wrote src/app/icon.png");

const faviconIco = await pngToIco([favicon16, favicon32, favicon48]);
writeFileSync(join(appDir, "favicon.ico"), faviconIco);
writeFileSync(join(root, "public", "favicon.ico"), faviconIco);
console.log("wrote src/app/favicon.ico");
console.log("wrote public/favicon.ico");
