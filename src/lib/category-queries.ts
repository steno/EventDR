import type { EventCategory } from "./types";

const REGION = "Puerto Plata Sosúa Cabarete Costa Norte";

export interface CategoryQuerySet {
  searches: string[];
  directUrls: string[];
}

/** Rich search queries tuned to surface hidden/local North Coast events per category. */
export const CATEGORY_QUERIES: Record<EventCategory, CategoryQuerySet> = {
  sports: {
    searches: [
      `deportes torneo fútbol voleibol ${REGION} 2026`,
      `kite surf surf volleyball baseball ${REGION} event`,
      `site:facebook.com deportes Cabarete Puerto Plata evento`,
      `site:eventbrite.com sports Cabarete Puerto Plata`,
      `liga softbol pickup soccer beach volleyball Sosúa Cabarete`,
      `running race triathlon paddleboard ${REGION} Dominican Republic`,
    ],
    directUrls: [
      "https://www.facebook.com/events/search?q=cabarete%20sports",
    ],
  },
  music: {
    searches: [
      `música en vivo banda DJ ${REGION} 2026`,
      `live music merengue bachata ${REGION} event`,
      `site:facebook.com música Puerto Plata Sosúa evento`,
      `site:allevents.in music Puerto Plata`,
      `sunset session beach music Cabarete`,
    ],
    directUrls: ["https://allevents.in/puerto%20plata/music"],
  },
  concert: {
    searches: [
      `concierto artista en vivo ${REGION} 2026`,
      `concert live show reggaeton ${REGION} Dominican Republic`,
      `site:eventbrite.com concert Puerto Plata Cabarete`,
      `site:facebook.com concierto Puerto Plata`,
      `acoustic night open air concert Malecón Puerto Plata`,
    ],
    directUrls: ["https://allevents.in/puerto%20plata/concerts"],
  },
  parties: {
    searches: [
      `fiesta nightclub pool party ${REGION} 2026`,
      `site:facebook.com fiesta Sosúa Cabarete Puerto Plata`,
      `reggaeton party beach club ${REGION}`,
      `site:eventbrite.com party Puerto Plata`,
      `ladies night rooftop party Costa Norte DR`,
    ],
    directUrls: [],
  },
  "food-drinks": {
    searches: [
      `food festival tasting wine beer ${REGION} 2026`,
      `feria gastronómica comida ${REGION} República Dominicana`,
      `site:facebook.com food event Puerto Plata`,
      `brunch market food truck ${REGION}`,
      `site:allevents.in food Puerto Plata`,
    ],
    directUrls: [],
  },
  festivals: {
    searches: [
      `festival cultural carnaval ${REGION} 2026`,
      `site:facebook.com festival Puerto Plata Cabarete`,
      `summer fest beach festival ${REGION} DR`,
      `site:allevents.in festivals Puerto Plata`,
      `feria artesanal festival Costa Norte`,
    ],
    directUrls: ["https://allevents.in/puerto%20plata/festivals"],
  },
  dance: {
    searches: [
      `clase de baile bachata salsa ${REGION} 2026`,
      `dance class social dancing ${REGION} Cabarete`,
      `site:facebook.com bachata salsa Puerto Plata evento`,
      `dance workshop Latin ${REGION}`,
      `site:eventbrite.com dance Puerto Plata`,
    ],
    directUrls: [],
  },
  "health-wellness": {
    searches: [
      `yoga meditación wellness retiro ${REGION} 2026`,
      `fitness bootcamp wellness ${REGION} Cabarete`,
      `site:facebook.com yoga Puerto Plata Sosúa`,
      `breathwork sound healing ${REGION}`,
      `site:allevents.in wellness Puerto Plata`,
    ],
    directUrls: [],
  },
  performances: {
    searches: [
      `teatro stand up comedy open mic ${REGION} 2026`,
      `show espectáculo artístico ${REGION} Puerto Plata`,
      `site:facebook.com comedy open mic Cabarete`,
      `live performance theater ${REGION}`,
      `poetry slam talent show Sosúa`,
    ],
    directUrls: [],
  },
  business: {
    searches: [
      `networking emprendimiento meetup ${REGION} 2026`,
      `business workshop conference ${REGION} Dominican Republic`,
      `site:eventbrite.com business Puerto Plata Cabarete`,
      `coworking remote work meetup ${REGION}`,
      `site:facebook.com networking Puerto Plata`,
    ],
    directUrls: [],
  },
};

export const BROAD_QUERIES = [
  `eventos Costa Norte Puerto Plata Sosúa Cabarete 2026`,
  `site:allevents.in Puerto Plata Dominican Republic`,
  `site:eventbrite.com Puerto Plata Sosúa Cabarete`,
  `site:facebook.com events Puerto Plata Costa Norte`,
  `qué hacer Puerto Plata eventos esta semana`,
  `pasalo.do eventos Puerto Plata`,
  `actividades Cabarete Sosúa eventos locales`,
];

/** Categories we always deep-crawl on the home feed (often under-represented). */
export const PRIORITY_CATEGORIES: EventCategory[] = [
  "sports",
  "concert",
  "performances",
  "business",
  "festivals",
];

export function getQueriesForCategory(category: EventCategory): string[] {
  return CATEGORY_QUERIES[category].searches;
}

export function getDirectUrlsForCategory(category: EventCategory): string[] {
  return CATEGORY_QUERIES[category].directUrls;
}
