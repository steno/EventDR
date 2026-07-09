import type { Venue } from "@/lib/types";

/** Fallback venues when Firebase is not configured. */
export const SEED_VENUES: Venue[] = [
  {
    slug: "lax-cabarete",
    name: "LAX Cabarete",
    city: "Cabarete",
    description:
      "Beachfront bar and live music hub on Cabarete Bay. Reggae nights, concerts, and sunset sessions.",
    lat: 19.7498,
    lng: -70.4082,
    emoji: "🎵",
    instagram: "laxcabarete",
  },
  {
    slug: "malecon-puerto-plata",
    name: "Malecón de Puerto Plata",
    city: "Puerto Plata",
    description:
      "Waterfront promenade with free concerts, food festivals, and local gatherings.",
    lat: 19.7934,
    lng: -70.6884,
    emoji: "🌊",
  },
  {
    slug: "kite-beach",
    name: "Kite Beach",
    city: "Cabarete",
    description:
      "World-famous kite surfing beach. Competitions, beach sports, and weekend meetups.",
    lat: 19.7512,
    lng: -70.415,
    emoji: "🏄",
  },
  {
    slug: "el-batey-sosua",
    name: "El Batey",
    city: "Sosúa",
    description: "Nightlife, salsa socials, and open mic nights in downtown Sosúa.",
    lat: 19.7528,
    lng: -70.5261,
    emoji: "🎤",
  },
  {
    slug: "cowork-cabarete",
    name: "Cowork Cabarete",
    city: "Cabarete",
    description: "Remote worker hub hosting startup meetups and tech talks.",
    lat: 19.7485,
    lng: -70.41,
    emoji: "💼",
  },
  {
    slug: "ocean-world",
    name: "Ocean World Adventure Park",
    city: "Puerto Plata",
    description:
      "Marine adventure park in Cofresí — dolphin swims, sea lion and shark encounters, snorkeling, and a water slide lagoon.",
    lat: 19.8267,
    lng: -70.71,
    emoji: "🐬",
    instagram: "oceanworldadventurepark",
    website: "https://www.oceanworld.net",
  },
  {
    slug: "sea-horse-ranch",
    name: "Sea Horse Ranch",
    city: "Cabarete-Sosúa",
    description:
      "Residential resort and tennis club on Route 5 between Cabarete and Sosúa, hosting local markets and community gatherings.",
    lat: 19.767,
    lng: -70.481,
    emoji: "🧺",
    website: "https://www.sea-horse-ranch.com",
  },
  {
    slug: "el-carey-puerto-plata",
    name: "El Carey Día y Noche",
    city: "Costambar",
    description:
      "Day-and-night spot on Costambar beach (Calle Reina Isabel) with live sports on a giant screen, drinks, and local nightlife.",
    lat: 19.8145247,
    lng: -70.7150884,
    emoji: "⚽",
    website: "https://www.facebook.com/profile.php?id=100089059716413",
  },
  {
    slug: "el-colibri-hotel",
    name: "El Colibri Hotel",
    city: "Sosúa",
    description:
      "Boutique tropical hotel in downtown Sosúa — poolside bar, Thursday karaoke, and local nightlife.",
    lat: 19.7545,
    lng: -70.519,
    emoji: "🎤",
    website: "https://www.elcolibriresort.com/",
  },
  {
    slug: "fortaleza-san-felipe",
    name: "Fortaleza San Felipe",
    city: "Puerto Plata",
    description:
      "16th-century Spanish fortress and museum overlooking the Atlantic — cannons, colonial history, and sunset views from La Puntilla.",
    lat: 19.808,
    lng: -70.695,
    emoji: "🏰",
    website: "https://museosrd.gob.do/museos/museo-fortaleza-san-felipe/",
  },
  {
    slug: "museo-ambar",
    name: "Museo del Ámbar",
    city: "Puerto Plata",
    description:
      "Victorian mansion in the historic center showcasing Dominican amber fossils — lizards, insects, and Jurassic-era specimens.",
    lat: 19.7937,
    lng: -70.6946,
    emoji: "🟠",
    website: "https://museosrd.gob.do/museos/amber-museum-experience/",
  },
  {
    slug: "charcos-damajagua",
    name: "27 Charcos de Damajagua",
    city: "Puerto Plata",
    description:
      "Waterfall adventure park in the Northern Corridor hills — guided hikes, natural slides, and turquoise pools about an hour from Puerto Plata.",
    lat: 19.7489,
    lng: -70.8289,
    emoji: "💧",
    website: "https://www.27charcos.com",
  },
  {
    slug: "teleferico-puerto-plata",
    name: "Teleférico Puerto Plata",
    city: "Puerto Plata",
    description:
      "Caribbean cable car to the summit of Pico Isabel de Torres — Christ statue, botanical gardens, and panoramic views.",
    lat: 19.7534,
    lng: -70.7089,
    emoji: "🚡",
    website: "https://telefericopuertoplata.com",
  },
  {
    slug: "cayo-arena",
    name: "Cayo Arena",
    city: "Puerto Plata",
    description:
      "Sandbar island (Cayo Paraíso) reached by boat from Punta Rucia — shallow turquoise water, white sand, and snorkeling.",
    lat: 19.8883,
    lng: -71.2256,
    emoji: "🏝️",
    website:
      "https://es.godominicanrepublic.com/que-hacer/cayo-arena",
  },
];

export function getSeedVenue(slug: string): Venue | undefined {
  return SEED_VENUES.find((v) => v.slug === slug);
}

export function matchVenueSlug(venueName?: string): string | undefined {
  if (!venueName) return undefined;
  const lower = venueName.toLowerCase();
  for (const v of SEED_VENUES) {
    if (lower.includes(v.name.toLowerCase()) || lower.includes(v.slug.replace(/-/g, " "))) {
      return v.slug;
    }
  }
  return undefined;
}
