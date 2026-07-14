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
      <div className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`
                rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors
                ${
                  active
                    ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-950/40 dark:text-orange-300"
                    : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:text-neutral-100"
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
