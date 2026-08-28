import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "popevent-images");
const destDir = join(root, "public", "events");
const venuesDir = join(root, "public", "venues");
const forceSync =
  process.env.FORCE_IMAGE_SYNC === "1" ||
  process.env.FORCE_VENUE_IMAGE_REFRESH === "1";

/**
 * popevent-images filename → event id.
 * Prefer `{eventId}.jpg` files produced by fetch-venue-images.mjs when present.
 *
 * One unique place shot per venue (`public/venues/`) and one action shot per
 * event (`public/events/`). Do not stamp the same file onto both unless it is
 * explicitly listed in SAME_VENUE_COPIES. Existing dest files are kept —
 * set FORCE_IMAGE_SYNC=1 to overwrite.
 */
const FILE_TO_EVENT_ID = {
  // --- Fetched / venue-accurate ({eventId}.jpg) ---
  "malecon-morning-wellness-walk.jpg": "malecon-morning-wellness-walk",
  "anfiteatro-la-puntilla-concerts-night.jpg": "anfiteatro-la-puntilla-concerts-night",
  "anfiteatro-la-puntilla-weekday-bowl.jpg": "anfiteatro-la-puntilla-weekday-bowl",
  "voyvoy-saturday-session-band.jpg": "voyvoy-saturday-session-band",
  "voyvoy-sunday-open-mic-closeup.jpg": "voyvoy-sunday-open-mic-closeup",
  "voyvoy-monday-night-terrace.jpg": "voyvoy-monday-live-music",
  "hard-rock-billed-concerts.jpg": "hard-rock-billed-concerts",
  "sosua-jewish-museum-hours.jpg": "sosua-jewish-museum-hours",
  "sosua-diving-adventures-daily.jpg": "sosua-diving-adventures-daily",
  "sosua-pedro-clisante-food-nights.jpg": "sosua-pedro-clisante-food-nights",
  "sosua-beach-live-bay.jpg": "sosua-beach-live-weekends",
  "smileys-saturday-live.jpg": "smileys-saturday-live",
  "finish-line-live-wednesday.jpg": "finish-line-live-wednesday",
  "liquid-blue-sunrise-yoga.jpg": "liquid-blue-sunrise-yoga",
  "natura-cabana-yoga-daily.jpg": "natura-cabana-yoga-daily",
  "liquid-blue-watersports-daily.jpg": "liquid-blue-watersports-daily",
  "la-casita-papi-sand-dining.jpg": "la-casita-papi-sand-dining",
  "el-cocotazo-cafe-beach-dining.jpg": "el-cocotazo-cafe-beach-dining",
  "iberostar-costa-dorada-day-pass.jpg": "iberostar-costa-dorada-day-pass",
  "gran-ventana-day-pass.jpg": "gran-ventana-day-pass",
  "cofresi-palm-day-pass.jpg": "cofresi-palm-day-pass",
  "cofresi-beach-sunset-walk.jpg": "cofresi-beach-sunset-walk",
  "crazy-lobster-shrimp.jpg": "crazy-lobster-shrimp",
  "don-limon.jpeg": "don-limon-beach-dining",
  "los-tres-cocos-coconut-shrimp.jpg": "los-tres-cocos-coconut-shrimp",
  "ocean-winds-karaoke-amados.jpg": "ocean-winds-karaoke-amados",
  "kite-beach-wind-culture.jpg": "kite-beach-wind-culture",
  "d-classico-merengue-bar.jpg": "d-classico-merengue-bar",
  "ojo-latin-night-thursday.jpg": "ojo-latin-night-thursday",
  "ojo-weekend-dj-parties.jpg": "ojo-weekend-dj-parties",
  "el-carey-weekend-nightlife.jpg": "el-carey-weekend-nightlife",
  "coconut-cove-ocean-zipline-daily.jpg": "coconut-cove-ocean-zipline-daily",
  "freestyle-catamaran-daily.jpg": "freestyle-catamaran-daily",
  "womens-reconnection-kite-camp-2026.jpg": "womens-reconnection-kite-camp-2026",
  "brugal-rum-center-weekdays.jpg": "brugal-rum-center-weekdays",
  "brugal-corporate-tours.jpg": "brugal-corporate-tours",
  "del-oro-chocolate-factory-tour.jpg": "del-oro-chocolate-factory-tour",
  "hacienda-cufa-cacao-tour.jpg": "hacienda-cufa-cacao-tour",
  "tabacalera-cremo-factory-tour.jpg": "tabacalera-cremo-factory-tour",
  "tabacalera-cremo-rolling-experience.jpg": "tabacalera-cremo-rolling-experience",
  "vivonte-cigar-factory-weekdays.jpg": "vivonte-cigar-factory-weekdays",
  "lil-naay-2026-07-17.jpg": "lil-naay-2026-07-17",
  "lena-dardelet-aura-beach-club-2026-07-24.jpg":
    "lena-dardelet-aura-beach-club-2026-07-24",
  "silent-run-5k-2026-07-25.jpg": "silent-run-5k-2026-07-25",
  "los-event-trilogy-2026-09-03.jpg": "los-event-trilogy-2026-09-03",
  "sunset-laughter-club-cabarete.jpg": "sunset-laughter-club-cabarete",
  "congreso-damas-adn-2026.jpg": "congreso-damas-adn-2026",
  "master-of-the-ocean-2026.jpg": "master-of-the-ocean-2026",
  "atlantico-fc-vs-delfines-2026-08-22.jpg":
    "atlantico-fc-vs-delfines-2026-08-22",
  "dewry-luciano-zona-acapella-2026-08-23.jpg":
    "dewry-luciano-zona-acapella-2026-08-23",
  "pop-cinemas-week-2026-08-20.jpg": "pop-cinemas-week-2026-08-20",
  "petit-francois-friday-karaoke.jpg": "petit-francois-friday-karaoke",
  "costambar-beach-fitness.png": "costambar-beach-fitness",
  // Atléticos summer league — authentic Atléticos pitcher (athleticosPOP.png); copies below.
  "athleticosPOP.png": "atleticos-pp-vs-mangueros-2026-07-17",
  // ASA Survival Series — same flyer for all five Saturday VIP games.
  "asa-surviaval.jpeg": "ingest-asa-survival-series-cdf-vs-dracos-game-2",

  // --- Logo → action shot replacements ({eventId}.jpg from fetch) ---
  "cabarete-pilates-reformer.jpg": "cabarete-pilates-reformer",
  "ingest-18th-annual-cabarete-butterfly-effect.jpg":
    "ingest-18th-annual-cabarete-butterfly-effect",
  // Kayak action shot only — venue place photo is jamao-al-norte.jpg.
  "ingest-hidden-river-kayak-adventure.jpg":
    "ingest-hidden-river-kayak-adventure",
  "sea-horse-saturday-market-tents.jpg": "sea-horse-saturday-market-tents",
  "el-carey-wc2026.jpg": "el-carey-wc2026",
  "el-colibri-karaoke-battle-2026.jpg": "el-colibri-karaoke-battle-2026",
  "rumble-in-paradise-12.jpg": "rumble-in-paradise-12",
  "rumble-in-paradise-13.png": "rumble-in-paradise-13",
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
  "macorix-house-of-rum-cellar.jpg": "macorix-house-of-rum",
  "casa-de-la-cultura-gallery-opening.jpg": "casa-de-la-cultura-gallery-opening",
  "casa-de-la-cultura-saturday-keyboard.jpg": "casa-de-la-cultura-saturday-keyboard",

  // --- Dominican-leaning venues / events (2026 curation) ---
  "cabarete-jazz-festival-2026.jpg": "cabarete-jazz-festival-2026",
  "jandy-ventura-legado-caballo-2026.jpg": "jandy-ventura-legado-caballo-2026",
  "natura-cabana-saturday-dining.jpg": "natura-cabana-saturday-dining",
  "el-parq-saturday-night.jpg": "el-parq-saturday-night",
  "plaza-independencia-weekend-culture.jpg": "plaza-independencia-weekend-culture",
  "el-parq-karaoke-thursday.jpg": "el-parq-karaoke-thursday",
  "el-parq-latin-friday.jpg": "el-parq-latin-friday",
  "ElChocoTuesdayLive.jpg": "parada-tipica-el-choco-tuesday-live",
  "puerto-plata-golf-classic-2026.jpg": "puerto-plata-golf-classic-2026",
  "cac-games-surf-playa-encuentro-2026.jpg": "cac-games-surf-playa-encuentro-2026",
  "puerto-plata-beach-soccer-2026.jpg": "puerto-plata-beach-soccer-2026",
  "sosua-10k-road-race-2026.jpg": "sosua-10k-road-race-2026",
  "puerto-plata-poker-experience-2026.jpg": "puerto-plata-poker-experience-2026",
  "aventurate-rd-2026.jpg": "aventurate-rd-2026",
  "imbert-mercedes-patronales-2026.jpg": "imbert-mercedes-patronales-2026",
  "guananico-san-miguel-patronales-2026.jpg":
    "guananico-san-miguel-patronales-2026",
  "sunset-cabarete-sessions-2026.jpg": "sunset-cabarete-sessions-2026",
  "la-chabola-wednesday-open-mic.jpg": "la-chabola-wednesday-open-mic",
  "groundzero-domingos-pal-pueblo.jpg": "groundzero-domingos-pal-pueblo",

  // --- Original curated venue / attraction photos ---
  "LAXSunsetSessions.JPG": "lax-sunset-daily",
  "MaleconFodKiosks.JPG": "malecon-kiosks-daily",
  "KiteBeachWindSession.JPG": "kite-beach-daily",
  "CoworkCabarete.JPG": "cowork-weekdays",
  "ElBateySalsaSocial.JPG": "batey-salsa-weekly",
  "el-batey-weekend-nightlife-clisante.jpg": "el-batey-weekend-nightlife-clisante",
  "SosuaBeachVolleyballPickup.JPG": "sosua-volleyball-weekly",
  "LAXFridayReggaeNight.JPG": "lax-reggae-friday",
  "HardRockWeekends.jpg": "hard-rock-weekends",
  "castaways-classic-rock-wednesday.jpg": "castaways-classic-rock-wednesday",
  "VoramarFridayLive.jpg": "voramar-friday-live",
  "cheers-weekly-live.jpg": "cheers-weekly-live",
  "senor-rock-cadillac-bar.jpg": "senor-rock-cadillac-bar",
  "batey-open-mic-weekly.jpg": "batey-open-mic-weekly",
  "lax-headline-concerts.jpg": "lax-headline-concerts",
  "CremoSalsaFriday.jpg": "cremo-salsa-friday",
  "victrola-sabado-bailable.jpg": "victrola-sabado-bailable",
  "victrola-ladies-night-friday.jpg": "victrola-ladies-night-friday",
  "cigar-town-acustico-humos-2026-08-14.jpg":
    "cigar-town-acustico-humos-2026-08-14",
  "cigar-town-acustico-humos.jpg": "cigar-town-acustico-humos",
  "chill-and-grill-bingo-terrace.jpg": "chill-and-grill-bingo-terrace",
  "CremoBohemianWednesday.jpg": "cremo-bohemian-wednesday",
  "CremoKaraokeSaturday.jpg": "cremo-karaoke-saturday",
  "BigLeesWeekendMusic.jpg": "big-lees-weekend-music",
  "CabaretePickleBallMeet.JPG": "community-pickleball-cabarete",
  "espadrillas.jpeg": "ingest-make-authentic-espadrilles-in-puerto-plata",
  "ingest-el-blachy.jpg": "ingest-el-blachy",
  "ingest-nacho-estrella-nd-eventos.jpg": "ingest-nacho-estrella-nd-eventos",
  "feriaartesanal.jpg": "feria-artesanal-verano-2026",
  "ocean-world-daily.jpg": "ocean-world-daily",
  "Damajagua.jpeg": "charcos-damajagua-daily",
  "fortaleza.jpeg": "fortaleza-san-felipe-daily",
  "museoambar.jpeg": "museo-ambar-weekdays",
  "teleferico.jpeg": "teleferico-puerto-plata-daily",
  "cayoarena.jpeg": "cayo-arena-tours-daily",
  "paseodonablanca.jpeg": "paseo-dona-blanca-daily",
  "callesombrillas.jpeg": "calle-sombrillas-daily",
  "letrero-pop.jpg": "letrero-puerto-plata-daily",
  "funcity.jpeg": "fun-city-daily",
  "monkeyland.jpeg": "monkeyland-puerto-plata-daily",
  "outback-safari.jpeg": "outback-safari-daily",
  "NorthCoastStartupMeet.JPG": "north-coast-networking-saturday",
  "CarribeanTechTalks.JPG": "north-coast-tech-meetup",
  "PlayaDoradaSummerFest.JPG": "puerto-plata-carnaval-2026",
  "love-does-bocadillos-course-2026.jpg": "love-does-bocadillos-course-2026",
  "love-does-cocktails-solidarity-2026-09-04.jpg":
    "love-does-cocktails-solidarity-2026-09-04",
  "waterfront-playa-alicia-sunset-dining.jpg":
    "waterfront-playa-alicia-sunset-dining",
  "waterfront-playa-alicia-friday-jazz.jpg":
    "waterfront-playa-alicia-friday-jazz",
  "rio-sonador-finca-papirucho.jpg": "rio-sonador-finca-papirucho",
  "sunset-grill-velero-beachfront-dining.jpg":
    "sunset-grill-velero-beachfront-dining",
  "sunset-grill-velero-sushi-nights.jpg":
    "sunset-grill-velero-sushi-nights",
  "charco-los-militares-daily.jpg": "charco-los-militares-daily",
  "la-rejoya-trek.jpg": "la-rejoya-trek",
  "rio-martinico-sosua.jpg": "rio-martinico-sosua",
  "flip-flop-live-sports-daily.jpg": "flip-flop-live-sports-daily",
  "flip-flop-wing-wednesday.jpg": "flip-flop-wing-wednesday",
  "flip-flop-taco-tuesday.jpg": "flip-flop-taco-tuesday",
  "flip-flop-monday-happy-hour.jpg": "flip-flop-monday-happy-hour",
};

/** Same venue, same photo — copy after primary sync. */
const SAME_VENUE_COPIES = [
  // El Batey salsa vs weekend nightlife now have distinct heroes.
  // Ojo / open mic / LAX headlines use dedicated assets (not salsa social or sunset).
  // Voy Voy: do NOT clone Monday dining onto Sat/Sun — unique band / mic heroes.
  // Del Oro Sat listing reuses the weekday tour-counter hero via event-images.ts.
  ["vivonte-cigar-factory-weekdays.jpg", "vivonte-cigar-factory-saturday"],
  ["asa-surviaval.jpeg", "ingest-asa-survival-series-cdf-vs-dracos-game-1"],
  ["asa-surviaval.jpeg", "ingest-asa-survival-series-cdf-vs-dracos-game-3"],
  ["asa-surviaval.jpeg", "ingest-asa-survival-series-cdf-vs-dracos-game-4"],
  ["asa-surviaval.jpeg", "ingest-asa-survival-series-cdf-vs-dracos-game-5"],
  // Atléticos home slate — same authentic team photo until per-game authentic shots land.
  ["athleticosPOP.png", "atleticos-pp-vs-capitanes-2026-07-11"],
  ["athleticosPOP.png", "atleticos-pp-vs-mineros-2026-07-31"],
  ["athleticosPOP.png", "atleticos-pp-vs-granjeros-2026-08-02"],
  ["athleticosPOP.png", "atleticos-pp-vs-bravos-2026-08-07"],
  ["athleticosPOP.png", "atleticos-pp-vs-reales-2026-08-09"],
  ["athleticosPOP.png", "atleticos-pp-vs-arroceros-2026-08-22"],
  ["athleticosPOP.png", "atleticos-pp-vs-capitanes-2026-08-28"],
];

/** popevent-images filename → venue slug (copied to public/venues/). */
const FILE_TO_VENUE_SLUG = {
  "baseballpark.png": "parque-jose-briceno",
  "asa-surviaval.jpeg": "club-deportivo-fantastico",
  "la-casita-de-papi-awning.jpg": "la-casita-de-papi-awning",
  // Filename bump — venue page was reusing the Sunset Sessions deck photo.
  "lax-cabarete-bar.jpg": "lax-cabarete-bar",
  "el-cocotazo-cafe-deck.jpg": "el-cocotazo-cafe-deck",
  // Place shot of the main pool; day-pass listing uses the swim-up bar instead.
  "iberostar-waves-costa-dorada.jpg": "iberostar-waves-costa-dorada",
  "cofresi-palm-beach-spa.jpg": "cofresi-palm-beach-spa",
  "crazy-lobster-maimon.jpg": "crazy-lobster-maimon",
  "don-limon-venue.jpeg": "don-limon-cofresi",
  "los-tres-cocos-dinner.jpg": "los-tres-cocos-cofresi",
  "hotel-ocean-winds-facade.jpg": "hotel-ocean-winds-facade",
  // Filename bump after replacing a tiny shared dolphin-jump JPEG.
  "ocean-world-park.jpg": "ocean-world-park",
  // Filename bump — Tennis Club patio (Saturday Market flyer/action stay on the event).
  "sea-horse-ranch-tennis-club.jpg": "sea-horse-ranch-tennis-club",
  // Filename bump — night entrance (Cadillac bar stays on the live listing).
  "senor-rock-playa-dorada-entrance.jpg": "senor-rock-playa-dorada-entrance",
  // Filename bump — Kite Beach school patio (official kite jump stays on the event).
  "liquid-blue-cabarete-beach.jpg": "liquid-blue-cabarete-beach",
  // Venue: stage+arch place shot (Wikimedia). Concerts use night hero; weekday uses bowl.
  "anfiteatro-la-puntilla-stage.jpg": "anfiteatro-la-puntilla-stage",
  // Filename bump — daytime Malecón promenade (not night open-air stage).
  "malecon-puerto-plata-promenade.jpg": "malecon-puerto-plata-promenade",
  // Filename bump — daytime street-facing bar (not the Saturday live stage).
  "smileys-bar-sosua-daytime.jpg": "smileys-bar-sosua-daytime",
  // Filename bump — busy pub bar (not the Wednesday live stage).
  "finish-line-sosua-bar.jpg": "finish-line-sosua-bar",
  "d-classico-sosua-daytime.jpg": "d-classico-sosua-daytime",
  // El Batey venue card is the whole downtown Sosúa district (Plaza García / Entrada
  // El Batey), so it uses a daytime street scene — not the food-nights or nightlife shot.
  "el-batey-downtown-daytime.jpg": "el-batey-sosua",
  // Authentic Voyvoy bar interior; Sat/Sun use dedicated event heroes (see FILE_TO_EVENT_ID).
  "voyvoy-cabarete-bar.jpg": "voyvoy-cabarete-bar",
  // Filename bump — daytime dining room (not the weekly live-music still).
  "cheers-bar-sosua-dining.jpg": "cheers-bar-sosua-dining",
  // Dining/bar interior — distinct filename so browsers don't keep the old concert-stock URL.
  "castaways-sosua-dining.jpg": "castaways-sosua-dining",
  // Filename bumps — place shots (food stills stay on the event listings).
  "paella-pop-el-pueblito-sign.jpg": "paella-pop-el-pueblito-sign",
  "paella-pop-green-one-resort.jpg": "paella-pop-green-one-resort",
  "plaza-independencia.jpg": "plaza-independencia",
  // Filename bump — plaza gazebo aerial (welcome sign stays on the patronales event).
  "plaza-sanchez-imbert-park.jpg": "plaza-sanchez-imbert-park",
  "rincon-caliente-guananico.jpg": "rincon-caliente-guananico",
  "el-parq-cabarete-foodpark.jpg": "el-parq-cabarete-foodpark",
  "disco-club-brugal.jpg": "disco-club-brugal",
  "natura-cabana-recepcion.jpg": "natura-cabana-recepcion",
  // Blue JackTar's decorated event space; keep the Jandy photo for its event card.
  "bjt-detail.jpg": "blue-jacktar-playa-dorada",
  // Real El Choco Sosúa night patio (Sosúa News); Tuesday live uses ElChocoTuesdayLive.jpg.
  "parada-tipica-el-choco.jpg": "parada-tipica-el-choco",
  "puerto-plata-golf-classic-2026.jpg": "playa-dorada-golf",
  "cac-games-surf-playa-encuentro-2026.jpg": "playa-encuentro",
  "puerto-plata-beach-soccer-2026.jpg": "playa-los-charamicos",
  // Filename bump — tiki bar interior (pizza stays on Wednesday open mic).
  "la-chabola-bar.jpg": "la-chabola-bar",
  // Filename bump — branded lounge (Domingos Pal Pueblo flyer stays on the event).
  "ground-zero-disco-lounge.jpg": "ground-zero-disco-lounge",
  "aurabeach.jpg": "aura-beach-club-cabarete",
  "macorix-house-of-rum.jpg": "macorix-house-of-rum",
  // Filename bump — Google Maps Del Oro facade (not the chocolate-box overlay).
  "del-oro-chocolate-factory-facade.jpg": "del-oro-chocolate-factory-facade",
  "espadrillas.jpeg": "handmade-the-brand",
  "paseo-de-db.jpg": "paseo-dona-blanca",
  "letrero-pop.jpg": "letrero-puerto-plata",
  "elcareyrestaurant.webp": "el-carey-puerto-plata",
  "victrola-037.jpg": "victrola-037",
  "cigar-town-pop.jpg": "cigar-town-pop",
  "ocean-one-cabarete-pool.jpg": "ocean-one-cabarete",
  "vip-beach-lifestyles-resort.jpg": "vip-beach-lifestyles-resort",
  "cacique-moncion-palapa.jpg": "cacique-moncion-palapa",
  "pingui-bar-tiki.jpg": "pingui-bar-tiki",
  "gran-ventana-beach-resort.jpg": "gran-ventana-beach-resort",
  // Filename bumps after replacing flyer / logo / park-aerial stand-ins.
  "meclao-rooftop-lounge.jpg": "meclao-rooftop-lounge",
  "kviar-costa-dorada-floor.jpg": "kviar-costa-dorada-floor",
  "playa-cofresi-beach.jpg": "playa-cofresi-beach",
  "laguna-sov-kids-park.jpg": "laguna-sov-kids-park",
  "santa-fe-sov-pools.jpg": "santa-fe-sov-pools",
  "restaurant-maria-sov-terrace.jpg": "restaurant-maria-sov-terrace",
  // Filename bumps after replacing a shared Freestyle Catamaran stand-in.
  "bar-39-sosua-beach.jpg": "bar-39-sosua-beach",
  "playa-sosua-shore.jpg": "playa-sosua-shore",
  "estadio-leonel-placido.jpg": "estadio-leonel-placido",
  "zona-acapella-club.jpg": "zona-acapella-club",
  "pop-cinemas-playa-dorada.jpg": "pop-cinemas-playa-dorada",
  "le-petit-francois.jpg": "le-petit-francois",
  "costambar-beach-fitness.png": "playa-costambar",
  "love-does-sosua.jpg": "love-does-sosua",
  // Filename bump — palapa-to-deck (sunset terrace stays on the dining event).
  "waterfront-playa-alicia-palapa.jpg": "waterfront-playa-alicia-palapa",
  // Filename bump — finca campsite (log crossing stays on the river event).
  "finca-papirucho-glamping.jpg": "finca-papirucho-glamping",
  "sunset-grill-velero-beachfront-dining.jpg": "sunset-grill-velero",
  "charco-los-militares-daily.jpg": "charco-los-militares",
  "la-rejoya-trek.jpg": "la-rejoya",
  "rio-martinico-sosua.jpg": "rio-martinico",
  // Place shot of the river corridor — distinct from the kayak action listing.
  "jamao-al-norte.jpg": "jamao-al-norte",
  "flip-flop-live-sports-daily.jpg": "flip-flop-sports-bar-sosua",
};

if (!existsSync(sourceDir)) {
  console.log("popevent-images/ not found — skipping sync");
  process.exit(0);
}

mkdirSync(destDir, { recursive: true });

const files = readdirSync(sourceDir);
let copied = 0;
let skipped = 0;

function destExtension(filename) {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot).toLowerCase() : ".jpg";
}

function hasCommittedImage(path) {
  try {
    return existsSync(path) && statSync(path).size > 1024;
  } catch {
    return false;
  }
}

async function writeDest(resolvedSrc, dest, ext) {
  if (/\.jpe?g$/i.test(ext)) {
    await sharp(resolvedSrc)
      .rotate()
      .resize(1200, null, { withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(dest);
    return;
  }
  copyFileSync(resolvedSrc, dest);
}

async function syncOne(filename, eventId, targetDir = destDir) {
  const src = join(sourceDir, filename);
  const match = existsSync(src)
    ? filename
    : files.find((f) => f.toLowerCase() === filename.toLowerCase());
  if (!match) {
    console.warn(`missing source: ${filename}`);
    return;
  }
  const resolvedSrc = join(sourceDir, match);
  const ext = destExtension(resolvedSrc);
  const dest = join(targetDir, `${eventId}${ext}`);
  const rel = targetDir === destDir ? "events" : "venues";
  if (!forceSync && hasCommittedImage(dest)) {
    skipped++;
    return;
  }
  await writeDest(resolvedSrc, dest, ext);
  copied++;
  console.log(`${filename} → ${rel}/${eventId}${ext}`);
}

for (const [filename, eventId] of Object.entries(FILE_TO_EVENT_ID)) {
  await syncOne(filename, eventId);
}

for (const [filename, eventId] of SAME_VENUE_COPIES) {
  await syncOne(filename, eventId);
}

mkdirSync(venuesDir, { recursive: true });
for (const [filename, venueSlug] of Object.entries(FILE_TO_VENUE_SLUG)) {
  await syncOne(filename, venueSlug, venuesDir);
}

console.log(
  `Synced ${copied} image(s) (${skipped} kept committed${forceSync ? ", FORCE_IMAGE_SYNC" : ""})`,
);
