import type { Locale } from "@/i18n/config";
import type { CityMeta, CitySlug } from "@/lib/cities";
import { getCityName } from "@/lib/cities";
import { getCategorySeo } from "@/lib/category-seo";
import type { EventCategory } from "@/lib/types";

export type CityCategorySeoCopy = {
  title: string;
  description: string;
  intro: string;
};

/** Explicit overrides for high-intent city × category landing pages. */
const CITY_CATEGORY_SEO: Partial<
  Record<CitySlug, Partial<Record<EventCategory, Record<Locale, CityCategorySeoCopy>>>>
> = {
  cabarete: {
    parties: {
      en: {
        title: "Cabarete Nightlife | Parties & Beach Clubs | POP Events",
        description:
          "Cabarete nightlife — beach clubs, reggae nights, DJ parties, and live music on Cabarete Bay. Find tonight's parties and weekend nights out on the North Coast.",
        intro:
          "From LAX sunset sessions to weekend dance floors — Cabarete nightlife starts here.",
      },
      es: {
        title: "Fiestas en Cabarete | Beach clubs | POP Eventos",
        description:
          "Vida nocturna en Cabarete — beach clubs, noches de reggae, fiestas con DJ y música en vivo en la bahía. Encuentra las fiestas de esta noche y el fin de semana en la Costa Norte.",
        intro:
          "Desde sesiones al atardecer en LAX hasta pistas de baile — la vida nocturna de Cabarete empieza aquí.",
      },
      fr: {
        title: "Nightlife Cabarete | Fêtes et beach clubs | POP Events",
        description:
          "Nightlife à Cabarete — beach clubs, soirées reggae, fêtes DJ et musique live sur la baie. Trouvez les fêtes de ce soir et du week-end sur la Côte Nord.",
        intro:
          "Des sessions au coucher du soleil à LAX aux dancefloors du week-end — le nightlife de Cabarete commence ici.",
      },
    },
    sports: {
      en: {
        title: "Kite Surf & Sports in Cabarete | POP Events",
        description:
          "Kite surfing, beach sports, and active events in Cabarete — North Coast Dominican Republic. Find lessons, competitions, and weekend sessions.",
        intro:
          "Cabarete is the North Coast kite capital — sessions, comps, and beach sports in one place.",
      },
      es: {
        title: "Kite surf y deportes en Cabarete | POP Eventos",
        description:
          "Kite surf, deportes de playa y eventos activos en Cabarete — Costa Norte RD. Clases, competencias y sesiones de fin de semana.",
        intro:
          "Cabarete es la capital del kite en la Costa Norte — sesiones, comps y deportes de playa.",
      },
      fr: {
        title: "Kite surf et sports à Cabarete | POP Events",
        description:
          "Kite surf, sports de plage et événements actifs à Cabarete — Côte Nord RD. Cours, compétitions et sessions du week-end.",
        intro:
          "Cabarete, capitale du kite sur la Côte Nord — sessions, comps et sports de plage.",
      },
    },
  },
  sosua: {
    parties: {
      en: {
        title: "Sosúa Nightlife | Parties & Beach Bars | POP Events",
        description:
          "Sosúa nightlife — Pedro Clisante parties, beach bars, DJs, and live music in El Batey. Find tonight's plans and weekend nights out.",
        intro:
          "From El Batey bar crawls to beachfront dance floors — Sosúa nights start here.",
      },
      es: {
        title: "Fiestas en Sosúa | Vida nocturna | POP Eventos",
        description:
          "Vida nocturna en Sosúa — fiestas en Pedro Clisante, beach bars, DJs y música en vivo en El Batey. Planes de esta noche y el fin de semana.",
        intro:
          "Desde bares en El Batey hasta pistas frente al mar — las noches en Sosúa empiezan aquí.",
      },
      fr: {
        title: "Nightlife Sosúa | Fêtes et beach bars | POP Events",
        description:
          "Nightlife à Sosúa — fêtes Pedro Clisante, beach bars, DJ et musique live à El Batey. Plans de ce soir et du week-end.",
        intro:
          "Des bars d'El Batey aux dancefloors en bord de mer — les nuits à Sosúa commencent ici.",
      },
    },
  },
  "puerto-plata": {
    music: {
      en: {
        title: "Live Music in Puerto Plata | Malecón & Downtown | POP Events",
        description:
          "Live music in Puerto Plata — Malecón concerts, merengue, bachata, and downtown shows on the North Coast of the Dominican Republic.",
        intro:
          "Malecón stages, downtown clubs, and local bands — live music across Puerto Plata.",
      },
      es: {
        title: "Música en vivo en Puerto Plata | Malecón | POP Eventos",
        description:
          "Música en vivo en Puerto Plata — conciertos en el Malecón, merengue, bachata y shows en el centro de la Costa Norte de RD.",
        intro:
          "Escenarios del Malecón, clubes del centro y bandas locales — música en vivo en Puerto Plata.",
      },
      fr: {
        title: "Musique live à Puerto Plata | Malecón | POP Events",
        description:
          "Musique live à Puerto Plata — concerts sur le Malecón, merengue, bachata et shows en centre-ville sur la Côte Nord de RD.",
        intro:
          "Scènes du Malecón, clubs du centre et groupes locaux — musique live à Puerto Plata.",
      },
    },
  },
};

export function getCityCategorySeo(
  locale: Locale,
  city: CityMeta,
  categoryId: EventCategory,
  categoryLabel: string,
): CityCategorySeoCopy {
  const override = CITY_CATEGORY_SEO[city.slug]?.[categoryId]?.[locale];
  if (override) return override;

  const cityName = getCityName(city, locale);
  const categorySeo = getCategorySeo(locale, categoryId);

  const copy: Record<Locale, CityCategorySeoCopy> = {
    en: {
      title: `${categoryLabel} events in ${cityName} | POP Events`,
      description: categorySeo.description.replace(
        /Puerto Plata, Sosúa, and Cabarete/gi,
        cityName,
      ),
      intro: `${categorySeo.intro} Focused on ${cityName}.`,
    },
    es: {
      title: `Eventos de ${categoryLabel} en ${cityName} | POP Eventos`,
      description: categorySeo.description.replace(
        /Puerto Plata, Sosúa y Cabarete/gi,
        cityName,
      ),
      intro: `${categorySeo.intro} Enfocado en ${cityName}.`,
    },
    fr: {
      title: `Événements ${categoryLabel} à ${cityName} | POP Events`,
      description: categorySeo.description.replace(
        /à Puerto Plata, Sosúa et Cabarete/gi,
        `à ${cityName}`,
      ),
      intro: `${categorySeo.intro} Focus ${cityName}.`,
    },
  };

  return copy[locale] ?? copy.en;
}
