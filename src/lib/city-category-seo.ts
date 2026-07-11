import type { Locale } from "@/i18n/config";
import type { CityMeta } from "@/lib/cities";
import { getCityName } from "@/lib/cities";
import { getCategorySeo } from "@/lib/category-seo";
import type { EventCategory } from "@/lib/types";

export type CityCategorySeoCopy = {
  title: string;
  description: string;
  intro: string;
};

export function getCityCategorySeo(
  locale: Locale,
  city: CityMeta,
  categoryId: EventCategory,
  categoryLabel: string,
): CityCategorySeoCopy {
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
