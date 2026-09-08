/**
 * Resize / recompress venue heroes under public/venues/.
 * Keeps filenames (venue-images.ts maps slugs → files).
 *
 * Default: rewrite when the result is smaller.
 * FORCE_IMAGE_OPTIMIZE=1 also re-encodes when size is flat (e.g. strip metadata).
 */
import sharp from "sharp";
import {
  existsSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const venuesDir = join(root, "public", "venues");
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;
const PNG_QUALITY = 80;
/** Skip already-lean files so CI builds stay fast after the first compress. */
const SKIP_UNDER_BYTES = 220 * 1024;
const forceOptimize = process.env.FORCE_IMAGE_OPTIMIZE === "1";

if (!existsSync(venuesDir)) {
  console.log("public/venues/ not found — skipping optimize");
  process.exit(0);
}

let optimized = 0;
let skipped = 0;
let savedBytes = 0;

for (const file of readdirSync(venuesDir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;

  const input = join(venuesDir, file);
  const before = statSync(input).size;
  if (!forceOptimize && before <= SKIP_UNDER_BYTES) {
    skipped++;
    continue;
  }

  const tmp = `${input}.opt`;
  const meta = await sharp(input).metadata();

  let pipeline = sharp(input).rotate();
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "png") {
    await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmp);
  } else if (ext === "webp") {
    await pipeline.webp({ quality: WEBP_QUALITY }).toFile(tmp);
  } else {
    await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
  }

  const after = statSync(tmp).size;
  if (after >= before) {
    unlinkSync(tmp);
    skipped++;
    continue;
  }

  unlinkSync(input);
  renameSync(tmp, input);
  optimized++;
  savedBytes += before - after;
  console.log(
    `${file}: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`,
  );
}

console.log(
  `Optimized ${optimized} venue images (${skipped} unchanged), saved ${Math.round(savedBytes / 1024)}KB`,
);
