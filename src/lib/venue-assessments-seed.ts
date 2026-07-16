import type { VenueAssessment } from "@/lib/types";

const SEED_AT = "2026-07-16T00:00:00.000Z";

function editorial(
  partial: Omit<VenueAssessment, "confidence" | "updatedAt" | "updatedBy" | "sources"> & {
    sources?: VenueAssessment["sources"];
  },
): VenueAssessment {
  return {
    ...partial,
    confidence: 0,
    sources: [
      {
        kind: "editorial",
        label: "POP editorial",
        ref: "seed",
      },
      ...(partial.sources ?? []),
    ],
    updatedAt: SEED_AT,
    updatedBy: "seed",
  };
}

/**
 * Phase 1 editorial venue snapshots. Confidence is recomputed at load time.
 * Theme/verdict keys resolve via venues.assessment i18n.
 */
export const SEED_VENUE_ASSESSMENTS: VenueAssessment[] = [
  editorial({
    venueSlug: "lax-cabarete",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.5, practical: 4.2 },
    themes: [
      { key: "sunset_views", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "kite-beach",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.5, atmosphere: 4.6, practical: 3.8 },
    themes: [
      { key: "kite_scene", sentiment: "positive", audience: "visitor" },
      { key: "beachfront", sentiment: "positive" },
      { key: "tourist_crowds", sentiment: "mixed", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "hard-rock-sosua",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.4, reliability: 4.2, practical: 4.3 },
    themes: [
      { key: "live_music", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "liquid-blue-cabarete",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.4, value: 4.0, practical: 4.3, reliability: 4.4 },
    themes: [
      { key: "water_sports", sentiment: "positive", audience: "visitor" },
      { key: "beachfront", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "castaways-sosua",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, value: 4.0 },
    themes: [
      { key: "expat_crowd", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "malecon-puerto-plata",
    verdictKey: "popular_public_space",
    crowdFit: ["local", "visitor", "family", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.2, practical: 4.0, value: 4.8 },
    themes: [
      { key: "free_access", sentiment: "positive" },
      { key: "ocean_views", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "parada-tipica-el-choco",
    verdictKey: "strong_mixed_food_nightlife",
    crowdFit: ["local", "mixed", "nightlife"],
    axes: { recommend: 4.3, atmosphere: 4.4, value: 4.2 },
    themes: [
      { key: "dominican_plates", sentiment: "positive", audience: "local" },
      { key: "live_music", sentiment: "positive" },
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
    ],
  }),
  editorial({
    venueSlug: "el-parq-cabarete",
    verdictKey: "strong_local_food",
    crowdFit: ["local", "mixed", "visitor"],
    axes: { recommend: 4.2, value: 4.3, atmosphere: 4.1 },
    themes: [
      { key: "food_park_vibe", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "d-classico-sosua",
    verdictKey: "strong_local_nightlife",
    crowdFit: ["local", "nightlife"],
    axes: { recommend: 4.4, atmosphere: 4.5, value: 4.1 },
    themes: [
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
      { key: "loud_late", sentiment: "mixed", audience: "nightlife" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "voyvoy-cabarete",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, practical: 4.1 },
    themes: [
      { key: "beachfront", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "ocean-world",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.1, atmosphere: 4.2, practical: 4.4, reliability: 4.3 },
    themes: [
      { key: "adventure_park", sentiment: "positive", audience: "family" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "la-casita-de-papi",
    verdictKey: "strong_mixed_food_nightlife",
    crowdFit: ["local", "visitor", "mixed"],
    axes: { recommend: 4.5, atmosphere: 4.6, value: 3.8 },
    themes: [
      { key: "sunset_views", sentiment: "positive" },
      { key: "dominican_plates", sentiment: "positive" },
      { key: "beachfront", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "playa-sosua",
    verdictKey: "popular_public_space",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.5, practical: 3.9, value: 4.6 },
    themes: [
      { key: "beachfront", sentiment: "positive", audience: "visitor" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "tourist_crowds", sentiment: "mixed", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "natura-cabana",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.4, atmosphere: 4.5, reliability: 4.3 },
    themes: [
      { key: "beachfront", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "bar-39-sosua",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife"],
    axes: { recommend: 4.1, atmosphere: 4.2 },
    themes: [
      { key: "ocean_views", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "cheers-bar-sosua",
    verdictKey: "local_favorite_night",
    crowdFit: ["local", "mixed", "nightlife"],
    axes: { recommend: 4.2, atmosphere: 4.1, value: 4.0 },
    themes: [
      { key: "expat_crowd", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "ground-zero-disco",
    verdictKey: "strong_local_nightlife",
    crowdFit: ["local", "nightlife"],
    axes: { recommend: 4.3, atmosphere: 4.5, value: 4.0 },
    themes: [
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
      { key: "loud_late", sentiment: "mixed", audience: "nightlife" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "anfiteatro-la-puntilla",
    verdictKey: "solid_local_culture",
    crowdFit: ["local", "visitor", "family", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.4, practical: 3.9 },
    themes: [
      { key: "ocean_views", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "free_access", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "blue-jacktar-playa-dorada",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "mixed", "nightlife"],
    axes: { recommend: 4.1, atmosphere: 4.2, reliability: 4.0, practical: 4.2 },
    themes: [
      { key: "resort_shows", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "fortaleza-san-felipe",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.3, practical: 4.1, reliability: 4.4 },
    themes: [
      { key: "heritage_site", sentiment: "positive", audience: "visitor" },
      { key: "ocean_views", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "pingui-bar",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3 },
    themes: [
      { key: "beachfront", sentiment: "positive", audience: "visitor" },
      { key: "live_music", sentiment: "positive" },
      { key: "sunset_views", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "teleferico-puerto-plata",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.3, atmosphere: 4.4, practical: 4.2, reliability: 4.2 },
    themes: [
      { key: "ocean_views", sentiment: "positive", audience: "visitor" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "el-batey-sosua",
    verdictKey: "strong_local_nightlife",
    crowdFit: ["local", "nightlife", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, practical: 4.1 },
    themes: [
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
      { key: "live_music", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "hotel-voramar-sosua",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, reliability: 4.2, practical: 4.2 },
    themes: [
      { key: "live_music", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "expat_crowd", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "smileys-bar-sosua",
    verdictKey: "local_favorite_night",
    crowdFit: ["local", "mixed", "nightlife"],
    axes: { recommend: 4.1, atmosphere: 4.2, value: 4.0 },
    themes: [
      { key: "karaoke", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "expat_crowd", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "finish-line-sosua",
    verdictKey: "local_favorite_night",
    crowdFit: ["local", "mixed"],
    axes: { recommend: 4.0, atmosphere: 4.0, value: 4.1 },
    themes: [
      { key: "expat_crowd", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "sosua-jewish-museum",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.2, reliability: 4.4, practical: 4.1 },
    themes: [
      { key: "heritage_site", sentiment: "positive", audience: "visitor" },
      { key: "museum_visit", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "sosua-diving-center",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.4, reliability: 4.3, practical: 4.2 },
    themes: [
      { key: "snorkeling", sentiment: "positive", audience: "visitor" },
      { key: "water_sports", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "la-chabola-cabarete",
    verdictKey: "strong_local_food",
    crowdFit: ["local", "mixed"],
    axes: { recommend: 4.2, value: 4.3, atmosphere: 4.1 },
    themes: [
      { key: "open_mic", sentiment: "positive", audience: "local" },
      { key: "live_music", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "cowork-cabarete",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.1, practical: 4.3, reliability: 4.2 },
    themes: [
      { key: "cowork_space", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "sea-horse-ranch",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.0 },
    themes: [
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "busy_weekends", sentiment: "mixed" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "senor-rock-playa-dorada",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, practical: 4.2 },
    themes: [
      { key: "live_music", sentiment: "positive" },
      { key: "resort_shows", sentiment: "positive", audience: "visitor" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "cremo-cigar-bar",
    verdictKey: "local_favorite_night",
    crowdFit: ["local", "mixed", "nightlife"],
    axes: { recommend: 4.2, atmosphere: 4.3, value: 3.9 },
    themes: [
      { key: "live_music", sentiment: "positive" },
      { key: "cigar_tour", sentiment: "positive" },
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
    ],
  }),
  editorial({
    venueSlug: "big-lees-beach-bar",
    verdictKey: "strong_visitor_nightlife",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, practical: 4.0 },
    themes: [
      { key: "beachfront", sentiment: "positive", audience: "visitor" },
      { key: "karaoke", sentiment: "positive" },
      { key: "ocean_views", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "el-carey-puerto-plata",
    verdictKey: "local_favorite_night",
    crowdFit: ["local", "nightlife", "mixed"],
    axes: { recommend: 4.1, atmosphere: 4.2, value: 4.0 },
    themes: [
      { key: "beachfront", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
      { key: "loud_late", sentiment: "mixed", audience: "nightlife" },
    ],
  }),
  editorial({
    venueSlug: "el-colibri-hotel",
    verdictKey: "reliable_visitor_pick",
    crowdFit: ["visitor", "nightlife", "mixed"],
    axes: { recommend: 4.1, atmosphere: 4.1, practical: 4.2 },
    themes: [
      { key: "karaoke", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "museo-ambar",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.2, reliability: 4.4, practical: 4.2 },
    themes: [
      { key: "museum_visit", sentiment: "positive", audience: "visitor" },
      { key: "heritage_site", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "charcos-damajagua",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.5, atmosphere: 4.6, practical: 3.9, reliability: 4.3 },
    themes: [
      { key: "adventure_park", sentiment: "positive", audience: "visitor" },
      { key: "countryside", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "cayo-arena",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.5, atmosphere: 4.7, practical: 3.7, reliability: 4.1 },
    themes: [
      { key: "boat_trip", sentiment: "positive", audience: "visitor" },
      { key: "snorkeling", sentiment: "positive" },
      { key: "tourist_crowds", sentiment: "mixed", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "plaza-independencia",
    verdictKey: "popular_public_space",
    crowdFit: ["local", "visitor", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, value: 4.8, practical: 4.3 },
    themes: [
      { key: "free_access", sentiment: "positive" },
      { key: "photo_spot", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "paseo-dona-blanca",
    verdictKey: "popular_public_space",
    crowdFit: ["local", "visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, value: 4.8, practical: 4.2 },
    themes: [
      { key: "photo_spot", sentiment: "positive", audience: "visitor" },
      { key: "free_access", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "calle-sombrillas",
    verdictKey: "popular_public_space",
    crowdFit: ["local", "visitor", "family", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.4, value: 4.9, practical: 4.2 },
    themes: [
      { key: "photo_spot", sentiment: "positive", audience: "visitor" },
      { key: "free_access", sentiment: "positive" },
      { key: "tourist_crowds", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "fun-city",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.2, atmosphere: 4.2, practical: 4.2, reliability: 4.2 },
    themes: [
      { key: "adventure_park", sentiment: "positive", audience: "family" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "monkeyland-puerto-plata",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.3, atmosphere: 4.4, practical: 4.0, reliability: 4.2 },
    themes: [
      { key: "adventure_park", sentiment: "positive", audience: "family" },
      { key: "countryside", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "coconut-cove",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.3, atmosphere: 4.5, practical: 3.9, reliability: 4.2 },
    themes: [
      { key: "adventure_park", sentiment: "positive", audience: "visitor" },
      { key: "ocean_views", sentiment: "positive" },
      { key: "water_sports", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "brugal-rum-center",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed", "local"],
    axes: { recommend: 4.3, atmosphere: 4.2, practical: 4.1, reliability: 4.3 },
    themes: [
      { key: "rum_tasting", sentiment: "positive", audience: "visitor" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "del-oro-chocolate-factory",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.2, value: 4.5, practical: 4.1 },
    themes: [
      { key: "chocolate_tour", sentiment: "positive", audience: "visitor" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "hacienda-cufa",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.4, atmosphere: 4.5, practical: 3.8, reliability: 4.2 },
    themes: [
      { key: "chocolate_tour", sentiment: "positive", audience: "visitor" },
      { key: "countryside", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "tabacalera-cremo",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.1, value: 4.4, practical: 4.2 },
    themes: [
      { key: "cigar_tour", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "vivonte-cigar-factory",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, value: 4.3, practical: 4.2 },
    themes: [
      { key: "cigar_tour", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
      { key: "museum_visit", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "freestyle-catamaran",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family"],
    axes: { recommend: 4.3, atmosphere: 4.4, practical: 4.0, reliability: 4.2 },
    themes: [
      { key: "boat_trip", sentiment: "positive", audience: "visitor" },
      { key: "snorkeling", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "outback-adventures",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "family", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.3, practical: 4.0, reliability: 4.3 },
    themes: [
      { key: "countryside", sentiment: "positive", audience: "visitor" },
      { key: "adventure_park", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "hms-valeria",
    verdictKey: "strong_mixed_food_nightlife",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.2, value: 3.9, practical: 4.1 },
    themes: [
      { key: "dominican_plates", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "rum-legacy-museum",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "local", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.2, reliability: 4.2 },
    themes: [
      { key: "rum_tasting", sentiment: "positive", audience: "visitor" },
      { key: "museum_visit", sentiment: "positive" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "la-confluencia-museum",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "local", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.1, reliability: 4.2 },
    themes: [
      { key: "museum_visit", sentiment: "positive" },
      { key: "heritage_site", sentiment: "positive", audience: "visitor" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
    ],
  }),
  editorial({
    venueSlug: "gregorio-luperon-museum",
    verdictKey: "solid_local_culture",
    crowdFit: ["visitor", "local", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.1, reliability: 4.2 },
    themes: [
      { key: "museum_visit", sentiment: "positive" },
      { key: "heritage_site", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "macorix-house-of-rum",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "local", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.0, reliability: 4.1 },
    themes: [
      { key: "rum_tasting", sentiment: "positive", audience: "visitor" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "casa-de-la-cultura",
    verdictKey: "solid_local_culture",
    crowdFit: ["local", "visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.2, value: 4.5, practical: 4.2 },
    themes: [
      { key: "museum_visit", sentiment: "positive" },
      { key: "live_music", sentiment: "positive" },
      { key: "free_access", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "handmade-the-brand",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, practical: 4.1, reliability: 4.0 },
    themes: [
      { key: "workshop", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
    ],
  }),
  editorial({
    venueSlug: "parque-jose-briceno",
    verdictKey: "solid_local_culture",
    crowdFit: ["local", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.3, practical: 4.0 },
    themes: [
      { key: "baseball", sentiment: "positive", audience: "local" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "disco-club-brugal",
    verdictKey: "strong_local_nightlife",
    crowdFit: ["local", "nightlife"],
    axes: { recommend: 4.2, atmosphere: 4.4, practical: 4.0 },
    themes: [
      { key: "live_music", sentiment: "positive" },
      { key: "loud_late", sentiment: "mixed", audience: "nightlife" },
      { key: "dance_floor", sentiment: "positive", audience: "nightlife" },
    ],
  }),
  editorial({
    venueSlug: "paella-pop-el-pueblito",
    verdictKey: "strong_mixed_food_nightlife",
    crowdFit: ["visitor", "local", "mixed"],
    axes: { recommend: 4.0, atmosphere: 4.2, value: 3.8, reliability: 3.2 },
    themes: [
      { key: "beachfront", sentiment: "positive" },
      { key: "dominican_plates", sentiment: "positive" },
      { key: "busy_weekends", sentiment: "mixed" },
    ],
  }),
  editorial({
    venueSlug: "paella-pop-green-one",
    verdictKey: "strong_mixed_food_nightlife",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.1, value: 3.9, practical: 4.1 },
    themes: [
      { key: "dominican_plates", sentiment: "positive" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "playa-dorada-golf",
    verdictKey: "solid_visitor_activity",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.3, atmosphere: 4.2, practical: 4.2, reliability: 4.3 },
    themes: [
      { key: "golf_course", sentiment: "positive", audience: "visitor" },
      { key: "good_for_guests", sentiment: "positive", audience: "visitor" },
      { key: "easy_to_find", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "playa-encuentro",
    verdictKey: "strong_visitor_beach",
    crowdFit: ["visitor", "mixed"],
    axes: { recommend: 4.5, atmosphere: 4.6, practical: 3.8 },
    themes: [
      { key: "surf_break", sentiment: "positive", audience: "visitor" },
      { key: "beachfront", sentiment: "positive" },
      { key: "water_sports", sentiment: "positive" },
    ],
  }),
  editorial({
    venueSlug: "playa-los-charamicos",
    verdictKey: "popular_public_space",
    crowdFit: ["local", "family", "mixed"],
    axes: { recommend: 4.2, atmosphere: 4.2, value: 4.7, practical: 3.9 },
    themes: [
      { key: "beachfront", sentiment: "positive" },
      { key: "family_friendly", sentiment: "positive", audience: "family" },
      { key: "baseball", sentiment: "positive", audience: "local" },
    ],
  }),
];

const bySlug = new Map(
  SEED_VENUE_ASSESSMENTS.map((a) => [a.venueSlug, a] as const),
);

export function getSeedVenueAssessment(
  slug: string,
): VenueAssessment | undefined {
  const seed = bySlug.get(slug);
  if (!seed) return undefined;
  return { ...seed, themes: [...seed.themes], sources: [...seed.sources], crowdFit: [...seed.crowdFit], axes: { ...seed.axes } };
}
