import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const iconsDir = join(root, "public", "icons");

async function pngFromSvg(name, size, out) {
  const svg = readFileSync(join(iconsDir, name));
  await sharp(svg).resize(size, size).png().toFile(join(iconsDir, out));
  console.log(`wrote ${out}`);
}

await pngFromSvg("icon.svg", 192, "icon-192.png");
await pngFromSvg("icon.svg", 512, "icon-512.png");
await pngFromSvg("icon-maskable.svg", 512, "icon-512-maskable.png");
