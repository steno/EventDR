"use client";

import Link from "next/link";
import { ChevronRight, Loader2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type Ref,
} from "react";
import { useRouter } from "next/navigation";
import { HorizontalScrollEdgeFades } from "@/components/HorizontalScrollEdgeFades";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
  CATEGORY_SCROLL_BTN,
  CATEGORY_SCROLLER_BAR,
} from "@/components/category-scroller-styles";

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
  scrollHint: string;
}

export function CityCategoryLinks({
  label,
  links,
  activeHref,
  allLink,
  scrollHint,
}: CityCategoryLinksProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const syncScrollHints = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 4) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const left = el.scrollLeft;
    setCanScrollLeft(left > 4);
    setCanScrollRight(left < maxScroll - 4);
  }, []);

  useEffect(() => {
    syncScrollHints();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => syncScrollHints();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncScrollHints, links, allLink]);

  useEffect(() => {
    const active = activeRef.current;
    if (!active) return;

    // Keep the active pill in view on the mobile slider without jumping the page.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    active.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "nearest",
      block: "nearest",
    });
    // Scroll may be async; refresh fades after layout settles.
    requestAnimationFrame(syncScrollHints);
  }, [activeHref, syncScrollHints]);

  // Scroll to the time filter tabs on mount when navigating from home page.
  // This ensures users see the tabs (All, Today, Tomorrow, Weekend) after clicking a category pill.
  useEffect(() => {
    if (!activeHref) return;

    // Only scroll on initial mount, not on subsequent activeHref changes
    const timeoutId = setTimeout(() => {
      // Find the time filter section (marked with data-list-scroll-anchor)
      const target = document.querySelector<HTMLElement>("[data-list-scroll-anchor]");
      if (!target) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      
      // Calculate offset to account for sticky header
      const headerHeight = parseInt(
        getComputedStyle(document.documentElement)
          .getPropertyValue("--sticky-list-header-height") || "0",
        10
      );
      
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const targetScroll = Math.max(0, targetTop - headerHeight - 8); // 8px padding
      
      window.scrollTo({
        top: targetScroll,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }, 150); // Small delay to ensure layout is stable

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps = run only on mount

  if (links.length === 0) return null;

  const hasActiveCategory = links.some((link) => link.href === activeHref);
  const allIsActive = Boolean(allLink) && !hasActiveCategory;

  const scrollForward = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(280, Math.max(160, el.clientWidth * 0.55));
    el.scrollBy({ left: step, behavior: "smooth" });
  };

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setLoadingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const renderPill = (
    link: RelatedCategoryLink,
    active: boolean,
    ref?: Ref<HTMLAnchorElement>,
  ) => {
    const isLoading = isPending && loadingHref === link.href;
    
    return (
      <Link
        key={link.href}
        ref={ref}
        href={link.href}
        scroll={false}
        onClick={(e) => handleNavigation(e, link.href)}
        aria-current={active ? "page" : undefined}
        aria-label={link.label}
        className={`${CATEGORY_PILL_BASE} ${active ? CATEGORY_PILL_ACTIVE : CATEGORY_PILL_IDLE} ${isLoading ? "opacity-70" : ""}`}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" aria-hidden />
        ) : link.emoji ? (
          <span className="shrink-0 text-sm leading-none select-none" aria-hidden>
            {link.emoji}
          </span>
        ) : null}
        <span className="whitespace-nowrap">{link.label}</span>
      </Link>
    );
  };

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
        {label}
      </p>
      <div className={CATEGORY_SCROLLER_BAR}>
        <div className="relative min-w-0 flex-1 overflow-hidden rounded-full">
          <div
            ref={scrollerRef}
            onScroll={syncScrollHints}
            className="overflow-x-auto scrollbar-hide"
          >
            <div className="flex w-max gap-1.5 px-0.5">
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

          <HorizontalScrollEdgeFades
            canScrollLeft={canScrollLeft}
            canScrollRight={canScrollRight}
            tone="bar"
          />
        </div>

        {canScrollRight ? (
          <button
            type="button"
            onClick={scrollForward}
            className={CATEGORY_SCROLL_BTN}
            aria-label={scrollHint}
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    </nav>
  );
}
