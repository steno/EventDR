import type { Locale } from "@/i18n/config";
import type { EventCategory } from "@/lib/types";

export type CategorySeoCopy = {
  title: string;
  description: string;
  intro: string;
};

const CATEGORY_SEO: Record<EventCategory, Record<Locale, CategorySeoCopy>> = {
  music: {
    en: {
      title: "Live Music Events in Cabarete, Sosúa & Puerto Plata | POP Events",
      description:
        "Find live music, DJs, merengue, bachata, and sunset sessions in Cabarete, Sosúa, and Puerto Plata on the North Coast of the Dominican Republic.",
      intro:
        "From reggae nights at LAX Cabarete to merengue on the Malecón — discover live music across the North Coast.",
    },
    es: {
      title: "Música en vivo en Cabarete, Sosúa y Puerto Plata | POP Eventos",
      description:
        "Encuentra música en vivo, DJs, merengue, bachata y sesiones al atardecer en Cabarete, Sosúa y Puerto Plata en la Costa Norte de RD.",
      intro:
        "Desde noches de reggae en LAX Cabarete hasta merengue en el Malecón — descubre música en vivo en la Costa Norte.",
    },
    fr: {
      title: "Musique live à Cabarete, Sosúa et Puerto Plata | POP Events",
      description:
        "Concerts, DJ sets, merengue, bachata et sessions au coucher du soleil à Cabarete, Sosúa et Puerto Plata sur la Côte Nord de RD.",
      intro:
        "Des soirées reggae à LAX Cabarete aux concerts sur le Malecón — découvrez la musique live sur la Côte Nord.",
    },
  },
  concert: {
    en: {
      title: "Concerts & Live Shows in North Coast DR | POP Events",
      description:
        "Concerts, reggaeton shows, acoustic nights, and open-air performances in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Outdoor concerts on the Malecón, beachfront shows, and headline acts across Puerto Plata, Sosúa, and Cabarete.",
    },
    es: {
      title: "Conciertos en la Costa Norte RD | POP Eventos",
      description:
        "Conciertos, shows de reggaetón, noches acústicas y espectáculos al aire libre en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "Conciertos en el Malecón, shows frente al mar y artistas en vivo en Puerto Plata, Sosúa y Cabarete.",
    },
    fr: {
      title: "Concerts sur la Côte Nord RD | POP Events",
      description:
        "Concerts, shows reggaeton, soirées acoustiques et spectacles en plein air à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Concerts sur le Malecón, spectacles en bord de mer et artistes live à Puerto Plata, Sosúa et Cabarete.",
    },
  },
  parties: {
    en: {
      title: "Parties & Nightlife in Cabarete, Sosúa & Puerto Plata | POP Events",
      description:
        "Reggaeton parties, pool parties, ladies night, beach club events, and nightlife in Cabarete, Sosúa, and Puerto Plata.",
      intro:
        "Beach clubs, rooftop parties, and weekend nightlife across the North Coast — find your next night out.",
    },
    es: {
      title: "Fiestas y vida nocturna en Cabarete, Sosúa y Puerto Plata | POP Eventos",
      description:
        "Fiestas de reggaetón, pool parties, ladies night, beach clubs y vida nocturna en Cabarete, Sosúa y Puerto Plata.",
      intro:
        "Beach clubs, fiestas en azotea y vida nocturna de fin de semana en la Costa Norte.",
    },
    fr: {
      title: "Fêtes et vie nocturne à Cabarete, Sosúa et Puerto Plata | POP Events",
      description:
        "Soirées reggaeton, pool parties, ladies night, beach clubs et nightlife à Cabarete, Sosúa et Puerto Plata.",
      intro:
        "Beach clubs, soirées sur les toits et nightlife du week-end sur toute la Côte Nord.",
    },
  },
  "food-drinks": {
    en: {
      title: "Food & Drink Events in North Coast DR | POP Events",
      description:
        "Food festivals, brunch markets, wine tastings, and gastronomic fairs on the Malecón and across Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Tasting events, food trucks, and culinary gatherings from the Malecón to Cabarete Bay.",
    },
    es: {
      title: "Eventos gastronómicos en la Costa Norte RD | POP Eventos",
      description:
        "Festivales de comida, brunch, degustaciones y ferias gastronómicas en el Malecón, Puerto Plata, Sosúa y Cabarete.",
      intro:
        "Degustaciones, food trucks y encuentros culinarios desde el Malecón hasta la bahía de Cabarete.",
    },
    fr: {
      title: "Événements food & drinks Côte Nord RD | POP Events",
      description:
        "Festivals gastronomiques, brunchs, dégustations et foires culinaires sur le Malecón, à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Dégustations, food trucks et rendez-vous culinaires du Malecón à la baie de Cabarete.",
    },
  },
  festivals: {
    en: {
      title: "Festivals & Cultural Fairs in North Coast DR | POP Events",
      description:
        "Carnival, beach festivals, artisan fairs, and summer fests in Puerto Plata, Sosúa, and Cabarete on the North Coast.",
      intro:
        "Seasonal festivals, cultural celebrations, and community fairs across the Puerto Plata region.",
    },
    es: {
      title: "Festivales y ferias en la Costa Norte RD | POP Eventos",
      description:
        "Carnaval, festivales de playa, ferias artesanales y fiestas de verano en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "Festivales de temporada, celebraciones culturales y ferias comunitarias en la región de Puerto Plata.",
    },
    fr: {
      title: "Festivals et foires Côte Nord RD | POP Events",
      description:
        "Carnaval, festivals de plage, foires artisanales et fêtes d'été à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Festivals saisonniers, célébrations culturelles et foires locales dans la région de Puerto Plata.",
    },
  },
  dance: {
    en: {
      title: "Dance & Salsa Events in Sosúa, Cabarete & Puerto Plata | POP Events",
      description:
        "Bachata and salsa socials, dance classes, Latin workshops, and social dancing in Sosúa, Cabarete, and Puerto Plata.",
      intro:
        "Salsa nights at El Batey, bachata socials, and dance workshops across the North Coast.",
    },
    es: {
      title: "Baile, salsa y bachata en Sosúa, Cabarete y Puerto Plata | POP Eventos",
      description:
        "Sociales de bachata y salsa, clases de baile, talleres latinos y baile social en Sosúa, Cabarete y Puerto Plata.",
      intro:
        "Noches de salsa en El Batey, sociales de bachata y talleres de baile en la Costa Norte.",
    },
    fr: {
      title: "Danse, salsa et bachata à Sosúa, Cabarete et Puerto Plata | POP Events",
      description:
        "Soirées bachata et salsa, cours de danse, ateliers latins et danses sociales à Sosúa, Cabarete et Puerto Plata.",
      intro:
        "Soirées salsa à El Batey, sociales bachata et ateliers de danse sur la Côte Nord.",
    },
  },
  "health-wellness": {
    en: {
      title: "Yoga & Wellness Events in Cabarete & North Coast DR | POP Events",
      description:
        "Sunrise yoga on Kite Beach, wellness retreats, fitness bootcamps, and meditation events in Cabarete, Sosúa, and Puerto Plata.",
      intro:
        "Beach yoga, breathwork sessions, and wellness meetups from Kite Beach to downtown Sosúa.",
    },
    es: {
      title: "Yoga y wellness en Cabarete y la Costa Norte RD | POP Eventos",
      description:
        "Yoga al amanecer en Kite Beach, retiros wellness, bootcamps y meditación en Cabarete, Sosúa y Puerto Plata.",
      intro:
        "Yoga en la playa, sesiones de breathwork y encuentros wellness desde Kite Beach hasta Sosúa.",
    },
    fr: {
      title: "Yoga et wellness à Cabarete et Côte Nord RD | POP Events",
      description:
        "Yoga au lever du soleil à Kite Beach, retraites wellness, bootcamps et méditation à Cabarete, Sosúa et Puerto Plata.",
      intro:
        "Yoga sur la plage, breathwork et rencontres wellness de Kite Beach à Sosúa.",
    },
  },
  performances: {
    en: {
      title: "Comedy, Open Mic & Shows in North Coast DR | POP Events",
      description:
        "Stand-up comedy, open mic nights, theater, poetry slams, and live performances in Sosúa, Cabarete, and Puerto Plata.",
      intro:
        "Open mic at El Batey, comedy nights, and live performances across the North Coast.",
    },
    es: {
      title: "Comedia, open mic y espectáculos en la Costa Norte RD | POP Eventos",
      description:
        "Stand-up comedy, open mic, teatro, poetry slam y shows en vivo en Sosúa, Cabarete y Puerto Plata.",
      intro:
        "Open mic en El Batey, noches de comedia y espectáculos en vivo en la Costa Norte.",
    },
    fr: {
      title: "Comédie, open mic et spectacles Côte Nord RD | POP Events",
      description:
        "Stand-up, open mic, théâtre, poetry slam et spectacles live à Sosúa, Cabarete et Puerto Plata.",
      intro:
        "Open mic à El Batey, soirées comédie et spectacles live sur la Côte Nord.",
    },
  },
  sports: {
    en: {
      title: "Sports & Kite Surf Events in Cabarete & North Coast DR | POP Events",
      description:
        "Kite surfing, wing foil, beach volleyball, pickup soccer, running races, and sports events in Cabarete, Sosúa, and Puerto Plata.",
      intro:
        "World-class kite surf at Kite Beach, beach volleyball in Sosúa, and local sports leagues across the North Coast.",
    },
    es: {
      title: "Deportes y kite surf en Cabarete y la Costa Norte RD | POP Eventos",
      description:
        "Kite surf, wing foil, voleibol de playa, fútbol pickup, carreras y eventos deportivos en Cabarete, Sosúa y Puerto Plata.",
      intro:
        "Kite surf de clase mundial en Kite Beach, voleibol en Sosúa y ligas locales en la Costa Norte.",
    },
    fr: {
      title: "Sports et kite surf à Cabarete et Côte Nord RD | POP Events",
      description:
        "Kite surf, wing foil, beach volley, football pickup, courses et événements sportifs à Cabarete, Sosúa et Puerto Plata.",
      intro:
        "Kite surf de classe mondiale à Kite Beach, beach volley à Sosúa et sports locaux sur la Côte Nord.",
    },
  },
  business: {
    en: {
      title: "Networking & Coworking Events in Cabarete & North Coast DR | POP Events",
      description:
        "Startup meetups, coworking events, remote worker gatherings, and business workshops in Cabarete, Sosúa, and Puerto Plata.",
      intro:
        "Cowork Cabarete meetups, expat networking, and entrepreneur events for the North Coast community.",
    },
    es: {
      title: "Networking y coworking en Cabarete y la Costa Norte RD | POP Eventos",
      description:
        "Meetups de startups, eventos de coworking, nómadas digitales y talleres de negocios en Cabarete, Sosúa y Puerto Plata.",
      intro:
        "Encuentros en Cowork Cabarete, networking de expats y eventos para emprendedores en la Costa Norte.",
    },
    fr: {
      title: "Networking et coworking à Cabarete et Côte Nord RD | POP Events",
      description:
        "Meetups startups, événements coworking, nomades digitaux et ateliers business à Cabarete, Sosúa et Puerto Plata.",
      intro:
        "Rencontres à Cowork Cabarete, networking expats et événements entrepreneurs sur la Côte Nord.",
    },
  },
  culture: {
    en: {
      title: "Culture & Heritage Events in Puerto Plata | POP Events",
      description:
        "Museum events, Fortaleza San Felipe tours, colonial heritage walks, and artisan fairs in Puerto Plata and the North Coast.",
      intro:
        "Museo del Ámbar, historic downtown walks, and cultural heritage events across Puerto Plata.",
    },
    es: {
      title: "Cultura y patrimonio en Puerto Plata y Costa Norte RD | POP Eventos",
      description:
        "Eventos en museos, Fortaleza San Felipe, patrimonio colonial y ferias artesanales en Puerto Plata y la Costa Norte.",
      intro:
        "Museo del Ámbar, paseos por el centro histórico y eventos culturales en Puerto Plata.",
    },
    fr: {
      title: "Culture et patrimoine à Puerto Plata et Côte Nord RD | POP Events",
      description:
        "Événements musées, Fortaleza San Felipe, patrimoine colonial et foires artisanales à Puerto Plata et sur la Côte Nord.",
      intro:
        "Museo del Ámbar, balades dans le centre historique et événements culturels à Puerto Plata.",
    },
  },
  adventure: {
    en: {
      title: "Adventure Tours & Excursions in North Coast DR | POP Events",
      description:
        "Damajagua waterfall tours, Cayo Arena boat trips, Ocean World, snorkeling, and adventure excursions from Puerto Plata to Cabarete.",
      intro:
        "Waterfall hikes, island day trips, and outdoor adventures across the North Coast of the Dominican Republic.",
    },
    es: {
      title: "Aventura y excursiones en la Costa Norte RD | POP Eventos",
      description:
        "Tour Damajagua, Cayo Arena, Ocean World, snorkel y excursiones de aventura desde Puerto Plata hasta Cabarete.",
      intro:
        "Cascadas, excursiones en bote e aventuras al aire libre en la Costa Norte de República Dominicana.",
    },
    fr: {
      title: "Aventure et excursions Côte Nord RD | POP Events",
      description:
        "Damajagua, Cayo Arena, Ocean World, snorkeling et excursions d'aventure de Puerto Plata à Cabarete.",
      intro:
        "Randonnées aux cascades, excursions en bateau et aventures outdoor sur la Côte Nord de RD.",
    },
  },
};

export function getCategorySeo(
  locale: Locale,
  categoryId: EventCategory,
): CategorySeoCopy {
  return CATEGORY_SEO[categoryId][locale] ?? CATEGORY_SEO[categoryId].en;
}
