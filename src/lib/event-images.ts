/** Maps seed event ids to image files under /public/events (synced from popevent-images). */
import { getAppVersion } from "./app-version";
import { getVenueImageUrl } from "./venue-images";

const EVENT_IMAGE_FILES: Record<string, string> = {
  "rumble-in-paradise-12": "rumble-in-paradise-12.jpg",
  "rumble-in-paradise-13": "rumble-in-paradise-13.png",
  "lax-sunset-daily": "lax-sunset-daily.jpg",
  "malecon-kiosks-daily": "malecon-kiosks-daily.jpg",
  "kite-beach-daily": "kite-beach-daily.jpg",
  "liquid-blue-sunrise-yoga": "liquid-blue-sunrise-yoga.jpg",
  "cowork-weekdays": "cowork-weekdays.jpg",
  "batey-salsa-weekly": "batey-salsa-weekly.jpg",
  "sosua-volleyball-weekly": "sosua-volleyball-weekly.jpg",
  "lax-reggae-friday": "lax-reggae-friday.jpg",
  "batey-open-mic-weekly": "batey-open-mic-weekly.jpg",
  "hard-rock-weekends": "hard-rock-weekends.jpg",
  "hard-rock-billed-concerts": "hard-rock-billed-concerts.jpg",
  "castaways-classic-rock-wednesday": "castaways-classic-rock-wednesday.jpg",
  "voramar-friday-live": "voramar-friday-live.jpg",
  "smileys-saturday-live": "smileys-saturday-live.jpg",
  "finish-line-live-wednesday": "finish-line-live-wednesday.jpg",
  "sosua-beach-live-weekends": "sosua-beach-live-bay.jpg",
  "cheers-weekly-live": "cheers-weekly-live.jpg",
  // Filename bump — live bar with hanging Cadillac (entrance stays on the venue).
  "senor-rock-live-nightly": "senor-rock-cadillac-bar.jpg",
  "cremo-salsa-friday": "cremo-salsa-friday.jpg",
  "cremo-bohemian-wednesday": "cremo-bohemian-wednesday.jpg",
  "cremo-karaoke-saturday": "cremo-karaoke-saturday.jpg",
  "big-lees-weekend-music": "big-lees-weekend-music.jpg",
  "sea-horse-saturday-market": "sea-horse-saturday-market-tents.jpg",
  "community-pickleball-cabarete": "community-pickleball-cabarete.jpg",
  "ingest-make-authentic-espadrilles-in-puerto-plata":
    "ingest-make-authentic-espadrilles-in-puerto-plata.jpg",
  "ingest-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect.jpg",
  "ingest-el-blachy": "ingest-el-blachy.jpg",
  "ingest-nacho-estrella-nd-eventos": "ingest-nacho-estrella-nd-eventos.jpg",
  "cabarete-classic-2026": "cabarete-classic-2026.jpg",
  "cabarete-pilates-reformer": "cabarete-pilates-reformer.jpg",
  "sancocho-sabados-pingui": "sancocho-sabados-pingui.jpg",
  "inicio-del-campamento-pp-2026": "inicio-del-campamento-pp-2026.jpg",
  "feria-artesanal-verano-2026": "feria-artesanal-verano-2026.jpg",
  "imbert-mercedes-patronales-2026": "imbert-mercedes-patronales-2026.jpg",
  "guananico-san-miguel-patronales-2026":
    "guananico-san-miguel-patronales-2026.jpg",
  "plaza-independencia-daily": "plaza-independencia-daily.jpg",
  "plaza-independencia-weekend-culture": "plaza-independencia-weekend-culture.jpg",
  "el-carey-wc2026": "el-carey-wc2026.jpg",
  "el-colibri-karaoke-battle-2026": "el-colibri-karaoke-battle-2026.jpg",
  "ocean-winds-karaoke-nights": "ocean-winds-karaoke-amados.jpg",
  "ocean-world-daily": "ocean-world-daily.jpg",
  "charcos-damajagua-daily": "charcos-damajagua-daily.jpeg",
  "fortaleza-san-felipe-daily": "fortaleza-san-felipe-daily.jpeg",
  "museo-ambar-weekdays": "museo-ambar-weekdays.jpeg",
  "teleferico-puerto-plata-daily": "teleferico-puerto-plata-daily.jpeg",
  "cayo-arena-tours-daily": "cayo-arena-tours-daily.jpeg",
  "paseo-dona-blanca-daily": "paseo-dona-blanca-daily.jpeg",
  "calle-sombrillas-daily": "calle-sombrillas-daily.jpeg",
  "letrero-puerto-plata-daily": "letrero-puerto-plata-daily.jpg",
  "fun-city-daily": "fun-city-daily.jpeg",
  "monkeyland-puerto-plata-daily": "monkeyland-puerto-plata-daily.jpeg",
  "coconut-cove-ocean-zipline-daily": "coconut-cove-ocean-zipline-daily.jpg",
  "brugal-rum-center-weekdays": "brugal-rum-center-weekdays.jpg",
  "brugal-corporate-tours": "brugal-corporate-tours.jpg",
  // Filename bump — Google Maps tour-counter action (not the chocolate-box overlay).
  "del-oro-chocolate-factory-weekdays": "del-oro-chocolate-factory-tour.jpg",
  "del-oro-chocolate-factory-saturday": "del-oro-chocolate-factory-tour.jpg",
  "hacienda-cufa-cacao-tour": "hacienda-cufa-cacao-tour.jpg",
  "tabacalera-cremo-factory-tour": "tabacalera-cremo-factory-tour.jpg",
  "tabacalera-cremo-rolling-experience": "tabacalera-cremo-rolling-experience.jpg",
  "vivonte-cigar-factory-weekdays": "vivonte-cigar-factory-weekdays.jpg",
  "vivonte-cigar-factory-saturday": "vivonte-cigar-factory-weekdays.jpg",
  "freestyle-catamaran-daily": "freestyle-catamaran-daily.jpg",
  "outback-safari-daily": "outback-safari-daily.jpeg",
  // Filename bumps — night show vs daytime bowl (venue uses separate stage shot).
  "anfiteatro-la-puntilla-concerts": "anfiteatro-la-puntilla-concerts-night.jpg",
  "anfiteatro-la-puntilla-weekday-culture":
    "anfiteatro-la-puntilla-weekday-bowl.jpg",
  "el-carey-karaoke-mujeres-monday": "el-carey-karaoke-mujeres-monday.jpg",
  "el-carey-weekend-nightlife": "el-carey-weekend-nightlife.jpg",
  "sosua-jewish-museum-hours": "sosua-jewish-museum-hours.jpg",
  "sosua-diving-adventures-daily": "sosua-diving-adventures-daily.jpg",
  // Filename bump — Pedro Clisante night strip (not the shared salsa-social shot).
  "el-batey-weekend-nightlife": "el-batey-weekend-nightlife-clisante.jpg",
  // Filename bump — packed night bar (not the daytime Club 59 facade).
  "d-classico-merengue-nights": "d-classico-merengue-bar.jpg",
  "sosua-pedro-clisante-food-nights": "sosua-pedro-clisante-food-nights.jpg",
  "natura-cabana-yoga-daily": "natura-cabana-yoga-daily.jpg",
  "north-coast-networking-saturday": "north-coast-networking-saturday.jpg",
  "ojo-latin-night-thursday": "ojo-latin-night-thursday.jpg",
  "ojo-weekend-dj-parties": "ojo-weekend-dj-parties.jpg",
  "la-casita-papi-beach-dining": "la-casita-papi-sand-dining.jpg",
  "el-cocotazo-cafe-beach-dining": "el-cocotazo-cafe-beach-dining.jpg",
  "iberostar-costa-dorada-day-pass": "iberostar-costa-dorada-day-pass.jpg",
  "crazy-lobster-beach-dining": "crazy-lobster-shrimp.jpg",
  "don-limon-beach-dining": "don-limon-beach-dining.jpeg",
  "los-tres-cocos-dinner": "los-tres-cocos-coconut-shrimp.jpg",
  "liquid-blue-watersports-daily": "liquid-blue-watersports-daily.jpg",
  "lax-headline-concerts": "lax-headline-concerts.jpg",
  "voyvoy-monday-live-music": "voyvoy-monday-night-terrace.jpg",
  // Filename bumps — unique heroes (sync used to clone Monday dining onto Sat/Sun).
  "voyvoy-saturday-session": "voyvoy-saturday-session-band.jpg",
  "voyvoy-sunday-open-mic": "voyvoy-sunday-open-mic-closeup.jpg",
  "womens-reconnection-kite-camp-2026": "womens-reconnection-kite-camp-2026.jpg",
  "kite-beach-wind-culture": "kite-beach-wind-culture.jpg",
  "north-coast-tech-meetup": "north-coast-tech-meetup.jpg",
  "puerto-plata-carnaval-2026": "puerto-plata-carnaval-2026.jpg",
  "malecon-morning-wellness-walk": "malecon-morning-wellness-walk.jpg",
  "hms-valeria-spanish-saturday": "hms-valeria-spanish-saturday.jpg",
  "hms-valeria-domingo-dominicano": "hms-valeria-domingo-dominicano.jpg",
  "rum-legacy-museum-daily": "rum-legacy-museum-daily.jpg",
  "la-confluencia-museum-daily": "la-confluencia-museum-daily.jpg",
  "gregorio-luperon-museum": "gregorio-luperon-museum.jpg",
  // Filename bump — barrel cellar tour (Ron Macorix entrance stays on the venue).
  "macorix-house-of-rum": "macorix-house-of-rum-cellar.jpg",
  // Filename bump — gallery opening (peach facade stays on the venue).
  "casa-de-la-cultura-exhibitions": "casa-de-la-cultura-gallery-opening.jpg",
  "casa-de-la-cultura-saturday-stage": "casa-de-la-cultura-saturday-keyboard.jpg",
  "paella-pop-el-pueblito": "paella-pop-el-pueblito.jpg",
  "paella-pop-green-one": "paella-pop-green-one.jpg",
  "lil-naay-2026-07-17": "lil-naay-2026-07-17.jpg",
  "lena-dardelet-aura-beach-club-2026-07-24":
    "lena-dardelet-aura-beach-club-2026-07-24.jpg",
  "cabarete-jazz-festival-2026": "cabarete-jazz-festival-2026.jpg",
  "jandy-ventura-legado-caballo-2026": "jandy-ventura-legado-caballo-2026.jpg",
  // Filename bump — restaurant cocktail (not the shared resort-pool still).
  "natura-cabana-saturday-live": "natura-cabana-saturday-dining.jpg",
  // Filename bump — Cabarete foodpark night (not Wikimedia Tulum).
  "el-parq-live-bands-saturday": "el-parq-saturday-night.jpg",
  "el-parq-karaoke-thursday": "el-parq-karaoke-thursday.jpg",
  "el-parq-latin-friday": "el-parq-latin-friday.jpg",
  "parada-tipica-el-choco-tuesday-live": "parada-tipica-el-choco-tuesday-live.jpg",
  "atleticos-pp-vs-capitanes-2026-07-11": "atleticos-pp-vs-capitanes-2026-07-11.jpg",
  "atleticos-pp-vs-mangueros-2026-07-17": "atleticos-pp-vs-mangueros-2026-07-17.jpg",
  "atleticos-pp-vs-mineros-2026-07-31": "atleticos-pp-vs-mineros-2026-07-31.jpg",
  "atleticos-pp-vs-granjeros-2026-08-02": "atleticos-pp-vs-granjeros-2026-08-02.jpg",
  "atleticos-pp-vs-bravos-2026-08-07": "atleticos-pp-vs-bravos-2026-08-07.jpg",
  "atleticos-pp-vs-reales-2026-08-09": "atleticos-pp-vs-reales-2026-08-09.jpg",
  "atleticos-pp-vs-arroceros-2026-08-22": "atleticos-pp-vs-arroceros-2026-08-22.jpg",
  "atleticos-pp-vs-capitanes-2026-08-28": "atleticos-pp-vs-capitanes-2026-08-28.jpg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-1":
    "ingest-asa-survival-series-cdf-vs-dracos-game-1.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-2":
    "ingest-asa-survival-series-cdf-vs-dracos-game-2.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-3":
    "ingest-asa-survival-series-cdf-vs-dracos-game-3.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-4":
    "ingest-asa-survival-series-cdf-vs-dracos-game-4.jpeg",
  "ingest-asa-survival-series-cdf-vs-dracos-game-5":
    "ingest-asa-survival-series-cdf-vs-dracos-game-5.jpeg",
  "puerto-plata-golf-classic-2026": "puerto-plata-golf-classic-2026.jpg",
  "cac-games-surf-playa-encuentro-2026": "cac-games-surf-playa-encuentro-2026.jpg",
  "puerto-plata-beach-soccer-2026": "puerto-plata-beach-soccer-2026.jpg",
  "sosua-10k-road-race-2026": "sosua-10k-road-race-2026.jpg",
  "puerto-plata-poker-experience-2026": "puerto-plata-poker-experience-2026.jpg",
  "aventurate-rd-2026": "aventurate-rd-2026.jpg",
  "sunset-cabarete-sessions-2026": "sunset-cabarete-sessions-2026.jpg",
  "la-chabola-wednesday-open-mic": "la-chabola-wednesday-open-mic.jpg",
  "groundzero-domingos-pal-pueblo": "groundzero-domingos-pal-pueblo.jpg",
  "groundzero-viernes-locos": "groundzero-viernes-locos.jpg",
  "groundzero-party-rojo-2026-08-01": "groundzero-party-rojo-2026-08-01.jpg",
  "blue-ice-saturday-gogo": "blue-ice-saturday-gogo.jpg",
  "silent-run-5k-2026-07-25": "silent-run-5k-2026-07-25.jpg",
  "victrola-sabado-bailable": "victrola-sabado-bailable.jpg",
  "victrola-ladies-night-friday": "victrola-ladies-night-friday.jpg",
  "cigar-town-acustico-humos-2026-08-14":
    "cigar-town-acustico-humos-2026-08-14.jpg",
  // Filename bump — terrace crowd (not the shared dining-room still).
  "chill-and-grill-bingo-2026-08-03": "chill-and-grill-bingo-terrace.jpg",
  "sunset-night-party-playa-encuentro-2026-07-25":
    "sunset-night-party-playa-encuentro-2026-07-25.jpg",
  "los-event-trilogy-2026-09-03": "los-event-trilogy-2026-09-03.jpg",
  "sunset-laughter-club-cabarete": "sunset-laughter-club-cabarete.jpg",
  "huelga-velada-maltrato-animal-torre-alta-2026-08-07":
    "huelga-velada-maltrato-animal-torre-alta-2026-08-07.jpg",
  "gym-sov-zumba-tuesday": "gym-sov-zumba-fitness.jpg",
  "handmade-pina-colada-experience": "handmade-pina-colada-experience.webp",
  "congreso-damas-adn-2026": "congreso-damas-adn-2026.jpg",
  "master-of-the-ocean-2026": "master-of-the-ocean-2026.jpg",
  "atlantico-fc-vs-delfines-2026-08-22":
    "atlantico-fc-vs-delfines-2026-08-22.jpg",
  "dewry-luciano-zona-acapella-2026-08-23":
    "dewry-luciano-zona-acapella-2026-08-23.jpg",
  "pop-cinemas-week-2026-08-20": "pop-cinemas-week-2026-08-20.jpg",
  "petit-francois-friday-karaoke": "petit-francois-friday-karaoke.jpg",
  "costambar-beach-fitness": "costambar-beach-fitness.png",
  "love-does-bocadillos-course-2026": "love-does-bocadillos-course-2026.jpg",
  "love-does-cocktails-solidarity-2026-09-04":
    "love-does-cocktails-solidarity-2026-09-04.jpg",
  "waterfront-playa-alicia-sunset-dining":
    "waterfront-playa-alicia-sunset-dining.jpg",
  "waterfront-playa-alicia-friday-jazz":
    "waterfront-playa-alicia-friday-jazz.jpg",
  "rio-sonador-finca-papirucho": "rio-sonador-finca-papirucho.jpg",
  "sunset-grill-velero-beachfront-dining":
    "sunset-grill-velero-beachfront-dining.jpg",
  "sunset-grill-velero-sushi-nights":
    "sunset-grill-velero-sushi-nights.jpg",
  "charco-los-militares-daily": "charco-los-militares-daily.jpg",
  "la-rejoya-trek": "la-rejoya-trek.jpg",
  "rio-martinico-sosua": "rio-martinico-sosua.jpg",
  "ingest-hidden-river-kayak-adventure":
    "ingest-hidden-river-kayak-adventure.jpg",
  "flip-flop-live-sports-daily": "flip-flop-live-sports-daily.jpg",
  "flip-flop-wing-wednesday": "flip-flop-wing-wednesday.jpg",
  "flip-flop-taco-tuesday": "flip-flop-taco-tuesday.jpg",
  "flip-flop-monday-happy-hour": "flip-flop-monday-happy-hour.jpg",
};

/** Legacy ingest ids that share a curated event image. */
const EVENT_IMAGE_ALIASES: Record<string, string> = {
  "ingest-1783371784615-0-18th-annual-cabarete-butterfly-effect":
    "ingest-18th-annual-cabarete-butterfly-effect",
  "museo-ambar-saturday": "museo-ambar-weekdays",
  "gym-sov-zumba-lift-thursday": "gym-sov-zumba-tuesday",
};

const EVENT_IMAGE_PREFIXES: { prefix: string; file: string }[] = [
  { prefix: "el-carey-wc2026-", file: "el-carey-wc2026.jpg" },
];

/** Tailwind object-position for detail heroes when the focal point isn't center. */
const EVENT_HERO_OBJECT_POSITION: Record<string, string> = {
  // Short mobile heroes keep the sun; desktop centers the sunset composition.
  "lax-sunset-daily": "object-top lg:object-center",
};

function curatedEventImageFile(eventId: string): string | undefined {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  return (
    EVENT_IMAGE_FILES[resolvedId] ??
    EVENT_IMAGE_PREFIXES.find((p) => resolvedId.startsWith(p.prefix))?.file
  );
}

export function getEventImageUrl(eventId: string): string | undefined {
  const file = curatedEventImageFile(eventId);
  return file ? `/events/${file}?v=${getAppVersion()}` : undefined;
}

/** Facebook/WhatsApp OG file generated at build (1200×630 baseline JPEG, no query string). */
export function getEventOgImageUrl(eventId: string): string | undefined {
  const file = curatedEventImageFile(eventId);
  if (!file) return undefined;
  const stem = file.replace(/\.(jpe?g|png|webp)$/i, "");
  return `/og/events/${stem}.jpg`;
}

export function getEventHeroObjectPosition(eventId: string): string {
  const resolvedId = EVENT_IMAGE_ALIASES[eventId] ?? eventId;
  return EVENT_HERO_OBJECT_POSITION[resolvedId] ?? "object-center";
}

function storedHeroIsDisplayable(url: string | undefined): boolean {
  const stored = url?.trim();
  if (!stored) return false;
  // OTA thumbs hotlink-block and aren't on the next/image allowlist —
  // they render as an empty hero. Keep other remotes and local paths.
  try {
    const host = new URL(stored).hostname.toLowerCase();
    if (
      host === "cdn.getyourguide.com" ||
      host.endsWith(".getyourguide.com") ||
      host.endsWith(".viator.com") ||
      host.endsWith(".civitatis.com")
    ) {
      return false;
    }
  } catch {
    return stored.startsWith("/");
  }
  return true;
}

export function attachEventImage<
  T extends { id: string; imageUrl?: string; venueSlug?: string },
>(event: T): T & { imageUrl?: string } {
  const curated = getEventImageUrl(event.id);
  const stored = event.imageUrl?.trim();
  const venueFallback = event.venueSlug
    ? getVenueImageUrl(event.venueSlug)
    : undefined;
  const imageUrl =
    curated ??
    (storedHeroIsDisplayable(stored) ? stored : undefined) ??
    venueFallback ??
    stored;
  return imageUrl ? { ...event, imageUrl } : event;
}

export function attachEventImages<
  T extends { id: string; imageUrl?: string; venueSlug?: string },
>(events: T[]): (T & { imageUrl?: string })[] {
  return events.map(attachEventImage);
}
