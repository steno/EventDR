/**
 * Copies the MapLibre module worker into /public so the map never depends on
 * a third-party CDN at runtime (faster + CSP-simple on Netlify).
 */
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(
  root,
  "node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs",
);
const dest = join(root, "public/maplibre-gl-worker.mjs");

if (!existsSync(src)) {
  console.warn(`[copy-maplibre-worker] missing ${src} — skip`);
  process.exit(0);
}

mkdirSync(dirname(dest), { recursive: true });
copyFileSync(src, dest);
console.log(`[copy-maplibre-worker] → ${dest}`);
