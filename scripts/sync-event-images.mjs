import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "popevent-images");
const destDir = join(root, "public", "events");
const venuesDir = join(root, "public", "venues");

/**
 * popevent-images filename → event id.
 * Prefer `{eventId}.jpg` files produced by fetch-venue-images.mjs when present.
 */
const FILE_TO_EVENT_ID = {
  // --- Fetched / venue-accurate ({eventId}.jpg) ---
  "malecon-morning-wellness-walk.jpg": "malecon-morning-wellness-walk",
  "anfiteatro-la-puntilla-concerts.jpg": "anfiteatro-la-puntilla-concerts",
  "anfiteatro-cultural-performances.jpg": "anfiteatro-cultural-performances",
  "hard-rock-billed-concerts.jpg": "hard-rock-billed-concerts",
  "sosua-jewish-museum-hours.jpg": "sosua-jewish-museum-hours",
  "sosua-diving-adventures-daily.jpg": "sosua-diving-adventures-daily",
  "sosua-pedro-clisante-food-nights.jpg": "sosua-pedro-clisante-food-nights",
  "sosua-beach-live-weekends.jpg": "sosua-beach-live-weekends",
  "smileys-saturday-live.jpg": "smileys-saturday-live",
  "finish-line-live-wednesday.jpg": "finish-line-live-wednesday",
  "liquid-blue-sunrise-yoga.jpg": "liquid-blue-sunrise-yoga",
  "natura-cabana-yoga-daily.jpg": "natura-cabana-yoga-daily",
  "liquid-blue-watersports-daily.jpg": "liquid-blue-watersports-daily",
  "sea-horse-saturday-artisan-fair.jpg": "sea-horse-saturday-artisan-fair",
  "la-casita-papi-beach-dining.jpg": "la-casita-papi-beach-dining",
  "kite-beach-wind-culture.jpg": "kite-beach-wind-culture",
  "d-classico-merengue-nights.jpg": "d-classico-merengue-nights",
  "el-carey-weekend-nightlife.jpg": "el-carey-weekend-nightlife",
  "coconut-cove-ocean-zipline-daily.jpg": "coconut-cove-ocean-zipline-daily",
  "freestyle-catamaran-daily.jpg": "freestyle-catamaran-daily",
  "womens-reconnection-kite-camp-2026.jpg": "womens-reconnection-kite-camp-2026",
  "brugal-rum-center-weekdays.jpg": "brugal-rum-center-weekdays",
  "del-oro-chocolate-factory-weekdays.jpg": "del-oro-chocolate-factory-weekdays",
  "hacienda-cufa-cacao-tour.jpg": "hacienda-cufa-cacao-tour",
  "tabacalera-cremo-factory-tour.jpg": "tabacalera-cremo-factory-tour",
  "tabacalera-cremo-rolling-experience.jpg": "tabacalera-cremo-rolling-experience",
  "vivonte-cigar-factory-weekdays.jpg": "vivonte-cigar-factory-weekdays",
  "capitanes.jpeg": "atleticos-pp-vs-capitanes-2026-07-11",
  "lil-naay-2026-07-17.jpg": "lil-naay-2026-07-17",
  "mineros.jpeg": "atleticos-pp-vs-mineros-2026-07-31",
  "granjeros-de-Moca.jpg": "atleticos-pp-vs-granjeros-2026-08-02",
  "bravos.jpeg": "atleticos-pp-vs-bravos-2026-08-07",
  "reales-de-santiago.jpg": "atleticos-pp-vs-reales-2026-08-09",
  "Arroceros.jpeg": "atleticos-pp-vs-arroceros-2026-08-22",

  // --- 2026 crawl: food & culture ---
  "paella-pop-el-pueblito.jpg": "paella-pop-el-pueblito",
  "paella-pop-green-one.jpg": "paella-pop-green-one",
  "hms-valeria-spanish-saturday.jpg": "hms-valeria-spanish-saturday",
  "hms-valeria-domingo-dominicano.jpg": "hms-valeria-domingo-dominicano",
  "rum-legacy-museum-daily.jpg": "rum-legacy-museum-daily",
  "la-confluencia-museum-daily.jpg": "la-confluencia-museum-daily",
  "gregorio-luperon-museum.jpg": "gregorio-luperon-museum",
  "macorix-house-of-rum.jpg": "macorix-house-of-rum",
  "casa-de-la-cultura-exhibitions.jpg": "casa-de-la-cultura-exhibitions",

  // --- Original curated venue / attraction photos ---
  "MaleconOPenAir.JPG": "malecon-live-concert",
  "RumbleInParadise12.png": "rumble-in-paradise-12",
  "LAXSunsetSessions.JPG": "lax-sunset-daily",
  "MaleconFodKiosks.JPG": "malecon-kiosks-daily",
  "KiteBeachWindSession.JPG": "kite-beach-daily",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "HardRockWeekends.jpg": "hard-rock-weekends",
  "CastawaysClassicRock.jpg": "castaways-classic-rock-wednesday",
  "VoramarFridayLive.jpg": "voramar-friday-live",
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
  "outback-safari.jpeg": "outback-safari-daily",
  "NorthCoastStartupMeet.JPG": "north-coast-networking-saturday",
  "CarribeanTechTalks.JPG": "north-coast-tech-meetup",
  "PlayaDoradaSummerFest.JPG": "puerto-plata-carnaval-2026",
};

/** Same venue, same photo — copy after primary sync. */
const SAME_VENUE_COPIES = [
  ["ElBateySalsaSocial.JPG", "batey-open-mic-weekly"],
  ["ElBateySalsaSocial.JPG", "el-batey-weekend-nightlife"],
  ["CremoSalsaFriday.jpg", "cremo-friday-salsa-dance"],
  ["LAXSunsetSessions.JPG", "lax-headline-concerts"],
  ["LAXSunsetSessions.JPG", "ojo-latin-night-thursday"],
  ["LAXSunsetSessions.JPG", "ojo-weekend-dj-parties"],
  ["voyvoy-monday-live-music.jpg", "voyvoy-saturday-session"],
  ["voyvoy-monday-live-music.jpg", "voyvoy-sunday-open-mic"],
  ["voyvoy-monday-live-music.jpg", "voyvoy-monday-live-music"],
  ["del-oro-chocolate-factory-weekdays.jpg", "del-oro-chocolate-factory-saturday"],
  ["atleticos-pp-pitcher-2026.jpg", "atleticos-pp-vs-mangueros-2026-07-17"],
  ["capitanes.jpeg", "atleticos-pp-vs-capitanes-2026-08-28"],
  ["vivonte-cigar-factory-weekdays.jpg", "vivonte-cigar-factory-saturday"],
];

/** popevent-images filename → venue slug (copied to public/venues/). */
const FILE_TO_VENUE_SLUG = {
  "atleticos-pp-vs-mangueros-2026-07-17.jpg": "parque-jose-briceno",
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

function syncOne(filename, eventId, targetDir = destDir) {
  const src = join(sourceDir, filename);
  const resolvedSrc = existsSync(src)
    ? src
    : join(sourceDir, files.find((f) => f.toLowerCase() === filename.toLowerCase()) ?? "");
  if (!existsSync(resolvedSrc)) {
    console.warn(`missing source: ${filename}`);
    return;
  }
  const ext = destExtension(resolvedSrc);
  copyFileSync(resolvedSrc, join(targetDir, `${eventId}${ext}`));
  copied++;
  const rel = targetDir === destDir ? "events" : "venues";
  console.log(`${filename} → ${rel}/${eventId}${ext}`);
}

for (const [filename, eventId] of Object.entries(FILE_TO_EVENT_ID)) {
  syncOne(filename, eventId);
}

for (const [filename, eventId] of SAME_VENUE_COPIES) {
  syncOne(filename, eventId);
}

mkdirSync(venuesDir, { recursive: true });
for (const [filename, venueSlug] of Object.entries(FILE_TO_VENUE_SLUG)) {
  syncOne(filename, venueSlug, venuesDir);
}

console.log(`Synced ${copied} event images to public/events/`);
