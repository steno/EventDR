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
    name: "Ocean World",
    city: "Puerto Plata",
    description: "Marine adventure park with pool parties and family events.",
    lat: 19.8267,
    lng: -70.71,
    emoji: "🐬",
    instagram: "oceanworldadventurepark",
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
    city: "Puerto Plata",
    description:
      "Day-and-night spot in Puerto Plata with live sports on a giant screen, drinks, and local nightlife.",
    lat: 19.7934,
    lng: -70.6884,
    emoji: "⚽",
    website: "https://www.facebook.com/profile.php?id=100089059716413",
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
