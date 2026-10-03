/**
 * Recompress public images for limited mobile data.
 *
 * Phone enlarge is full-bleed. Try 1920px first (~2× a large phone). If the
 * file is still heavy, step the long edge down — resize is the lever when
 * MozJPEG alone cannot get a detailed photo under the budget. Each pass
 * encodes from the original, and the smallest result is kept.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve("public");
/** Long edge for photos opened full-screen on a phone. */
const PHOTO_LONG_EDGE = 1920;
const PHOTO_JPEG_QUALITY = 80;
const OG_JPEG_QUALITY = 82;
const MIN_SAVINGS_RATIO = 0.04;

const PHOTO_DIRS = new Set([
  "events",
  "venues",
  "categories",
  "cities",
  "cruise",
  "support",
]);

sharp.cache(false);
sharp.concurrency(4);

function rel(file) {
  return path.relative(ROOT, file);
}

function isBrandAsset(file) {
  const name = rel(file);
  if (name.startsWith("icons/")) return true;
  if (name.startsWith("events/restaurant-week-2026/logos/")) return true;
  if (/^(favicon|poplogo|poplogo-safe|popevent-logo|pop-home-logo)\./.test(name)) {
    return true;
  }
  return false;
}

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function jpegOptions(quality) {
  return {
    quality,
    mozjpeg: true,
    progressive: true,
    chromaSubsampling: "4:2:0",
    trellisQuantisation: true,
    overshootDeringing: true,
    optimiseScans: true,
    optimiseCoding: true,
  };
}

function outputFormat(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".png") return "png";
  if (ext === ".webp") return "webp";
  return "jpeg";
}

async function encode(file, input, kind, { maxEdge, quality }) {
  const meta = await sharp(input, { failOn: "none" }).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  const longEdge = Math.max(width, height);
  const format = outputFormat(file);

  if (kind === "lossless") {
    const base = sharp(input, { failOn: "none" }).rotate();
    if (format === "jpeg") return base.jpeg(jpegOptions(90)).toBuffer();
    if (format === "webp") return base.webp({ lossless: true, effort: 6 }).toBuffer();
    return base
      .png({ compressionLevel: 9, effort: 10, adaptiveFiltering: true })
      .toBuffer();
  }

  let pipeline = sharp(input, { failOn: "none" }).rotate();
  const downscale = longEdge > maxEdge;
  if (downscale) {
    pipeline = pipeline.resize({
      width: maxEdge,
      height: maxEdge,
      fit: "inside",
      withoutEnlargement: true,
      kernel: "lanczos3",
    });
    // Lanczos softens edges. A light unsharp mask puts that sharpness back
    // without the crunch of a stronger pass.
    pipeline = pipeline.sharpen({ sigma: 0.4, m1: 0.3, m2: 0.2 });
  }

  if (format === "png") {
    return pipeline
      .png({
        compressionLevel: 9,
        effort: 10,
        palette: true,
        quality: Math.min(95, quality + 12),
        dither: 0.6,
      })
      .toBuffer();
  }

  if (format === "webp") {
    return pipeline
      .webp({ quality, effort: 6, smartSubsample: true })
      .toBuffer();
  }

  return pipeline.jpeg(jpegOptions(quality)).toBuffer();
}

/**
 * 1920 stays sharp on a phone. 1600, then 1280, only when that file is still
 * over the byte budget. 1280 is the floor: below that, enlarge looks soft.
 */
function passesFor(kind) {
  if (kind === "og") {
    return [
      { maxEdge: 1200, quality: OG_JPEG_QUALITY },
      { maxEdge: 1200, quality: 74 },
    ];
  }
  return [
    { maxEdge: PHOTO_LONG_EDGE, quality: PHOTO_JPEG_QUALITY },
    { maxEdge: 1600, quality: 74 },
    { maxEdge: 1280, quality: 72 },
  ];
}

const PHOTO_BYTE_BUDGET = 180 * 1024;

function kindFor(file) {
  const name = rel(file);
  if (isBrandAsset(file)) return "lossless";
  if (name.startsWith("og/")) return "og";
  const top = name.split("/")[0];
  if (PHOTO_DIRS.has(top) || top.includes(".")) return "photo";
  // public/og-image.jpg lives at the root.
  return "photo";
}

async function compressFile(file) {
  const before = (await fs.stat(file)).size;
  const kind = kindFor(file);
  // Share cards were already encoded once; don't run MozJPEG over them again.
  if (kind === "og" && before <= 140 * 1024) {
    return { file, kind, before, after: before, skipped: true };
  }
  const input = await fs.readFile(file);
  let output;
  if (kind === "lossless") {
    output = await encode(file, input, kind, { maxEdge: 0, quality: 90 });
  } else {
    const budget = kind === "og" ? 140 * 1024 : PHOTO_BYTE_BUDGET;
    let best;
    for (const pass of passesFor(kind)) {
      const encoded = await encode(file, input, kind, pass);
      if (!best || encoded.length < best.length) best = encoded;
      if (encoded.length <= budget) {
        best = encoded;
        break;
      }
    }
    output = best;
  }
  const saved = before - output.length;
  if (saved < 2048 || saved / before < MIN_SAVINGS_RATIO) {
    return { file, kind, before, after: before, skipped: true };
  }
  const tmp = `${file}.compressing`;
  await fs.writeFile(tmp, output);
  await fs.rename(tmp, file);
  return { file, kind, before, after: output.length, skipped: false };
}

const files = await walk(ROOT);
let beforeTotal = 0;
let afterTotal = 0;
let changed = 0;
let skipped = 0;
let failed = 0;
const wins = [];

const queue = [...files];
async function worker() {
  for (;;) {
    const file = queue.shift();
    if (!file) return;
    try {
      const result = await compressFile(file);
      beforeTotal += result.before;
      afterTotal += result.after;
      if (result.skipped) skipped += 1;
      else {
        changed += 1;
        wins.push(result);
      }
    } catch (error) {
      failed += 1;
      console.error(`fail ${rel(file)}: ${error instanceof Error ? error.message : error}`);
    }
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));

wins.sort((a, b) => b.before - b.after - (a.before - a.after));
const mb = (n) => (n / 1048576).toFixed(1);

console.log(
  `changed ${changed}, skipped ${skipped}, failed ${failed}, files ${files.length}`,
);
console.log(
  `${mb(beforeTotal)} MB -> ${mb(afterTotal)} MB (saved ${mb(beforeTotal - afterTotal)} MB)`,
);
console.log("largest savings:");
for (const win of wins.slice(0, 12)) {
  const savedKb = Math.round((win.before - win.after) / 1024);
  console.log(
    `  -${savedKb} KB  ${Math.round(win.after / 1024)} KB  ${rel(win.file)}`,
  );
}
