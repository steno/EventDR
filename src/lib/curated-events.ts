import type { Event } from "./types";
import type { LocalizedText } from "./localized-text";

type CuratedPatch = Partial<
  Omit<Event, "localized" | "recurrence" | "recurrenceDay" | "recurrenceDays">
> & {
  localized?: Partial<{
    title: LocalizedText;
    description: LocalizedText;
  }>;
  /** Set to null to remove the field from the merged event (e.g. clear recurrence). */
  recurrence?: Event["recurrence"] | null;
  recurrenceDay?: Event["recurrenceDay"] | null;
  recurrenceDays?: Event["recurrenceDays"] | null;
  isFree?: Event["isFree"] | null;
  admissionPrice?: Event["admissionPrice"] | null;
  callForPricing?: Event["callForPricing"] | null;
  ticketUrl?: Event["ticketUrl"] | null;
};

/** Stable id patches (preferred over title key). */
const CURATED_EVENT_BY_ID: Record<string, CuratedPatch> = {
  "puerto-plata-carnaval-2026": {
    date: "2026-02-01",
    endDate: "2026-03-01",
    recurrence: null,
    recurrenceDay: null,
  },
  "feria-artesanal-verano-2026": {
    venue: "Plaza Independencia (Parque Central)",
    venueSlug: "plaza-independencia",
    address: "Calle San Felipe, Puerto Plata",
    location: "Puerto Plata",
    isFree: true,
  },
  "cabarete-classic-2026": {
    // Geocoders tag Cabarete under Sosúa municipality — keep zone unambiguous.
    location: "Cabarete",
    venueSlug: "kite-beach",
    address: "Residencial Mañanero, Cabarete",
    isFree: true,
  },
  "puerto-plata-golf-classic-2026": {
    venueSlug: "playa-dorada-golf",
    admissionPrice: "US$210",
    phone: "+18093204262",
    sourceUrl: "https://playadoradagolf.com/en/event/puerto-plata-golf-classic/",
    isFree: false,
  },
  "cac-games-surf-playa-encuentro-2026": {
    venueSlug: "playa-encuentro",
    isFree: true,
    phone: "+18298934214",
  },
  "puerto-plata-beach-soccer-2026": {
    venueSlug: "playa-los-charamicos",
    isFree: true,
    phone: "+18095866125",
  },
  "cabarete-pilates-reformer": {
    venue: "Rafaella's Studio",
    location: "Cabarete",
    phone: "+18094605777",
    description:
      "Group Pilates Reformer sessions in Cabarete with Rafaella Cirillo (Tue & Thu 9 AM). Studio address shared when you book — DM or WhatsApp +1 809 460 5777. Discount code RC-pilates for first class.",
    localized: {
      description: {
        en: "Group Pilates Reformer sessions in Cabarete with Rafaella Cirillo (Tue & Thu 9 AM). Studio address shared when you book — DM or WhatsApp +1 809 460 5777. Discount code RC-pilates for first class.",
        es: "Sesiones grupales de Pilates Reformer en Cabarete con Rafaella Cirillo (mar y jue 9 AM). La dirección del estudio se confirma al reservar — DM o WhatsApp +1 809 460 5777. Código RC-pilates para la primera clase.",
        fr: "Cours collectifs de Pilates Reformer à Cabarete avec Rafaella Cirillo (mar. et jeu. 9 h). L'adresse du studio est communiquée à la réservation — DM ou WhatsApp +1 809 460 5777. Code RC-pilates pour le premier cours.",
      },
    },
  },
  "museo-ambar-weekdays": {
    isFree: false,
    admissionPrice: "RD$250",
  },
  "museo-ambar-saturday": {
    isFree: false,
    admissionPrice: "RD$250",
  },
  "sosua-jewish-museum-hours": {
    isFree: false,
    admissionPrice: "RD$100",
  },
  "fortaleza-san-felipe-daily": {
    isFree: false,
    admissionPrice: "RD$100",
  },
  "gregorio-luperon-museum": {
    isFree: false,
    admissionPrice: "RD$50",
  },
  "la-confluencia-museum-daily": {
    isFree: false,
    admissionPrice: "RD$200",
  },
  "rum-legacy-museum-daily": {
    isFree: true,
  },
  "macorix-house-of-rum": {
    isFree: false,
    admissionPrice: "US$8",
  },
  "teleferico-puerto-plata-daily": {
    isFree: false,
    admissionPrice: "RD$350",
  },
  "hacienda-cufa-cacao-tour": {
    isFree: false,
    admissionPrice: "from RD$400",
  },
  "fun-city-daily": {
    isFree: false,
    admissionPrice: "from RD$200",
  },
  "cayo-arena-tours-daily": {
    isFree: false,
    admissionPrice: "from US$55",
    address: "Punta Rucia",
    location: "Puerto Plata",
  },
  "sosua-diving-adventures-daily": {
    isFree: false,
    admissionPrice: "from US$35",
  },
  "liquid-blue-watersports-daily": {
    isFree: false,
    admissionPrice: "from US$25",
  },
  "vivonte-cigar-factory-weekdays": {
    isFree: false,
    admissionPrice: "US$20",
  },
  "vivonte-cigar-factory-saturday": {
    isFree: false,
    admissionPrice: "US$20",
  },
  "natura-cabana-yoga-daily": {
    isFree: false,
    admissionPrice: "US$15",
  },
  "liquid-blue-sunrise-yoga": {
    isFree: false,
    admissionPrice: "from US$15",
  },
  "brugal-rum-center-weekdays": {
    isFree: true,
  },
  "brugal-corporate-tours": {
    isFree: true,
  },
  "del-oro-chocolate-factory-weekdays": {
    isFree: true,
  },
  "del-oro-chocolate-factory-saturday": {
    isFree: true,
  },
  "tabacalera-cremo-factory-tour": {
    isFree: true,
  },
  "paseo-dona-blanca-daily": {
    isFree: true,
  },
  "calle-sombrillas-daily": {
    isFree: true,
  },
  "plaza-independencia-daily": {
    isFree: true,
  },
  "plaza-independencia-weekend-culture": {
    isFree: true,
  },
  "sea-horse-saturday-market": {
    isFree: true,
  },
  "casa-de-la-cultura-exhibitions": {
    isFree: true,
  },
  "handmade-the-brand": {
    isFree: true,
  },
  "kite-beach-daily": {
    isFree: true,
  },
  "malecon-kiosks-daily": {
    isFree: true,
  },
  "hard-rock-weekends": {
    isFree: false,
    callForPricing: true,
    phone: "+18495057778",
  },
  "hard-rock-billed-concerts": {
    isFree: false,
    callForPricing: true,
    phone: "+18495057778",
  },
  "anfiteatro-la-puntilla-concerts": {
    address: "Desvío a La Puntilla",
    location: "Puerto Plata",
    venue: "Anfiteatro La Puntilla",
    venueSlug: "anfiteatro-la-puntilla",
    isFree: false,
    callForPricing: true,
    description:
      "Outdoor concerts, cultural shows, and carnival troupes at Anfiteatro La Puntilla on the Atlantic — weekend performances on Puerto Plata's Malecón waterfront stage overlooking Fortaleza San Felipe. Admission varies by show (many municipal/Mitur concerts are free; billed artists sell tickets separately). Lineups announced per show.",
    localized: {
      description: {
        en: "Outdoor concerts, cultural shows, and carnival troupes at Anfiteatro La Puntilla on the Atlantic — weekend performances on Puerto Plata's Malecón waterfront stage overlooking Fortaleza San Felipe. Admission varies by show (many municipal/Mitur concerts are free; billed artists sell tickets separately). Lineups announced per show.",
        es: "Conciertos al aire libre, espectáculos culturales y comparsas en el Anfiteatro La Puntilla frente al Atlántico — funciones de fin de semana en el malecón de Puerto Plata con vista a la Fortaleza San Felipe. La entrada varía según el espectáculo (muchos conciertos municipales/Mitur son gratis; artistas de carteleras venden boletas aparte). Cartelera anunciada por función.",
        fr: "Concerts en plein air, spectacles culturels et carnaval au Anfiteatro La Puntilla face à l'Atlantique — week-ends sur le malecón de Puerto Plata avec vue sur Fortaleza San Felipe. Tarif selon le spectacle (beaucoup de concerts municipaux/Mitur sont gratuits ; les têtes d'affiche vendent des billets à part). Programmation annoncée par concert.",
      },
    },
  },
  "lax-headline-concerts": {
    address: "Cabarete Beach",
    location: "Cabarete",
    venue: "LAX Cabarete",
    venueSlug: "lax-cabarete",
    isFree: false,
    callForPricing: true,
  },
  "kite-beach-wind-culture": {
    address: "Carretera 5, Kite Beach",
    location: "Cabarete",
    venue: "Kite Beach",
    venueSlug: "kite-beach",
    isFree: true,
  },
  "womens-reconnection-kite-camp-2026": {
    address: "Cabarete Beach",
    location: "Cabarete",
    venueSlug: "kite-beach",
    isFree: false,
    callForPricing: true,
    phone: "+18299391261",
  },
  "charcos-damajagua-daily": {
    address: "Imbert",
    location: "Puerto Plata",
  },
  "monkeyland-puerto-plata-daily": {
    address: "Imbert hills",
    location: "Imbert",
  },
  "freestyle-catamaran-daily": {
    address: "Playa Dorada Beach",
    location: "Puerto Plata",
    venue: "Freestyle Catamaran",
    venueSlug: "freestyle-catamaran",
    phone: "+18095861239",
    description:
      "Full-day catamaran from Playa Dorada to Sosúa Bay — two snorkeling stops on the north coast reef, lunch and open bar onboard, and a fun crew keeping the music going. Free hotel pickup from Playa Dorada, Costa Dorada, Sosúa, and Cabarete; confirm your pickup time when you book (~8 hours).",
    localized: {
      description: {
        en: "Full-day catamaran from Playa Dorada to Sosúa Bay — two snorkeling stops on the north coast reef, lunch and open bar onboard, and a fun crew keeping the music going. Free hotel pickup from Playa Dorada, Costa Dorada, Sosúa, and Cabarete; confirm your pickup time when you book (~8 hours).",
        es: "Día completo en catamarán desde Playa Dorada hasta la bahía de Sosúa — dos paradas de snorkel en el arrecife de la costa norte, almuerzo y barra libre a bordo, y tripulación animada. Recogida gratuita en hoteles de Playa Dorada, Costa Dorada, Sosúa y Cabarete; confirma tu hora al reservar (~8 horas).",
        fr: "Journée en catamaran de Playa Dorada à la baie de Sosúa — deux arrêts snorkeling sur le récif de la côte nord, déjeuner et open bar à bord, équipage festif. Prise en charge gratuite aux hôtels de Playa Dorada, Costa Dorada, Sosúa et Cabarete ; confirmez l'heure à la réservation (~8 h).",
      },
    },
  },
  "outback-safari-daily": {
    address: "Plaza Turisol, Av. Gregorio Luperón",
    location: "Puerto Plata",
    venue: "Outback Adventures",
    venueSlug: "outback-adventures",
    phone: "+18093202525",
    description:
      "All-inclusive day in open-air safari trucks — rural villages, coffee and cacao plantation tastings, a local school visit, and boogie boarding at a hidden beach. Free hotel pickup from Puerto Plata, Sosúa, and Cabarete; confirm meeting details the day before (~8 hours). One of Puerto Plata's classic full-day cultural adventures.",
    localized: {
      description: {
        en: "All-inclusive day in open-air safari trucks — rural villages, coffee and cacao plantation tastings, a local school visit, and boogie boarding at a hidden beach. Free hotel pickup from Puerto Plata, Sosúa, and Cabarete; confirm meeting details the day before (~8 hours). One of Puerto Plata's classic full-day cultural adventures.",
        es: "Día todo incluido en camiones safari descubiertos — pueblos rurales, degustación de café y cacao, visita a una escuela local y bodyboard en una playa escondida. Recogida gratuita en hoteles de Puerto Plata, Sosúa y Cabarete; confirma el punto de encuentro el día anterior (~8 horas). Una aventura cultural clásica de Puerto Plata.",
        fr: "Journée tout compris en camions safari découverts — villages ruraux, dégustation café et cacao, visite d'une école locale et bodyboard sur une plage cachée. Prise en charge gratuite aux hôtels de Puerto Plata, Sosúa et Cabarete ; confirmez le point de rendez-vous la veille (~8 h). Une aventure culturelle classique de Puerto Plata.",
      },
    },
  },
};
const CURATED_EVENT_PATCHES: Record<string, CuratedPatch> = {
  "18th-annual-cabarete-butterfly-effect": {
    sourceUrl: "https://www.cabaretebutterflyeffect.com/",
    ticketUrl:
      "https://www.eventbrite.ca/e/18th-annual-cabarete-butterfly-effect-tickets-1568174655609",
    venue: "Kite Beach & Cabarete town",
    address: "Carretera 5",
    location: "Cabarete",
    endDate: "2026-07-11",
    venueSlug: "kite-beach",
    description:
      "Five-day women's watersports festival across Cabarete (Jul 7–11): SUP clinics, yoga, beach cleanup, catamaran cruise, and the signature river paddle. See the official site for schedule and registration.",
    localized: {
      description: {
        en: "Five-day women's watersports festival across Cabarete (Jul 7–11): SUP clinics, yoga, beach cleanup, catamaran cruise, and the signature river paddle. See the official site for schedule and registration.",
        es: "Festival de cinco días de deportes acuáticos para mujeres en Cabarete (7–11 jul): clínicas de SUP, yoga, limpieza de playa, crucero en catamarán y la travesía en remo por el río. Consulta el sitio oficial para horarios e inscripción.",
        fr: "Festival de sports nautiques pour femmes sur cinq jours à Cabarete (7–11 juil.) : cliniques SUP, yoga, nettoyage de plage, croisière en catamaran et la traversée emblématique en paddle sur la rivière. Voir le site officiel pour le programme et l'inscription.",
      },
    },
  },
};

export function eventCuratedKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

/** Stable key for saved events — survives ingest id changes. */
export const eventSaveKey = eventCuratedKey;

export function applyCuratedEventPatch(event: Event): Event {
  const byId = CURATED_EVENT_BY_ID[event.id];
  if (byId) return mergeCuratedPatch(event, byId);

  const patch = CURATED_EVENT_PATCHES[eventCuratedKey(event.title)];
  if (!patch) return event;

  return mergeCuratedPatch(event, patch);
}

function mergeCuratedPatch(event: Event, patch: CuratedPatch): Event {
  const { localized: localizedPatch, ...fields } = patch;
  const applied = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== null),
  ) as Partial<Event>;
  const merged: Event = { ...event, ...applied };

  for (const [key, value] of Object.entries(fields)) {
    if (value === null) {
      delete merged[key as keyof Event];
    }
  }

  if (localizedPatch) {
    merged.localized = {
      title: { ...event.localized?.title, ...localizedPatch.title },
      description: {
        ...event.localized?.description,
        ...localizedPatch.description,
      },
    };
    if (localizedPatch.description?.en) {
      merged.description = localizedPatch.description.en;
    }
  }

  return merged;
}

export function applyCuratedEventPatches(events: Event[]): Event[] {
  return events.map(applyCuratedEventPatch);
}

/** Fallback ids to upsert into Firebase (see fallback-events). */
export const CURATED_SEED_EVENT_IDS = [
  "el-colibri-karaoke-battle-2026",
] as const;
