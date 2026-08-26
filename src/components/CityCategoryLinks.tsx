"use client";

import { useEffect, useLayoutEffect, useRef, type Ref } from "react";
import { IntentLink } from "@/components/IntentLink";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import {
  scrollBehaviorPreference,
  scrollToListTop,
} from "@/lib/list-scroll";

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
  const scrolledHrefRef = useRef<string | null>(null);

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

  // Category landing: let the hero sit, then nudge down to the pills.
  // Cancel if the visitor already scrolled (or a pill/tab already parked).
  useEffect(() => {
    if (!activeHref) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const startY = window.scrollY;
    const userMovedPx = 24;
    if (startY > userMovedPx) return;

    let cancelled = false;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) >= userMovedPx) {
        cancelled = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const timeoutId = window.setTimeout(() => {
      window.removeEventListener("scroll", onScroll);
      if (cancelled) return;
      if (Math.abs(window.scrollY - startY) >= userMovedPx) return;
      scrollToListTop(undefined, { onlyScrollDown: true });
    }, 5000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", onScroll);
    };
    // Landing only — pill clicks park immediately via the layout effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same park as All/Today/Tomorrow/Weekend: after the user picks a pill,
  // tuck list chrome under the sticky header (only scroll down).
  useLayoutEffect(() => {
    const key = activeHref ?? "";
    if (scrolledHrefRef.current === null) {
      scrolledHrefRef.current = key;
      return;
    }
    if (scrolledHrefRef.current === key) return;
    scrolledHrefRef.current = key;
    scrollToListTop(undefined, { onlyScrollDown: true });
  }, [activeHref]);

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
          <span className="text-[48px] leading-none select-none" aria-hidden>
            {link.emoji}
          </span>
        ) : null}
        <span className="line-clamp-2 w-full">{link.label}</span>
      </IntentLink>
    );
  };

  return (
    <nav
      aria-label={label}
      className="mb-6"
      data-list-scroll-anchor
    >
      <p className="mb-2.5 text-base font-semibold text-neutral-700 dark:text-neutral-300">
        {label}
      </p>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
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
