import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { SEED_VENUES } from "@/lib/venues-seed";

interface SiteFooterProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

const FOOTER_CATEGORIES = [
  "music",
  "parties",
  "food-drinks",
  "sports",
  "culture",
  "adventure",
] as const;

export function SiteFooter({ dict, locale, className = "" }: SiteFooterProps) {
  const footerVenues = SEED_VENUES.slice(0, 4);

  return (
    <footer
      className={`border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-center ${className}`}
    >
      <nav
        aria-label={dict.browse.ariaLabel}
        className="mx-auto mb-4 flex max-w-lg flex-wrap justify-center gap-x-4 gap-y-2 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400"
      >
        <Link href={`/${locale}`} className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
          {dict.hero.events}
        </Link>
        {FOOTER_CATEGORIES.map((id) => (
          <Link
            key={id}
            href={`/${locale}/category/${id}`}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            {dict.categories[id]}
          </Link>
        ))}
        {footerVenues.map((venue) => (
          <Link
            key={venue.slug}
            href={`/${locale}/venue/${venue.slug}`}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            {venue.name}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">{dict.footer.tagline}</p>
      <p className="text-xs text-neutral-300 dark:text-neutral-600 mt-1">
        {dict.footer.builtWith}{" "}
        <a
          href="https://www.asemota.de"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors font-medium"
        >
          asemota
        </a>
        {" · "}
        <a
          href="https://brave.com/search/api/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          {dict.footer.searchByBrave}
        </a>
      </p>
    </footer>
  );
}
