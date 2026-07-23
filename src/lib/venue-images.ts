/** Maps venue slugs to image files under /public/venues (synced from event photos / popevent-images). */
import { getAppVersion } from "./app-version";

const VENUE_IMAGE_FILES: Record<string, string> = {
  "lax-cabarete": "lax-cabarete.jpg",
  "malecon-puerto-plata": "malecon-puerto-plata.jpg",
  "kite-beach": "kite-beach.jpg",
  "liquid-blue-cabarete": "liquid-blue-cabarete.jpg",
  "el-batey-sosua": "el-batey-sosua.jpg",
  "hard-rock-sosua": "hard-rock-sosua.jpg",
  "castaways-sosua": "castaways-sosua.jpg",
  "hotel-voramar-sosua": "hotel-voramar-sosua.jpg",
  "smileys-bar-sosua": "smileys-bar-sosua.jpg",
  "finish-line-sosua": "finish-line-sosua.jpg",
  "playa-sosua": "playa-sosua.jpg",
  "bar-39-sosua": "bar-39-sosua.jpg",
  "cheers-bar-sosua": "cheers-bar-sosua.jpg",
  "sosua-jewish-museum": "sosua-jewish-museum.jpg",
  "sosua-diving-center": "sosua-diving-center.jpg",
  "natura-cabana": "natura-cabana.jpg",
  "d-classico-sosua": "d-classico-sosua.jpg",
  "voyvoy-cabarete": "voyvoy-cabarete.jpg",
  "aura-beach-club-cabarete": "aura-beach-club-cabarete.jpg",
  "la-casita-de-papi": "la-casita-de-papi.jpg",
  "anfiteatro-la-puntilla": "anfiteatro-la-puntilla.jpg",
  "cowork-cabarete": "cowork-cabarete.jpg",
  "ocean-world": "ocean-world.jpg",
  "sea-horse-ranch": "sea-horse-ranch.jpg",
  "senor-rock-playa-dorada": "senor-rock-playa-dorada.jpg",
  "cremo-cigar-bar": "cremo-cigar-bar.jpg",
  "big-lees-beach-bar": "big-lees-beach-bar.jpg",
  "pingui-bar": "pingui-bar.jpg",
  "el-carey-puerto-plata": "el-carey-puerto-plata.webp",
  "el-colibri-hotel": "el-colibri-hotel.jpg",
  "fortaleza-san-felipe": "fortaleza-san-felipe.jpg",
  "museo-ambar": "museo-ambar.jpg",
  "charcos-damajagua": "charcos-damajagua.jpg",
  "teleferico-puerto-plata": "teleferico-puerto-plata.jpg",
  "cayo-arena": "cayo-arena.jpg",
  "paseo-dona-blanca": "paseo-dona-blanca.jpg",
  "calle-sombrillas": "calle-sombrillas.jpg",
  "fun-city": "fun-city.jpg",
  "monkeyland-puerto-plata": "monkeyland-puerto-plata.jpg",
  "coconut-cove": "coconut-cove.jpg",
  "brugal-rum-center": "brugal-rum-center.jpg",
  "del-oro-chocolate-factory": "del-oro-chocolate-factory.jpg",
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
  "paella-pop-el-pueblito": "paella-pop-el-pueblito.jpg",
  "paella-pop-green-one": "paella-pop-green-one.jpg",
  "plaza-independencia": "plaza-independencia.jpg",
  "el-parq-cabarete": "el-parq-cabarete.jpg",
  "disco-club-brugal": "disco-club-brugal.jpg",
  "parada-tipica-el-choco": "parada-tipica-el-choco.jpg",
  "blue-jacktar-playa-dorada": "blue-jacktar-playa-dorada.jpg",
  "playa-dorada-golf": "playa-dorada-golf.jpg",
  "playa-encuentro": "playa-encuentro.jpg",
  "playa-los-charamicos": "playa-los-charamicos.jpg",
  "la-chabola-cabarete": "la-chabola-cabarete.jpg",
  "ground-zero-disco": "ground-zero-disco.jpg",
  "victrola-037": "victrola-037.jpg",
  "ocean-one-cabarete": "ocean-one-cabarete.jpg",
  "vip-beach-lifestyles-resort": "vip-beach-lifestyles-resort.jpg",
  "gym-sov-sosua-ocean-village": "gym-sov-sosua-ocean-village.webp",
  "zen-fitness-cabarete": "zen-fitness-cabarete.jpg",
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
