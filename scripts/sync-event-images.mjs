import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "popevent-images");
const destDir = join(root, "public", "events");

/** popevent-images filename → event id */
const FILE_TO_EVENT_ID = {
  "MaleconOPenAir.JPG": "malecon-live-concert",
  "RumbleInParadise12.png": "rumble-in-paradise-12",
  "LAXSunsetSessions.JPG": "lax-sunset-daily",
  "MaleconFodKiosks.JPG": "malecon-kiosks-daily",
  "KiteBeachWindSession.JPG": "kite-beach-daily",
  "CabareteSunriseBeachYoga.JPG": "cabarete-yoga-daily",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "ElBateyOpenMic.JPG": "batey-open-mic-weekly",
  "SeaHorseSaturdayMarket.png": "sea-horse-saturday-market",
  "DominoNoightColmado.JPG": "community-domino-sosua",
  "CabaretePickleBallMeet.JPG": "community-pickleball-cabarete",
  "espadrillas.jpeg": "ingest-make-authentic-espadrilles-in-puerto-plata",
  "butterflyeffect.png": "ingest-18th-annual-cabarete-butterfly-effect",
  "cabclassic.jpg": "cabarete-classic-2026",
  "rafaella.png": "cabarete-pilates-reformer",
  "campamento.jpg": "inicio-del-campamento-pp-2026",
  "el-carey-wc2026.png": "el-carey-wc2026",
};

if (!existsSync(sourceDir)) {
  console.log("popevent-images/ not found — skipping sync");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });

const files = readdirSync(sourceDir);
let copied = 0;

function destExtension(filename) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : ".jpg";
}

for (const [filename, eventId] of Object.entries(FILE_TO_EVENT_ID)) {
  const src = join(sourceDir, filename);
  if (!existsSync(src)) {
    const match = files.find((f) => f.toLowerCase() === filename.toLowerCase());
    if (!match) {
      console.warn(`missing source: ${filename}`);
      continue;
    }
    const ext = destExtension(match);
    copyFileSync(join(sourceDir, match), join(destDir, `${eventId}${ext}`));
    copied++;
    console.log(`${match} → events/${eventId}${ext}`);
    continue;
  }
  const ext = destExtension(filename);
  copyFileSync(src, join(destDir, `${eventId}${ext}`));
  copied++;
  console.log(`${filename} → events/${eventId}${ext}`);
}

console.log(`Synced ${copied} event images to public/events/`);
