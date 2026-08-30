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
  "nonas-grill-kitchen": "nonas-grill-kitchen.jpg",
  "hard-rock-sosua": "hard-rock-sosua.jpg",
  // Filename bump after replacing shared concert stock — next/image rejects ?v= on local paths.
  "castaways-sosua": "castaways-sosua-dining.jpg",
  "hotel-voramar-sosua": "hotel-voramar-sosua.jpg",
  "smileys-bar-sosua": "smileys-bar-sosua-daytime.jpg",
  "finish-line-sosua": "finish-line-sosua-bar.jpg",
  // Filename bump after replacing a shared Freestyle Catamaran shot.
  "playa-sosua": "playa-sosua-shore.jpg",
  "bar-39-sosua": "bar-39-sosua-beach.jpg",
  "cheers-bar-sosua": "cheers-bar-sosua-dining.jpg",
  "sosua-jewish-museum": "sosua-jewish-museum.jpg",
  "sosua-diving-center": "sosua-diving-center.jpg",
  // Filename bump — Maps reception palapa (not the Saturday dining cocktail).
  "natura-cabana": "natura-cabana-recepcion.jpg",
  // Filename bump — daytime Clasico Club 59 facade (not the night bar).
  "d-classico-sosua": "d-classico-sosua-daytime.jpg",
  // Filename bump — authentic Voyvoy bar interior (not shared dining URL with all nights).
  "voyvoy-cabarete": "voyvoy-cabarete-bar.jpg",
  "aura-beach-club-cabarete": "aura-beach-club-cabarete.jpg",
  // Filename bump after replacing a generic Restaurant Guru table shot.
  "la-casita-de-papi": "la-casita-de-papi-awning.jpg",
  // Filename bump — empty kite-beach deck (couple dining stays on the event).
  "el-cocotazo-cafe": "el-cocotazo-cafe-deck.jpg",
  // Filename bump — distinct stage/arch place shot (not shared with concert heroes).
  "anfiteatro-la-puntilla": "anfiteatro-la-puntilla-stage.jpg",
  "cowork-cabarete": "cowork-cabarete.jpg",
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
  // Filename bump — Wikimedia lawn + flags (not the 524px aerial clone / event hero).
  "fortaleza-san-felipe": "fortaleza-san-felipe-bastion.jpg",
  "museo-ambar": "museo-ambar.jpg",
  "charcos-damajagua": "charcos-damajagua.jpg",
  "teleferico-puerto-plata": "teleferico-puerto-plata.jpg",
  "cayo-arena": "cayo-arena.jpg",
  "paseo-dona-blanca": "paseo-dona-blanca.jpg",
  "calle-sombrillas": "calle-sombrillas.jpg",
  "letrero-puerto-plata": "letrero-puerto-plata.jpg",
  "fun-city": "fun-city.jpg",
  "monkeyland-puerto-plata": "monkeyland-puerto-plata.jpg",
  "coconut-cove": "coconut-cove.jpg",
  "brugal-rum-center": "brugal-rum-center.jpg",
  // Filename bump — Google Maps facade (not the shared chocolate-box overlay).
  "del-oro-chocolate-factory": "del-oro-chocolate-factory-facade.jpg",
  "hacienda-cufa": "hacienda-cufa.jpg",
  "tabacalera-cremo": "tabacalera-cremo.jpg",
  "vivonte-cigar-factory": "vivonte-cigar-factory.jpg",
  "freestyle-catamaran": "freestyle-catamaran.jpg",
  "outback-adventures": "outback-adventures.jpg",
  "hms-valeria": "hms-valeria.jpg",
  "rum-legacy-museum": "rum-legacy-museum.jpg",
  "la-confluencia-museum": "la-confluencia-museum.jpg",
  "gregorio-luperon-museum": "gregorio-luperon-museum.jpg",
  "macorix-house-of-rum": "macorix-house-of-rum.jpg",
  "casa-de-la-cultura": "casa-de-la-cultura.jpg",
  "handmade-the-brand": "handmade-the-brand.jpeg",
  "parque-jose-briceno": "parque-jose-briceno.jpg",
  "club-deportivo-fantastico": "club-deportivo-fantastico.jpeg",
  // Filename bump — El Pueblito rooftop sign (Unsplash pan stays on the event).
  "paella-pop-el-pueblito": "paella-pop-el-pueblito-sign.jpg",
  // Filename bump — Green One Playa Dorada resort (plated seafood stays on the event).
  "paella-pop-green-one": "paella-pop-green-one-resort.jpg",
  "plaza-independencia": "plaza-independencia.jpg",
  // Filename bump — plaza gazebo aerial (highway welcome sign stays on the patronales event).
  "plaza-sanchez-imbert": "plaza-sanchez-imbert-park.jpg",
  "rincon-caliente-guananico": "rincon-caliente-guananico.jpg",
  // Filename bump — this Cabarete foodpark (not Wikimedia Tulum).
  "el-parq-cabarete": "el-parq-cabarete-foodpark.jpg",
  "disco-club-brugal": "disco-club-brugal.jpg",
  "parada-tipica-el-choco": "parada-tipica-el-choco.jpg",
  "blue-jacktar-playa-dorada": "blue-jacktar-playa-dorada.jpg",
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
  "vip-beach-lifestyles-resort": "vip-beach-lifestyles-resort.jpg",
  "gym-sov-sosua-ocean-village": "gym-sov-sosua-ocean-village.webp",
  "laguna-sov": "laguna-sov-kids-park.jpg",
  "santa-fe-sov": "santa-fe-sov-pools.jpg",
  "restaurant-maria-sov": "restaurant-maria-sov-terrace.jpg",
  "zen-fitness-cabarete": "zen-fitness-cabarete.jpg",
  // Filename bump — Maps palapa dining hall (not El Blachy’s patio still).
  "cacique-moncion": "cacique-moncion-palapa.jpg",
  "gran-ventana-beach-resort": "gran-ventana-beach-resort.jpg",
  "cofresi-palm-beach-spa": "cofresi-palm-beach-spa.jpg",
  // Filename bumps after replacing flyer / logo / park-aerial stand-ins.
  "meclao-rooftop": "meclao-rooftop-lounge.jpg",
  "kviar-costa-dorada": "kviar-costa-dorada-floor.jpg",
  "iberostar-waves-costa-dorada": "iberostar-waves-costa-dorada.jpg",
  "playa-cofresi": "playa-cofresi-beach.jpg",
  "don-limon-cofresi": "don-limon-cofresi.jpeg",
  "los-tres-cocos-cofresi": "los-tres-cocos-cofresi.jpg",
  "crazy-lobster-maimon": "crazy-lobster-maimon.jpg",
  // Filename bump — Costambar hotel facade (karaoke uses Amado’s night patio).
  "hotel-ocean-winds": "hotel-ocean-winds-facade.jpg",
  "estadio-leonel-placido": "estadio-leonel-placido.jpg",
  "zona-acapella-club": "zona-acapella-club.jpg",
  "pop-cinemas-playa-dorada": "pop-cinemas-playa-dorada.jpg",
  "le-petit-francois": "le-petit-francois.jpg",
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
  "flip-flop-sports-bar-sosua": "flip-flop-sports-bar-sosua.jpg",
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
