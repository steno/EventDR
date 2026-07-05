/** North Coast DR Facebook groups monitored for local events. */
export const FACEBOOK_GROUPS = [
  {
    slug: "everythingsosua",
    url: "https://www.facebook.com/groups/everythingsosua",
    label: "Everything Sosúa Dominican Republic",
    areas: ["Sosúa"],
  },
  {
    slug: "costambar",
    url: "https://www.facebook.com/groups/costambar",
    label: "Costambar - Puerto Plata",
    areas: ["Costambar", "Puerto Plata"],
  },
  {
    slug: "1645713275525853",
    url: "https://www.facebook.com/groups/1645713275525853",
    label: "Everything Puerto Plata Dominican Republic",
    areas: ["Puerto Plata"],
  },
  {
    slug: "1987795941420787",
    url: "https://www.facebook.com/groups/1987795941420787",
    label: "Expats in Sosúa and Cabarete",
    areas: ["Sosúa", "Cabarete"],
  },
  {
    slug: "265911674014554",
    url: "https://www.facebook.com/groups/265911674014554",
    label: "Everything Cabarete Dominican Republic",
    areas: ["Cabarete"],
  },
] as const;

export function facebookGroupSearchQueries(): string[] {
  const region = "Puerto Plata Sosúa Cabarete Costa Norte";
  return FACEBOOK_GROUPS.flatMap((group) => [
    `site:facebook.com/groups/${group.slug} evento fiesta concierto ${region} 2026`,
    `site:facebook.com/groups/${group.slug} party concert festival ${region}`,
  ]);
}

/** Curated event ids discovered from monitored Facebook groups (see fallback-events). */
export const FACEBOOK_SEED_EVENT_IDS = [
  "voyvoy-sunday-open-mic",
  "voyvoy-saturday-session",
  "womens-reconnection-kite-camp-2026",
  "cabarete-pilates-reformer",
] as const;

export function facebookGroupEventUrls(): string[] {
  return FACEBOOK_GROUPS.map((group) => `${group.url}/events`);
}
