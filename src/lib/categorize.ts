import type { Event, EventCategory } from "./types";
import { CATEGORY_IDS } from "./categories";

/** Plain string = weight 1. Strong terms use weight 2+ so one hit unlocks a secondary. */
type Keyword = string | { term: string; weight: number };

type KeywordMap = Record<EventCategory, Keyword[]>;

const KEYWORDS: KeywordMap = {
  sports: [
    { term: "kitesurf", weight: 2 },
    { term: "kite surf", weight: 2 },
    { term: "windsurf", weight: 2 },
    { term: "beach volleyball", weight: 2 },
    { term: "volleyball", weight: 2 },
    { term: "voleibol", weight: 2 },
    { term: "triathlon", weight: 2 },
    { term: "triatlón", weight: 2 },
    { term: "marathon", weight: 2 },
    { term: "maratón", weight: 2 },
    { term: "fun run", weight: 2 },
    { term: "5k", weight: 2 },
    { term: "10k", weight: 2 },
    { term: "crossfit", weight: 2 },
    { term: "karting", weight: 2 },
    { term: "go-kart", weight: 2 },
    { term: "gokart", weight: 2 },
    { term: "go kart", weight: 2 },
    { term: "grand prix", weight: 2 },
    { term: "motorsport", weight: 2 },
    { term: "snorkeling", weight: 2 },
    { term: "snorkel", weight: 2 },
    { term: "diving", weight: 2 },
    { term: "buceo", weight: 2 },
    { term: "scuba", weight: 2 },
    { term: "softball", weight: 2 },
    { term: "softbol", weight: 2 },
    { term: "basketball", weight: 2 },
    { term: "baloncesto", weight: 2 },
    { term: "baseball", weight: 2 },
    { term: "béisbol", weight: 2 },
    { term: "beisbol", weight: 2 },
    { term: "tournament", weight: 2 },
    { term: "torneo", weight: 2 },
    { term: "trek", weight: 2 },
    { term: "hike", weight: 2 },
    { term: "caminata", weight: 2 },
    { term: "randonnée", weight: 2 },
    { term: "randonnee", weight: 2 },
    { term: "bodyboard", weight: 2 },
    "sport",
    "deporte",
    "fútbol",
    "futbol",
    "soccer",
    "football",
    "kite",
    "surf",
    "carrera",
    "liga",
    "pickup",
    "paddle",
    "sup",
    "tennis",
    "tenis",
    "gym",
    "cycling",
    "ciclismo",
    "race",
  ],
  music: [
    { term: "live music", weight: 2 },
    { term: "música en vivo", weight: 2 },
    { term: "musica en vivo", weight: 2 },
    { term: "musique live", weight: 2 },
    { term: "live band", weight: 2 },
    { term: "live bands", weight: 2 },
    { term: "latin band", weight: 2 },
    { term: "latin music", weight: 2 },
    { term: "live session", weight: 2 },
    { term: "open jam", weight: 2 },
    { term: "open mic", weight: 2 },
    { term: "micrófono abierto", weight: 2 },
    { term: "karaoke", weight: 2 },
    { term: "karaoké", weight: 2 },
    { term: "dj", weight: 2 },
    { term: "djs", weight: 2 },
    { term: "merengue", weight: 2 },
    { term: "bachata", weight: 2 },
    { term: "salsa", weight: 2 },
    { term: "reggaeton", weight: 2 },
    { term: "reggae", weight: 2 },
    { term: "dembow", weight: 2 },
    { term: "típico", weight: 2 },
    { term: "tipico", weight: 2 },
    { term: "typique", weight: 2 },
    { term: "perico ripiao", weight: 2 },
    { term: "acoustic", weight: 2 },
    { term: "acústico", weight: 2 },
    "music",
    "música",
    "musica",
    "musique",
    "band",
    "banda",
    "jam",
  ],
  concert: [
    { term: "concert", weight: 2 },
    { term: "concierto", weight: 2 },
    { term: "headliner", weight: 2 },
    { term: "opening act", weight: 2 },
    { term: "live show", weight: 2 },
    { term: "world tour", weight: 2 },
    { term: "on tour", weight: 2 },
    { term: "concert tour", weight: 2 },
    "gira",
    "artista",
    "singer",
    "cantante",
  ],
  parties: [
    { term: "nightclub", weight: 2 },
    { term: "club night", weight: 2 },
    { term: "pool party", weight: 2 },
    { term: "beach party", weight: 2 },
    { term: "ladies night", weight: 2 },
    { term: "afterparty", weight: 2 },
    { term: "nightlife", weight: 2 },
    { term: "club scene", weight: 2 },
    { term: "disco", weight: 2 },
    "party",
    "fiesta",
  ],
  "food-drinks": [
    { term: "cocktail", weight: 2 },
    { term: "cóctel", weight: 2 },
    { term: "brunch", weight: 2 },
    { term: "tasting", weight: 2 },
    { term: "degustación", weight: 2 },
    { term: "dégustation", weight: 2 },
    { term: "food truck", weight: 2 },
    { term: "restaurant week", weight: 2 },
    { term: "culinary", weight: 2 },
    { term: "gastronom", weight: 2 },
    { term: "open bar", weight: 2 },
    { term: "dinner", weight: 2 },
    { term: "cena", weight: 2 },
    { term: "dîner", weight: 2 },
    { term: "bbq", weight: 2 },
    { term: "barbecue", weight: 2 },
    { term: "barbeque", weight: 2 },
    { term: "food park", weight: 2 },
    { term: "foodpark", weight: 2 },
    { term: "street food", weight: 2 },
    "food",
    "comida",
    "drink",
    "bebida",
    "wine",
    "vino",
    "beer",
    "bière",
    "cerveza",
    "rum",
    "ron",
    "rhum",
  ],
  festivals: [
    { term: "festival", weight: 2 },
    { term: "feria", weight: 2 },
    { term: "fiesta patronal", weight: 2 },
    { term: "summer fest", weight: 2 },
    { term: "cultural fest", weight: 2 },
    // Weight 1: museums often mention carnival history without being a festival
    "carnival",
    "carnaval",
  ],
  dance: [
    { term: "social dancing", weight: 2 },
    { term: "dance floor", weight: 2 },
    { term: "piste de danse", weight: 2 },
    { term: "dance social", weight: 2 },
    { term: "salsa social", weight: 2 },
    { term: "salsa night", weight: 2 },
    { term: "salsa class", weight: 2 },
    { term: "bachata class", weight: 2 },
    { term: "clase de baile", weight: 2 },
    { term: "latin dance", weight: 2 },
    { term: "zumba", weight: 2 },
    { term: "kizomba", weight: 2 },
    { term: "dancing", weight: 2 },
    { term: "salsa", weight: 2 },
    { term: "danse", weight: 2 },
    "dance",
    "baile",
  ],
  "health-wellness": [
    { term: "yoga", weight: 2 },
    { term: "wellness", weight: 2 },
    { term: "bienestar", weight: 2 },
    { term: "meditation", weight: 2 },
    { term: "meditación", weight: 2 },
    { term: "breathwork", weight: 2 },
    { term: "pilates", weight: 2 },
    { term: "mindfulness", weight: 2 },
    { term: "sound healing", weight: 2 },
    "retreat",
    "retiro",
    "healing",
    "spa",
  ],
  performances: [
    { term: "open mic", weight: 2 },
    { term: "micrófono abierto", weight: 2 },
    { term: "stand-up", weight: 2 },
    { term: "standup", weight: 2 },
    { term: "talent show", weight: 2 },
    { term: "magic show", weight: 2 },
    { term: "theater", weight: 2 },
    { term: "teatro", weight: 2 },
    { term: "théâtre", weight: 2 },
    { term: "comedy", weight: 2 },
    { term: "comedia", weight: 2 },
    { term: "poetry", weight: 2 },
    { term: "poesía", weight: 2 },
    { term: "poésie", weight: 2 },
    { term: "circus", weight: 2 },
    { term: "circo", weight: 2 },
    "performance",
    "espectáculo",
  ],
  business: [
    { term: "networking", weight: 2 },
    { term: "startup", weight: 2 },
    { term: "emprendimiento", weight: 2 },
    { term: "conference", weight: 2 },
    { term: "conferencia", weight: 2 },
    { term: "workshop", weight: 2 },
    { term: "taller", weight: 2 },
    { term: "atelier", weight: 2 },
    { term: "seminar", weight: 2 },
    { term: "seminario", weight: 2 },
    { term: "coworking", weight: 2 },
    { term: "entrepreneur", weight: 2 },
    { term: "webinar", weight: 2 },
    "business",
    "negocio",
    "meetup",
    "pitch",
  ],
  culture: [
    { term: "museum", weight: 2 },
    { term: "museo", weight: 2 },
    { term: "heritage", weight: 2 },
    { term: "patrimonio", weight: 2 },
    { term: "fortress", weight: 2 },
    { term: "fortaleza", weight: 2 },
    { term: "art gallery", weight: 2 },
    { term: "galería", weight: 2 },
    { term: "exhibition", weight: 2 },
    { term: "exposición", weight: 2 },
    { term: "craft fair", weight: 2 },
    { term: "artesanal", weight: 2 },
    { term: "historic center", weight: 2 },
    { term: "centro histórico", weight: 2 },
    { term: "centro historico", weight: 2 },
    { term: "culturel", weight: 2 },
    { term: "culturelle", weight: 2 },
    "culture",
    "cultura",
    "cultural",
    "history",
    "historia",
    "historic",
    "histórico",
    "colonial",
    "architecture",
    "arquitectura",
    "amber",
    "ámbar",
  ],
  adventure: [
    { term: "adventure", weight: 2 },
    { term: "aventura", weight: 2 },
    { term: "excursion", weight: 2 },
    { term: "excursión", weight: 2 },
    { term: "boat trip", weight: 2 },
    { term: "boat tour", weight: 2 },
    { term: "catamaran", weight: 2 },
    { term: "catamarán", weight: 2 },
    { term: "snorkeling", weight: 2 },
    { term: "snorkel", weight: 2 },
    { term: "waterfall", weight: 2 },
    { term: "cascada", weight: 2 },
    { term: "charco", weight: 2 },
    { term: "cable car", weight: 2 },
    { term: "teleférico", weight: 2 },
    { term: "teleferico", weight: 2 },
    { term: "zip line", weight: 2 },
    { term: "canopy", weight: 2 },
    { term: "island trip", weight: 2 },
    { term: "sandbar", weight: 2 },
    { term: "ocean world", weight: 2 },
    { term: "monkeyland", weight: 2 },
    { term: "safari truck", weight: 2 },
    { term: "go-kart", weight: 2 },
    { term: "gokart", weight: 2 },
    { term: "go kart", weight: 2 },
    "lancha",
    "hike",
    "caminata",
    "trek",
    "safari",
    "cayo",
    "dolphin",
    "delfín",
    "tour",
    "monkey",
  ],
};

/** Primary category always implies these secondaries when present. */
const CATEGORY_AFFINITIES: Partial<Record<EventCategory, EventCategory[]>> = {
  concert: ["music"],
};

function keywordWeight(keyword: Keyword): { term: string; weight: number } {
  return typeof keyword === "string"
    ? { term: keyword, weight: 1 }
    : keyword;
}

/** Stem prefixes that should match inside longer words (e.g. gastronom → gastronómica). */
const STEM_PREFIXES = new Set(["gastronom"]);

/**
 * Phrase match, or token match with word boundaries (avoids spa→Spanish, tour→tourist).
 * Allows a simple trailing -s / -es plural on single-token terms.
 */
function textIncludesKeyword(haystack: string, term: string): boolean {
  const needle = term.toLowerCase();
  if (needle.includes(" ") || STEM_PREFIXES.has(needle)) {
    return haystack.includes(needle);
  }
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(
    `(^|[^\\p{L}\\p{N}])${escaped}(?:e?s)?([^\\p{L}\\p{N}]|$)`,
    "iu",
  ).test(haystack);
}

function scoreCategory(text: string, keywords: Keyword[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce((score, keyword) => {
    const { term, weight } = keywordWeight(keyword);
    return score + (textIncludesKeyword(lower, term) ? weight : 0);
  }, 0);
}

function categoryScores(text: string): Map<EventCategory, number> {
  const scores = new Map<EventCategory, number>();
  for (const id of CATEGORY_IDS) {
    scores.set(
      id as EventCategory,
      scoreCategory(text, KEYWORDS[id as EventCategory]),
    );
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

/**
 * Keyword-based secondaries.
 * Strong keywords (weight 2+) unlock a category alone; weak terms need minScore 2 total.
 */
export function inferSecondaryCategories(
  text: string,
  primary: EventCategory,
  minScore = 2,
): EventCategory[] {
  const scores = categoryScores(text);
  const fromKeywords = CATEGORY_IDS.filter((id) => {
    const category = id as EventCategory;
    if (category === primary) return false;
    return (scores.get(category) ?? 0) >= minScore;
  }) as EventCategory[];

  const fromAffinity = (CATEGORY_AFFINITIES[primary] ?? []).filter(
    (category) => category !== primary,
  );

  return [...new Set([...fromAffinity, ...fromKeywords])];
}

/** Merge curated tags with keyword/affinity inference (explicit tags are never dropped). */
export function resolveSecondaryCategories(event: {
  title: string;
  description: string;
  category: EventCategory;
  categories?: EventCategory[];
}): EventCategory[] {
  const explicit =
    event.categories?.filter((category) => category !== event.category) ?? [];
  const inferred = inferSecondaryCategories(
    `${event.title} ${event.description}`,
    event.category,
  );
  return [...new Set([...explicit, ...inferred])];
}

/** Fill secondary categories when omitted; merges curated tags with inference. */
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
