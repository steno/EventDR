"use client";

import { useEffect, useRef, useState, type Ref } from "react";
import { IntentLink } from "@/components/IntentLink";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_DIMMED,
  CATEGORY_PILL_IDLE,
  CATEGORY_PILL_PENDING,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";
import {
  scrollToListTop,
} from "@/lib/list-scroll";
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

type RailScrollResult = "pending" | "done";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Center `pill` in the horizontal scroller without scrolling the page. */
function scrollActivePillIntoRail(
  scroller: HTMLElement,
  pill: HTMLElement,
  behavior: ScrollBehavior,
): RailScrollResult {
  // Rail not measured yet (common on hard-nav from home before first layout).
  if (scroller.clientWidth <= 0 || pill.offsetWidth <= 0) return "pending";

  const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
  const pillRect = pill.getBoundingClientRect();
  const scrollerRect = scroller.getBoundingClientRect();
  const outside =
    pillRect.right > scrollerRect.right + 4 ||
    pillRect.left < scrollerRect.left - 4;

  // scrollWidth can lag one frame behind pill geometry on hard-nav from home.
  if (max <= 0) return outside ? "pending" : "done";

  const pillOffset = pillRect.left - scrollerRect.left + scroller.scrollLeft;
  const nextLeft = Math.max(
    0,
    Math.min(pillOffset - (scroller.clientWidth - pill.offsetWidth) / 2, max),
  );
  if (Math.abs(scroller.scrollLeft - nextLeft) >= 2) {
    scroller.scrollTo({ left: nextLeft, behavior });
  }
  return "done";
}

function pillKey(link: RelatedCategoryLink): string {
  return link.id ?? link.href;
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
  const navRef = useRef<HTMLElement>(null);
  const prevActiveKeyRef = useRef<string | null>(null);
  /** User soft-tap — highlight in place, then smooth-slide to center. */
  const softTapKeyRef = useRef<string | null>(null);
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const activeKey =
    activeCategoryId ??
    (activeHref
      ? (links.find((link) => link.href === activeHref)?.id ?? activeHref)
      : "all");
  const hasSelectedCategory = Boolean(activeCategoryId ?? activeHref);

  const clearPending = () => {
    softTapKeyRef.current = null;
    setPendingKey(null);
  };

  // Keep the active pill in the rail. Hard-nav from home (late pills that were
  // off-screen in the home slider) often runs before overflow is measured —
  // retry until layout is ready. Soft-nav already has a warm layout: paint the
  // press highlight first, then smooth-slide the tapped pill to center.
  useEffect(() => {
    if (prevActiveKeyRef.current === activeKey) return;

    let cancelled = false;
    let rafId = 0;
    let tries = 0;
    let settleId = 0;
    let clearId = 0;
    let scrollEndTarget: HTMLElement | null = null;
    let centered = false;

    const softTapKey = softTapKeyRef.current;
    const isSoftTap = softTapKey != null && softTapKey === String(activeKey);
    const behavior: ScrollBehavior =
      isSoftTap && !prefersReducedMotion() ? "smooth" : "auto";

    const finishSoftTap = () => {
      if (cancelled) return;
      if (scrollEndTarget) {
        scrollEndTarget.removeEventListener("scrollend", finishSoftTap);
        scrollEndTarget = null;
      }
      if (clearId) window.clearTimeout(clearId);
      clearPending();
      prevActiveKeyRef.current = activeKey;
    };

    const attempt = () => {
      if (cancelled || centered) return false;
      const active = activeRef.current;
      const scroller = scrollRef.current;
      if (!active || !scroller) return false;
      const result = scrollActivePillIntoRail(scroller, active, behavior);
      if (result !== "done") return false;
      centered = true;

      if (isSoftTap) {
        // Keep press chrome through the slide; clear when motion settles.
        if (behavior === "smooth") {
          scrollEndTarget = scroller;
          scroller.addEventListener("scrollend", finishSoftTap);
          clearId = window.setTimeout(finishSoftTap, 450);
        } else {
          finishSoftTap();
        }
      } else {
        prevActiveKeyRef.current = activeKey;
      }
      return true;
    };

    const tick = () => {
      if (cancelled) return;
      if (attempt()) return;
      if (tries++ < 30) rafId = requestAnimationFrame(tick);
    };

    if (isSoftTap) {
      // Two frames: commit pending styles, then start the slide.
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(tick);
      });
      // Failsafe if layout never reports ready.
      settleId = window.setTimeout(() => {
        if (cancelled || centered) return;
        if (!attempt()) finishSoftTap();
      }, 500);
    } else {
      tick();
      // After land-park / hero layout, force one more center for late pills.
      settleId = window.setTimeout(() => {
        if (cancelled) return;
        const active = activeRef.current;
        const scroller = scrollRef.current;
        if (!active || !scroller) return;
        scrollActivePillIntoRail(scroller, active, "auto");
        prevActiveKeyRef.current = activeKey;
      }, 200);
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(settleId);
      window.clearTimeout(clearId);
      if (scrollEndTarget) {
        scrollEndTarget.removeEventListener("scrollend", finishSoftTap);
      }
    };
  }, [activeKey]);

  // Home → category: skip the hero and park the icon row under the sticky
  // header so the active pill stays on screen. onlyScrollDown avoids yanking
  // up after detail→back scroll restoration mid-list.
  useEffect(() => {
    if (!hasSelectedCategory) return;

    const timeoutId = window.setTimeout(() => {
      const nav = navRef.current;
      if (!nav) return;
      scrollToListTop(nav, { onlyScrollDown: true });
    }, 150);

    return () => window.clearTimeout(timeoutId);
    // Landing only — soft category swaps keep the rail in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    const key = pillKey(link);
    const pending = pendingKey === key;
    // Soft-nav: skip sibling dim — opacity bounce makes idle borders flash.
    const dimmed =
      !onSoftNavigate && pendingKey != null && pendingKey !== key;
    return (
      <IntentLink
        key={key}
        ref={ref}
        href={link.href}
        scroll={false}
        data-soft-nav={onSoftNavigate ? "1" : undefined}
        aria-current={active ? "page" : undefined}
        aria-busy={pending || undefined}
        aria-label={link.label}
        className={`${CATEGORY_PILL_BASE} ${active ? CATEGORY_PILL_ACTIVE : CATEGORY_PILL_IDLE}${
          pending ? ` ${CATEGORY_PILL_PENDING}` : ""
        }${dimmed ? ` ${CATEGORY_PILL_DIMMED}` : ""}`}
        onClick={(event) => {
          const keyNow = pillKey(link);
          setPendingKey(keyNow);
          if (!onSoftNavigate) return;
          if (event.defaultPrevented) return;
          if (event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
          }
          if (onSoftNavigate(link.href)) {
            event.preventDefault();
            // Drop focus so a focus ring can't flash on a neighbor after the rail moves.
            event.currentTarget.blur();
            if (keyNow === String(activeKey)) {
              // Already selected — no slide; drop busy chrome next paint.
              requestAnimationFrame(clearPending);
              return;
            }
            softTapKeyRef.current = keyNow;
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
    <nav ref={navRef} aria-label={label} data-category-nav className="mb-6">
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
