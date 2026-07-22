import { CategoryGrid } from "@/components/CategoryGrid";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";

interface CategoryDirectoryProps {
  locale: Locale;
  dict: Dictionary;
  events?: Pick<Event, "category" | "categories">[];
}

/** Full browse directory — same pill grid as home, without city scoping. */
export function CategoryDirectory({
  locale,
  dict,
  events,
}: CategoryDirectoryProps) {
  return <CategoryGrid locale={locale} dict={dict} events={events} />;
}
