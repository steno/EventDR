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
    phone: "+18297458811",
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
    slug: "liquid-blue-cabarete",
    name: "Liquid Blue Cabarete",
    city: "Cabarete",
    description:
      "Watersports school on Kite Beach since 2014 — kite, wing, eFoil, surf, and sunrise yoga on the sand. Shop at Calle Principal #87.",
    lat: 19.7512,
    lng: -70.415,
    emoji: "🧘",
    instagram: "lbcabarete",
    website: "https://www.lbcabarete.com/fitness-classes/",
    phone: "+18492719573",
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
    phone: "+18095710808",
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
    phone: "+18092911000",
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
    phone: "+18095712902",
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
    phone: "+18494404199",
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
    phone: "+18099709433",
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
    phone: "+18092611911",
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
    phone: "+18095862848",
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
    phone: "+18092721438",
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
    phone: "+18099700501",
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
    phone: "+18295997444",
  },
  {
    slug: "paseo-dona-blanca",
    name: "Paseo de Doña Blanca",
    city: "Puerto Plata",
    description:
      "Pink-paved pedestrian alley honoring tourism pioneer Bianca Franceschini — Victorian touches, photo spots, and cafés between Calle Beller and John F. Kennedy.",
    lat: 19.7988,
    lng: -70.6962,
    emoji: "🌸",
    website: "https://puertoplatadr.com/boulevard/paseo-dona-blanca/",
  },
  {
    slug: "calle-sombrillas",
    name: "Calle de las Sombrillas",
    city: "Puerto Plata",
    description:
      "178 multicolored umbrellas over Calle San Felipe in the historic center — free photo walk between artisan shops, cafés, and local vendors.",
    lat: 19.7943,
    lng: -70.6938,
    emoji: "☂️",
    website:
      "https://gobernacionpuertoplata.gob.do/turismo/whatsapp-image-2024-09-06-at-10-15-43-am/",
  },
  {
    slug: "fun-city",
    name: "Fun City Action Park",
    city: "Puerto Plata",
    description:
      "Dominican Republic's largest go-kart park on Highway 5 — Cyclone, Sprint 500, Grand Prix, and bumper cars, plus a kids' playground near Playa Dorada.",
    lat: 19.7651,
    lng: -70.5154,
    emoji: "🏎️",
    instagram: "funcitypuertoplata",
    website: "https://puertoplatadr.com/tours/fun-city-gokarts/",
    phone: "+18096970794",
  },
  {
    slug: "monkeyland-puerto-plata",
    name: "Monkeyland Puerto Plata",
    city: "Imbert",
    description:
      "Jungle sanctuary in the Imbert hills — feed squirrel monkeys, stroll botanical trails, and visit a traditional countryside home on safari-truck tours with hotel pickup.",
    lat: 19.7541,
    lng: -70.8438,
    emoji: "🐒",
    website: "https://www.runnersadventures.com/monkeyland/monkeyland-puerto-plata/",
    phone: "+18295997444",
  },
  {
    slug: "coconut-cove",
    name: "Chukka Ocean Outpost — Coconut Cove",
    city: "Bajo Hondo",
    description:
      "Cliffside seaside adventure park — 1,200-ft ocean zipline, ATV and dune buggy trails, private beach, and watersports west of Puerto Plata.",
    lat: 19.8348,
    lng: -70.7542,
    emoji: "🪂",
    website: "https://chukka.com/dominican-republic/ocean-outpost-coconut-cove",
    phone: "+18097967176",
  },
  {
    slug: "brugal-rum-center",
    name: "Brugal Rum Center",
    city: "Puerto Plata",
    description:
      "Working rum distillery and visitor center on the Maimón highway — guided tours, aging warehouses, and tastings of award-winning Dominican rums.",
    lat: 19.7825,
    lng: -70.6938,
    emoji: "🥃",
    website: "https://www.brugal.do/",
  },
  {
    slug: "freestyle-catamaran",
    name: "Freestyle Catamaran",
    city: "Puerto Plata",
    description:
      "Catamaran cruises from Puerto Plata to Sosúa Bay — two snorkeling stops, lunch, drinks, and live music on deck.",
    lat: 19.798,
    lng: -70.688,
    emoji: "⛵",
    website:
      "https://www.tripadvisor.com/Attraction_Review-g147290-d2162077-Reviews-Freestyle_Catamaran_Tour-Puerto_Plata_Puerto_Plata_Province_Dominican_Republic.html",
  },
  {
    slug: "outback-adventures",
    name: "Outback Adventures",
    city: "Puerto Plata",
    description:
      "Open-air safari trucks through countryside villages, coffee plantations, local schools, and a hidden beach — a Puerto Plata classic since 2004.",
    lat: 19.787,
    lng: -70.675,
    emoji: "🛻",
    website: "https://outback-adventures.com/st_location/dominican-republic/puerto-plata/",
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
