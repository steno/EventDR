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
      <div className="-mx-1 flex flex-nowrap gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {links.map((link) => {
          const active = activeHref === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              scroll={false}
              aria-current={active ? "page" : undefined}
              className={`
                shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors
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
