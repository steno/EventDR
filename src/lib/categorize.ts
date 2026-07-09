import type { EventCategory } from "./types";
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
  ],
};

function scoreCategory(text: string, keywords: string[]): number {
  const lower = text.toLowerCase();
  return keywords.reduce(
    (score, kw) => score + (lower.includes(kw.toLowerCase()) ? 1 : 0),
    0,
  );
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

export function matchesCategory(
  event: { title: string; description: string; category: EventCategory },
  category: EventCategory,
): boolean {
  if (event.category === category) return true;
  const text = `${event.title} ${event.description}`;
  return scoreCategory(text, KEYWORDS[category]) >= 1;
}
