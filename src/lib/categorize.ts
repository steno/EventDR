import type { Event, EventCategory } from "./types";
import { CATEGORY_IDS } from "./categories";

type KeywordMap = Record<EventCategory, string[]>;

const KEYWORDS: KeywordMap = {
  sports: [
    "sport",
    "deporte",
    "fútbol",
    "futbol",
    "soccer",
    "football",
    "volleyball",
    "voleibol",
    "baseball",
    "béisbol",
    "beisbol",
    "kite",
    "kitesurf",
    "surf",
    "triathlon",
    "triatlón",
    "marathon",
    "maratón",
    "run",
    "carrera",
    "liga",
    "torneo",
    "tournament",
    "pickup",
    "paddle",
    "sup",
    "windsurf",
    "beach volleyball",
    "softbol",
    "softball",
    "basketball",
    "baloncesto",
    "tennis",
    "tenis",
    "gym",
    "crossfit",
    "cycling",
    "ciclismo",
    "race",
    "karting",
    "go-kart",
    "gokart",
    "go kart",
    "grand prix",
    "motorsport",
  ],
  music: [
    "music",
    "música",
    "musica",
    "dj",
    "band",
    "banda",
    "live session",
    "jam",
    "merengue",
    "bachata",
    "reggaeton",
    "acoustic",
    "acústico",
  ],
  concert: [
    "concert",
    "concierto",
    "gira",
    "tour",
    "headliner",
    "opening act",
    "live show",
    "artista",
    "singer",
    "cantante",
  ],
  parties: [
    "party",
    "fiesta",
    "nightclub",
    "club night",
    "pool party",
    "beach party",
    "ladies night",
    "afterparty",
    "disco",
  ],
  "food-drinks": [
    "food",
    "comida",
    "drink",
    "bebida",
    "wine",
    "vino",
    "beer",
    "cerveza",
    "cocktail",
    "cóctel",
    "brunch",
    "tasting",
    "degustación",
    "gastronom",
    "food truck",
    "restaurant week",
    "culinary",
  ],
  festivals: [
    "festival",
    "feria",
    "carnival",
    "carnaval",
    "fiesta patronal",
    "summer fest",
    "cultural fest",
  ],
  dance: [
    "dance",
    "baile",
    "salsa",
    "bachata class",
    "clase de baile",
    "social dancing",
    "zumba",
    "kizomba",
  ],
  "health-wellness": [
    "yoga",
    "wellness",
    "bienestar",
    "meditation",
    "meditación",
    "retreat",
    "retiro",
    "healing",
    "breathwork",
    "pilates",
    "mindfulness",
    "spa",
  ],
  performances: [
    "performance",
    "espectáculo",
    "theater",
    "teatro",
    "comedy",
    "comedia",
    "stand-up",
    "standup",
    "open mic",
    "micrófono abierto",
    "poetry",
    "poesía",
    "talent show",
    "circus",
    "circo",
    "magic show",
  ],
  business: [
    "business",
    "negocio",
    "networking",
    "meetup",
    "startup",
    "emprendimiento",
    "conference",
    "conferencia",
    "workshop",
    "taller",
    "seminar",
    "seminario",
    "coworking",
    "entrepreneur",
    "pitch",
    "webinar",
  ],
  culture: [
    "culture",
    "cultura",
    "cultural",
    "museum",
    "museo",
    "heritage",
    "patrimonio",
    "history",
    "historia",
    "historic",
    "histórico",
    "fortress",
    "fortaleza",
    "colonial",
    "art gallery",
    "galería",
    "exhibition",
    "exposición",
    "artesanal",
    "craft fair",
    "architecture",
    "arquitectura",
    "amber",
    "ámbar",
  ],
  adventure: [
    "adventure",
    "aventura",
    "excursion",
    "excursión",
    "tour",
    "boat trip",
    "lancha",
    "snorkel",
    "snorkeling",
    "waterfall",
    "cascada",
    "charco",
    "hike",
    "caminata",
    "trek",
    "cable car",
    "teleférico",
    "teleferico",
    "safari",
    "cayo",
    "island trip",
    "sandbar",
    "zip line",
    "canopy",
    "dolphin",
    "delfín",
    "ocean world",
    "go-kart",
    "gokart",
    "go kart",
    "monkeyland",
    "monkey",
    "mono",
    "safari truck",
  ],
};

function scoreCategory(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce(
    (score, kw) => score + (lower.includes(kw.toLowerCase()) ? 1 : 0),
    0,
  );
}

function categoryScores(text: string): Map<EventCategory, number> {
  const scores = new Map<EventCategory, number>();
  for (const id of CATEGORY_IDS) {
    scores.set(id as EventCategory, scoreCategory(text, KEYWORDS[id as EventCategory]));
  }
  return scores;
}

export function inferCategory(
  text: string,
  hint?: EventCategory,
): EventCategory {
  if (hint) {
    const hintScore = scoreCategory(text, KEYWORDS[hint]);
    if (hintScore >= 1) return hint;
  }

  let best: EventCategory = hint ?? "music";
  let bestScore = 0;

  for (const id of CATEGORY_IDS) {
    const score = scoreCategory(text, KEYWORDS[id as EventCategory]);
    if (score > bestScore) {
      bestScore = score;
      best = id as EventCategory;
    }
  }

  return best;
}

/** Primary plus any explicit or inferred secondary categories. */
export function getEventCategoryList(event: {
  category: EventCategory;
  categories?: EventCategory[];
}): EventCategory[] {
  const secondary =
    event.categories?.filter((category) => category !== event.category) ?? [];
  return [event.category, ...secondary];
}

/** Keyword-based secondaries — min score 2 avoids weak matches like lone "tour". */
export function inferSecondaryCategories(
  text: string,
  primary: EventCategory,
  minScore = 2,
): EventCategory[] {
  const scores = categoryScores(text);
  return CATEGORY_IDS.filter((id) => {
    const category = id as EventCategory;
    if (category === primary) return false;
    return (scores.get(category) ?? 0) >= minScore;
  }) as EventCategory[];
}

export function resolveSecondaryCategories(event: {
  title: string;
  description: string;
  category: EventCategory;
  categories?: EventCategory[];
}): EventCategory[] {
  const explicit =
    event.categories?.filter((category) => category !== event.category) ?? [];
  if (explicit.length > 0) {
    return [...new Set(explicit)];
  }
  return inferSecondaryCategories(
    `${event.title} ${event.description}`,
    event.category,
  );
}

/** Fill secondary categories when omitted; preserves explicit tags on seed events. */
export function withResolvedCategories<T extends Event>(event: T): T {
  const secondary = resolveSecondaryCategories(event);
  if (secondary.length === 0) {
    if (!event.categories?.length) return event;
    const { categories: _removed, ...rest } = event;
    return rest as T;
  }
  return { ...event, categories: secondary };
}

export function eventInCategory(
  event: {
    category: EventCategory;
    categories?: EventCategory[];
  },
  category: EventCategory,
): boolean {
  if (event.category === category) return true;
  return event.categories?.includes(category) ?? false;
}

export function matchesCategory(
  event: {
    title: string;
    description: string;
    category: EventCategory;
    categories?: EventCategory[];
  },
  category: EventCategory,
): boolean {
  if (eventInCategory(event, category)) return true;
  const text = `${event.title} ${event.description}`;
  return scoreCategory(text, KEYWORDS[category]) >= 1;
}
