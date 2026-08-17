import type { EventCategory } from "./types";
import { instagramProfileUrls } from "./instagram-sources";

const REGION = "Puerto Plata Sosúa Cabarete Costa Norte";

const ALLEVENTS_PP = "https://allevents.in/puerto-plata";
const ALLEVENTS_SOSUA = "https://allevents.in/sosua";
const ALLEVENTS_CABARETE = "https://allevents.in/cabarete";
const EVENTBRITE_PP =
  "https://www.eventbrite.com/d/dominican-republic--puerto-plata/events/";
const EVENTBRITE_SOSUA =
  "https://www.eventbrite.com/d/dominican-republic--sosua/events/";
const EVENTBRITE_CABARETE =
  "https://www.eventbrite.com/d/dominican-republic--cabarete/events/";
const BANDSINTOWN_SOSUA =
  "https://www.bandsintown.com/c/sosua-dominican-republic";
const BANDSINTOWN_CABARETE =
  "https://www.bandsintown.com/c/cabarete-dominican-republic";
const BANDSINTOWN_PP =
  "https://www.bandsintown.com/c/puerto-plata-dominican-republic";
const TODOTICKETS_HOME = "https://todotickets.do/";
const TICKETPLUS_RD = "https://dominicana.myticketplus.com/";
const TIX_DO_HOME = "https://tix.do/";
const TIX_DO_EVENTS = "https://tix.do/events";
const CABARETE_JAZZ = "https://www.cabaretejazz.com/";
const DR_JAZZ = "https://www.drjazzfestival.com/";
const NATURA_EVENTS = "https://naturacabana.com/events/";
const PUERTO_PLATA_DIGITAL = "https://puertoplatadigital.com/";
const INFOTUR_RD = "https://infoturdominicano.com/rd/";
const JAZZ_EN_DOMINICANA = "https://www.jazzendominicana.com/";
// Local press — carries chamber/civic announcements that never reach ticketing
// sites. The organizer sites they cover (e.g. foroempresarialpuertoplata.com)
// publish no dates and 403 our crawler, so the press is the usable surface.
const DIARIO_PUERTO_PLATA = "https://diariopuertoplata.com.do/";
const PUERTO_PLATA_NOTICIAS = "https://puertoplatanoticias.com/";
const SOSUA_DIGITAL_TV = "https://sosuadigitaltv.com/";
const OPINION_DIGITAL_PP = "https://opiniondigitalpp.com/";
const AYUNTAMIENTO_PP = "https://ayuntamientopuertoplata.gob.do/";
const ANFITEATRO_PUNTILLA =
  "https://es.godominicanrepublic.com/que-hacer/anfiteatro-la-puntilla";

/**
 * Tour marketplaces (Viator / GetYourGuide) block direct scrapes (403).
 * Discover them via Brave `site:` search in BROAD_QUERIES / adventure only.
 */

/** Known listing pages crawled on every broad ingest (no search API needed). */
export const REGION_DIRECT_URLS = [
  TODOTICKETS_HOME,
  TICKETPLUS_RD,
  TIX_DO_HOME,
  TIX_DO_EVENTS,
  CABARETE_JAZZ,
  DR_JAZZ,
  NATURA_EVENTS,
  PUERTO_PLATA_DIGITAL,
  INFOTUR_RD,
  JAZZ_EN_DOMINICANA,
  DIARIO_PUERTO_PLATA,
  PUERTO_PLATA_NOTICIAS,
  SOSUA_DIGITAL_TV,
  OPINION_DIGITAL_PP,
  AYUNTAMIENTO_PP,
  ANFITEATRO_PUNTILLA,
  ALLEVENTS_PP,
  `${ALLEVENTS_PP}/music`,
  `${ALLEVENTS_PP}/concerts`,
  `${ALLEVENTS_PP}/festivals`,
  ALLEVENTS_SOSUA,
  ALLEVENTS_CABARETE,
  EVENTBRITE_PP,
  EVENTBRITE_SOSUA,
  EVENTBRITE_CABARETE,
  BANDSINTOWN_SOSUA,
  BANDSINTOWN_CABARETE,
  BANDSINTOWN_PP,
  // Instagram profiles — best-effort; many hits login walls (see ingest-social).
  ...instagramProfileUrls(),
];

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
      `Master of the Ocean Cabarete kite beach 2026`,
    ],
    directUrls: [
      `${ALLEVENTS_PP}/sports`,
      EVENTBRITE_CABARETE,
      "https://www.masteroftheocean.org/",
    ],
  },
  music: {
    searches: [
      `música en vivo banda DJ ${REGION} 2026`,
      `live music merengue bachata típico ${REGION} event`,
      `site:facebook.com música en vivo Puerto Plata Sosúa evento`,
      `site:allevents.in music Puerto Plata`,
      `sunset session beach music Cabarete`,
      `perico ripiao típico en vivo Cabarete Sosúa Puerto Plata`,
      `site:naturacabana.com live music Cabarete`,
      `El Parq Foodpark live music karaoke Cabarete`,
    ],
    directUrls: [
      `${ALLEVENTS_PP}/music`,
      ALLEVENTS_CABARETE,
      BANDSINTOWN_SOSUA,
      BANDSINTOWN_CABARETE,
      NATURA_EVENTS,
      PUERTO_PLATA_DIGITAL,
    ],
  },
  concert: {
    searches: [
      `concierto artista en vivo ${REGION} 2026`,
      `concert live show reggaeton urbano ${REGION} Dominican Republic`,
      `site:eventbrite.com concert Puerto Plata Cabarete`,
      `site:bandsintown.com Cabarete OR Sosúa OR Puerto Plata Dominican Republic`,
      `site:facebook.com concierto Puerto Plata boletería`,
      `acoustic night open air concert Malecón Puerto Plata`,
      `site:todotickets.do Puerto Plata Sosúa Cabarete concierto`,
      `site:dominicana.myticketplus.com Puerto Plata Cabarete jazz`,
      `site:tix.do Puerto Plata OR Sosúa OR Cabarete OR Encuentro concierto`,
      `Jandy Ventura OR Lil Naay OR merengue Blue JackTar Puerto Plata`,
      `site:puertoplatadigital.com concierto OR en vivo`,
    ],
    directUrls: [
      `${ALLEVENTS_PP}/concerts`,
      EVENTBRITE_PP,
      BANDSINTOWN_SOSUA,
      BANDSINTOWN_CABARETE,
      BANDSINTOWN_PP,
      TODOTICKETS_HOME,
      TICKETPLUS_RD,
      TIX_DO_HOME,
      TIX_DO_EVENTS,
      CABARETE_JAZZ,
      DR_JAZZ,
    ],
  },
  parties: {
    searches: [
      `fiesta nightclub pool party ${REGION} 2026`,
      `site:facebook.com fiesta Sosúa Cabarete Puerto Plata`,
      `reggaeton party beach club ${REGION}`,
      `site:eventbrite.com party Puerto Plata`,
      `site:tix.do fiesta OR party Cabarete OR Sosúa OR "Puerto Plata" OR Encuentro`,
      `ladies night rooftop party Costa Norte DR`,
    ],
    directUrls: [
      `${ALLEVENTS_PP}/parties`,
      EVENTBRITE_CABARETE,
      TIX_DO_HOME,
      TIX_DO_EVENTS,
    ],
  },
  "food-drinks": {
    searches: [
      `food festival tasting wine beer ${REGION} 2026`,
      `feria gastronómica comida ${REGION} República Dominicana`,
      `site:facebook.com food event Puerto Plata`,
      `brunch market food truck ${REGION}`,
      `site:allevents.in food Puerto Plata`,
    ],
    directUrls: [`${ALLEVENTS_PP}/food`, EVENTBRITE_PP],
  },
  festivals: {
    searches: [
      `festival cultural carnaval ${REGION} 2026`,
      `site:facebook.com festival Puerto Plata Cabarete`,
      `summer fest beach festival ${REGION} DR`,
      `site:allevents.in festivals Puerto Plata`,
      `feria artesanal festival Costa Norte`,
      `Festival del Merengue Puerto Plata Luciano Vásquez`,
      `Cabarete Jazz Festival OR DR Jazz Festival ${REGION}`,
      `site:infoturdominicano.com Puerto Plata evento OR feria`,
      `site:jazzendominicana.com Cabarete OR Puerto Plata`,
    ],
    directUrls: [
      `${ALLEVENTS_PP}/festivals`,
      ALLEVENTS_PP,
      CABARETE_JAZZ,
      DR_JAZZ,
      INFOTUR_RD,
      JAZZ_EN_DOMINICANA,
    ],
  },
  dance: {
    searches: [
      `clase de baile bachata salsa ${REGION} 2026`,
      `dance class social dancing ${REGION} Cabarete`,
      `site:facebook.com bachata salsa merengue Puerto Plata evento`,
      `dance workshop Latin ${REGION}`,
      `site:eventbrite.com dance Puerto Plata`,
      `El Parq Latin Night Cabarete OR D-Classico merengue Sosúa`,
    ],
    directUrls: [`${ALLEVENTS_PP}/dance`, EVENTBRITE_PP],
  },
  "health-wellness": {
    searches: [
      `yoga meditación wellness retiro ${REGION} 2026`,
      `fitness bootcamp wellness ${REGION} Cabarete`,
      `site:facebook.com yoga Puerto Plata Sosúa`,
      `breathwork sound healing ${REGION}`,
      `site:allevents.in wellness Puerto Plata`,
    ],
    directUrls: [`${ALLEVENTS_PP}/wellness`, ALLEVENTS_CABARETE],
  },
  performances: {
    searches: [
      `teatro stand up comedy open mic ${REGION} 2026`,
      `show espectáculo artístico ${REGION} Puerto Plata`,
      `site:facebook.com comedy open mic Cabarete`,
      `live performance theater ${REGION}`,
      `poetry slam talent show Sosúa`,
    ],
    directUrls: [`${ALLEVENTS_PP}/performances`, `${ALLEVENTS_PP}/concerts`],
  },
  business: {
    // Institutional queries lead: Dominican chamber/free-zone events are
    // announced as "foro", "rueda de negocios" or "feria", never as "meetup",
    // and fast mode only runs the first few searches.
    searches: [
      `foro empresarial OR "rueda de negocios" OR "feria comercial" ${REGION} 2026`,
      `"Cámara de Comercio" OR "Zona Franca" Puerto Plata evento OR foro OR congreso 2026`,
      `site:instagram.com foroempresarialpuertoplata OR camarapuertoplata OR zonafrancapuertoplata evento`,
      `congreso OR seminario OR capacitación empresarial ${REGION} 2026`,
      `site:diariopuertoplata.com.do OR site:puertoplatanoticias.com foro OR feria OR congreso empresarial`,
      `networking emprendimiento meetup ${REGION} 2026`,
      `business workshop conference ${REGION} Dominican Republic`,
      `site:eventbrite.com business Puerto Plata Cabarete`,
      `coworking remote work meetup ${REGION}`,
      `site:facebook.com networking Puerto Plata`,
    ],
    directUrls: [
      EVENTBRITE_PP,
      ALLEVENTS_PP,
      DIARIO_PUERTO_PLATA,
      PUERTO_PLATA_NOTICIAS,
    ],
  },
  culture: {
    searches: [
      `museo cultura patrimonio ${REGION} 2026`,
      `museum heritage history Puerto Plata colonial`,
      `site:facebook.com cultural event Puerto Plata`,
      `feria artesanal exposición ${REGION}`,
      `Fortaleza San Felipe Museo del Ámbar eventos`,
      `"Casa de la Cultura" OR "Casa de la Cultura Eduardo Brito" Puerto Plata exposición OR teatro OR concierto`,
      `ayuntamiento Puerto Plata evento cultural OR concierto OR exposición OR teatro 2026`,
      `anfiteatro "La Puntilla" Puerto Plata concierto OR cultural OR ballet OR folclórico 2026`,
      `site:ayuntamientopuertoplata.gob.do evento OR concierto OR cultural OR exposición`,
      `site:facebook.com/ayuntamientodepuertoplata evento OR concierto OR cultural`,
    ],
    directUrls: [ALLEVENTS_PP, AYUNTAMIENTO_PP, ANFITEATRO_PUNTILLA],
  },
  adventure: {
    searches: [
      `excursión aventura tour ${REGION} 2026`,
      `boat tour snorkeling waterfall ${REGION} Puerto Plata`,
      `site:facebook.com excursion Cabarete Puerto Plata`,
      `Cayo Arena Damajagua Teleférico tour Costa Norte`,
      `Ocean World adventure park ${REGION}`,
      `site:viator.com Puerto Plata OR Sosúa OR Cabarete tour`,
      `site:viator.com Sosua snorkeling OR catamaran OR buggy OR horseback`,
      `site:getyourguide.com Puerto Plata OR Cabarete OR Sosúa`,
      `site:getyourguide.com Cabarete kite OR buggy OR waterfall`,
    ],
    directUrls: [ALLEVENTS_PP],
  },
};

export const BROAD_QUERIES = [
  `eventos Costa Norte Puerto Plata Sosúa Cabarete 2026`,
  // OTA tours early so fast-mode cron (first 3 searches) still covers them.
  `site:viator.com things to do Puerto Plata Sosúa Cabarete`,
  `site:getyourguide.com Puerto Plata Cabarete tours activities`,
  `site:allevents.in Puerto Plata Dominican Republic`,
  `site:eventbrite.com Puerto Plata Sosúa Cabarete`,
  `site:bandsintown.com Sosúa OR Cabarete OR Puerto Plata Dominican Republic`,
  `site:todotickets.do eventos Puerto Plata Sosúa Cabarete`,
  `site:dominicana.myticketplus.com Puerto Plata OR Cabarete OR Sosúa`,
  `site:tix.do Puerto Plata OR Cabarete OR Sosúa`,
  `site:facebook.com events Puerto Plata Costa Norte`,
  `qué hacer Puerto Plata eventos esta semana`,
  `pasalo.do eventos Puerto Plata`,
  `actividades Cabarete Sosúa eventos locales`,
  `conciertos merengue bachata típico urbano Puerto Plata Sosúa 2026`,
  `site:puertoplatadigital.com evento OR concierto OR en vivo`,
  `site:infoturdominicano.com Puerto Plata feria OR festival`,
  `site:diariolibre.com Puerto Plata OR Sosúa OR Cabarete concierto`,
  `site:suelocaribe.com Puerto Plata eventos`,
  `boletería José Luis OR Tío Pan concierto Puerto Plata`,
  `ayuntamiento OR "casa de la cultura" OR anfiteatro Puerto Plata evento cultural 2026`,
];

/** Categories we always deep-crawl on the home feed (often under-represented). */
export const PRIORITY_CATEGORIES: EventCategory[] = [
  "sports",
  "concert",
  "performances",
  "business",
  "festivals",
  "culture",
  "adventure",
];

export function getQueriesForCategory(category: EventCategory): string[] {
  return CATEGORY_QUERIES[category].searches;
}

export function getDirectUrlsForCategory(category: EventCategory): string[] {
  return CATEGORY_QUERIES[category].directUrls;
}
