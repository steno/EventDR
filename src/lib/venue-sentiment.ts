import type {
  AssessmentAxis,
  AssessmentTheme,
  CrowdFit,
  VenueAssessment,
} from "@/lib/types";
import type { GooglePlaceDetails } from "@/lib/google-places";

interface ThemeLexiconEntry {
  key: string;
  /** Lowercase EN/ES keywords or phrases matched in review text. */
  keywords: string[];
  defaultSentiment: AssessmentTheme["sentiment"];
  audience?: CrowdFit;
}

interface CrowdLexiconEntry {
  fit: CrowdFit;
  keywords: string[];
}

/** Theme detectors for North Coast venue reviews (English + Spanish). */
const THEME_LEXICON: ThemeLexiconEntry[] = [
  {
    key: "sunset_views",
    keywords: ["sunset", "atardecer", "sun set", "golden hour"],
    defaultSentiment: "positive",
  },
  {
    key: "live_music",
    keywords: [
      "live music",
      "música en vivo",
      "musica en vivo",
      "live band",
      "banda en vivo",
      "dj",
      "salsa",
      "merengue",
      "bachata",
      "reggaeton",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "busy_weekends",
    keywords: [
      "busy weekend",
      "packed weekend",
      "crowded on weekend",
      "lleno el fin",
      "fin de semana lleno",
      "muy lleno",
      "packed",
      "crowded",
    ],
    defaultSentiment: "mixed",
  },
  {
    key: "easy_to_find",
    keywords: [
      "easy to find",
      "easy to get to",
      "fácil de encontrar",
      "facil de encontrar",
      "central location",
      "bien ubicado",
      "well located",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "loud_late",
    keywords: [
      "loud",
      "noisy",
      "too loud",
      "ruidoso",
      "mucho ruido",
      "late night",
      "until late",
      "hasta tarde",
      "after midnight",
    ],
    defaultSentiment: "mixed",
    audience: "nightlife",
  },
  {
    key: "dominican_plates",
    keywords: [
      "dominican food",
      "comida dominicana",
      "mofongo",
      "sancocho",
      "bandera",
      "típico",
      "tipico",
      "local food",
      "comida local",
      "plato típico",
    ],
    defaultSentiment: "positive",
    audience: "local",
  },
  {
    key: "beachfront",
    keywords: [
      "beachfront",
      "on the beach",
      "by the beach",
      "frente al mar",
      "frente a la playa",
      "right on the beach",
      "beach bar",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "kite_scene",
    keywords: ["kite", "kitesurf", "kite surf", "kitesurfing", "kite beach"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "family_friendly",
    keywords: [
      "family friendly",
      "family-friendly",
      "kids",
      "children",
      "niños",
      "ninos",
      "familia",
      "for families",
      "with kids",
    ],
    defaultSentiment: "positive",
    audience: "family",
  },
  {
    key: "tourist_crowds",
    keywords: [
      "touristy",
      "tourists",
      "tourist",
      "turistas",
      "turístico",
      "turistico",
      "full of tourists",
    ],
    defaultSentiment: "mixed",
    audience: "visitor",
  },
  {
    key: "dance_floor",
    keywords: [
      "dance floor",
      "pista de baile",
      "dancing",
      "bailar",
      "baile",
      "great for dancing",
    ],
    defaultSentiment: "positive",
    audience: "nightlife",
  },
  {
    key: "expat_crowd",
    keywords: ["expat", "expatriate", "foreigners", "extranjeros", "gringo"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "good_for_guests",
    keywords: [
      "hotel guest",
      "resort guest",
      "from the hotel",
      "huéspedes",
      "huespedes",
      "all inclusive",
      "todo incluido",
    ],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "water_sports",
    keywords: [
      "water sports",
      "watersports",
      "jet ski",
      "paddle",
      "kayak",
      "deportes acuáticos",
      "deportes acuaticos",
    ],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "free_access",
    keywords: [
      "free entry",
      "free access",
      "no cover",
      "entrada gratis",
      "acceso libre",
      "gratis",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "ocean_views",
    keywords: [
      "ocean view",
      "ocean views",
      "sea view",
      "vista al mar",
      "vistas al océano",
      "vistas al oceano",
      "view of the ocean",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "resort_shows",
    keywords: ["resort show", "hotel show", "show del hotel", "evening show"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "food_park_vibe",
    keywords: ["food park", "food court", "food trucks", "foodtruck"],
    defaultSentiment: "positive",
  },
  {
    key: "heritage_site",
    keywords: [
      "historic",
      "history",
      "heritage",
      "fortaleza",
      "museum fort",
      "histórico",
      "historico",
    ],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "adventure_park",
    keywords: [
      "zipline",
      "zip line",
      "adventure park",
      "parque de aventura",
      "canopy",
      "rappel",
    ],
    defaultSentiment: "positive",
    audience: "family",
  },
  {
    key: "rum_tasting",
    keywords: ["rum tasting", "degustación de ron", "degustacion de ron", "brugal", "ron"],
    defaultSentiment: "positive",
  },
  {
    key: "cigar_tour",
    keywords: ["cigar", "cigars", "tabaco", "cigarro", "puros"],
    defaultSentiment: "positive",
  },
  {
    key: "museum_visit",
    keywords: ["museum", "museo", "exhibit", "exposición", "exposicion"],
    defaultSentiment: "positive",
  },
  {
    key: "surf_break",
    keywords: ["surf", "surfing", "waves", "olas", "surf break"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "golf_course",
    keywords: ["golf", "golf course", "campo de golf"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "karaoke",
    keywords: ["karaoke", "karaoké"],
    defaultSentiment: "positive",
  },
  {
    key: "workshop",
    keywords: ["workshop", "taller", "class", "clase", "hands-on"],
    defaultSentiment: "positive",
  },
  {
    key: "boat_trip",
    keywords: ["boat", "catamaran", "catamarán", "barco", "cruise", "paseo en barco"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "baseball",
    keywords: ["baseball", "béisbol", "beisbol", "stadium", "estadio"],
    defaultSentiment: "positive",
    audience: "local",
  },
  {
    key: "snorkeling",
    keywords: ["snorkel", "snorkeling", "snorkelling"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "photo_spot",
    keywords: [
      "photo",
      "photos",
      "instagram",
      "pictures",
      "fotos",
      "photo spot",
    ],
    defaultSentiment: "positive",
  },
  {
    key: "chocolate_tour",
    keywords: ["chocolate", "cacao", "cocoa"],
    defaultSentiment: "positive",
  },
  {
    key: "countryside",
    keywords: ["countryside", "campo", "rural", "nature", "naturaleza"],
    defaultSentiment: "positive",
  },
  {
    key: "cowork_space",
    keywords: ["cowork", "co-working", "coworking", "wifi", "remote work"],
    defaultSentiment: "positive",
    audience: "visitor",
  },
  {
    key: "open_mic",
    keywords: ["open mic", "open-mic", "micrófono abierto", "microfono abierto"],
    defaultSentiment: "positive",
    audience: "local",
  },
];

const CROWD_LEXICON: CrowdLexiconEntry[] = [
  {
    fit: "local",
    keywords: [
      "locals",
      "local crowd",
      "dominican",
      "dominicanos",
      "gente local",
      "donde van los locales",
    ],
  },
  {
    fit: "visitor",
    keywords: [
      "tourists",
      "visitors",
      "vacation",
      "holiday",
      "turistas",
      "visitantes",
      "resort",
    ],
  },
  {
    fit: "family",
    keywords: ["family", "kids", "children", "familia", "niños", "ninos"],
  },
  {
    fit: "nightlife",
    keywords: [
      "nightlife",
      "club",
      "party",
      "noche",
      "discoteca",
      "vida nocturna",
      "late night",
    ],
  },
  {
    fit: "mixed",
    keywords: ["mixed crowd", "everyone", "all ages", "de todo", "variado"],
  },
];

const POSITIVE_CUES = [
  "amazing",
  "awesome",
  "great",
  "love",
  "loved",
  "excellent",
  "fantastic",
  "perfect",
  "recommend",
  "best",
  "wonderful",
  "friendly",
  "delicious",
  "incríble",
  "increible",
  "excelente",
  "recomiendo",
  "buenísimo",
  "buenisimo",
  "genial",
  "espectacular",
  "vale la pena",
];

const NEGATIVE_CUES = [
  "terrible",
  "awful",
  "worst",
  "rude",
  "overpriced",
  "dirty",
  "avoid",
  "disappointing",
  "scam",
  "horrible",
  "malo",
  "pésimo",
  "pesimo",
  "caro",
  "sucio",
  "no recomiendo",
  "decepción",
  "decepcion",
];

export interface SentimentAggregate {
  themes: AssessmentTheme[];
  crowdFit: CrowdFit[];
  polarity: number;
  matchedThemeHits: number;
  evidenceSnippets: string[];
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function countKeywordHits(haystack: string, keywords: string[]): number {
  let hits = 0;
  for (const raw of keywords) {
    const needle = normalize(raw);
    if (!needle) continue;
    if (haystack.includes(needle)) hits += 1;
  }
  return hits;
}

function textPolarity(haystack: string): number {
  const pos = countKeywordHits(haystack, POSITIVE_CUES);
  const neg = countKeywordHits(haystack, NEGATIVE_CUES);
  if (pos + neg === 0) return 0;
  return (pos - neg) / (pos + neg);
}

function ratingPolarity(rating?: number): number {
  if (rating == null || !Number.isFinite(rating)) return 0;
  // Map 1–5 → -1…1 around a neutral 3
  return Math.max(-1, Math.min(1, (rating - 3) / 2));
}

function sentimentFromScore(score: number): AssessmentTheme["sentiment"] {
  if (score >= 0.35) return "positive";
  if (score <= -0.35) return "negative";
  if (Math.abs(score) < 0.12) return "neutral";
  return "mixed";
}

function toSnippet(text: string, max = 140): string {
  const t = text.trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

/** Aggregate themes/crowd/polarity from Google review texts + star ratings. */
export function aggregateReviewSentiment(
  reviews: { text: string; rating?: number }[],
  placeRating?: number,
): SentimentAggregate {
  const themeScores = new Map<
    string,
    { hits: number; sentimentSum: number; audience?: CrowdFit; def: AssessmentTheme["sentiment"] }
  >();
  const crowdScores = new Map<CrowdFit, number>();
  const evidence: { score: number; text: string }[] = [];

  let polaritySum = 0;
  let polarityN = 0;

  for (const review of reviews) {
    const haystack = normalize(review.text);
    if (!haystack) continue;

    const pText = textPolarity(haystack);
    const pRating = ratingPolarity(review.rating);
    const p =
      review.rating != null ? pText * 0.45 + pRating * 0.55 : pText;
    polaritySum += p;
    polarityN += 1;

    let reviewThemeHits = 0;
    for (const entry of THEME_LEXICON) {
      const hits = countKeywordHits(haystack, entry.keywords);
      if (hits === 0) continue;
      reviewThemeHits += hits;
      const prev = themeScores.get(entry.key) ?? {
        hits: 0,
        sentimentSum: 0,
        audience: entry.audience,
        def: entry.defaultSentiment,
      };
      prev.hits += hits;
      prev.sentimentSum += p * hits;
      themeScores.set(entry.key, prev);
    }

    for (const entry of CROWD_LEXICON) {
      const hits = countKeywordHits(haystack, entry.keywords);
      if (hits === 0) continue;
      crowdScores.set(entry.fit, (crowdScores.get(entry.fit) ?? 0) + hits);
    }

    if (reviewThemeHits > 0 || Math.abs(p) >= 0.35) {
      evidence.push({ score: Math.abs(p) + reviewThemeHits * 0.2, text: review.text });
    }
  }

  if (placeRating != null) {
    polaritySum += ratingPolarity(placeRating) * 1.5;
    polarityN += 1.5;
  }

  const polarity = polarityN > 0 ? polaritySum / polarityN : 0;

  const themes: AssessmentTheme[] = [...themeScores.entries()]
    .sort((a, b) => b[1].hits - a[1].hits)
    .slice(0, 5)
    .map(([key, v]) => ({
      key,
      sentiment:
        v.hits >= 2
          ? sentimentFromScore(v.sentimentSum / v.hits)
          : v.def,
      ...(v.audience ? { audience: v.audience } : {}),
    }));

  const crowdFit = [...crowdScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 3)
    .map(([fit]) => fit);

  const matchedThemeHits = [...themeScores.values()].reduce(
    (n, v) => n + v.hits,
    0,
  );

  const evidenceSnippets = evidence
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((e) => toSnippet(e.text));

  return {
    themes,
    crowdFit,
    polarity,
    matchedThemeHits,
    evidenceSnippets,
  };
}

function blendAxes(
  seed: VenueAssessment["axes"],
  placeRating?: number,
  polarity?: number,
): VenueAssessment["axes"] {
  const axes: Partial<Record<AssessmentAxis, number>> = { ...seed };
  if (placeRating != null && Number.isFinite(placeRating)) {
    const recommend = Math.round(placeRating * 10) / 10;
    axes.recommend = seed.recommend
      ? Math.round(((seed.recommend + recommend) / 2) * 10) / 10
      : recommend;
  }
  if (polarity != null && Math.abs(polarity) >= 0.15) {
    const atmosphere = Math.round((3 + polarity * 2) * 10) / 10;
    axes.atmosphere = seed.atmosphere
      ? Math.round(((seed.atmosphere + atmosphere) / 2) * 10) / 10
      : Math.max(1, Math.min(5, atmosphere));
  }
  return axes;
}

function mergeThemes(
  editorial: AssessmentTheme[],
  fromReviews: AssessmentTheme[],
): AssessmentTheme[] {
  if (fromReviews.length === 0) return editorial.slice(0, 3);

  const reviewByKey = new Map(fromReviews.map((t) => [t.key, t]));
  const editorialKeys = new Set(editorial.map((t) => t.key));

  // 1) Themes both editorial + reviews agree on (review sentiment wins)
  const confirmed: AssessmentTheme[] = [];
  for (const t of editorial) {
    const fromReview = reviewByKey.get(t.key);
    if (!fromReview) continue;
    confirmed.push({
      ...t,
      sentiment: fromReview.sentiment,
      ...(fromReview.audience ? { audience: fromReview.audience } : {}),
    });
  }

  // 2) Review-only themes (real online signals editorial missed)
  const reviewOnly = fromReviews.filter((t) => !editorialKeys.has(t.key));

  // 3) Editorial-only (local judgment without review keyword hits)
  const editorialOnly = editorial.filter((t) => !reviewByKey.has(t.key));

  return [...confirmed, ...reviewOnly, ...editorialOnly].slice(0, 3);
}

function mergeCrowd(editorial: CrowdFit[], fromReviews: CrowdFit[]): CrowdFit[] {
  if (fromReviews.length === 0) return editorial.slice(0, 3);
  // Prefer overlap, then editorial lean, then review-only extras
  const reviewSet = new Set(fromReviews);
  const confirmed = editorial.filter((f) => reviewSet.has(f));
  const editorialOnly = editorial.filter((f) => !reviewSet.has(f));
  const reviewOnly = fromReviews.filter((f) => !editorial.includes(f));
  const out: CrowdFit[] = [];
  for (const fit of [...confirmed, ...editorialOnly, ...reviewOnly]) {
    if (!out.includes(fit)) out.push(fit);
    if (out.length >= 3) break;
  }
  return out;
}

/**
 * Keep POP editorial verdict as the tip voice.
 * Only retarget when Google volume is high and reviews clearly point elsewhere.
 */
function pickVerdict(
  seedKey: string,
  crowd: CrowdFit[],
  themes: AssessmentTheme[],
  polarity: number,
  reviewCount: number,
): string {
  // Light review volume → trust editorial judgment for the comment headline.
  if (reviewCount < 40 || polarity < 0.2) return seedKey;

  const themeKeys = new Set(themes.map((t) => t.key));
  const hasNightlife =
    crowd.includes("nightlife") ||
    themeKeys.has("dance_floor") ||
    themeKeys.has("loud_late") ||
    themeKeys.has("live_music");
  const hasFood =
    themeKeys.has("dominican_plates") || themeKeys.has("food_park_vibe");
  const hasBeach =
    themeKeys.has("beachfront") ||
    themeKeys.has("ocean_views") ||
    themeKeys.has("sunset_views");
  const hasCulture =
    themeKeys.has("heritage_site") ||
    themeKeys.has("museum_visit") ||
    themeKeys.has("rum_tasting") ||
    themeKeys.has("cigar_tour");
  const localLean = crowd.includes("local") && !crowd.includes("visitor");
  const visitorLean = crowd.includes("visitor") || crowd.includes("family");

  let suggested = seedKey;
  if (hasNightlife && hasFood) suggested = "strong_mixed_food_nightlife";
  else if (hasNightlife && localLean) suggested = "strong_local_nightlife";
  else if (hasNightlife && visitorLean) suggested = "strong_visitor_nightlife";
  else if (hasNightlife) suggested = "local_favorite_night";
  else if (hasFood && localLean) suggested = "strong_local_food";
  else if (hasBeach && visitorLean) suggested = "strong_visitor_beach";
  else if (hasCulture) suggested = "solid_local_culture";
  else if (themeKeys.has("adventure_park") || themeKeys.has("water_sports")) {
    suggested = "solid_visitor_activity";
  } else if (themeKeys.has("free_access")) {
    suggested = "popular_public_space";
  } else if (visitorLean && polarity >= 0.35) {
    suggested = "reliable_visitor_pick";
  }

  return suggested;
}

/**
 * Blend Google Places rating/reviews onto an editorial seed.
 * Editorial verdict stays the tip voice unless reviews are high-volume + clear.
 * Themes prefer editorial∩reviews, then review-only, then editorial-only.
 */
export function applyReviewSentiment(
  assessment: VenueAssessment,
  details: GooglePlaceDetails,
): VenueAssessment {
  const aggregate = aggregateReviewSentiment(
    details.reviews,
    details.rating,
  );

  const hasReviewSignal =
    details.reviews.length > 0 &&
    (aggregate.matchedThemeHits >= 1 || details.rating != null);

  if (!hasReviewSignal && details.rating == null) {
    return assessment;
  }

  const themes = mergeThemes(assessment.themes, aggregate.themes);
  const crowdFit = mergeCrowd(assessment.crowdFit, aggregate.crowdFit);
  const verdictKey = pickVerdict(
    assessment.verdictKey,
    crowdFit,
    themes,
    aggregate.polarity,
    details.userRatingCount ?? details.reviews.length,
  );
  const axes = blendAxes(
    assessment.axes,
    details.rating,
    aggregate.polarity,
  );

  const withoutGoogle = assessment.sources.filter(
    (s) => s.kind !== "google_places",
  );
  const snippets =
    aggregate.evidenceSnippets.length > 0
      ? aggregate.evidenceSnippets
      : details.snippets;

  return {
    ...assessment,
    googlePlaceId: details.placeId,
    verdictKey,
    crowdFit,
    themes,
    axes,
    sources: [
      ...withoutGoogle,
      {
        kind: "google_places",
        ref: details.placeId,
        label: "Google reviews",
        rating: details.rating,
        reviewCount: details.userRatingCount,
        fetchedAt: new Date().toISOString(),
        snippets,
      },
    ],
    updatedAt: new Date().toISOString(),
    updatedBy: assessment.updatedBy.includes("sentiment")
      ? assessment.updatedBy
      : "seed+places+sentiment",
  };
}
