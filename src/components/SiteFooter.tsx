import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { FooterInstallLink } from "@/components/FooterInstallLink";
import { CITIES, getCityName } from "@/lib/cities";
import { PAGE_WIDTH_CLASS } from "@/lib/page-shell";

interface SiteFooterProps {
  dict: Dictionary;
  locale: Locale;
  className?: string;
}

export function SiteFooter({ dict, locale, className = "pb-6" }: SiteFooterProps) {
  return (
    <footer
      className={`border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 pt-6 text-center ${className}`}
    >
      <nav
        aria-label={dict.browse.ariaLabel}
        className={`${PAGE_WIDTH_CLASS} mb-4 flex flex-wrap justify-center gap-x-3 gap-y-2 px-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400 sm:gap-x-4`}
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
          href={`/${locale}/when/tomorrow`}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {dict.time.tomorrow}
        </Link>
        <Link
          href={`/${locale}/when/weekend`}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {dict.time.weekend}
        </Link>
        <Link
          href={`/${locale}/for-partners`}
          className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          {dict.footer.partners}
        </Link>
        <FooterInstallLink dict={dict} />
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
      </p>
    </footer>
  );
}
