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
  "CabareteSunriseBeachYoga.JPG": "liquid-blue-sunrise-yoga",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "ElBateyOpenMic.JPG": "batey-open-mic-weekly",
  "HardRockWeekends.jpg": "hard-rock-weekends",
  "HardRockBilledConcerts.jpg": "hard-rock-billed-concerts",
  "CastawaysClassicRock.jpg": "castaways-classic-rock-wednesday",
  "VoramarFridayLive.jpg": "voramar-friday-live",
  "SmileysSaturdayLive.jpg": "smileys-saturday-live",
  "FinishLineLiveWednesday.jpg": "finish-line-live-wednesday",
  "SosuaBeachLiveWeekends.jpg": "sosua-beach-live-weekends",
  "CheersWeeklyLive.jpg": "cheers-weekly-live",
  "SenorRockLiveNight.jpg": "senor-rock-live-nightly",
  "CremoSalsaFriday.jpg": "cremo-salsa-friday",
  "CremoBohemianWednesday.jpg": "cremo-bohemian-wednesday",
  "CremoKaraokeSaturday.jpg": "cremo-karaoke-saturday",
  "BigLeesWeekendMusic.jpg": "big-lees-weekend-music",
  "SeaHorseSaturdayMarket.png": "sea-horse-saturday-market",
  "DominoNoightColmado.JPG": "community-domino-sosua",
  "CabaretePickleBallMeet.JPG": "community-pickleball-cabarete",
  "espadrillas.jpeg": "ingest-make-authentic-espadrilles-in-puerto-plata",
  "butterflyeffect.png": "ingest-18th-annual-cabarete-butterfly-effect",
  "cabclassic.jpg": "cabarete-classic-2026",
  "rafaella.png": "cabarete-pilates-reformer",
  "campamento.jpg": "inicio-del-campamento-pp-2026",
  "Feria-artesanal-Puerto-Plata-julio-2026-lead.jpg":
    "feria-artesanal-verano-2026",
  "el-carey-wc2026.png": "el-carey-wc2026",
  "el-colibri-karaoke-battle-2026.png": "el-colibri-karaoke-battle-2026",
  "oceanworld.jpeg": "ocean-world-daily",
  "Damajagua.jpeg": "charcos-damajagua-daily",
  "fortaleza.jpeg": "fortaleza-san-felipe-daily",
  "museoambar.jpeg": "museo-ambar-weekdays",
  "teleferico.jpeg": "teleferico-puerto-plata-daily",
  "cayoarena.jpeg": "cayo-arena-tours-daily",
  "paseodonablanca.jpeg": "paseo-dona-blanca-daily",
  "callesombrillas.jpeg": "calle-sombrillas-daily",
  "funcity.jpeg": "fun-city-daily",
  "monkeyland.jpeg": "monkeyland-puerto-plata-daily",
  "coconut-cove-zipline.jpeg": "coconut-cove-ocean-zipline-daily",
  "brugal-rum-center.jpeg": "brugal-rum-center-weekdays",
  "freestyle-catamaran.jpeg": "freestyle-catamaran-daily",
  "outback-safari.jpeg": "outback-safari-daily",
  "cremo-friday-salsa-dance.jpg": "cremo-friday-salsa-dance",
  "anfiteatro-la-puntilla-concerts.jpg": "anfiteatro-la-puntilla-concerts",
  "el-carey-weekend-nightlife.jpg": "el-carey-weekend-nightlife",
  "anfiteatro-cultural-performances.jpg": "anfiteatro-cultural-performances",
  "sosua-jewish-museum-hours.jpg": "sosua-jewish-museum-hours",
  "sosua-diving-adventures-daily.jpg": "sosua-diving-adventures-daily",
  "el-batey-weekend-nightlife.jpg": "el-batey-weekend-nightlife",
  "d-classico-merengue-nights.jpg": "d-classico-merengue-nights",
  "sosua-pedro-clisante-food-nights.jpg": "sosua-pedro-clisante-food-nights",
  "natura-cabana-yoga-daily.jpg": "natura-cabana-yoga-daily",
  "north-coast-networking-saturday.jpg": "north-coast-networking-saturday",
  "ojo-latin-night-thursday.jpg": "ojo-latin-night-thursday",
  "ojo-weekend-dj-parties.jpg": "ojo-weekend-dj-parties",
  "la-casita-papi-beach-dining.jpg": "la-casita-papi-beach-dining",
  "liquid-blue-watersports-daily.jpg": "liquid-blue-watersports-daily",
  "lax-headline-concerts.jpg": "lax-headline-concerts",
  "voyvoy-monday-live-music.jpg": "voyvoy-monday-live-music",
  "kite-beach-wind-culture.jpg": "kite-beach-wind-culture",
  "north-coast-tech-meetup.jpg": "north-coast-tech-meetup",
  "sea-horse-saturday-artisan-fair.png": "sea-horse-saturday-artisan-fair",
  "puerto-plata-carnaval-2026.jpg": "puerto-plata-carnaval-2026",
  "malecon-morning-wellness-walk.jpg": "malecon-morning-wellness-walk",
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
