/**
 * North Coast Instagram accounts monitored for event discovery.
 * Profiles are scraped best-effort (login walls often block); site: search
 * queries still surface public posts via web search.
 */

export const INSTAGRAM_ACCOUNTS = [
  // Existing tourist-facing venues
  {
    handle: "laxcabarete",
    label: "LAX Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "lbcabarete",
    label: "Liquid Blue Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "hardrockcafepuertoplata",
    label: "Hard Rock Cafe Puerto Plata",
    areas: ["Sosúa"],
  },
  {
    handle: "oceanworldadventurepark",
    label: "Ocean World",
    areas: ["Puerto Plata"],
  },
  {
    handle: "funcitypuertoplata",
    label: "Fun City Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "graaneventsplanners",
    label: "GRAAN Events Planners",
    areas: ["Puerto Plata"],
  },
  {
    handle: "cabaretejazz",
    label: "Cabarete Jazz Festival",
    areas: ["Cabarete"],
  },
  {
    handle: "nonasgrillkitchen",
    label: "Nona's Grill & Kitchen",
    areas: ["Cabarete"],
  },
  {
    handle: "voyvoycabarete",
    label: "VOYVOY Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "elcolibrihotel",
    label: "El Colibri Hotel",
    areas: ["Sosúa"],
  },
  {
    handle: "naturacabana",
    label: "Natura Cabana",
    areas: ["Cabarete", "Sosúa"],
  },
  {
    handle: "ashonorte",
    label: "Ashonorte",
    areas: ["Puerto Plata", "Playa Dorada"],
  },
  
  // Local Cabarete bars & nightlife (Dominican community favorites)
  {
    handle: "onnosbar",
    label: "Onno's Bar Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "classicocabarete",
    label: "Classico Bar & Lounge",
    areas: ["Cabarete"],
  },
  {
    handle: "shakabardr",
    label: "Shaka Bar DR",
    areas: ["Cabarete"],
  },
  {
    handle: "bahiabeachclub",
    label: "Bahía Beach Club",
    areas: ["Cabarete"],
  },
  {
    handle: "kahunas_restaurant",
    label: "Kahuna's Restaurant & Bar",
    areas: ["Cabarete"],
  },
  {
    handle: "lachabola.cabarete",
    label: "La Chabola Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "driftercabarete",
    label: "Drifter Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "rolfsbarandrestaurant",
    label: "Rolf's Bar & Restaurant",
    areas: ["Cabarete"],
  },
  
  // Sosúa local nightlife & bars
  {
    handle: "blueice_pianobar",
    label: "Blue Ice Piano Bar",
    areas: ["Sosúa"],
  },
  {
    handle: "groundzero_disco",
    label: "Ground Zero Discoteca",
    areas: ["Sosúa"],
  },
  {
    handle: "captainbaileyssosua",
    label: "Captain Baileys Sosúa",
    areas: ["Sosúa"],
  },
  {
    handle: "jollyrogerbargrill",
    label: "Jolly Roger Bar & Grill",
    areas: ["Sosúa"],
  },
  {
    handle: "baileys.restaurant",
    label: "Bailey's Restaurant",
    areas: ["Sosúa"],
  },
  {
    handle: "laroca.sosua",
    label: "La Roca Sosúa",
    areas: ["Sosúa"],
  },
  {
    handle: "rumbabargrill",
    label: "Rumba Bar and Grill",
    areas: ["Sosúa"],
  },
  
  // Puerto Plata cultural venues & Dominican music
  {
    handle: "anfiteatropuertoplata",
    label: "Anfiteatro Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "anfiteatro_puertoplata_rd",
    label: "Anfiteatro La Puntilla",
    areas: ["Puerto Plata"],
  },
  {
    handle: "discoclubbrugal",
    label: "Disco Club Brugal",
    areas: ["Puerto Plata"],
  },
  {
    handle: "luciano.vasquez.pp",
    label: "Luciano Vásquez - Festival del Merengue",
    areas: ["Puerto Plata"],
  },
  {
    handle: "festivaldemerenguepuertoplata",
    label: "Festival del Merengue PP",
    areas: ["Puerto Plata"],
  },
  
  // Regional tourism & event promoters
  {
    handle: "turismopuertoplata",
    label: "Turismo Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "ayuntamientodepuertoplata",
    label: "Ayuntamiento de Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "clusterpuertoplata",
    label: "Clúster Turístico Puerto Plata",
    areas: ["Puerto Plata"],
  },
  {
    handle: "costanorterd",
    label: "Costa Norte RD",
    areas: ["Puerto Plata", "Sosúa", "Cabarete"],
  },
  {
    handle: "descubrepuertoplata",
    label: "Descubre Puerto Plata",
    areas: ["Puerto Plata"],
  },
  
  // Local event hashtags & aggregators
  {
    handle: "eventoscabarete",
    label: "Eventos Cabarete",
    areas: ["Cabarete"],
  },
  {
    handle: "sosuaevents",
    label: "Sosúa Events",
    areas: ["Sosúa"],
  },
  {
    handle: "eventosnorterd",
    label: "Eventos Norte RD",
    areas: ["Puerto Plata", "Sosúa", "Cabarete"],
  },
] as const;

export function instagramProfileUrls(): string[] {
  return INSTAGRAM_ACCOUNTS.map(
    (account) => `https://www.instagram.com/${account.handle}/`,
  );
}

/** Discovery queries layered onto social ingest (web search, not direct scrape). */
export function instagramSearchQueries(): string[] {
  const region = "Puerto Plata Sosúa Cabarete Costa Norte";
  
  // Split accounts into smaller groups for more targeted searches
  const localVenues = [
    "onnosbar", "classicocabarete", "shakabardr", "lachabola.cabarete",
    "groundzero_disco", "blueice_pianobar", "captainbaileyssosua"
  ].join(" OR ");
  
  const culturalVenues = [
    "anfiteatropuertoplata", "anfiteatro_puertoplata_rd", "discoclubbrugal",
    "festivaldemerenguepuertoplata", "graaneventsplanners"
  ].join(" OR ");
  
  const touristInfo = [
    "turismopuertoplata", "ayuntamientodepuertoplata", "clusterpuertoplata",
    "costanorterd", "descubrepuertoplata"
  ].join(" OR ");
  
  return [
    // General event discovery
    `site:instagram.com events ${region} 2026`,
    `site:instagram.com eventos ${region} 2026`,
    
    // Local Dominican events (bachata, merengue, típico)
    `site:instagram.com concierto merengue bachata típico ${region}`,
    `site:instagram.com música en vivo ${region}`,
    `site:instagram.com "en vivo" Puerto Plata OR Sosúa OR Cabarete`,
    `site:instagram.com bachata fiesta ${region}`,
    `site:instagram.com merengue típico costa norte`,
    
    // Nightlife & parties
    `site:instagram.com fiesta discoteca ${region}`,
    `site:instagram.com party nightlife Cabarete Sosúa`,
    `site:instagram.com DJ evento ${region}`,
    
    // Cultural & community events
    `site:instagram.com festival cultural Puerto Plata`,
    `site:instagram.com anfiteatro Puerto Plata concierto`,
    `site:instagram.com carnaval Puerto Plata`,
    `site:instagram.com dominicano local ${region} evento`,
    
    // Local venue searches
    `site:instagram.com (${localVenues}) evento OR fiesta OR concierto OR "live music"`,
    `site:instagram.com (${culturalVenues}) concierto OR festival OR presentación`,
    `site:instagram.com (${touristInfo}) evento OR actividad OR fiesta`,
    
    // Food & entertainment
    `site:instagram.com restaurante bar música ${region}`,
    `site:instagram.com gastronómico evento ${region}`,
    
    // Sports & adventure (local favorites)
    `site:instagram.com kitesurf windsurf torneo Cabarete`,
    `site:instagram.com beach volley soccer ${region}`,
    `site:instagram.com deportivo evento costa norte`,
    
    // Wellness & community
    `site:instagram.com yoga wellness retiro ${region}`,
    `site:instagram.com pilates fitness Cabarete`,
    `site:instagram.com mercado artesanal ${region}`,
    
    // Weekly & recurring events
    `site:instagram.com lunes martes miércoles jueves viernes sábado domingo ${region}`,
    `site:instagram.com weekly semanal ${region} evento`,
    `site:instagram.com open mic karaoke ${region}`,
    
    // Local hashtags
    `site:instagram.com #puertoplata #sosua #cabarete evento`,
    `site:instagram.com #costanorterd #eventosdominicanos`,
    `site:instagram.com #somosfiesterosrd costa norte`,
  ];
}
