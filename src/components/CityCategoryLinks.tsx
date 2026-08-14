"use client";

import { useEffect, useRef, type Ref } from "react";
import { IntentLink } from "@/components/IntentLink";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import {
  readDocumentTop,
  readStickyListHeaderReserve,
  scrollBehaviorPreference,
  scrollToListTop,
} from "@/lib/list-scroll";
import { getScrollChromeVisible } from "@/lib/scroll-chrome";

export type RelatedCategoryLink = {
  href: string;
  label: string;
  emoji?: string;
};

interface CityCategoryLinksProps {
  label: string;
  links: RelatedCategoryLink[];
  /** Highlights the selected category pill. */
  activeHref?: string;
  /** Leading “All Events” pill — active when no category href matches. */
  allLink?: RelatedCategoryLink;
  /**
   * Instant in-page scope swap (no RSC). Return true when handled so the
   * default link navigation is skipped.
   */
  onSoftNavigate?: (href: string) => boolean;
}

export function CityCategoryLinks({
  label,
  links,
  activeHref,
  allLink,
  onSoftNavigate,
}: CityCategoryLinksProps) {
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    // Keep the active pill in view on the mobile slider without jumping the page.
    active.scrollIntoView({
      behavior: scrollBehaviorPreference(),
      inline: "nearest",
      block: "nearest",
    });
  }, [activeHref]);

  // On mount (home → category), skip the hero and park the category icon row
  // under the sticky header — same target as time-tab switches (scrollToListTop).
  // Skip when already parked there (area-chip swaps keep scroll via scroll:false).
  useEffect(() => {
    if (!activeHref) return;

    const timeoutId = setTimeout(() => {
      const nav = navRef.current;
      if (!nav) return;

      const targetScroll = Math.max(
        0,
        readDocumentTop(nav) - readStickyListHeaderReserve(),
      );

      // Area chips navigate with scroll:false while the user is already on the
      // list chrome — re-animating here is the flash. Home → category still
      // starts near the top, so this still scrolls past the hero.
      // If chrome hid during a prior park, re-run so the header covers the gap.
      if (
        Math.abs(window.scrollY - targetScroll) < 64 &&
        getScrollChromeVisible()
      ) {
        return;
      }

      scrollToListTop(nav);
    }, 150); // Small delay to ensure layout is stable

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps = run only on mount

  if (links.length === 0) return null;

  const hasActiveCategory = links.some((link) => link.href === activeHref);
  const allIsActive = Boolean(allLink) && !hasActiveCategory;

  const renderPill = (
    link: RelatedCategoryLink,
    active: boolean,
    ref?: Ref<HTMLAnchorElement>,
  ) => {
    return (
      <IntentLink
        key={link.href}
        ref={ref}
        href={link.href}
        scroll={false}
        data-soft-nav={onSoftNavigate ? "1" : undefined}
        aria-current={active ? "page" : undefined}
        aria-label={link.label}
        className={`${CATEGORY_PILL_BASE} ${active ? CATEGORY_PILL_ACTIVE : CATEGORY_PILL_IDLE}`}
        onClick={(event) => {
          if (!onSoftNavigate) return;
          if (event.defaultPrevented) return;
          if (event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          if (onSoftNavigate(link.href)) {
            event.preventDefault();
          }
        }}
      >
        {link.emoji ? (
          <span className="text-4xl leading-none select-none" aria-hidden>
            {link.emoji}
          </span>
        ) : null}
        <span className="line-clamp-2 w-full">{link.label}</span>
      </IntentLink>
    );
  };

  return (
    <nav
      ref={navRef}
      aria-label={label}
      className="mb-6"
      data-list-scroll-anchor
    >
      <p className="mb-2.5 text-base font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </p>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            ref={scrollerRef}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="flex w-max gap-3 px-0.5 py-1">
              {allLink
                ? renderPill(
                    allLink,
                    allIsActive,
                    allIsActive ? activeRef : undefined,
                  )
                : null}
              {links.map((link) => {
                const active = activeHref === link.href;
                return renderPill(
                  link,
                  active,
                  active ? activeRef : undefined,
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
