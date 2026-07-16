/**
 * North Coast Instagram accounts monitored for event discovery.
 * Profiles are scraped best-effort (login walls often block); site: search
 * queries still surface public posts via web search.
 */

export const INSTAGRAM_ACCOUNTS = [
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
] as const;

export function instagramProfileUrls(): string[] {
  return INSTAGRAM_ACCOUNTS.map(
    (account) => `https://www.instagram.com/${account.handle}/`,
  );
}

/** Discovery queries layered onto social ingest (web search, not direct scrape). */
export function instagramSearchQueries(): string[] {
  const region = "Puerto Plata Sosúa Cabarete Costa Norte";
  const handleOr = INSTAGRAM_ACCOUNTS.map((a) => a.handle).join(" OR ");
  return [
    `site:instagram.com events ${region}`,
    `site:instagram.com fiesta evento Cabarete República Dominicana`,
    `site:instagram.com concierto Puerto Plata`,
    `site:instagram.com música en vivo merengue bachata típico ${region}`,
    `site:instagram.com (${handleOr}) evento OR concierto OR fiesta OR "live music"`,
    `site:instagram.com graaneventsplanners OR cabaretejazz OR nonasgrillkitchen evento`,
    `site:instagram.com ashonorte OR "playa dorada" OR "beach soccer" Sosúa`,
  ];
}
