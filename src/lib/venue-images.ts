/** Maps venue slugs to image files under /public/venues (synced from event photos / popevent-images). */
import { getAppVersion } from "./app-version";

const VENUE_IMAGE_FILES: Record<string, string> = {
  // Filename bump after replacing the shared Sunset Sessions deck shot.
  "lax-cabarete": "lax-cabarete-bar.jpg",
  // Filename bump after replacing night concert stage with daytime promenade.
  "malecon-puerto-plata": "malecon-puerto-plata-promenade.jpg",
  "kite-beach": "kite-beach.jpg",
  // Filename bump — Kite Beach school patio (kite-jump stays on the watersports event).
  "liquid-blue-cabarete": "liquid-blue-cabarete-beach.jpg",
  // Filename bump — Pedro Clisante restaurant strip (not Plaza García / Entrada).
  "el-batey-sosua": "el-batey-pedro-clisante-strip.jpg",
  // Filename bump — garden patio with NOMA'S sign (replaces entrance walk-by).
  "nonas-grill-kitchen": "nonas-grill-kitchen-garden.jpg",
  "hard-rock-sosua": "hard-rock-sosua.jpg",
  "international-school-sosua": "international-school-sosua-entrance.jpg",
  // Filename bump after replacing shared concert stock — next/image rejects ?v= on local paths.
  "castaways-sosua": "castaways-sosua-dining.jpg",
  // Filename bump — daytime pool / palapa place shot (editor-provided).
  "hotel-voramar-sosua": "hotel-voramar-sosua-pool.jpg",
  "casa-coco-sosua": "casa-coco-sosua.jpg",
  "smileys-bar-sosua": "smileys-bar-sosua-daytime.jpg",
  "finish-line-sosua": "finish-line-sosua-bar.jpg",
  // Filename bump — POP aerial of Sosúa Bay (editor-provided; UI badge cropped).
  "playa-sosua": "playa-sosua-aerial-bay.jpg",
  // Filename bump — POP photo of the Bar 39 palapa and 39 sign (not the beach-strip stock).
  "bar-39-sosua": "bar-39-sosua-palapa.jpg",
  "cheers-bar-sosua": "cheers-bar-sosua-dining.jpg",
  "sosua-jewish-museum": "sosua-jewish-museum-facade.jpg",
  "templo-de-las-americas": "templo-de-las-americas.jpg",
  "sosua-diving-center": "sosua-diving-center.jpg",
  // Filename bump — Maps reception palapa (not the Saturday dining cocktail).
  "natura-cabana": "natura-cabana-recepcion.jpg",
  // Filename bump — daytime Clasico Club 59 facade (not the night bar).
  "d-classico-sosua": "d-classico-sosua-daytime.jpg",
  // Filename bump — authentic Voyvoy bar interior (not shared dining URL with all nights).
  "voyvoy-cabarete": "voyvoy-cabarete-bar.jpg",
  "gypsy-bowls-cabarete": "gypsy-bowls-cabarete-exterior.jpg",
  "drifter-cabarete": "drifter-cabarete-sunset.jpg",
  "aura-beach-club-cabarete": "aura-beach-club-cabarete-entrance.jpg",
  // Filename bump after replacing a generic Restaurant Guru table shot.
  "la-casita-de-papi": "la-casita-de-papi-awning.jpg",
  // Filename bump — empty kite-beach deck (couple dining stays on the event).
  "el-cocotazo-cafe": "el-cocotazo-cafe-deck.jpg",
  // Filename bump — distinct stage/arch place shot (not shared with concert heroes).
  "anfiteatro-la-puntilla": "anfiteatro-la-puntilla-stage.jpg",
  "ocean-world": "ocean-world-park.jpg",
  // Filename bump — Tennis Club patio (Saturday Market flyer stays off the venue).
  "sea-horse-ranch": "sea-horse-ranch-tennis-club.jpg",
  // Filename bump — night entrance (Cadillac bar stays on the live listing).
  "senor-rock-playa-dorada": "senor-rock-playa-dorada-entrance.jpg",
  "cremo-cigar-bar": "cremo-cigar-bar.jpg",
  "big-lees-beach-bar": "big-lees-beach-bar.jpg",
  // Filename bump — Maps tiki bar (not the Saturday sancocho flyer).
  "pingui-bar": "pingui-bar-tiki.jpg",
  "el-carey-puerto-plata": "el-carey-puerto-plata.webp",
  "el-colibri-hotel": "el-colibri-hotel.jpg",
  "taino-bay": "taino-bay-village.jpg",
  "amber-cove": "amber-cove-village.jpg",
  // Filename bump — Wikimedia lawn + flags (not the 524px aerial clone / event hero).
  "fortaleza-san-felipe": "fortaleza-san-felipe-bastion.jpg",
  "museo-ambar": "museo-ambar.jpg",
  "charcos-damajagua": "charcos-damajagua.jpg",
  "teleferico-puerto-plata": "teleferico-puerto-plata.jpg",
  "cayo-arena": "cayo-arena.jpg",
  "paseo-dona-blanca": "paseo-dona-blanca.jpg",
  "calle-sombrillas": "calle-sombrillas-umbrella-street-v2.jpg",
  // Filename bump — POP kite canopy on Calle Sánchez / Chichiguas.
  "kite-street-pop": "kite-street-pop-chichiguas.jpg",
  "letrero-puerto-plata": "letrero-puerto-plata.jpg",
  "faro-puerto-plata": "faro-puerto-plata-park.jpg",
  "cuartel-bomberos-puerto-plata": "cuartel-bomberos-puerto-plata.jpg",
  "fun-city": "fun-city.jpg",
  "grecialandia": "grecialandia-village.jpg",
  "monkeyland-puerto-plata": "monkeyland-puerto-plata.jpg",
  "coconut-cove": "coconut-cove.jpg",
  "brugal-rum-center": "brugal-rum-center.jpg",
  // Filename bump — Google Maps facade (not the shared chocolate-box overlay).
  "del-oro-chocolate-factory": "del-oro-chocolate-factory-facade.jpg",
  "hacienda-cufa": "hacienda-cufa.jpg",
  "tabacalera-cremo": "tabacalera-cremo.jpg",
  "vivonte-cigar-factory": "vivonte-cigar-factory.jpg",

  "outback-adventures": "outback-adventures.jpg",
  "hms-valeria": "hms-valeria.jpg",
  "rum-legacy-museum": "rum-legacy-museum.jpg",
  "la-confluencia-museum": "la-confluencia-museum.jpg",
  "gregorio-luperon-museum": "gregorio-luperon-museum.jpg",
  "macorix-house-of-rum": "macorix-house-of-rum.jpg",
  "casa-de-la-cultura": "casa-de-la-cultura.jpg",
  "handmade-the-brand": "handmade-the-brand.jpeg",
  "parque-jose-briceno": "parque-jose-briceno.jpg",
  "gregorio-luperon-airport": "gregorio-luperon-airport.jpg",
  "club-deportivo-fantastico": "club-deportivo-fantastico.jpeg",
  // Filename bump — El Pueblito rooftop sign (Unsplash pan stays on the event).
  "paella-pop-el-pueblito": "paella-pop-el-pueblito-sign.jpg",
  // Filename bump — Green One Playa Dorada resort (plated seafood stays on the event).
  "paella-pop-green-one": "paella-pop-green-one-resort.jpg",
  "plaza-independencia": "plaza-independencia.jpg",
  "plaza-juan-brugal": "plaza-juan-brugal-licorlab.jpg",
  // Filename bump — plaza gazebo aerial (highway welcome sign stays on the patronales event).
  "plaza-sanchez-imbert": "plaza-sanchez-imbert-park.jpg",
  "rincon-caliente-guananico": "rincon-caliente-guananico.jpg",
  // Filename bump — this Cabarete foodpark (not Wikimedia Tulum).
  "el-parq-cabarete": "el-parq-cabarete-foodpark.jpg",
  "ninafrika-dance-school-cabarete": "ninafrika-dance-school-cabarete-beach.jpg",
  // Filename bump — Latin Disco Club interior (disco ball / lit floor; replaces Unsplash concert stock).
  "disco-club-brugal": "disco-club-brugal-interior.jpg",
  "twenty-disco-lounge": "twenty-disco-lounge-bar.jpg",
  "parada-tipica-el-choco": "parada-tipica-el-choco.jpg",
  "blue-jacktar-playa-dorada": "blue-jacktar-playa-dorada.jpg",
  // Filename bump — Calle Dr. Rosen storefront with blue ice PIANO BAR sign.
  "blue-ice-pianobar-sosua": "blue-ice-pianobar-sosua-facade.jpg",
  "playa-dorada-golf": "playa-dorada-golf.jpg",
  "playa-encuentro": "playa-encuentro.jpg",
  "playa-los-charamicos": "playa-los-charamicos.jpg",
  // Filename bump — tiki bar interior (branded pizza stays on Wednesday open mic).
  "la-chabola-cabarete": "la-chabola-bar.jpg",
  // Filename bump — branded lounge interior (Domingos Pal Pueblo flyer stays on the event).
  "ground-zero-disco": "ground-zero-disco-lounge.jpg",
  // Filename bump to force cache refresh after storefront photo was added but not deployed.
  "victrola-037": "victrola-037-storefront.jpg",
  "cigar-town-pop": "cigar-town-pop.jpg",
  "ocean-one-cabarete": "ocean-one-cabarete-pool.jpg",
  // Filename bump after replacing an Ocean World dolphin-sign stand-in.
  "vip-beach-lifestyles-resort": "vip-beach-lifestyles-tropical.jpg",
  "gym-sov-sosua-ocean-village": "gym-sov-sosua-ocean-village.webp",
  "laguna-sov": "laguna-sov-kids-park.jpg",
  "santa-fe-sov": "santa-fe-sov-pools.jpg",
  "restaurant-maria-sov": "restaurant-maria-sov-terrace.jpg",
  "zen-fitness-cabarete": "zen-fitness-cabarete.jpg",
  // Filename bump — thatched training palapa / gym mats (editor-provided).
  "desarrollo-fitness-cabarete": "desarrollo-fitness-cabarete-gym.jpg",
  // Filename bump — Cuevas del Choco lagoon swim (editor-provided).
  "parque-nacional-el-choco": "parque-nacional-el-choco-cave.jpg",
  "gran-ventana-beach-resort": "gran-ventana-beach-resort.jpg",
  "cofresi-palm-beach-spa": "cofresi-palm-beach-spa.jpg",
  // Filename bumps after replacing flyer / logo / park-aerial stand-ins.
  // Filename bump — dusk exterior with MECLAO Rooftop Lounge sign (editor-provided).
  "meclao-rooftop": "meclao-rooftop-exterior-dusk.jpg",
  "kviar-costa-dorada": "kviar-costa-dorada-floor.jpg",
  "iberostar-waves-costa-dorada": "iberostar-waves-costa-dorada.jpg",
  "playa-cofresi": "playa-cofresi-beach.jpg",
  "don-limon-cofresi": "don-limon-cofresi.jpeg",
  // Filename bump — POP on-site entrance sign crop (garden dining stays on the event).
  "los-tres-cocos-cofresi": "los-tres-cocos-cofresi-entrance-sign.jpg",
  "crazy-lobster-maimon": "crazy-lobster-maimon.jpg",
  // Filename bump — Costambar hotel facade (karaoke uses Amado’s night patio).
  "hotel-ocean-winds": "hotel-ocean-winds-facade.jpg",
  "estadio-leonel-placido": "estadio-leonel-placido.jpg",
  "zona-acapella-club": "zona-acapella-club.jpg",
  "vinoteca-wine-house": "vinoteca-wine-house.jpg",
  "pop-cinemas-playa-dorada": "pop-cinemas-playa-dorada.jpg",
  // Filename bump — daytime bistro with the Le Petit François sign (not the tall tiki-torch dinner).
  "le-petit-francois": "le-petit-francois-bistro.jpg",
  "playa-costambar": "playa-costambar.png",
  "love-does-sosua": "love-does-sosua.jpg",
  // Filename bump — palapa-to-deck (sunset terrace stays on the dining event).
  "waterfront-playa-alicia": "waterfront-playa-alicia-palapa.jpg",
  // Filename bump — finca campsite (log crossing stays on the river event).
  "finca-papirucho": "finca-papirucho-glamping.jpg",
  "sunset-grill-velero": "sunset-grill-velero.jpg",
  "charco-los-militares": "charco-los-militares.jpg",
  "la-rejoya": "la-rejoya.jpg",
  "rio-martinico": "rio-martinico.jpg",
  "jamao-al-norte": "jamao-al-norte.jpg",
  // Filename bump — yellow-steps entrance (homepage interior stays on live sports).
  "flip-flop-sports-bar-sosua": "flip-flop-sports-bar-sosua-yellow-steps.jpg",
  // Restaurant Week 2026 participants — curated place shots.
  "aguaji-sosua": "aguaji-sosua.jpg",
  "baia-lounge-sosua": "baia-lounge-sosua.jpg",
  "bliss-cabarete": "bliss-cabarete.jpg",
  "casa-balcon-puerto-plata": "casa-balcon-puerto-plata.jpg",
  "casa-caribe-puerto-plata": "casa-caribe-puerto-plata.jpg",
  "project-paradise-cabarete": "project-paradise-cabarete.jpg",
  "casita-azul-puerto-plata": "casita-azul-puerto-plata.jpg",
  "la-isabela-colonial-puerto-plata": "la-isabela-colonial-puerto-plata.jpg",
  "la-lola-malecon": "la-lola-malecon.jpg",
  "latinwok-puerto-plata": "latinwok-puerto-plata.jpg",
  "latinwok-plaza-uno": "latinwok-plaza-uno.jpg",
  "mauros-puerto-plata": "mauros-puerto-plata.jpg",
  "mi-bodegon-cabarete": "mi-bodegon-cabarete.jpg",
  "tasty-food-park-puerto-plata": "tasty-food-park-puerto-plata.jpg",
  "sosua-food-market": "sosua-food-market-entrance.jpg",
  // Filename bump — dining terrace with floral arch + valley/ocean view (editor-provided).
  "rancho-catalina-puerto-plata":
    "rancho-catalina-puerto-plata-terrace-dining.jpg",
  "ristorante-passatore-playa-dorada": "ristorante-passatore-playa-dorada.jpg",
  "sambalu-puerto-plata": "sambalu-puerto-plata.jpg",
  "skina-puerto-plata": "skina-puerto-plata.jpg",
  "sun-club-costa-norte-sosua": "sun-club-costa-norte-sosua.jpg",
  "lokuras-pop": "lokuras-pop-interior.jpg",
  "nova-salud-bienestar": "nova-salud-bienestar-facade.jpg",
  "camara-comercio-puerto-plata": "camara-comercio-puerto-plata-facade.jpg",
  "ambar-lounge-pop": "ambar-lounge-pop-interior-v4.jpg",
  "nueve-puerto-plata": "nueve-puerto-plata.jpg",
  "grand-prix-puerto-plata": "grand-prix-puerto-plata.jpg",
  "el-mirador-de-finely": "el-mirador-de-finely-balcony.jpg",
  "luna-lounge-lcb": "luna-lounge-lcb-facade.jpg",
  "ivan-garcia-teatro-escuela": "ivan-garcia-teatro-escuela-facade.jpg",
  "spotland-puerto-plata": "spotland-puerto-plata-entrance.jpg",
  // Filename bump — POP-supplied Calle de las Sombrillas classic-car line (not the coastal convoy event hero).
  "classic-cars-dominicana": "classic-cars-dominicana-umbrella-street.jpg",
  // POP-supplied mural party trolley with riders (flyer stays on the daily listing).
  "trolley-city-tours": "trolley-city-tours-party-bus.jpg",
  "hotel-villa-taina": "hotel-villa-taina-pool.jpg",
  "terramar-pickleball-club": "terramar-pickleball-club.jpg",
};

/** Cache-busted URL for general venue thumbnails / JSON-LD. */
export function getVenueImageUrl(slug: string): string | undefined {
  const file = VENUE_IMAGE_FILES[slug];
  return file ? `/venues/${file}?v=${getAppVersion()}` : undefined;
}

/** Stable local path for venue heroes (works with next/image). */
export function getVenueHeroImageUrl(slug: string): string | undefined {
  const file = VENUE_IMAGE_FILES[slug];
  return file ? `/venues/${file}` : undefined;
}

/** Tailwind object-position for venue heroes when the focal point isn't center. */
const VENUE_HERO_OBJECT_POSITION: Record<string, string> = {
  // Portrait palapa shot — keep the 39 sign in wide card crops.
  "bar-39-sosua": "object-top",
  // Balcony lunch overlooking the park — keep the table/view at the top of the crop.
  "casa-balcon-puerto-plata": "object-top",
  // Keep the SPOTLAND sign in frame on the entrance crop (mobile + desktop).
  "spotland-puerto-plata": "object-top",
  // Keep the NUEVE sign / entrance lights in the crop (mobile + desktop).
  "nueve-puerto-plata": "object-top",
};

export function getVenueHeroObjectPosition(slug: string): string {
  return VENUE_HERO_OBJECT_POSITION[slug] ?? "object-center";
}

/** Wide venue-card crop. Custom focal points stay put; the default is top on phones. */
export function getVenueCardObjectPosition(slug: string): string {
  const position = getVenueHeroObjectPosition(slug);
  return position === "object-center" ? "object-top sm:object-center" : position;
}

export function attachVenueImage<T extends { slug: string; imageUrl?: string }>(
  venue: T,
): T & { imageUrl?: string } {
  const curated = getVenueImageUrl(venue.slug);
  const imageUrl = curated ?? venue.imageUrl;
  return imageUrl ? { ...venue, imageUrl } : venue;
}

export function attachVenueImages<T extends { slug: string; imageUrl?: string }>(
  venues: T[],
): (T & { imageUrl?: string })[] {
  return venues.map(attachVenueImage);
}
