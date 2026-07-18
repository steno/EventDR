"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type Ref,
} from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_PILL_ACTIVE,
  CATEGORY_PILL_BASE,
  CATEGORY_PILL_IDLE,
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
}

export function CityCategoryLinks({
  label,
  links,
  activeHref,
  allLink,
}: CityCategoryLinksProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

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
  }, [activeHref]);

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
          <Loader2 className="h-9 w-9 animate-spin shrink-0" aria-hidden />
        ) : link.emoji ? (
          <span className="text-4xl leading-none select-none" aria-hidden>
            {link.emoji}
          </span>
        ) : null}
        <span className="truncate w-full">{link.label}</span>
      </Link>
    );
  };

  return (
    <nav aria-label={label} className="mb-6">
      <p className="mb-2.5 text-xs font-bold uppercase tracking-widest text-neutral-400">
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
