import type { Event } from "./types";
import type { LocalizedText } from "./localized-text";

type CuratedPatch = Partial<Omit<Event, "localized">> & {
  localized?: Partial<{
    title: LocalizedText;
    description: LocalizedText;
  }>;
};

/** Title-based patches for known North Coast events (any ingest id). */
const CURATED_EVENT_PATCHES: Record<string, CuratedPatch> = {
  "18th-annual-cabarete-butterfly-effect": {
    sourceUrl: "https://www.cabaretebutterflyeffect.com/",
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
  const patch = CURATED_EVENT_PATCHES[eventCuratedKey(event.title)];
  if (!patch) return event;

  const { localized: localizedPatch, ...fields } = patch;
  const merged: Event = { ...event, ...fields };

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
  "ingest-18th-annual-cabarete-butterfly-effect",
] as const;
