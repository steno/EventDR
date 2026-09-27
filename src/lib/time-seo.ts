import type { Locale } from "@/i18n/config";
import type { TimeRange } from "@/lib/filters";

export const WHEN_SLUGS = ["today", "tomorrow", "weekend"] as const;

export type WhenSlug = (typeof WHEN_SLUGS)[number];

export type WhenSeoCopy = {
  title: string;
  description: string;
  intro: string;
  h1: string;
};

export function isWhenSlug(value: string): value is WhenSlug {
  return WHEN_SLUGS.includes(value as WhenSlug);
}

export function isIndexableWhenRange(
  range: TimeRange,
): range is WhenSlug {
  return isWhenSlug(range);
}

const WHEN_SEO: Record<WhenSlug, Record<Locale, WhenSeoCopy>> = {
  today: {
    en: {
      h1: "Things to do today",
      title: "Things to do today in Puerto Plata | POP Events",
      description:
        "Today’s plans on the North Coast — live music, parties, go-karts, and local events in Puerto Plata, Sosúa, and Cabarete. Updated daily.",
      intro:
        "Today’s North Coast plans — concerts, beach events, and one-off happenings, updated daily.",
    },
    es: {
      h1: "Qué hacer hoy",
      title: "Qué hacer hoy en Puerto Plata | POP Eventos",
      description:
        "Planes de hoy en la Costa Norte — música en vivo, fiestas, go-karts y eventos locales en Puerto Plata, Sosúa y Cabarete. Actualizado cada día.",
      intro:
        "Los planes de hoy en la Costa Norte — conciertos, playa y eventos sueltos, actualizados cada día.",
    },
    fr: {
      h1: "Que faire aujourd'hui",
      title: "Que faire aujourd'hui à Puerto Plata | POP Events",
      description:
        "Les plans du jour sur la Côte Nord — musique live, fêtes, karts et sorties locales à Puerto Plata, Sosúa et Cabarete. Mis à jour chaque jour.",
      intro:
        "Les plans du jour sur la Côte Nord — concerts, plage et sorties ponctuelles, mis à jour chaque jour.",
    },
  },
  tomorrow: {
    en: {
      h1: "Things to do tomorrow",
      title: "Things to do tomorrow in Puerto Plata | POP Events",
      description:
        "Tomorrow’s plans on the North Coast — live music, parties, go-karts, and local events in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Tomorrow’s North Coast plans — concerts, beach events, and one-off happenings.",
    },
    es: {
      h1: "Qué hacer mañana",
      title: "Qué hacer mañana en Puerto Plata | POP Eventos",
      description:
        "Planes de mañana en la Costa Norte — música en vivo, fiestas, go-karts y eventos locales en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "Los planes de mañana en la Costa Norte — conciertos, playa y eventos sueltos.",
    },
    fr: {
      h1: "Que faire demain",
      title: "Que faire demain à Puerto Plata | POP Events",
      description:
        "Les plans de demain sur la Côte Nord — musique live, fêtes, karts et sorties locales à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Les plans de demain sur la Côte Nord — concerts, plage et sorties ponctuelles.",
    },
  },
  weekend: {
    en: {
      h1: "Things to do this weekend",
      title: "Things to do this weekend in Puerto Plata | POP Events",
      description:
        "This weekend on the North Coast — parties, live music, kite surf, and local plans in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Friday through Sunday on the North Coast — Puerto Plata, Sosúa, and Cabarete, grouped by day.",
    },
    es: {
      h1: "Qué hacer este fin de semana",
      title: "Qué hacer este fin de semana en Puerto Plata | POP Eventos",
      description:
        "Este fin de semana en la Costa Norte — fiestas, música en vivo, kite surf y planes en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "De viernes a domingo en la Costa Norte — Puerto Plata, Sosúa y Cabarete, agrupado por día.",
    },
    fr: {
      h1: "Que faire ce week-end",
      title: "Que faire ce week-end à Puerto Plata | POP Events",
      description:
        "Ce week-end sur la Côte Nord — fêtes, musique live, kite surf et sorties à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Du vendredi au dimanche sur la Côte Nord — Puerto Plata, Sosúa et Cabarete, groupé par jour.",
    },
  },
};

export function getWhenSeo(locale: Locale, slug: WhenSlug): WhenSeoCopy {
  return WHEN_SEO[slug][locale] ?? WHEN_SEO[slug].en;
}
