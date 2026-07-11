import sharp from "sharp";
import { existsSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const eventsDir = join(root, "public", "events");
const syncScript = join(root, "scripts", "sync-event-images.mjs");
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 82;

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
let savedBytes = 0;

for (const file of readdirSync(eventsDir)) {
  if (!targets.has(file)) continue;
  if (!/\.(jpe?g)$/i.test(file)) continue;

  const input = join(eventsDir, file);
  const before = statSync(input).size;
  const tmp = `${input}.opt`;

  let pipeline = sharp(input).rotate();
  const meta = await pipeline.metadata();
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

console.log(
  `Optimized ${optimized} JPEG images, saved ${Math.round(savedBytes / 1024)}KB`,
);
