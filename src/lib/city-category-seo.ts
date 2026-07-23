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
        title: "Vida nocturna en Cabarete | Fiestas y beach clubs | POP Eventos",
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
