import sharp from "sharp";
import pngToIco from "png-to-ico";
import { mkdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");
const appDir = join(root, "src", "app");
const jpegLogoPath = join(root, "popevent-images", "pop-home-logo.jpeg");
const faviconPath = join(root, "popevent-images", "favicon.png");
const headerLogoOut = join(root, "public", "pop-home-logo.png");

const whiteBackground = { r: 255, g: 255, b: 255, alpha: 1 };
const transparentBackground = { r: 0, g: 0, b: 0, alpha: 0 };

/** Header mark from pop-home-logo.jpeg with black keyed to transparency. */
async function writeHeaderLogo() {
  const raw = await sharp(jpegLogoPath)
    .resize(368, 368, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data, info } = raw;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    // Near-black pixels from the JPEG backdrop → transparent.
    if (r < 28 && g < 28 && b < 28) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(headerLogoOut);
  console.log(`wrote ${headerLogoOut.replace(root + "/", "")}`);
}

/** Scale popevent-images/favicon.png to a square icon. */
async function iconFromFavicon(size, background = transparentBackground) {
  let pipeline = sharp(faviconPath);

  if (background.alpha === 1) {
    pipeline = pipeline.flatten({ background });
  }

  return pipeline
    .resize(size, size, {
      fit: "contain",
      background,
    })
    .png()
    .toBuffer();
}

async function pwaIconFile(size, out, { inset = 0, background = whiteBackground } = {}) {
  const inner = size - inset * 2;
  const mark = await iconFromFavicon(inner, background);
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

// Site header logo (used by AppHeader) — pop-home mark.
await writeHeaderLogo();

// Google SERP + browser favicon: square P mark, 48px minimum recommended size.
const favicon48 = await iconFromFavicon(48);
writeFileSync(join(iconsDir, "icon-48.png"), favicon48);
console.log("wrote icon-48.png");

const favicon32 = await iconFromFavicon(32);
const favicon16 = await iconFromFavicon(16);
writeFileSync(join(appDir, "icon.png"), favicon48);
console.log("wrote src/app/icon.png");

const faviconIco = await pngToIco([favicon16, favicon32, favicon48]);
writeFileSync(join(appDir, "favicon.ico"), faviconIco);
writeFileSync(join(root, "public", "favicon.ico"), faviconIco);
console.log("wrote src/app/favicon.ico");
console.log("wrote public/favicon.ico");
