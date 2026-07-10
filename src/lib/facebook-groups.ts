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

/** Facebook event *pages* (not groups) — host /events feeds for regattas, venues, etc. */
export const FACEBOOK_EVENT_PAGES = [
  {
    slug: "cabareteclassiceventpage",
    url: "https://www.facebook.com/cabareteclassiceventpage",
    label: "Cabarete Classic",
    areas: ["Cabarete"],
  },
  {
    slug: "el-carey-dia-y-noche",
    url: "https://www.facebook.com/profile.php?id=100089059716413",
    label: "El Carey Día y Noche",
    areas: ["Costambar", "Puerto Plata"],
  },
] as const;

export function facebookGroupSearchQueries(): string[] {
  const region = "Puerto Plata Sosúa Cabarete Costa Norte";
  return FACEBOOK_GROUPS.flatMap((group) => [
    `site:facebook.com/groups/${group.slug} evento fiesta concierto ${region} 2026`,
    `site:facebook.com/groups/${group.slug} party concert festival ${region}`,
  ]);
}

import { EL_CAREY_WC2026_EVENT_IDS } from "./world-cup-2026-events";

const FACEBOOK_SEED_EVENT_IDS_BASE = [
  "voyvoy-sunday-open-mic",
  "voyvoy-saturday-session",
  "womens-reconnection-kite-camp-2026",
  "cabarete-pilates-reformer",
  "cabarete-classic-2026",
  "inicio-del-campamento-pp-2026",
  "feria-artesanal-verano-2026",
] as const;

/** Curated event ids discovered from monitored Facebook groups (see fallback-events). */
export const FACEBOOK_SEED_EVENT_IDS: readonly string[] = [
  ...FACEBOOK_SEED_EVENT_IDS_BASE,
  ...EL_CAREY_WC2026_EVENT_IDS,
];

export function facebookGroupEventUrls(): string[] {
  return FACEBOOK_GROUPS.map((group) => `${group.url}/events`);
}

export function facebookEventPageUrls(): string[] {
  return FACEBOOK_EVENT_PAGES.flatMap((page) => [
    page.url,
    `${page.url}/events`,
  ]);
}
