import type { EventOpinion } from "@/lib/types";
import { SEED_EVENT_OPINIONS_MORE } from "@/lib/event-opinions-seed-more";

const AT = "2026-07-16T22:40:00.000Z";

/**
 * Unique event/night opinions — written per series, never copy-pasted from venue tips.
 * Prefer eventId match; seriesKey covers materialized recurring instances.
 *
 * Research bar: cite a public source or rating. Always include priceFeel when known.
 * If we cannot say something specific about THIS night (including price feel), skip it.
 *
 * Body style: lean tips only (1 sentence, max 2 very short ones). Never rehash the
 * event description (venue name, night type, genre list, location) — add only what
 * the description doesn't already say: who it's for, timing, crowd contrast vs a
 * sibling night, what to skip, dress, ride needed, etc. Price essays belong in
 * priceFeel/priceNote, not body.
 */
export const SEED_EVENT_OPINIONS_BASE: EventOpinion[] = [
  {
    eventId: "lax-reggae-friday",
    seriesKey: "lax-cabarete:weekly:5",
    body: "Locals still send visitors here for the late crowd — busier after 11; come for the music, not a quiet dinner (food service is mixed).",
    localized: {
      es: "Los locales igual mandan visitantes aquí por el ambiente tardío — más lleno después de las 11; ven por la música, no por una cena tranquila (el servicio de comida es variable).",
      fr: "Les locaux y envoient toujours les visiteurs pour l'ambiance tardive — plus animé après 23 h ; venez pour la musique, pas pour un dîner calme (service resto inégal).",
    },
    priceFeel: "upscale",
    priceNote:
      "Tourist beach pricing — cocktails and dinner on the higher side; entry usually open, spend is in drinks/food",
    priceNoteLocalized: {
      es: "Precios de playa turística — cócteles y cena del lado alto; entrada suele ser libre, el gasto va en tragos/comida",
      fr: "Tarifs plage touristique — cocktails et dîner plutôt élevés ; entrée souvent libre, le budget part en boissons/repas",
    },
    attribution: "POP research · Cabarete nightlife guides",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes:
      "Petit Futé meal/cocktail price cues; Google ~4.4; tourist beach bar spend pattern.",
    updatedAt: AT,
  },
  {
    eventId: "lax-sunset-daily",
    seriesKey: "lax-cabarete:daily",
    body: "Go for the view before Ojo's late crowd takes over upstairs — expect tourist volume on weekends, quieter midweek.",
    localized: {
      es: "Ven por la vista antes de que el ambiente tardío de Ojo tome el piso de arriba — más turistas el fin de semana, más tranquilo entre semana.",
      fr: "Venez pour la vue avant que la foule tardive d'Ojo ne prenne le dessus à l'étage — plus touristique le week-end, plus calme en semaine.",
    },
    priceFeel: "upscale",
    priceNote:
      "Same beach-bar check — expect visitor prices on drinks and plates",
    priceNoteLocalized: {
      es: "Misma cuenta de beach bar — espera precios de visitante en tragos y platos",
      fr: "Même addition beach bar — tarifs visiteurs sur boissons et plats",
    },
    attribution: "POP research · venue guides",
    ratingCite: "Google 4.4",
    googleRating: 4.4,
    researchNotes: "Petit Futé beach pricing cues.",
    updatedAt: AT,
  },
  {
    eventId: "la-chabola-wednesday-open-mic",
    seriesKey: "la-chabola-cabarete:weekly:3",
    body: "Arrive early for a seat in the small room — this leans neighborhood crowd, not beach-tourist.",
    localized: {
      es: "Llega temprano para conseguir mesa en la sala chica — es más ambiente de barrio que de turista de playa.",
      fr: "Venez tôt pour avoir une place dans la petite salle — ambiance quartier, pas touriste de plage.",
    },
    priceFeel: "budget",
    priceNote: "Neighborhood prices — pizza and drinks stay affordable vs beachfront bars",
    priceNoteLocalized: {
      es: "Precios de barrio — pizza y tragos más asequibles que los beach bars",
      fr: "Prix de quartier — pizza et verres plus abordables que les beach bars",
    },
    attribution: "POP research · Cabarete nightlife guides",
    researchNotes: "Cabarete.com: cheap drinks + pizza at La Chabola.",
    updatedAt: AT,
  },
  {
    eventId: "voyvoy-sunday-open-mic",
    seriesKey: "voyvoy-cabarete:weekly:0",
    body: "Good pick for live music without a late-night commitment — quieter and more dinner-friendly than Saturday's Session.",
    localized: {
      es: "Buena opción si quieres música en vivo sin comprometerte a una noche larga — más tranquilo y apto para cenar que el Saturday Session.",
      fr: "Bon choix pour du live sans s'engager pour une nuit tardive — plus calme et compatible dîner que le Saturday Session du samedi.",
    },
    priceFeel: "moderate",
    priceNote: "No cover typical — budget for dinner/drinks at beach-bar rates",
    priceNoteLocalized: {
      es: "Sin cover en general — reserva presupuesto para cena/tragos a tarifa de beach bar",
      fr: "Pas de cover en général — prévoyez dîner/boissons au tarif beach bar",
    },
    attribution: "POP research · Cabarete nightlife guides",
    researchNotes: "Bayfront restaurant pricing; open mic typically no cover.",
    updatedAt: AT,
  },
  {
    eventId: "voyvoy-saturday-session",
    seriesKey: "voyvoy-cabarete:weekly:6",
    body: "Louder and later than the Sunday jam — expect a standing crowd once it fills, and come ready to dance, not for a quiet meal.",
    localized: {
      es: "Más ruidoso y tarde que el jam del domingo — espera público de pie cuando se llena; ven a bailar, no a cenar tranquilo.",
      fr: "Plus fort et plus tard que le jam du dimanche — attendez-vous à une foule debout une fois plein ; venez danser, pas pour un dîner calme.",
    },
    priceFeel: "moderate",
    priceNote: "No cover — spend is drinks; bayfront prices, not local-colmadón cheap",
    priceNoteLocalized: {
      es: "Sin cover — el gasto es en tragos; precios de bahía, no de colmado local",
      fr: "Sans cover — le budget part en boissons ; tarifs baie, pas prix de quartier",
    },
    attribution: "POP research · event listing",
    researchNotes: "Seed: no cover Saturday session.",
    updatedAt: AT,
  },
  {
    eventId: "el-parq-karaoke-thursday",
    seriesKey: "el-parq-cabarete:weekly:4",
    body: "Bring cash for the food stalls — this is a casual sing-along crowd, not a polished stage show.",
    localized: {
      es: "Lleva efectivo para los puestos de comida — es un ambiente casual de cantar juntos, no un show de escenario pulido.",
      fr: "Prenez du cash pour les stands de nourriture — ambiance casual sing-along, pas un show de scène soigné.",
    },
    priceFeel: "budget",
    priceNote: "Street-food spend — cheap plates and drinks; cash for stalls",
    priceNoteLocalized: {
      es: "Gasto de food park — platos y tragos baratos; efectivo para los puestos",
      fr: "Budget food park — plats et verres abordables ; cash pour les stands",
    },
    attribution: "POP research · venue + listing",
    researchNotes: "Foodpark vendor pricing.",
    updatedAt: AT,
  },
  {
    eventId: "el-parq-latin-friday",
    seriesKey: "el-parq-cabarete:weekly:5",
    body: "Wear shoes you can dance in — this is a dance-first, local-leaning crowd, not a VIP bottle-table scene.",
    localized: {
      es: "Usa zapatos para bailar — es un público más local y de baile, no una escena de mesa VIP.",
      fr: "Portez des chaussures à danser — public plutôt local, dance-first, pas une scène de table VIP.",
    },
    priceFeel: "budget",
    priceNote: "Food-stall night out — far cheaper than resort clubs",
    priceNoteLocalized: {
      es: "Noche de puestos — mucho más barato que clubes de resort",
      fr: "Soirée food stalls — bien moins cher que les clubs de resort",
    },
    attribution: "POP research · venue + listing",
    researchNotes: "Foodpark Latin night.",
    updatedAt: AT,
  },
  {
    eventId: "el-parq-live-bands-saturday",
    seriesKey: "el-parq-cabarete:weekly:6",
    body: "Louder than Thursday's karaoke, but still outdoor and informal — go for the band and the stalls, not hotel polish.",
    localized: {
      es: "Más fuerte que el karaoke del jueves, pero sigue siendo al aire libre e informal — ve por la banda y los puestos, no por brillo de hotel.",
      fr: "Plus fort que le karaoké du jeudi, mais toujours outdoor et informel — venez pour le groupe et les stands, pas le polish hôtel.",
    },
    priceFeel: "budget",
    priceNote: "Same food-park wallet — eat and drink stall-by-stall",
    priceNoteLocalized: {
      es: "Misma billetera de food park — come y bebe puesto por puesto",
      fr: "Même budget food park — mangez et buvez stand par stand",
    },
    attribution: "POP research · venue + listing",
    researchNotes: "Saturday live at El Parq.",
    updatedAt: AT,
  },
  {
    eventId: "parada-tipica-el-choco-tuesday-live",
    seriesKey: "parada-tipica-el-choco:weekly:2",
    body: "Arrive hungry and early if you want a table before the dance floor peaks — roadside energy, not beach-bar chic.",
    localized: {
      es: "Llega con hambre y temprano si quieres mesa antes de que la pista se llene — energía de parada, no beach-bar chic.",
      fr: "Venez tôt et affamés pour avoir une table avant que la piste ne se remplisse — énergie de parada, pas beach-bar chic.",
    },
    priceFeel: "moderate",
    priceNote:
      "Local restaurant spend — Dominican plates and drinks at corridor prices, not Malecón tourist markup",
    priceNoteLocalized: {
      es: "Gasto de restaurante local — platos dominicanos y tragos a precio de corredor, no markup turístico del Malecón",
      fr: "Addition resto local — plats dominicains et verres au tarif corridor, pas le markup touristique du Malecón",
    },
    attribution: "POP research · venue history + listing",
    researchNotes: "Roadside típico pricing vs beach tourist bars.",
    updatedAt: AT,
  },
  {
    eventId: "hard-rock-weekends",
    seriesKey: "hard-rock-sosua:weekends",
    body: "Easy, safe pick for hotel guests — tourist-friendly room, not an underground local disco. Check whether the weekend is ticketed.",
    localized: {
      es: "Opción fácil y segura para huéspedes de hotel — sala amigable para turistas, no una disco local underground. Revisa si el fin de semana tiene boleto.",
      fr: "Choix facile et sûr pour les touristes — salle visitor-friendly, pas une disco locale underground. Vérifiez si le week-end est payant.",
    },
    priceFeel: "varies",
    priceNote:
      "Ticketed when a bill is announced — check door/ticket link; bar prices sit in the tourist-moderate band",
    priceNoteLocalized: {
      es: "Con boleto cuando hay cartel — mira puerta/link; barra en banda turística-moderada",
      fr: "Payant quand un show est annoncé — vérifiez billet/porte ; bar en bande touristique-modérée",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Hard Rock billed concerts vs open weekends.",
    updatedAt: AT,
  },
  {
    eventId: "castaways-classic-rock-wednesday",
    seriesKey: "castaways-sosua:weekly:3",
    body: "Low-drama expat clubhouse crowd — skip it if you want dembow or a fashion scene.",
    localized: {
      es: "Público de clubhouse expat, sin drama — sáltalo si buscas dembow o escena fashion.",
      fr: "Public clubhouse expat, sans drame — à éviter si vous cherchez du dembow ou une scène fashion.",
    },
    priceFeel: "moderate",
    priceNote: "Pub menu night — wings and drinks at expat-bar prices, not a cover charge scene",
    priceNoteLocalized: {
      es: "Noche de menú pub — alitas y tragos a precio de bar expat, sin vibe de cover",
      fr: "Soirée menu pub — wings et verres au tarif bar expat, pas de cover type club",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Castaways clubhouse/eatery pricing.",
    updatedAt: AT,
  },
  {
    eventId: "cheers-weekly-live",
    seriesKey: "cheers-bar-sosua:weekly",
    body: "A familiar bar-band night, not a destination concert — steady regulars, sports on the screens.",
    localized: {
      es: "Una noche de barra con banda conocida, no un concierto destino — clientela fija, deportes en las pantallas.",
      fr: "Une soirée bar/groupe familière, pas un concert destination — habitués fidèles, sport à l'écran.",
    },
    priceFeel: "moderate",
    priceNote: "Sports-pub spend — beers and pub food; typically no concert ticket",
    priceNoteLocalized: {
      es: "Gasto de sports pub — cervezas y comida de pub; suele no haber boleto de concierto",
      fr: "Budget sports pub — bières et pub food ; rarement un billet concert",
    },
    attribution: "POP research · venue listing",
    researchNotes: "Cheers strip pub pricing.",
    updatedAt: AT,
  },
  {
    eventId: "groundzero-domingos-pal-pueblo",
    seriesKey: "ground-zero-disco:weekly:0",
    body: "Plan a ride — this is a real Dominican club night, not a tourist beach crawl. Watch for whisky promos.",
    localized: {
      es: "Planea transporte — es una noche de disco dominicana de verdad, no un crawl de playa turista. Ojo a las promos de whisky.",
      fr: "Prévoyez un trajet — vraie nuit club dominicaine, pas un crawl plage touriste. Repérez les promos whisky.",
    },
    priceFeel: "moderate",
    priceNote:
      "Local club night — entry/promos vary (whisky deals common); call ahead; cheaper than beach VIP tables",
    priceNoteLocalized: {
      es: "Noche de disco local — entrada/promos varían (whisky en oferta frecuente); llama antes; más barato que mesas VIP de playa",
      fr: "Nuit club locale — entrée/promos variables (whisky en promo fréquent) ; appelez ; moins cher que tables VIP plage",
    },
    attribution: "POP research · venue + Instagram listing",
    researchNotes: "callForPricing on seed; whisky half-price promo in listing.",
    updatedAt: AT,
  },
  {
    eventId: "el-colibri-karaoke-battle-2026",
    seriesKey: "el-colibri-hotel:weekly:4",
    body: "Real prize money is on the line over several weeks — fun to sing or watch, but skip it if you want an early, quiet night.",
    localized: {
      es: "Hay premios reales en juego durante varias semanas — divertido si cantas o miras, pero sáltalo si quieres una noche temprana y tranquila.",
      fr: "De vrais prix sont en jeu sur plusieurs semaines — fun pour chanter ou regarder, mais à éviter pour une soirée calme et tôt.",
    },
    priceFeel: "moderate",
    priceNote: "Hotel bar night — drinks at boutique-hotel rates; contest entry details via WhatsApp",
    priceNoteLocalized: {
      es: "Noche de barra de hotel — tragos a tarifa boutique; detalles del concurso por WhatsApp",
      fr: "Soirée bar d'hôtel — verres au tarif boutique ; détails concours via WhatsApp",
    },
    attribution: "POP research · hotel listing",
    researchNotes: "El Colibri boutique hotel bar pricing.",
    updatedAt: AT,
  },
  {
    eventId: "natura-cabana-saturday-live",
    seriesKey: "natura-cabana:weekly:6",
    body: "Boutique-resort calm, not Cabarete strip volume — a strong pick if you want an earlier wind-down.",
    localized: {
      es: "Calma de resort boutique, no el volumen de la franja de Cabarete — buena opción si quieres un cierre más temprano.",
      fr: "Calme resort boutique, pas le volume de la strip Cabarete — bon choix pour une fin de soirée plus tôt.",
    },
    priceFeel: "upscale",
    priceNote: "Boutique resort restaurant — expect higher dinner/drink tabs than town bars",
    priceNoteLocalized: {
      es: "Restaurante de resort boutique — espera cuenta más alta que bares del pueblo",
      fr: "Restaurant de resort boutique — addition plus élevée que les bars en ville",
    },
    attribution: "POP research · venue site",
    researchNotes: "Natura Cabana boutique eco-resort pricing.",
    updatedAt: AT,
  },
  {
    eventId: "liquid-blue-sunrise-yoga",
    seriesKey: "liquid-blue-cabarete:daily",
    body: "The anti-nightlife start to the day — leave your party expectations at LAX and come just for the practice.",
    localized: {
      es: "El antídoto a la vida nocturna de Cabarete — deja las expectativas de fiesta en LAX y ven solo por la práctica.",
      fr: "L'anti-nightlife pour commencer la journée — laissez la fête à LAX et venez juste pour la pratique.",
    },
    priceFeel: "varies",
    priceNote: "Class fee via Liquid Blue — confirm current rate when you book; not a free beach meetup",
    priceNoteLocalized: {
      es: "Tarifa de clase vía Liquid Blue — confirma el precio al reservar; no es meetup gratis en la playa",
      fr: "Tarif cours via Liquid Blue — confirmez le prix à la réservation ; ce n'est pas un meetup gratuit",
    },
    attribution: "POP research · venue site",
    researchNotes: "Paid watersports school classes. Event is daily — seriesKey matches daily.",
    updatedAt: AT,
  },
  {
    eventId: "ingest-make-authentic-espadrilles-in-puerto-plata",
    seriesKey: "handmade-the-brand:weekdays",
    body: "A strong pick for a wearable souvenir and guided craft time; allow the full two hours, and skip it if you only want a quick shop visit.",
    localized: {
      es: "Buena opción para llevarte un recuerdo que puedas usar y disfrutar de una actividad artesanal guiada; reserva las dos horas completas y sáltatelo si solo buscas una visita rápida a una tienda.",
      fr: "Un bon choix pour repartir avec un souvenir à porter et profiter d'un atelier guidé ; prévoyez les deux heures complètes et passez votre chemin si vous cherchez seulement une visite rapide en boutique.",
    },
    priceFeel: "upscale",
    priceNote: "From €99.90 on Eventbrite · materials, snacks, cava, and your finished pair included",
    priceNoteLocalized: {
      es: "Desde €99,90 en Eventbrite · incluye materiales, tentempiés, cava y el par terminado",
      fr: "Dès 99,90 € sur Eventbrite · matériel, collations, cava et paire terminée inclus",
    },
    attribution: "POP research · Eventbrite and Airbnb guest reviews",
    researchNotes:
      "Official Eventbrite listing confirms the two-hour format and inclusions; Airbnb experience listing showed 5.0 from 3 reviews on 2026-07-17.",
    updatedAt: "2026-07-18T02:50:00.000Z",
  },
];

export const SEED_EVENT_OPINIONS: EventOpinion[] = [
  ...SEED_EVENT_OPINIONS_BASE,
  ...SEED_EVENT_OPINIONS_MORE,
];

export function eventSeriesKey(input: {
  venueSlug?: string;
  recurrence?: string;
  recurrenceDay?: number;
  recurrenceDays?: number[];
}): string | null {
  const slug = input.venueSlug?.trim();
  const recurrence = input.recurrence?.trim();
  if (!slug || !recurrence) return null;
  if (recurrence === "daily" || recurrence === "weekdays" || recurrence === "weekends") {
    return `${slug}:${recurrence}`;
  }
  if (typeof input.recurrenceDay === "number") {
    return `${slug}:${recurrence}:${input.recurrenceDay}`;
  }
  if (input.recurrenceDays && input.recurrenceDays.length === 1) {
    return `${slug}:${recurrence}:${input.recurrenceDays[0]}`;
  }
  if (input.recurrenceDays && input.recurrenceDays.length > 1) {
    return `${slug}:${recurrence}`;
  }
  return `${slug}:${recurrence}`;
}
