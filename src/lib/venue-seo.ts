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
      title: "Fun City Puerto Plata | Go-Kart Action Park | POP Events",
      description:
        "Fun City Action Park in Puerto Plata — the Dominican Republic's largest go-kart park on Highway 5 near Playa Dorada. Cyclone, Sprint 500, Grand Prix, bumper cars, and kids' tracks.",
      schemaType: "AmusementPark",
    },
    es: {
      title: "Fun City Puerto Plata | Parque de go-karts | POP Eventos",
      description:
        "Fun City Action Park en Puerto Plata — el parque de go-karts más grande de República Dominicana en la Carretera 5 cerca de Playa Dorada. Cyclone, Sprint 500, Grand Prix, autos chocadores y pistas infantiles.",
      schemaType: "AmusementPark",
    },
    fr: {
      title: "Fun City Puerto Plata | Parc de go-karts | POP Events",
      description:
        "Fun City Action Park à Puerto Plata — le plus grand parc de go-karts de République dominicaine sur la Highway 5 près de Playa Dorada. Cyclone, Sprint 500, Grand Prix, autos tamponneuses et pistes enfants.",
      schemaType: "AmusementPark",
    },
  },
  "coconut-cove": {
    en: {
      title: "Chukka Coconut Cove | Ocean Zipline Puerto Plata | POP Events",
      description:
        "Chukka Ocean Outpost at Coconut Cove near Puerto Plata — 1,200-ft seaside zipline, ATV and dune buggy trails, private beach, and watersports in Bajo Hondo.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    es: {
      title: "Chukka Coconut Cove | Tirolesa océano Puerto Plata | POP Eventos",
      description:
        "Chukka Ocean Outpost en Coconut Cove cerca de Puerto Plata — tirolesa frente al mar de 1.200 pies, rutas en ATV y buggy, playa privada y deportes acuáticos en Bajo Hondo.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    fr: {
      title: "Chukka Coconut Cove | Tyrolienne océan Puerto Plata | POP Events",
      description:
        "Chukka Ocean Outpost à Coconut Cove près de Puerto Plata — tyrolienne en bord de mer de 365 m, pistes ATV et buggy, plage privée et sports nautiques à Bajo Hondo.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
  },
  "museo-ambar": {
    en: {
      title:
        "Amber Museum Puerto Plata | Fossilized Resin & Dominican Amber | POP Events",
      description:
        "Museo del Ámbar — Puerto Plata's amber museum of fossilized resin in a Victorian mansion. Dominican amber with lizards, insects, and prehistoric specimens in the historic center.",
      schemaType: "Museum",
    },
    es: {
      title:
        "Museo del Ámbar Puerto Plata | Ámbar y resina fosilizada | POP Eventos",
      description:
        "Museo del Ámbar en el centro histórico de Puerto Plata — museo de ámbar dominicano y resina fosilizada en una mansión victoriana, con lagartos, insectos y especímenes prehistóricos.",
      schemaType: "Museum",
    },
    fr: {
      title:
        "Musée de l'Ambre Puerto Plata | Résine fossilisée | POP Events",
      description:
        "Museo del Ámbar — musée de l'ambre et de la résine fossilisée à Puerto Plata, dans un manoir victorien du centre historique. Ambre dominicain avec lézards, insectes et spécimens préhistoriques.",
      schemaType: "Museum",
    },
  },
  "ocean-world": {
    en: {
      title: "Ocean World Puerto Plata | Marine Adventure Park | POP Events",
      description:
        "Ocean World Adventure Park in Cofresí, Puerto Plata — dolphin swims, sea lion and shark encounters, snorkeling, and water slides. Open daily; sometimes searched as Sea World Puerto Plata.",
      schemaType: ["AmusementPark", "TouristAttraction"],
    },
    es: {
      title: "Ocean World Puerto Plata | Parque marino de aventura | POP Eventos",
      description:
        "Ocean World Adventure Park en Cofresí, Puerto Plata — nado con delfines, encuentros con leones marinos y tiburones, snorkel y toboganes. Abierto todos los días; a veces buscado como Sea World Puerto Plata.",
      schemaType: ["AmusementPark", "TouristAttraction"],
    },
    fr: {
      title: "Ocean World Puerto Plata | Parc marin d'aventure | POP Events",
      description:
        "Ocean World Adventure Park à Cofresí, Puerto Plata — nage avec dauphins, otaries et requins, snorkeling et toboggans. Ouvert tous les jours ; parfois cherché comme Sea World Puerto Plata.",
      schemaType: ["AmusementPark", "TouristAttraction"],
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
