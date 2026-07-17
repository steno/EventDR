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
  "la-casita-papi-beach-dining.jpg": "la-casita-papi-beach-dining",
  "kite-beach-wind-culture.jpg": "kite-beach-wind-culture",
  "d-classico-merengue-nights.jpg": "d-classico-merengue-nights",
  "ojo-latin-night-thursday.jpg": "ojo-latin-night-thursday",
  "ojo-weekend-dj-parties.jpg": "ojo-weekend-dj-parties",
  "el-carey-weekend-nightlife.jpg": "el-carey-weekend-nightlife",
  "coconut-cove-ocean-zipline-daily.jpg": "coconut-cove-ocean-zipline-daily",
  "freestyle-catamaran-daily.jpg": "freestyle-catamaran-daily",
  "womens-reconnection-kite-camp-2026.jpg": "womens-reconnection-kite-camp-2026",
  "brugal-rum-center-weekdays.jpg": "brugal-rum-center-weekdays",
  "brugal-corporate-tours.jpg": "brugal-corporate-tours",
  "del-oro-chocolate-factory-weekdays.jpg": "del-oro-chocolate-factory-weekdays",
  "hacienda-cufa-cacao-tour.jpg": "hacienda-cufa-cacao-tour",
  "tabacalera-cremo-factory-tour.jpg": "tabacalera-cremo-factory-tour",
  "tabacalera-cremo-rolling-experience.jpg": "tabacalera-cremo-rolling-experience",
  "vivonte-cigar-factory-weekdays.jpg": "vivonte-cigar-factory-weekdays",
  "lil-naay-2026-07-17.jpg": "lil-naay-2026-07-17",
  // Atléticos summer league — unique Unsplash baseball action per home game.
  "atleticos-pp-vs-capitanes-2026-07-11.jpg": "atleticos-pp-vs-capitanes-2026-07-11",
  "atleticos-pp-vs-mangueros-2026-07-17.jpg": "atleticos-pp-vs-mangueros-2026-07-17",
  "atleticos-pp-vs-mineros-2026-07-31.jpg": "atleticos-pp-vs-mineros-2026-07-31",
  "atleticos-pp-vs-granjeros-2026-08-02.jpg": "atleticos-pp-vs-granjeros-2026-08-02",
  "atleticos-pp-vs-bravos-2026-08-07.jpg": "atleticos-pp-vs-bravos-2026-08-07",
  "atleticos-pp-vs-reales-2026-08-09.jpg": "atleticos-pp-vs-reales-2026-08-09",
  "atleticos-pp-vs-arroceros-2026-08-22.jpg": "atleticos-pp-vs-arroceros-2026-08-22",
  "atleticos-pp-vs-capitanes-2026-08-28.jpg": "atleticos-pp-vs-capitanes-2026-08-28",

  // --- Logo → action shot replacements ({eventId}.jpg from fetch) ---
  "cabarete-pilates-reformer.jpg": "cabarete-pilates-reformer",
  "ingest-18th-annual-cabarete-butterfly-effect.jpg":
    "ingest-18th-annual-cabarete-butterfly-effect",
  "sea-horse-saturday-market.jpg": "sea-horse-saturday-market",
  "el-carey-wc2026.jpg": "el-carey-wc2026",
  "el-colibri-karaoke-battle-2026.jpg": "el-colibri-karaoke-battle-2026",
  "rumble-in-paradise-12.jpg": "rumble-in-paradise-12",
  "inicio-del-campamento-pp-2026.jpg": "inicio-del-campamento-pp-2026",
  "cabarete-classic-2026.jpg": "cabarete-classic-2026",

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

  // --- Dominican-leaning venues / events (2026 curation) ---
  "cabarete-jazz-festival-2026.jpg": "cabarete-jazz-festival-2026",
  "jandy-ventura-legado-caballo-2026.jpg": "jandy-ventura-legado-caballo-2026",
  "natura-cabana-saturday-live.jpg": "natura-cabana-saturday-live",
  "el-parq-live-bands-saturday.jpg": "el-parq-live-bands-saturday",
  "el-parq-karaoke-thursday.jpg": "el-parq-karaoke-thursday",
  "el-parq-latin-friday.jpg": "el-parq-latin-friday",
  "ElChocoTuesdayLive.jpg": "parada-tipica-el-choco-tuesday-live",
  "puerto-plata-golf-classic-2026.jpg": "puerto-plata-golf-classic-2026",
  "cac-games-surf-playa-encuentro-2026.jpg": "cac-games-surf-playa-encuentro-2026",
  "puerto-plata-beach-soccer-2026.jpg": "puerto-plata-beach-soccer-2026",
  "la-chabola-wednesday-open-mic.jpg": "la-chabola-wednesday-open-mic",
  "groundzero-domingos-pal-pueblo.jpg": "groundzero-domingos-pal-pueblo",

  // --- Original curated venue / attraction photos ---
  "LAXSunsetSessions.JPG": "lax-sunset-daily",
  "MaleconFodKiosks.JPG": "malecon-kiosks-daily",
  "KiteBeachWindSession.JPG": "kite-beach-daily",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "HardRockWeekends.jpg": "hard-rock-weekends",
  "castaways-classic-rock-wednesday.jpg": "castaways-classic-rock-wednesday",
  "VoramarFridayLive.jpg": "voramar-friday-live",
  "cheers-weekly-live.jpg": "cheers-weekly-live",
  "SenorRockLiveNight.jpg": "senor-rock-live-nightly",
  "batey-open-mic-weekly.jpg": "batey-open-mic-weekly",
  "lax-headline-concerts.jpg": "lax-headline-concerts",
  "CremoSalsaFriday.jpg": "cremo-salsa-friday",
  "CremoBohemianWednesday.jpg": "cremo-bohemian-wednesday",
  "CremoKaraokeSaturday.jpg": "cremo-karaoke-saturday",
  "BigLeesWeekendMusic.jpg": "big-lees-weekend-music",
  "DominoNoightColmado.JPG": "community-domino-sosua",
  "CabaretePickleBallMeet.JPG": "community-pickleball-cabarete",
  "espadrillas.jpeg": "ingest-make-authentic-espadrilles-in-puerto-plata",
  "feriaartesanal.jpg": "feria-artesanal-verano-2026",
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
  ["ElBateySalsaSocial.JPG", "el-batey-weekend-nightlife"],
  ["CremoSalsaFriday.jpg", "cremo-friday-salsa-dance"],
  // Ojo / open mic / LAX headlines use dedicated assets (not salsa social or sunset).
  ["voyvoy-monday-live-music.jpg", "voyvoy-saturday-session"],
  ["voyvoy-monday-live-music.jpg", "voyvoy-sunday-open-mic"],
  ["voyvoy-monday-live-music.jpg", "voyvoy-monday-live-music"],
  ["del-oro-chocolate-factory-weekdays.jpg", "del-oro-chocolate-factory-saturday"],
  ["vivonte-cigar-factory-weekdays.jpg", "vivonte-cigar-factory-saturday"],
];

/**
 * Venue place photos live only under popevent-images/venues/.
 * Never copy event assets into public/venues/ — venues and events must not share images.
 */
const venueSourceDir = join(sourceDir, "venues");

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

function syncOne(filename, eventId, targetDir = destDir, fromDir = sourceDir) {
  const src = join(fromDir, filename);
  const dirFiles = fromDir === sourceDir ? files : readdirSync(fromDir);
  const match = existsSync(src)
    ? filename
    : dirFiles.find((f) => f.toLowerCase() === filename.toLowerCase());
  if (!match) {
    console.warn(`missing source: ${filename}`);
    return;
  }
  const resolvedSrc = join(fromDir, match);
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
let venueCopied = 0;
if (existsSync(venueSourceDir)) {
  for (const filename of readdirSync(venueSourceDir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(filename)) continue;
    const slug = filename.replace(/\.[^.]+$/, "");
    syncOne(filename, slug, venuesDir, venueSourceDir);
    venueCopied++;
  }
} else {
  console.warn("popevent-images/venues/ not found — venue images not synced");
}

console.log(`Synced ${copied - venueCopied} event images to public/events/`);
console.log(`Synced ${venueCopied} venue place images to public/venues/`);
