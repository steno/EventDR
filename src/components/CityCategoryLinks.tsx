import Link from "next/link";

export type RelatedCategoryLink = {
  href: string;
  label: string;
};

interface CityCategoryLinksProps {
  label: string;
  links: RelatedCategoryLink[];
  /** Highlights the selected category pill. */
  activeHref?: string;
}

export function CityCategoryLinks({
  label,
  links,
  activeHref,
}: CityCategoryLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      {/* Wrap so every category stays reachable and the active pill is never off-screen. */}
      <div className="flex flex-wrap gap-x-1.5 gap-y-1 sm:gap-2">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`
                rounded-full border px-3 py-0.5 text-[11px] leading-5 font-semibold
                transition-colors touch-manipulation
                sm:px-3.5 sm:py-1.5 sm:text-xs sm:leading-none
                ${
                  active
                    ? "border-orange-500 bg-transparent text-orange-600 dark:border-orange-400 dark:text-orange-400"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-600 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:border-neutral-500 dark:hover:text-white"
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
