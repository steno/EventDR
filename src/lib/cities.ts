import type { Locale } from "@/i18n/config";
import type { Event, EventCategory } from "@/lib/types";

export type CitySlug = "puerto-plata" | "sosua" | "cabarete";

/** Regional hero for North Coast scope pages (no city selected). */
export const NORTH_COAST_HERO_IMAGE = "/cities/north-coast.jpg";

/** Curated pills for regional “Popular in North Coast” links. */
export const NORTH_COAST_TOP_CATEGORIES: EventCategory[] = [
  "music",
  "parties",
  "sports",
  "adventure",
  "food-drinks",
  "festivals",
];

export type CitySeoCopy = {
  title: string;
  description: string;
  intro: string;
};

export type CityMeta = {
  slug: CitySlug;
  emoji: string;
  /** Place hero image for city scope pages. */
  heroImage: string;
  name: Record<Locale, string>;
  matchers: string[];
  topCategories: EventCategory[];
  seo: Record<Locale, CitySeoCopy>;
};

export const CITIES: CityMeta[] = [
  {
    slug: "puerto-plata",
    emoji: "🏛️",
    heroImage: "/cities/puerto-plata.jpg",
    name: {
      en: "Puerto Plata",
      es: "Puerto Plata",
      fr: "Puerto Plata",
    },
    matchers: [
      "puerto plata",
      "cofresí",
      "cofresi",
      "playa dorada",
      "costambar",
      "damajagua",
      "teleférico",
      "teleferico",
    ],
    topCategories: ["music", "culture", "adventure", "concert", "festivals", "food-drinks"],
    seo: {
      en: {
        title: "Events in Puerto Plata | Things to Do This Weekend | POP Events",
        description:
          "Discover concerts, festivals, Malecón gatherings, Ocean World activities, and local events in Puerto Plata on the North Coast of the Dominican Republic.",
        intro:
          "From waterfront concerts on the Malecón to Damajagua waterfall tours and downtown culture walks — here's what's happening in Puerto Plata.",
      },
      es: {
        title: "Eventos en Puerto Plata | Qué hacer este fin de semana | POP Eventos",
        description:
          "Descubre conciertos, festivales, eventos en el Malecón, Ocean World y actividades locales en Puerto Plata en la Costa Norte de RD.",
        intro:
          "Desde conciertos en el Malecón hasta tours a Damajagua y paseos culturales — esto es lo que pasa en Puerto Plata.",
      },
      fr: {
        title: "Événements à Puerto Plata | Que faire ce week-end | POP Events",
        description:
          "Concerts, festivals, Malecón, Ocean World et événements locaux à Puerto Plata sur la Côte Nord de la République dominicaine.",
        intro:
          "Des concerts sur le Malecón aux cascades de Damajagua — voici ce qui se passe à Puerto Plata.",
      },
    },
  },
  {
    slug: "sosua",
    emoji: "🌴",
    heroImage: "/cities/sosua.jpg",
    name: {
      en: "Sosúa",
      es: "Sosúa",
      fr: "Sosúa",
    },
    matchers: ["sosúa", "sosua"],
    topCategories: ["dance", "parties", "sports", "performances", "music"],
    seo: {
      en: {
        title: "Events in Sosúa | Things to Do This Weekend | POP Events",
        description:
          "Find salsa socials, beach volleyball, nightlife at El Batey, expat meetups, and local events in Sosúa on the North Coast of the DR.",
        intro:
          "Beach days, salsa nights, and expat community events — discover what's on in Sosúa this week.",
      },
      es: {
        title: "Eventos en Sosúa | Qué hacer este fin de semana | POP Eventos",
        description:
          "Encuentra sociales de salsa, voleibol de playa, vida nocturna en El Batey, meetups de expats y eventos locales en Sosúa.",
        intro:
          "Playa, salsa y comunidad expat — descubre qué pasa en Sosúa esta semana.",
      },
      fr: {
        title: "Événements à Sosúa | Que faire ce week-end | POP Events",
        description:
          "Soirées salsa, beach volley, nightlife à El Batey, meetups expats et événements locaux à Sosúa sur la Côte Nord.",
        intro:
          "Plage, salsa et communauté expat — découvrez ce qui se passe à Sosúa cette semaine.",
      },
    },
  },
  {
    slug: "cabarete",
    emoji: "🏄",
    heroImage: "/cities/cabarete.jpg",
    name: {
      en: "Cabarete",
      es: "Cabarete",
      fr: "Cabarete",
    },
    matchers: ["cabarete"],
    topCategories: ["sports", "parties", "music", "health-wellness", "adventure"],
    seo: {
      en: {
        title: "Events in Cabarete | Kite Surf, Parties & Live Music | POP Events",
        description:
          "Live music, kite surf competitions, yoga on Kite Beach, reggae nights, and parties in Cabarete — the adventure hub of the North Coast DR.",
        intro:
          "Kite Beach competitions, sunset sessions at LAX, and weekend parties — Cabarete's event calendar starts here.",
      },
      es: {
        title: "Eventos en Cabarete | Kite surf, fiestas y música en vivo | POP Eventos",
        description:
          "Música en vivo, competencias de kite surf, yoga en Kite Beach, noches de reggae y fiestas en Cabarete, el corazón de la Costa Norte.",
        intro:
          "Competencias en Kite Beach, sesiones al atardecer en LAX y fiestas de fin de semana — el calendario de Cabarete empieza aquí.",
      },
      fr: {
        title: "Événements à Cabarete | Kite surf, fêtes et musique live | POP Events",
        description:
          "Musique live, compétitions kite surf, yoga à Kite Beach, soirées reggae et fêtes à Cabarete, le cœur de la Côte Nord.",
        intro:
          "Compétitions à Kite Beach, sessions au coucher du soleil à LAX et fêtes du week-end — le calendrier de Cabarete commence ici.",
      },
    },
  },
];

export const CITY_SLUGS = CITIES.map((city) => city.slug);

/** Query value for “whole North Coast” on home (`?city=all`). */
export const HOME_CITY_ALL = "all";

const HOME_AREA_STORAGE_KEY = "pop-home-area";

export function isCitySlug(value: string): value is CitySlug {
  return CITY_SLUGS.includes(value as CitySlug);
}

/**
 * Parse home `?city=` — URL is the source of truth for area filter
 * (back/forward, reload, share).
 */
export function parseHomeCityParam(value: string | null): {
  city: CitySlug | null;
  areaChosen: boolean;
} {
  if (!value) return { city: null, areaChosen: false };
  if (value === HOME_CITY_ALL) return { city: null, areaChosen: true };
  if (isCitySlug(value)) return { city: value, areaChosen: true };
  return { city: null, areaChosen: false };
}

/** Home href including area query when the user has chosen a zone. */
export function homePathWithArea(
  locale: string,
  city: CitySlug | null,
  areaChosen: boolean,
): string {
  if (!areaChosen) return `/${locale}`;
  return `/${locale}?city=${city ?? HOME_CITY_ALL}`;
}

/** Persist chosen home area for the tab session (survives links that drop ?city=). */
export function writeHomeArea(city: CitySlug | null): void {
  try {
    sessionStorage.setItem(HOME_AREA_STORAGE_KEY, city ?? HOME_CITY_ALL);
  } catch {
    /* private mode / disabled storage */
  }
}

/** Clear session home area (e.g. logo click → fresh home). */
export function clearHomeArea(): void {
  try {
    sessionStorage.removeItem(HOME_AREA_STORAGE_KEY);
  } catch {
    /* private mode / disabled storage */
  }
}

export function readHomeArea(): {
  city: CitySlug | null;
  areaChosen: boolean;
} {
  try {
    return parseHomeCityParam(sessionStorage.getItem(HOME_AREA_STORAGE_KEY));
  } catch {
    return { city: null, areaChosen: false };
  }
}

/** Last home path for this session, or bare locale home if none chosen. */
export function lastHomePath(locale: string): string {
  const { city, areaChosen } = readHomeArea();
  return homePathWithArea(locale, city, areaChosen);
}

export function getCityMeta(slug: string): CityMeta | undefined {
  return CITIES.find((city) => city.slug === slug);
}

export function getCityName(city: CityMeta, locale: Locale): string {
  return city.name[locale] ?? city.name.en;
}

export function getCitySeo(city: CityMeta, locale: Locale): CitySeoCopy {
  return city.seo[locale] ?? city.seo.en;
}

export function getCityTopCategories(slug: CitySlug): EventCategory[] {
  return getCityMeta(slug)?.topCategories ?? [];
}

function normalizeLocation(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/**
 * When `location` names exactly one home zone, trust that over venue/address.
 * Geocoders often put Cabarete under Sosúa municipality (shared postal codes).
 */
function cityFromLocationField(location: string | undefined): CitySlug | null {
  if (!location?.trim()) return null;
  const normalized = normalizeLocation(location);
  const hits = CITIES.filter((city) =>
    city.matchers.some((matcher) =>
      normalized.includes(normalizeLocation(matcher)),
    ),
  );
  return hits.length === 1 ? hits[0].slug : null;
}

export function eventMatchesCity(event: Event, slug: CitySlug): boolean {
  const city = getCityMeta(slug);
  if (!city) return false;

  const primary = cityFromLocationField(event.location);
  if (primary) return primary === slug;

  const haystack = normalizeLocation(
    [event.location, event.venue, event.address].filter(Boolean).join(" "),
  );

  return city.matchers.some((matcher) =>
    haystack.includes(normalizeLocation(matcher)),
  );
}
