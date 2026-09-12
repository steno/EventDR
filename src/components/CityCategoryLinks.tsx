"use client";

import { useEffect, useRef, type Ref } from "react";
import { IntentLink } from "@/components/IntentLink";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import { useCategoryAutoStepScroll } from "@/hooks/useCategoryAutoStepScroll";
import { scrollBehaviorPreference } from "@/lib/list-scroll";
import type { EventCategory } from "@/lib/types";

export type RelatedCategoryLink = {
  href: string;
  label: string;
  emoji?: string;
  /** Stable identity — keeps DOM/scroll when only the area in `href` changes. */
  id?: EventCategory | "all";
};

interface CityCategoryLinksProps {
  label: string;
  links: RelatedCategoryLink[];
  /** Highlights the selected category pill. */
  activeHref?: string;
  /**
   * Selected category id. Prefer this over parsing `activeHref` so area
   * soft-nav does not re-trigger active-pill scroll.
   */
  activeCategoryId?: EventCategory;
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
  activeCategoryId,
  allLink,
  onSoftNavigate,
}: CityCategoryLinksProps) {
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
  const pillCount = links.length + (allLink ? 1 : 0);
  useCategoryAutoStepScroll(scrollRef, pillCount);

  const activeKey =
    activeCategoryId ??
    (activeHref
      ? (links.find((link) => link.href === activeHref)?.id ?? activeHref)
      : "all");

  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    // Only recenter when the selected category changes — not when area soft-nav
    // rewrites the same pill's href (that remount jump used to yank the rail).
    if (prevActiveKeyRef.current === activeKey) return;
    prevActiveKeyRef.current = activeKey;

    // Keep the active pill in view on the mobile slider without jumping the page.
    active.scrollIntoView({
      behavior: scrollBehaviorPreference(),
      inline: "nearest",
      block: "nearest",
    });
  }, [activeKey]);

  if (links.length === 0) return null;

  const hasActiveCategory = activeCategoryId
    ? links.some((link) => link.id === activeCategoryId)
    : links.some((link) => link.href === activeHref);
  const allIsActive = Boolean(allLink) && !hasActiveCategory;

  const renderPill = (
    link: RelatedCategoryLink,
    active: boolean,
    ref?: Ref<HTMLAnchorElement>,
  ) => {
    return (
      <IntentLink
        key={link.id ?? link.href}
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
          <span className="text-[48px] leading-none select-none" aria-hidden>
            {link.emoji}
          </span>
        ) : null}
        <span className="line-clamp-2 w-full">{link.label}</span>
      </IntentLink>
    );
  };

  return (
    <nav aria-label={label} data-category-nav className="mb-6">
      <p className="mb-2.5 text-base font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </p>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div ref={scrollRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex w-max gap-3 px-0.5 py-1">
              {allLink
                ? renderPill(
                    { ...allLink, id: allLink.id ?? "all" },
                    allIsActive,
                    allIsActive ? activeRef : undefined,
                  )
                : null}
              {links.map((link) => {
                const active = activeCategoryId
                  ? link.id === activeCategoryId
                  : activeHref === link.href;
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
