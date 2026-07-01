import type { Locale } from "../config";
import type { Dictionary } from "./en";
import { en } from "./en";
import { es } from "./es";
import { fr } from "./fr";

const dictionaries: Record<Locale, Dictionary> = { en, es, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export type { Dictionary, AppTab } from "./en";
