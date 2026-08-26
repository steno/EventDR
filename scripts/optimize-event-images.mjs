import sharp from "sharp";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  statSync,
  unlinkSync,
} from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDir = join(root, "public", "events");
const ogDir = join(root, "public", "og", "events");
const syncScript = join(root, "scripts", "sync-event-images.mjs");
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_BACKGROUND = { r: 10, g: 10, b: 10 };
/** Re-encode catalog JPEGs / rewrite existing OG only when explicitly requested. */
const forceOptimize = process.env.FORCE_IMAGE_OPTIMIZE === "1";

function syncedEventFiles() {
  const source = readFileSync(syncScript, "utf8");
  const files = new Set();
  for (const match of source.matchAll(/^\s*"[^"]+":\s*"([a-z0-9-]+)"/gm)) {
    const eventId = match[1];
    files.add(`${eventId}.jpg`);
    files.add(`${eventId}.jpeg`);
    files.add(`${eventId}.png`);
  }
  return files;
}

if (!existsSync(eventsDir)) {
  console.log("public/events/ not found — skipping optimize");
  process.exit(0);
}

const targets = syncedEventFiles();
let optimized = 0;
let skipped = 0;
let savedBytes = 0;

for (const file of readdirSync(eventsDir)) {
  if (!targets.has(file)) continue;
  if (!/\.(jpe?g)$/i.test(file)) continue;

  const input = join(eventsDir, file);
  // Committed catalog stays as-is. New files are sized at sync time.
  if (!forceOptimize) {
    skipped++;
    continue;
  }

  const before = statSync(input).size;
  const tmp = `${input}.opt`;
  const meta = await sharp(input).metadata();

  let pipeline = sharp(input).rotate();
  if ((meta.width ?? 0) > MAX_WIDTH) {
    pipeline = pipeline.resize(MAX_WIDTH, null, { withoutEnlargement: true });
  }

  await pipeline
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(tmp);

  const after = statSync(tmp).size;
  if (after >= before) {
    unlinkSync(tmp);
    continue;
  }

  unlinkSync(input);
  renameSync(tmp, input);
  optimized++;
  savedBytes += before - after;
  console.log(`${file}: ${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB`);
}

mkdirSync(ogDir, { recursive: true });
let ogWritten = 0;

for (const file of readdirSync(eventsDir)) {
  if (!/\.(jpe?g|png|webp)$/i.test(file)) continue;
  const input = join(eventsDir, file);
  const stem = file.replace(/\.(jpe?g|png|webp)$/i, "");
  const output = join(ogDir, `${stem}.jpg`);

  if (existsSync(output) && process.env.FORCE_IMAGE_OPTIMIZE !== "1") {
    continue;
  }

  // No mozjpeg: it always writes progressive JPEGs, which Facebook's crawler
  // often fails to decode. OG must be baseline 1200×630.
  await sharp(input)
    .rotate()
    .resize(OG_WIDTH, OG_HEIGHT, {
      fit: "contain",
      background: OG_BACKGROUND,
    })
    .jpeg({ quality: 84, progressive: false })
    .toFile(output);
  ogWritten++;
  console.log(`og ${stem}.jpg`);
}

console.log(
  `Optimized ${optimized} JPEG images (${skipped} kept committed), saved ${Math.round(savedBytes / 1024)}KB; wrote ${ogWritten} Facebook OG images`,
);
