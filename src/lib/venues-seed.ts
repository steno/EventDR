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
    phone: "+18095862526",
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
    description:
      "Sosúa's walkable downtown district — beach access, the Pedro Clisante restaurant-and-bar strip, shops and cafés by day, then salsa socials and open-mic nights after dark.",
    lat: 19.7676443,
    lng: -70.5085273,
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
    slug: "playa-sosua",
    name: "Playa Sosúa",
    city: "Sosúa",
    description:
      "Main public beach in Sosúa Bay — calm water, reef snorkeling, beach bars, and weekly pickup sports on the sand.",
    lat: 19.7572211,
    lng: -70.5171504,
    emoji: "🏖️",
  },
  {
    slug: "bar-39-sosua",
    name: "Bar 39",
    city: "Sosúa",
    description:
      "Beachfront bar on Playa Sosúa — ocean views, cold Presidentes, and live music on weekend evenings.",
    // Distinct from Playa Sosúa beach pin (mid-bay); Bar 39 sits on the lounge strip nearer Casa Marina.
    lat: 19.75942,
    lng: -70.51672,
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
    name: "Natura Cabana",
    city: "Sosúa",
    description:
      "Boutique eco-resort in Perla Marina — oceanfront yoga temple plus Saturday live music at the beachfront restaurant (acoustic, jazz, and Caribbean fusion).",
    lat: 19.7833499,
    lng: -70.4621124,
    emoji: "🧘",
    website: "https://naturacabana.com/",
    phone: "+18492147010",
  },
  {
    slug: "el-parq-cabarete",
    name: "El Parq Foodpark",
    city: "Cabarete",
    description:
      "Open-air food park near Encuentro — street-food vendors, communal tables, Shaka Bar Thursday karaoke (7:30–9:30 PM), Ninafrika Dance Friday Noche Latina from 7 PM, and live bands on Saturdays.",
    lat: 19.7739371,
    lng: -70.4446512,
    emoji: "🍔",
  },
  {
    slug: "parada-tipica-el-choco",
    name: "Parada Típica El Choco",
    city: "Sosúa",
    description:
      "Roadside restaurant on the Sosúa–Cabarete corridor — Dominican and international plates, dance floor, and Tuesday live-music nights popular with locals and residents.",
    lat: 19.7726199,
    lng: -70.4964466,
    emoji: "🎵",
    phone: "+18098042510",
  },
  {
    slug: "blue-jacktar-playa-dorada",
    name: "Blue JackTar Playa Dorada",
    city: "Puerto Plata",
    description:
      "Resort convention center inside Playa Dorada — ticketed merengue and tribute concerts with local boletería sales across Puerto Plata.",
    lat: 19.7703,
    lng: -70.6494,
    emoji: "🎤",
    phone: "+18093203800",
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
    slug: "ground-zero-disco",
    name: "Ground Zero Discoteca",
    city: "Sosúa",
    description:
      "North Coast discoteca on the Puerto Plata–Sosúa highway opposite Gregorio Luperón Airport — reggaeton, dembow, típico, and late-night parties (closed Mon–Wed).",
    lat: 19.7497279,
    lng: -70.5630864,
    emoji: "🪩",
    instagram: "groundzero_disco",
    phone: "+18494651313",
  },
  {
    slug: "la-chabola-cabarete",
    name: "La Chabola",
    city: "Cabarete",
    description:
      "Neighborhood pizza bar in Callejón de la Loma — stone-oven pies, local musicians, and Wednesday open mic nights with an affordable Cabarete crowd.",
    lat: 19.7488174,
    lng: -70.4146652,
    emoji: "🎤",
    website: "https://www.facebook.com/chabolacabaretee",
    phone: "+18095435860",
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
    phone: "+18095710805",
  },
  {
    slug: "aura-beach-club-cabarete",
    name: "Aura Beach Club Cabarete",
    city: "Cabarete",
    description:
      "Beachfront club on Calle Principal — daytime lounging and nighttime live shows facing Cabarete Bay.",
    lat: 19.7500769,
    lng: -70.4070417,
    emoji: "🌴",
    website: "https://auracabarete.com/",
    instagram: "auracabarete",
    phone: "+18297870140",
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
    website: "https://www.bluecoworking.com",
  },
  {
    slug: "ocean-world",
    name: "Ocean World Adventure Park",
    city: "Puerto Plata",
    description:
      "Marine adventure park in Cofresí — dolphin swims, sea lion and shark encounters, snorkeling, and a water slide lagoon. Puerto Plata's Ocean World (sometimes searched as Sea World).",
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
    city: "Sosúa",
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
      "Victorian mansion in the historic center — Puerto Plata's amber museum of Dominican fossilized resin, with lizards, insects, and Jurassic-era specimens.",
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
    slug: "plaza-independencia",
    name: "Independence Park",
    city: "Puerto Plata",
    description:
      "Puerto Plata's central park (Plaza Independencia) in the historic downtown — shaded plaza, cathedral views, and a gathering point for festivals and community events.",
    lat: 19.7976623,
    lng: -70.6932862,
    emoji: "🌳",
    website:
      "https://www.google.com/maps/place/Independence+Park/@19.7976623,-70.6932862,17z",
    phone: "+18095862526",
  },
  {
    slug: "paseo-dona-blanca",
    name: "Paseo de Doña Blanca",
    city: "Puerto Plata",
    description:
      "Temporarily closed to the public from Monday, July 20 to August 5, 2026 for renovation, painting, and general maintenance work (about 15 days). Reopening after August 5th. Pink-paved pedestrian alley honoring tourism pioneer Bianca Franceschini — Victorian touches, photo spots, and cafés between Calle Beller and John F. Kennedy.",
    lat: 19.79859,
    lng: -70.6936521,
    emoji: "🌸",
    website: "https://puertoplatadr.com/boulevard/paseo-dona-blanca/",
    googlePlaceId: "ChIJJSAjF67vsY4RVxVDPdQbhZQ",
    temporarilyClosed: true,
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
      "Dominican Republic's largest go-kart park on Highway 5 — Fun City Puerto Plata with Cyclone, Sprint 500, Grand Prix, and bumper cars, plus a kids' playground near Playa Dorada.",
    lat: 19.7450324,
    lng: -70.6353642,
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
      "Chukka Ocean Outpost near Puerto Plata — cliffside seaside adventure park with a 1,200-ft ocean zipline, ATV and dune buggy trails, private beach, and watersports in Bajo Hondo.",
    lat: 19.9028125,
    lng: -70.8399375,
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
    lat: 19.7788429,
    lng: -70.6690158,
    emoji: "🥃",
    website: "https://www.brugal.do/",
  },
  {
    slug: "del-oro-chocolate-factory",
    name: "Del Oro Chocolate Factory",
    city: "Puerto Plata",
    description:
      "Working organic chocolate factory in Barrio Las Yaguitas — free guided tour with tastings, short film on cacao production, and a gift shop on Calle Principal.",
    lat: 19.7767245,
    lng: -70.6662354,
    emoji: "🍫",
    website: "https://www.chocolate.do/delorochocolate",
    phone: "+18093207715",
  },
  {
    slug: "hacienda-cufa",
    name: "Hacienda Cufa",
    city: "Guananico",
    description:
      "Organic cacao farm in La Mariposa, Guananico — seven-stop sensory trail, traditional hot chocolate, choco therapy, Dominican lunch, and a river swim on the cacao tour.",
    lat: 19.7364625,
    lng: -70.9244844,
    emoji: "🌿",
    website: "https://puertoplatadr.com/tours/cacao-tour-hacienda-cufa/",
    phone: "+18097564806",
  },
  {
    slug: "tabacalera-cremo",
    name: "Tabacalera Cremo",
    city: "Puerto Plata",
    description:
      "Downtown cigar factory on Calle San Felipe — walk the production floor, meet Cuban master rollers, welcome drink, and take-home cigar on the free factory tour.",
    lat: 19.799812,
    lng: -70.6933279,
    emoji: "🚬",
    website: "https://cremocigars.com/dr/tabacalera-cremo/",
    phone: "+13059429440",
  },
  {
    slug: "vivonte-cigar-factory",
    name: "Vivonté Cigar Factory",
    city: "Puerto Plata",
    description:
      "Educational cigar factory one block from Central Park — seed-to-cigar walkthrough, fermentation and aging rooms, and rolling demo on Calle Separación.",
    lat: 19.797,
    lng: -70.6928,
    emoji: "🍂",
    website: "https://vivontecigars.com/",
    phone: "+18095865257",
  },
  {
    slug: "freestyle-catamaran",
    name: "Freestyle Catamaran",
    city: "Puerto Plata",
    description:
      "Catamaran cruises departing Playa Dorada for Sosúa Bay — two snorkeling stops, lunch, drinks, and live music on deck. Hotel pickup included.",
    lat: 19.7786014,
    lng: -70.6703871,
    emoji: "⛵",
    website: "https://freestylecatamarans.com/",
    phone: "+18095861239",
  },
  {
    slug: "outback-adventures",
    name: "Outback Adventures",
    city: "Puerto Plata",
    description:
      "Open-air safari trucks through countryside villages, coffee plantations, local schools, and a hidden beach — a Puerto Plata classic since 2004. Hotel pickup from the North Coast.",
    lat: 19.7974584,
    lng: -70.7010331,
    emoji: "🛻",
    website:
      "https://www.sightseeing.com/packages/outback-safari-adventure-tour-from-puerto-plata/",
    phone: "+18093202525",
  },
  {
    slug: "hms-valeria",
    name: "HMS Valeria Seafood Restaurant",
    city: "Sosúa",
    description:
      "Ship-themed seafood restaurant at Casa Valeria Hotel — Spanish Saturday paella nights and Sunday Dominican specials steps from Sosúa Beach.",
    lat: 19.7650527,
    lng: -70.5150705,
    emoji: "🥘",
    website: "https://www.casavaleria.com/restaurant",
    phone: "+18095711693",
  },
  {
    slug: "rum-legacy-museum",
    name: "Rum Legacy Museum & Shop Experience",
    city: "Puerto Plata",
    description:
      "Immersive rum heritage museum in the historic center — audio-guided tour from sugarcane to guided tastings on Calle Beller.",
    lat: 19.7979,
    lng: -70.6938,
    emoji: "🥃",
    phone: "+18092618661",
  },
  {
    slug: "la-confluencia-museum",
    name: "La Confluencia Galería Etnográfica",
    city: "Puerto Plata",
    description:
      "Ethnographic gallery tracing Taíno, African, and colonial heritage — bilingual exhibits and QR-guided tours in the historic center.",
    lat: 19.7968,
    lng: -70.6915,
    emoji: "🏛️",
    website: "https://www.laconfluencia.com.do/",
    phone: "+18093815745",
  },
  {
    slug: "gregorio-luperon-museum",
    name: "Casa Museo General Gregorio Luperón",
    city: "Puerto Plata",
    description:
      "Victorian house-museum honoring the Restoration hero — period rooms, photographs, and courtyard mural on Calle 12 de Julio.",
    lat: 19.7965,
    lng: -70.6912,
    emoji: "🏛️",
    phone: "+18092618661",
  },
  {
    slug: "macorix-house-of-rum",
    name: "Macorix House of Rum",
    city: "Puerto Plata",
    description:
      "Rum cellar tours and tastings — history video, aging barrels, and Macorix rum samples on Av. Francisco Alberto Caamaño.",
    lat: 19.7946694,
    lng: -70.6991738,
    emoji: "🥃",
    website: "https://macorixhouseofrum.com/en/",
  },
  {
    slug: "casa-de-la-cultura",
    name: "Casa de la Cultura Eduardo Brito",
    city: "Puerto Plata",
    description:
      "Victorian cultural center facing Parque Central — rotating art exhibitions, poetry readings, theater, and folkloric dance.",
    lat: 19.7975,
    lng: -70.693,
    emoji: "🎨",
    website: "https://depuertoplata.com/historia-de-puerto-plata/casa-de-la-cultura-puerto-plata/",
  },
  {
    slug: "handmade-the-brand",
    name: "Handmade the Brand",
    city: "Puerto Plata",
    description:
      "Colorful workshop on Calle Duarte 37 (corner of Umbrella Street) — stitch-your-own espadrilles and the adults-only Piña Colada Experience (pineapple cocktail + rum tasting). Book workshops ahead.",
    lat: 19.7979791,
    lng: -70.694567,
    emoji: "🍍",
    phone: "+19394089392",
    website:
      "https://www.eventbrite.es/e/make-authentic-espadrilles-in-puerto-plata-tickets-1981840949630",
  },
  {
    slug: "parque-jose-briceno",
    name: "Parque José Briceño",
    city: "Puerto Plata",
    description:
      "Renovated 6,000-seat baseball stadium on Av. Hermanas Mirabal — home of the Atléticos de Puerto Plata in the Liga Nacional de Béisbol de Verano.",
    lat: 19.7827778,
    lng: -70.6713889,
    emoji: "⚾",
    website: "https://todotickets.do",
  },
  {
    slug: "club-deportivo-fantastico",
    name: "Club Deportivo Fantastico",
    city: "Puerto Plata",
    description:
      "Covered community sports club on Calle 1ra in barrio Haití (Urbanización Gregorio Luperón) — home court for Al Sena Athletics basketball and the ASA Survival Series.",
    lat: 19.7934114,
    lng: -70.7072068,
    emoji: "🏀",
    website:
      "https://www.eventbrite.co/o/al-sena-athletics-121192087480",
  },
  {
    slug: "disco-club-brugal",
    name: "Disco Club",
    city: "Puerto Plata",
    description:
      "Nightlife and concert hall at the Brugal rum depots on Calle Duarte — ticketed shows for touring Dominican artists.",
    lat: 19.7792778,
    lng: -70.6690061,
    emoji: "🎤",
    website: "https://todotickets.do",
  },
  {
    slug: "paella-pop-el-pueblito",
    name: "Paella POP Playa El Pueblito",
    city: "Puerto Plata",
    description:
      "Beachfront Spanish paella by Laia & Nico on Playa El Pueblito — soft-opened July 2026 but listed as temporarily closed on Google Maps; official hours TBA. Paella POP still serves daily at Green One Playa Dorada.",
    lat: 19.7742,
    lng: -70.6529,
    emoji: "🥘",
    website:
      "https://sosuadigitaltv.com/paella-pop-celebra-su-soft-opening-en-playa-el-pueblito-y-consolida-una-historia-de-emprendimiento-nacida-con-apenas-50-euros/",
  },
  {
    slug: "paella-pop-green-one",
    name: "Paella POP at Green One",
    city: "Puerto Plata",
    description:
      "Original Paella POP kitchen at One Club, Green One Playa Dorada — paella and Spanish plates in the golf resort clubhouse.",
    lat: 19.7674958,
    lng: -70.6482428,
    emoji: "🥘",
    website: "https://www.greenoneplayadorada.com/",
  },
  {
    slug: "playa-dorada-golf",
    name: "Playa Dorada Golf Course",
    city: "Playa Dorada",
    description:
      "Robert Trent Jones Sr. 18-hole championship course inside the Playa Dorada resort complex — home of the Puerto Plata Golf Classic and Ashonorte sports tourism events.",
    lat: 19.7685063,
    lng: -70.6427756,
    emoji: "⛳",
    website: "https://playadoradagolf.com/",
    instagram: "ashonorte",
    phone: "+18093204262",
  },
  {
    slug: "playa-encuentro",
    name: "Playa Encuentro",
    city: "Cabarete",
    description:
      "North Coast's premier surf beach between Cabarete and Sosúa — reef breaks for all levels and the official CAC Games 2026 surf venue.",
    lat: 19.7834465,
    lng: -70.4516521,
    emoji: "🏄",
    phone: "+18298934214",
  },
  {
    slug: "playa-los-charamicos",
    name: "Playa Los Charamicos",
    city: "Sosúa",
    description:
      "Local Sosúa beach west of El Batey — host of Puerto Plata Beach Soccer and family-friendly waterfront sports days.",
    lat: 19.7530055,
    lng: -70.5228086,
    emoji: "⚽",
    phone: "+18095866125",
    instagram: "puertoplatabeachsoccer",
  },
  {
    slug: "parque-nacional-el-choco",
    name: "Parque Nacional El Choco",
    city: "Cabarete",
    description:
      "Protected karst park just inland from Cabarete — freshwater lagoons, subtropical forest, and guided cave boat tours through underground lakes (Cuevas del Choco).",
    lat: 19.7227201,
    lng: -70.4319982,
    emoji: "🏞️",
    website:
      "https://es.godominicanrepublic.com/destinos/cabarete",
  },
  {
    slug: "jamao-al-norte",
    name: "Jamao al Norte",
    city: "Cabarete",
    description:
      "Eco-tourism town on the Yásica / Jamao River corridor inland from Cabarete — clear-water kayaking, community lunch stops, and nature escapes popular with North Coast day tours.",
    lat: 19.602236,
    lng: -70.4669931,
    emoji: "🛶",
  },
  {
    slug: "victrola-037",
    name: "Victrola 037 Arte Café",
    city: "Puerto Plata",
    description:
      "Art café and restaurant on the Puerto Plata Malecón — murals, criollo kitchen, cocktails, and a meetup hub for waterfront experiences at Av. Gregorio Luperón & Padre Castellanos.",
    lat: 19.7995463,
    lng: -70.6909467,
    emoji: "☕",
    website: "https://victrolart.do/",
  },
  {
    slug: "ocean-one-cabarete",
    name: "Ocean One Cabarete",
    city: "Cabarete",
    description:
      "Beachfront condo complex in the heart of Cabarete Bay — gated pools, plaza access, and a direct beach entrance used for community meetups and sunset sessions.",
    lat: 19.7495899,
    lng: -70.4120254,
    emoji: "🏖️",
  },
  {
    slug: "vip-beach-lifestyles-resort",
    name: "VIP Beach Lifestyles Resort and Spa",
    city: "Puerto Plata",
    description:
      "Beach resort complex on Cofresí Beach (Lifestyle Holidays area) — pools, entertainment venues, and large multi-day party takeovers for visitors and club members.",
    lat: 19.8184013,
    lng: -70.7283993,
    emoji: "🌴",
  },
  {
    slug: "gym-sov-sosua-ocean-village",
    name: "GYM SOV — Sosúa Ocean Village",
    city: "Sosúa",
    description:
      "Two-story ocean-view fitness center inside Sosúa Ocean Village — cardio, machines, boxing room, and drop-in group classes (Zumba, strength) open without a full gym membership.",
    lat: 19.78102,
    lng: -70.50059,
    emoji: "💪",
    instagram: "gymsov",
    website: "https://www.sosuaoceanvillage.com/gym",
    phone: "+18299612269",
  },
  {
    slug: "zen-fitness-cabarete",
    name: "Zen Fitness Camps",
    city: "Cabarete",
    description:
      "Beachfront fitness and wellness camp at Zen Cabarete on Kite Beach (formerly eXtreme) — barefoot tiki gym, ocean-view yoga loft, farm-to-table meals, and year-round weightloss and fitness holidays.",
    lat: 19.7638004,
    lng: -70.4240155,
    emoji: "🏋️",
    instagram: "extremefitnesscamps",
    website: "https://cabaretefitnesscamp.com/",
  },
];

/** Extra name fragments → seed slug (checked before fuzzy name includes). */
const VENUE_ALIASES: { pattern: RegExp; slug: string }[] = [
  {
    pattern: /parque\s+nacional\s+el\s+choc[oó]|choc[oó]\s+national\s+park|cuevas?\s+(del\s+)?choc[oó]|laguna\s+(el\s+)?choc[oó]|deep\s+caves?/i,
    slug: "parque-nacional-el-choco",
  },
  {
    pattern: /jamao(\s+al\s+norte)?|yasica\s+river|r[ií]o\s+jamao/i,
    slug: "jamao-al-norte",
  },
  {
    pattern: /27\s*charcos|damajagua/i,
    slug: "charcos-damajagua",
  },
  {
    pattern: /cayo\s*arena|cayo\s*para[ií]so/i,
    slug: "cayo-arena",
  },
  {
    pattern: /ocean\s*world/i,
    slug: "ocean-world",
  },
  {
    pattern: /victrola\s*037|la\s*victrola/i,
    slug: "victrola-037",
  },
  {
    pattern: /ocean\s*one(\s*cabarete)?/i,
    slug: "ocean-one-cabarete",
  },
  {
    pattern: /vip\s*beach\s*lifestyles|lifestyle\s*tropical\s*beach/i,
    slug: "vip-beach-lifestyles-resort",
  },
  {
    // Local/expat name for Sea Horse Ranch Tennis Club (pickleball / courts).
    pattern: /cabarete\s*sports?\s*club/i,
    slug: "sea-horse-ranch",
  },
  {
    pattern: /gym\s*sov|sov\s*gym|sosu[aá]\s*ocean\s*village\s*gym/i,
    slug: "gym-sov-sosua-ocean-village",
  },
  {
    pattern:
      /zen\s*fitness|cabarete\s*fitness\s*camp|extreme\s*fitness\s*camp|e?xtreme\s*hotels?\s*cabarete|zen\s*cabarete/i,
    slug: "zen-fitness-cabarete",
  },
];

export function getSeedVenue(slug: string): Venue | undefined {
  return SEED_VENUES.find((v) => v.slug === slug);
}

export function matchVenueSlug(venueName?: string): string | undefined {
  if (!venueName) return undefined;
  const lower = venueName.toLowerCase().trim();
  if (!lower) return undefined;

  for (const alias of VENUE_ALIASES) {
    if (alias.pattern.test(lower)) return alias.slug;
  }

  // Prefer longer seed names first so "Parada Típica El Choco" wins over short fragments.
  const byNameLength = [...SEED_VENUES].sort(
    (a, b) => b.name.length - a.name.length,
  );
  for (const v of byNameLength) {
    const name = v.name.toLowerCase();
    const slugWords = v.slug.replace(/-/g, " ");
    if (lower.includes(name) || lower.includes(slugWords)) {
      return v.slug;
    }
  }
  return undefined;
}
