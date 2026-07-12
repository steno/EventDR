import type { Venue } from "@/lib/types";

/** Fallback venues when Firebase is not configured. */
export const SEED_VENUES: Venue[] = [
  {
    slug: "lax-cabarete",
    name: "LAX Cabarete",
    city: "Cabarete",
    description:
      "Beachfront bar and live music hub on Cabarete Bay. Reggae nights, concerts, and sunset sessions.",
    lat: 19.7503643,
    lng: -70.406125,
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
    lat: 19.7905058,
    lng: -70.6718446,
    emoji: "🌊",
  },
  {
    slug: "kite-beach",
    name: "Kite Beach",
    city: "Cabarete",
    description:
      "World-famous kite surfing beach. Competitions, beach sports, and weekend meetups.",
    lat: 19.7637836,
    lng: -70.4226424,
    emoji: "🏄",
  },
  {
    slug: "liquid-blue-cabarete",
    name: "Liquid Blue Cabarete",
    city: "Cabarete",
    description:
      "Watersports school on Kite Beach since 2014 — kite, wing, eFoil, surf, and sunrise yoga on the sand. Shop at Calle Principal #87.",
    lat: 19.7497315,
    lng: -70.4076978,
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
    lat: 19.7675,
    lng: -70.5115,
    emoji: "🎤",
  },
  {
    slug: "hard-rock-sosua",
    name: "Hard Rock Cafe Puerto Plata",
    city: "Sosúa",
    description:
      "Two-story downtown stage on Calle Duarte — touring acts, local rock bands, and tribute shows on the North Coast's biggest live-music floor.",
    lat: 19.7634107,
    lng: -70.5162309,
    emoji: "🎸",
    instagram: "hardrockcafepuertoplata",
    website: "https://cafe.hardrock.com/puerto-plata/",
    phone: "+18495057778",
  },
  {
    slug: "castaways-sosua",
    name: "Castaway's Clubhouse & Eatery",
    city: "Sosúa",
    description:
      "Expat clubhouse in Casa Linda with classic-rock cover bands, wing specials, and a North American pub atmosphere.",
    lat: 19.7643646,
    lng: -70.4890209,
    emoji: "🎸",
  },
  {
    slug: "hotel-voramar-sosua",
    name: "Hotel Voramar",
    city: "Sosúa",
    description:
      "Poolside boutique hotel with Friday BBQ nights and live rock and pop cover bands — German-run, steps from Playa Chiquita.",
    lat: 19.7767518,
    lng: -70.509873,
    emoji: "🎵",
    website: "https://www.hotelvoramar-sosua.com/en",
    phone: "+18095713910",
  },
  {
    slug: "smileys-bar-sosua",
    name: "Smiley's Bar & Restaurant",
    city: "Sosúa",
    description:
      "Open-air courtyard bar on Calle Pedro Clisante — live music, karaoke, and a steady expat crowd on weekend nights.",
    lat: 19.7679864,
    lng: -70.5100086,
    emoji: "🎤",
  },
  {
    slug: "finish-line-sosua",
    name: "The Finish Line",
    city: "Sosúa",
    description:
      "Expat pub on the Sosúa strip — acoustic sets, cover bands, and a familiar sports-bar vibe midweek and on weekends.",
    lat: 19.7661412,
    lng: -70.5130522,
    emoji: "🍺",
  },
  {
    slug: "bar-39-sosua",
    name: "Bar 39",
    city: "Sosúa",
    description:
      "Beachfront bar on Playa Sosúa — ocean views, cold Presidentes, and live music on weekend evenings.",
    lat: 19.7572211,
    lng: -70.5171504,
    emoji: "🌴",
  },
  {
    slug: "cheers-bar-sosua",
    name: "Cheers Bar & Grill",
    city: "Sosúa",
    description:
      "Expat-owned sports pub on Calle Pedro Clisante — rock and blues cover bands, big-screen sports, pub food, and a steady weekly live-music crowd.",
    lat: 19.7678473,
    lng: -70.5103493,
    emoji: "🍻",
    phone: "+1809404822463",
  },
  {
    slug: "sosua-jewish-museum",
    name: "Museo Judío de Sosúa",
    city: "Sosúa",
    description:
      "Museum and synagogue honoring the 1940 Jewish refugee settlement — photographs, artifacts, and documentary films on Sosúa's unique heritage next to Casa Marina.",
    lat: 19.7654983,
    lng: -70.5163301,
    emoji: "🏛️",
    website: "https://www.sosuajewishmuseum.com/",
  },
  {
    slug: "sosua-diving-center",
    name: "Sosua Diving Center",
    city: "Sosúa",
    description:
      "PADI dive center on La Puntilla — reef dives, snorkeling, and boat trips across 12+ Sosúa Bay sites with experienced local guides.",
    lat: 19.7619578,
    lng: -70.5165768,
    emoji: "🤿",
    website: "https://sosuadivingcenter.com/",
    phone: "+18094749220",
  },
  {
    slug: "natura-cabana",
    name: "Natura Cabana Yoga Temple",
    city: "Sosúa",
    description:
      "Open-air oceanfront yoga temple in Perla Marina — morning flows and sunset sessions open to guests and visitors, steps from the Caribbean.",
    lat: 19.7833499,
    lng: -70.4621124,
    emoji: "🧘",
    website: "https://naturacabana.com/yoga-temple-your-daily-practice-facing-the-caribbean-blue/",
  },
  {
    slug: "d-classico-sosua",
    name: "D-Classico Merengue Bar",
    city: "Sosúa",
    description:
      "Merengue and bachata bar in the heart of El Batey — local rhythms, dancing crowds, and a classic Sosúa nightlife spot on Pedro Clisante.",
    lat: 19.7640775,
    lng: -70.515048,
    emoji: "💃",
  },
  {
    slug: "voyvoy-cabarete",
    name: "VOYVOY Cabarete",
    city: "Cabarete",
    description:
      "Beachfront restaurant and nightlife spot on Cabarete Bay — open mic jams, DJ sessions, and weekend dance parties with bay views.",
    lat: 19.7502161,
    lng: -70.4066784,
    emoji: "🎤",
  },
  {
    slug: "la-casita-de-papi",
    name: "La Casita de Papi",
    city: "Cabarete",
    description:
      "Iconic beachfront seafood restaurant on Cabarete Central Beach — paella, grilled catch, and sunset dinners under palm trees since the 1990s.",
    lat: 19.7502745,
    lng: -70.4073077,
    emoji: "🦐",
    website: "https://www.facebook.com/lacasitadepapi/",
    phone: "+18099863750",
  },
  {
    slug: "anfiteatro-la-puntilla",
    name: "Anfiteatro La Puntilla",
    city: "Puerto Plata",
    description:
      "Oceanfront amphitheater at La Puntilla — outdoor concerts, carnival parades, and cultural performances overlooking the Atlantic.",
    lat: 19.803611,
    lng: -70.694722,
    emoji: "🎭",
    website:
      "https://es.godominicanrepublic.com/que-hacer/anfiteatro-la-puntilla",
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
    lat: 19.8263178,
    lng: -70.7314779,
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
    lat: 19.7799532,
    lng: -70.4893065,
    emoji: "🧺",
    website: "https://www.sea-horse-ranch.com",
    phone: "+18095712902",
  },
  {
    slug: "senor-rock-playa-dorada",
    name: "Señor Rock Bar & Grill",
    city: "Playa Dorada",
    description:
      "Bar & grill in Playa Dorada Plaza with nightly live bands — rock, pop covers, and Caribbean classics with dinner and drinks.",
    lat: 19.7694757,
    lng: -70.6430326,
    emoji: "🎸",
  },
  {
    slug: "cremo-cigar-bar",
    name: "Cremo Cigar Bar & Lounge",
    city: "Puerto Plata",
    description:
      "Downtown cigar lounge with weekly salsa, bohemian live music, and karaoke — cocktails, tapas, and Dominican rums.",
    lat: 19.7984235,
    lng: -70.6931832,
    emoji: "🎺",
    website: "https://cremocigars.com/cremo-cigar-bar-lounge-en/",
    phone: "+13059429440",
  },
  {
    slug: "big-lees-beach-bar",
    name: "Big Lee's Beach Bar & Grill",
    city: "Puerto Plata",
    description:
      "Beachfront bar at Cosita Rica since 2011 — classic rock, karaoke nights, and Atlantic views steps from the sand.",
    lat: 19.7911508,
    lng: -70.6728342,
    emoji: "🎤",
  },
  {
    slug: "pingui-bar",
    name: "Pingüi Bar Restaurant",
    city: "Puerto Plata",
    description:
      "Beach bar at Playa El Pueblito — piña coladas, Dominican comfort food, and weekend oceanfront vibes.",
    lat: 19.773903,
    lng: -70.652704,
    emoji: "🍹",
    phone: "+18096682051",
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
    lat: 19.7709496,
    lng: -70.5081792,
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
    lat: 19.8041466,
    lng: -70.6958831,
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
    lat: 19.7963741,
    lng: -70.6921771,
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
    lat: 19.7342692,
    lng: -70.8191197,
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
    lat: 19.7881298,
    lng: -70.7099725,
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
    lat: 19.870215,
    lng: -71.3056676,
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
    lat: 19.79859,
    lng: -70.6936521,
    emoji: "🌸",
    website: "https://puertoplatadr.com/boulevard/paseo-dona-blanca/",
  },
  {
    slug: "calle-sombrillas",
    name: "Calle de las Sombrillas",
    city: "Puerto Plata",
    description:
      "178 multicolored umbrellas over Calle San Felipe in the historic center — free photo walk between artisan shops, cafés, and local vendors.",
    lat: 19.7985582,
    lng: -70.6942833,
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
    lat: 19.75519,
    lng: -70.642975,
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
    lat: 19.780278,
    lng: -70.668889,
    emoji: "🥃",
    website: "https://www.brugal.do/",
  },
  {
    slug: "freestyle-catamaran",
    name: "Freestyle Catamaran",
    city: "Puerto Plata",
    description:
      "Catamaran cruises from Puerto Plata to Sosúa Bay — two snorkeling stops, lunch, drinks, and live music on deck.",
    lat: 19.7786014,
    lng: -70.6703871,
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
    lat: 19.7974584,
    lng: -70.7010331,
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
