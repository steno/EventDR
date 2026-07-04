import sharp from "sharp";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");
const logoPath = join(root, "popevent-images", "poplogo.png");

async function pngFromLogo(size, out, inset = 0) {
  const resizeTo = size - inset * 2;
  await sharp(logoPath)
    .resize(resizeTo, resizeTo, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: inset,
      bottom: inset,
      left: inset,
      right: inset,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(join(iconsDir, out));
  console.log(`wrote ${out}`);
}

mkdirSync(iconsDir, { recursive: true });

await pngFromLogo(192, "icon-192.png");
await pngFromLogo(512, "icon-512.png");
await pngFromLogo(512, "icon-512-maskable.png", 52);
