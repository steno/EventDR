import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { CATEGORY_IDS } from "@/lib/categories";
import { CITIES, getCityName } from "@/lib/cities";
import { SEED_VENUES } from "@/lib/venues-seed";

interface SiteFooterProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

const FOOTER_VENUE_COUNT = 6;

export function SiteFooter({ dict, locale, className = "" }: SiteFooterProps) {
  const footerVenues = SEED_VENUES.slice(0, FOOTER_VENUE_COUNT);

  return (
    <footer
      className={`border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-center ${className}`}
    >
      <nav
        aria-label={dict.browse.ariaLabel}
        className="mx-auto mb-4 flex max-w-lg flex-wrap justify-center gap-x-3 gap-y-2 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:gap-x-4"
      >
        {CITIES.map((city) => (
          <Link
            key={city.slug}
            href={`/${locale}/city/${city.slug}`}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            {getCityName(city, locale)}
          </Link>
        ))}
        <Link
          href={`/${locale}/when/today`}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {dict.time.today}
        </Link>
        <Link
          href={`/${locale}/when/weekend`}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {dict.time.weekend}
        </Link>
        <span className="hidden sm:contents">
          <Link href={`/${locale}`} className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
            {dict.hero.events}
          </Link>
          {CATEGORY_IDS.map((id) => (
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
        </span>
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
