import Link from "next/link";

export type RelatedCategoryLink = {
  href: string;
  label: string;
};

interface CityCategoryLinksProps {
  label: string;
  links: RelatedCategoryLink[];
}

export function CityCategoryLinks({ label, links }: CityCategoryLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors hover:border-neutral-300 dark:hover:border-neutral-600 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
