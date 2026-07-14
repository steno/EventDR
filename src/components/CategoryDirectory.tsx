import { CategoryGrid } from "@/components/CategoryGrid";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface CategoryDirectoryProps {
  locale: Locale;
  dict: Dictionary;
}

/** Full browse directory — same pill grid as home, without city scoping. */
export function CategoryDirectory({ locale, dict }: CategoryDirectoryProps) {
  return <CategoryGrid locale={locale} dict={dict} />;
}
