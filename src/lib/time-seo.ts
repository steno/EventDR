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
      h1: "Events happening today",
      title: "Events Today in Puerto Plata, Sosúa & Cabarete | POP Events",
      description:
        "What's happening today on the North Coast of the Dominican Republic — live music, parties, sports, food events, and local plans in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Today's calendar for the North Coast — concerts, meetups, recurring beach events, and one-off happenings updated daily.",
    },
    es: {
      h1: "Eventos de hoy",
      title: "Eventos hoy en Puerto Plata, Sosúa y Cabarete | POP Eventos",
      description:
        "Qué pasa hoy en la Costa Norte de RD — música en vivo, fiestas, deportes, gastronomía y planes locales en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "El calendario de hoy en la Costa Norte — conciertos, meetups, eventos de playa recurrentes y planes puntuales.",
    },
    fr: {
      h1: "Événements aujourd'hui",
      title: "Événements aujourd'hui à Puerto Plata, Sosúa et Cabarete | POP Events",
      description:
        "Ce qui se passe aujourd'hui sur la Côte Nord de RD — musique live, fêtes, sports, food et activités locales à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "L'agenda du jour sur la Côte Nord — concerts, meetups, événements plage récurrents et sorties ponctuelles.",
    },
  },
  tomorrow: {
    en: {
      h1: "Events tomorrow",
      title: "Events Tomorrow in Puerto Plata, Sosúa & Cabarete | POP Events",
      description:
        "What's happening tomorrow on the North Coast of the Dominican Republic — live music, parties, sports, food events, and local plans in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Tomorrow's calendar for the North Coast — concerts, meetups, recurring beach events, and one-off happenings.",
    },
    es: {
      h1: "Eventos de mañana",
      title: "Eventos mañana en Puerto Plata, Sosúa y Cabarete | POP Eventos",
      description:
        "Qué pasa mañana en la Costa Norte de RD — música en vivo, fiestas, deportes, gastronomía y planes locales en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "El calendario de mañana en la Costa Norte — conciertos, meetups, eventos de playa recurrentes y planes puntuales.",
    },
    fr: {
      h1: "Événements demain",
      title: "Événements demain à Puerto Plata, Sosúa et Cabarete | POP Events",
      description:
        "Ce qui se passe demain sur la Côte Nord de RD — musique live, fêtes, sports, food et activités locales à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "L'agenda de demain sur la Côte Nord — concerts, meetups, événements plage récurrents et sorties ponctuelles.",
    },
  },
  weekend: {
    en: {
      h1: "Events this weekend",
      title: "Events This Weekend in Puerto Plata, Sosúa & Cabarete | POP Events",
      description:
        "Things to do this weekend on the North Coast DR — parties, live music, kite surf, food festivals, and local events in Puerto Plata, Sosúa, and Cabarete.",
      intro:
        "Your weekend guide to the North Coast — filtered to Friday through Sunday happenings across Puerto Plata, Sosúa, and Cabarete.",
    },
    es: {
      h1: "Eventos este fin de semana",
      title: "Eventos este fin de semana en Puerto Plata, Sosúa y Cabarete | POP Eventos",
      description:
        "Qué hacer este fin de semana en la Costa Norte RD — fiestas, música en vivo, kite surf, festivales y planes en Puerto Plata, Sosúa y Cabarete.",
      intro:
        "Tu guía de fin de semana en la Costa Norte — planes de viernes a domingo en Puerto Plata, Sosúa y Cabarete.",
    },
    fr: {
      h1: "Événements ce week-end",
      title: "Événements ce week-end à Puerto Plata, Sosúa et Cabarete | POP Events",
      description:
        "Que faire ce week-end sur la Côte Nord RD — fêtes, musique live, kite surf, festivals et activités à Puerto Plata, Sosúa et Cabarete.",
      intro:
        "Votre guide week-end sur la Côte Nord — sorties du vendredi au dimanche à Puerto Plata, Sosúa et Cabarete.",
    },
  },
};

export function getWhenSeo(locale: Locale, slug: WhenSlug): WhenSeoCopy {
  return WHEN_SEO[slug][locale] ?? WHEN_SEO[slug].en;
}
