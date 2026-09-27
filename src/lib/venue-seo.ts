import type { Locale } from "@/i18n/config";

export type VenueSeoCopy = {
  title: string;
  description: string;
  /** Schema.org @type override (defaults to LocalBusiness). */
  schemaType?: string | string[];
  /** Prefer this locality in address schema (e.g. Puerto Plata for Chukka). */
  addressLocality?: string;
};

/**
 * Keyword-tuned venue titles/descriptions for high-intent attraction queries.
 * Falls back to dictionary templates when a slug is not listed.
 */
const VENUE_SEO: Record<string, Record<Locale, VenueSeoCopy>> = {
  "fun-city": {
    en: {
      title: "Fun City Puerto Plata | Go-karts from RD$200 | POP Events",
      description:
        "Open daily 10 AM–6 PM on Highway 5 near Playa Dorada. Go-karts from RD$200: Cyclone, Sprint 500, Grand Prix, bumper cars. Tel. 809-697-0794.",
      schemaType: "AmusementPark",
    },
    es: {
      title: "Fun City Puerto Plata | Go-karts desde RD$200 | POP Eventos",
      description:
        "Abierto todos los días 10 AM–6 PM en la Carretera 5, cerca de Playa Dorada. Go-karts desde RD$200: Cyclone, Sprint 500 y Grand Prix. Tel. 809-697-0794.",
      schemaType: "AmusementPark",
    },
    fr: {
      title: "Fun City Puerto Plata | Karts dès RD$200 | POP Events",
      description:
        "Ouvert tous les jours 10 h–18 h sur la Highway 5, près de Playa Dorada. Karts dès RD$200 : Cyclone, Sprint 500, Grand Prix. Tél. 809-697-0794.",
      schemaType: "AmusementPark",
    },
  },
  "aura-beach-club-cabarete": {
    en: {
      title: "Aura Beach Club Cabarete | Hours & nights | POP Events",
      description:
        "Beach club on Calle Principal, Cabarete. Monday 2×1 margaritas, Wednesday Latin Flow from 9 PM, Saturday disco from 11:30 PM. WhatsApp +1 829-787-0140.",
      schemaType: "NightClub",
    },
    es: {
      title: "Aura Beach Club Cabarete | Horario y noches | POP Eventos",
      description:
        "Calle Principal, Cabarete. Lunes 2×1 margarita, miércoles Latin Flow 9 PM, sábado disco 11:30 PM. WhatsApp +1 829-787-0140.",
      schemaType: "NightClub",
    },
    fr: {
      title: "Aura Beach Club Cabarete | Horaires & nuits | POP Events",
      description:
        "Beach club sur Calle Principal, Cabarete. Lundi 2×1 margaritas, mercredi Latin Flow dès 21 h, samedi disco dès 23 h 30. WhatsApp +1 829-787-0140.",
      schemaType: "NightClub",
    },
  },
  "pop-cinemas-playa-dorada": {
    en: {
      title: "POP Cinemas Playa Dorada | Tickets RD$300 | POP Events",
      description:
        "North Coast’s only cinema, in Playa Dorada Mall. Tickets RD$300. Weekly films in Spanish — call 809-320-1400 or see cinemaspop.com.do.",
      schemaType: "MovieTheater",
    },
    es: {
      title: "POP Cinemas Playa Dorada | Cartelera RD$300 | POP Eventos",
      description:
        "El único cine de la Costa Norte, en Playa Dorada Mall. Entrada RD$300. Cartelera semanal en español — 809-320-1400 o cinemaspop.com.do.",
      schemaType: "MovieTheater",
    },
    fr: {
      title: "POP Cinemas Playa Dorada | Séances RD$300 | POP Events",
      description:
        "Seul cinéma de la Côte Nord, au Playa Dorada Mall. Places RD$300. Programme hebdo en espagnol — 809-320-1400 ou cinemaspop.com.do.",
      schemaType: "MovieTheater",
    },
  },
  "coconut-cove": {
    en: {
      title: "Chukka Coconut Cove | Ocean zipline | POP Events",
      description:
        "1,200-ft seaside zipline, ATV and buggy trails, and a private beach at Chukka Ocean Outpost, Bajo Hondo, Puerto Plata.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    es: {
      title: "Chukka Coconut Cove | Tirolesa al mar | POP Eventos",
      description:
        "Tirolesa de 1.200 pies frente al mar, rutas en ATV y buggy, y playa privada en Chukka Ocean Outpost, Bajo Hondo, Puerto Plata.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    fr: {
      title: "Chukka Coconut Cove | Tyrolienne mer | POP Events",
      description:
        "Tyrolienne en bord de mer (365 m), pistes ATV et buggy, et plage privée au Chukka Ocean Outpost, Bajo Hondo, Puerto Plata.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
  },
  "museo-ambar": {
    en: {
      title: "Amber Museum Puerto Plata | Dominican amber | POP Events",
      description:
        "Dominican amber with lizards and insects in a Victorian mansion in Puerto Plata's historic center. Museo del Ámbar.",
      schemaType: "Museum",
    },
    es: {
      title: "Museo del Ámbar | Ámbar dominicano | POP Eventos",
      description:
        "Ámbar dominicano con lagartos e insectos en una mansión victoriana del centro histórico de Puerto Plata.",
      schemaType: "Museum",
    },
    fr: {
      title: "Musée de l'Ambre Puerto Plata | Ambre fossile | POP Events",
      description:
        "Ambre dominicain avec lézards et insectes, dans un manoir victorien du centre historique de Puerto Plata.",
      schemaType: "Museum",
    },
  },
  "ocean-world": {
    en: {
      title: "Ocean World Puerto Plata | Dolphins & slides | POP Events",
      description:
        "Dolphin swims, sea lions, sharks, snorkeling, and water slides in Cofresí. Open daily. Often searched as Sea World Puerto Plata.",
      schemaType: ["AmusementPark", "TouristAttraction"],
    },
    es: {
      title: "Ocean World | Delfines y toboganes | POP Eventos",
      description:
        "Nado con delfines, leones marinos, tiburones, snorkel y toboganes en Cofresí. Abierto todos los días. A veces buscado como Sea World.",
      schemaType: ["AmusementPark", "TouristAttraction"],
    },
    fr: {
      title: "Ocean World Cofresí | Dauphins et toboggans | POP Events",
      description:
        "Nage avec dauphins, otaries et requins, snorkeling et toboggans à Cofresí. Ouvert tous les jours. Souvent cherché comme Sea World.",
      schemaType: ["AmusementPark", "TouristAttraction"],
    },
  },
  "don-limon-cofresi": {
    en: {
      title: "Don Limón Cofresí | Cuban beach restaurant | POP Events",
      description:
        "Family-run Cuban spot on Playa Cofresí. Sandwiches, grilled fish, paella, cocktails. Open daily 11 AM–1 AM. Google 4.8 (165 reviews).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
    es: {
      title: "Don Limón Cofresí | Restaurante cubano | POP Eventos",
      description:
        "Cubano de familia en Playa Cofresí. Sándwiches, pescado a la parrilla, paella y cócteles. Abierto todos los días 11 AM–1 AM. Google 4.8 (165 reseñas).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
    fr: {
      title: "Don Limón Cofresí | Restaurant cubain | POP Events",
      description:
        "Restaurant cubain familial sur Playa Cofresí. Sandwiches, poisson grillé, paella, cocktails. Ouvert tous les jours 11 h–1 h. Google 4,8 (165 avis).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
  },
  "los-tres-cocos-cofresi": {
    en: {
      title: "Los Tres Cocos Cofresí | Garden dinner | POP Events",
      description:
        "Caribbean–European garden dinner in La Roka, Cofresí, with chef Micky. Wed–Mon 5–11 PM, closed Tuesday. Google 4.8 (326 reviews).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
    es: {
      title: "Los Tres Cocos Cofresí | Cena en jardín | POP Eventos",
      description:
        "Cena caribeña–europea en jardín, La Roka, Cofresí, con el chef Micky. Mié–lun 5–11 PM, cerrado martes. Google 4.8 (326 reseñas).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
    fr: {
      title: "Los Tres Cocos Cofresí | Dîner au jardin | POP Events",
      description:
        "Dîner caribéo-européen au jardin, La Roka, Cofresí, avec le chef Micky. Mer–lun 17 h–23 h, fermé mardi. Google 4,8 (326 avis).",
      schemaType: "Restaurant",
      addressLocality: "Cofresí",
    },
  },
};

export function getVenueSeo(
  slug: string,
  locale: Locale,
): VenueSeoCopy | undefined {
  const byLocale = VENUE_SEO[slug];
  if (!byLocale) return undefined;
  return byLocale[locale] ?? byLocale.en;
}
