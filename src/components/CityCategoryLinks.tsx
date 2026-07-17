"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

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
  const activeRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    // Keep the active pill in view on the mobile slider without jumping the page.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    active.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeHref]);

  if (links.length === 0) return null;

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:gap-2.5">
          {links.map((link) => {
            const active = activeHref === link.href;
            return (
              <Link
                key={link.href}
                ref={active ? activeRef : undefined}
                href={link.href}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`
                  shrink-0 rounded-full border px-4 py-2 text-sm leading-none font-semibold
                  transition-colors touch-manipulation
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
      </div>
    </nav>
  );
}
