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
      title: "Fun City Puerto Plata | Go-kart tickets RD$200 | POP Events",
      description:
        "Go-kart park near Playa Dorada — tickets from RD$200. Open daily 10 AM–6 PM. Cyclone, Sprint 500, Grand Prix, bumper cars. Hwy 5. Tel. 809-697-0794.",
      schemaType: "AmusementPark",
    },
    es: {
      title: "Fun City Puerto Plata | Go-karts desde RD$200 | POP Eventos",
      description:
        "Parque de go-karts cerca de Playa Dorada. Tickets desde RD$200 — Cyclone, Sprint 500, Grand Prix. Carretera 5. Abierto 10 AM–6 PM. Tel. 809-697-0794.",
      schemaType: "AmusementPark",
    },
    fr: {
      title: "Fun City Puerto Plata | Karts dès RD$200 | POP Events",
      description:
        "Parc de karts près de Playa Dorada. Tickets dès RD$200 — Cyclone, Sprint 500, Grand Prix. Highway 5. Ouvert 10 h–18 h. Tél. 809-697-0794.",
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
      title: "Chukka Puerto Plata | Coconut Cove zipline | POP Events",
      description:
        "Chukka adventure park in Puerto Plata — 1,200-ft ocean zipline, ATV & buggy at Coconut Cove, Bajo Hondo. Private beach.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    es: {
      title: "Chukka Puerto Plata | Tirolesa Coconut Cove | POP Eventos",
      description:
        "Parque Chukka en Puerto Plata — tirolesa al mar de 1.200 pies, ATV y buggy en Coconut Cove, Bajo Hondo. Playa privada.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Puerto Plata",
    },
    fr: {
      title: "Chukka Puerto Plata | Tyrolienne Coconut Cove | POP Events",
      description:
        "Parc Chukka à Puerto Plata — tyrolienne mer 365 m, ATV et buggy à Coconut Cove, Bajo Hondo. Plage privée.",
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
  "letrero-puerto-plata": {
    en: {
      title: "Letrero Puerto Plata | Free photo letters | POP Events",
      description:
        "Free Malecón photo letters near La Puntilla — iconic PUERTO PLATA sign with Atlantic views. Open daily; pair with Fortaleza San Felipe.",
      schemaType: "TouristAttraction",
    },
    es: {
      title: "Letrero Puerto Plata | Letras foto gratis | POP Eventos",
      description:
        "Letras foto gratis en el Malecón cerca de La Puntilla — el letrero PUERTO PLATA con vista al Atlántico. Todos los días; junto a San Felipe.",
      schemaType: "TouristAttraction",
    },
    fr: {
      title: "Letrero Puerto Plata | Lettres photo gratis | POP Events",
      description:
        "Lettres photo gratuites sur le Malecón près de La Puntilla — le panneau PUERTO PLATA vue Atlantique. Tous les jours ; près de San Felipe.",
      schemaType: "TouristAttraction",
    },
  },
  "rum-legacy-museum": {
    en: {
      title: "Rum Legacy Museum Puerto Plata | Free tour | POP Events",
      description:
        "Free rum museum in Puerto Plata historic center — audio tour and tasting on Calle Beller. Open daily 9:30 AM–4:30 PM. Tel. 809-261-8661.",
      schemaType: "Museum",
    },
    es: {
      title: "Rum Legacy Museum | Tour gratis Puerto Plata | POP Eventos",
      description:
        "Museo del ron gratis en el centro de Puerto Plata — tour audio y degustación en Calle Beller. Diario 9:30 AM–4:30 PM. Tel. 809-261-8661.",
      schemaType: "Museum",
    },
    fr: {
      title: "Rum Legacy Museum Puerto Plata | Visite libre | POP Events",
      description:
        "Musée du rhum gratuit au centre de Puerto Plata — visite audio et dégustation, Calle Beller. Tous les jours 9 h 30–16 h 30. Tél. 809-261-8661.",
      schemaType: "Museum",
    },
  },
  "santa-fe-sov": {
    en: {
      title: "Santa Fe Sosúa | Day pass & tickets | POP Events",
      description:
        "Sosúa Ocean Village day pass — pools, fortress, Santa Maria ship. Tickets at pasadia.santafe.do. Not Restaurant Maria.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Sosúa",
    },
    es: {
      title: "Santa Fe Sosúa | Day pass y tickets | POP Eventos",
      description:
        "Day pass en Sosúa Ocean Village — piscinas, fortaleza, barco Santa Maria. Tickets en pasadia.santafe.do. No es Restaurant Maria.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Sosúa",
    },
    fr: {
      title: "Santa Fe Sosúa | Day pass & billets | POP Events",
      description:
        "Day pass à Sosúa Ocean Village — piscines, forteresse, bateau Santa Maria. Billets sur pasadia.santafe.do. Pas Restaurant Maria.",
      schemaType: ["TouristAttraction", "AmusementPark"],
      addressLocality: "Sosúa",
    },
  },
  "iberostar-waves-costa-dorada": {
    en: {
      title: "Iberostar Day Pass Puerto Plata | From US$65 | POP Events",
      description:
        "All-inclusive day pass — pools, beach, food & drinks from US$65. Costa Dorada, Puerto Plata. Closed 30 Aug–26 Oct 2026; book after 26 Oct.",
      schemaType: "Resort",
    },
    es: {
      title: "Day pass Iberostar Puerto Plata | Desde US$65 | POP Eventos",
      description:
        "Day pass all-inclusive — piscinas, playa, comida y bebidas desde US$65. Costa Dorada. Cerrado 30 ago–26 oct 2026; reserva desde el 27 oct.",
      schemaType: "Resort",
    },
    fr: {
      title: "Day pass Iberostar Puerto Plata | Dès 65 $ US | POP Events",
      description:
        "Day pass all-inclusive — piscines, plage, repas et boissons dès 65 $ US. Costa Dorada. Fermé 30 août–26 oct. 2026 ; réservez dès le 27 oct.",
      schemaType: "Resort",
    },
  },
  "teleferico-puerto-plata": {
    en: {
      title: "Puerto Plata Cable Car | Closed until ~2028 | POP Events",
      description:
        "Puerto Plata cable car (Teleférico) is closed for rebuild since June 2024. Reopening expected around 2028. Pico Isabel de Torres.",
      schemaType: "TouristAttraction",
    },
    es: {
      title: "Teleférico Puerto Plata | Cerrado hasta ~2028 | POP Eventos",
      description:
        "El teleférico / cable car de Puerto Plata está cerrado por reconstrucción desde junio 2024. Reapertura prevista hacia 2028.",
      schemaType: "TouristAttraction",
    },
    fr: {
      title: "Téléphérique Puerto Plata | Fermé vers 2028 | POP Events",
      description:
        "Le téléphérique (cable car) de Puerto Plata est fermé pour reconstruction depuis juin 2024. Réouverture prévue vers 2028.",
      schemaType: "TouristAttraction",
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
