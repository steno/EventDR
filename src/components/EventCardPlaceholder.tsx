"use client";

import { ChevronRight, Plus } from "lucide-react";
import { IntentLink } from "@/components/IntentLink";
import type { EventListView } from "@/lib/event-list-view";
import { CARD_GRID_FULL_ROW_CLASS } from "@/lib/page-shell";

/**
 * Minimum list “slots” so short tabs have enough document height for
 * scrollToListTop to park the filter bar under the sticky header.
 * Extra height beyond one CTA uses a silent spacer — not duplicate cards.
 */
export const LIST_SCROLL_PAD_TARGET = 3;

/** Approximate card/list row heights for silent scroll padding. */
const CARD_SLOT_MIN_HEIGHT = "14rem";
const LIST_SLOT_MIN_HEIGHT = "4.75rem";

/** Span leftover last-row columns, or the full next row. */
export type GridFillSpan = number | "full";

interface EventCardPlaceholderProps {
  title: string;
  label: string;
  onClick?: () => void;
  /** Prefer for mailto / external — renders an anchor instead of a button. */
  href?: string;
  view?: EventListView;
  fillSpan?: GridFillSpan;
  /** Default list cards use 4/3; home highlight rails use 16/10 → 3/2. */
  mediaAspectClass?: string;
  /**
   * Fill the grid cell height (match a neighbor highlight card) instead of a
   * fixed aspect box — used for featured-placement promos.
   */
  stretch?: boolean;
}

const PLACEHOLDER_TILE_CLASS = `
  group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
  border border-dashed border-neutral-300 bg-neutral-50
  transition-colors touch-manipulation
  hover:border-orange-400 hover:bg-orange-50/70
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
  dark:border-neutral-600 dark:bg-neutral-900/60
  dark:hover:border-orange-500/60 dark:hover:bg-orange-950/30
`;

const MORE_BAR_CLASS = `
  ${CARD_GRID_FULL_ROW_CLASS}
  flex min-h-14 items-center justify-center gap-1.5 rounded-2xl
  border border-neutral-200 bg-white px-5 text-center
  text-sm font-bold text-neutral-800
  transition-colors touch-manipulation
  hover:border-orange-300 hover:bg-orange-50/70 hover:text-orange-600
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
  dark:border-neutral-700 dark:bg-neutral-900
  dark:text-neutral-200 dark:hover:border-orange-800 dark:hover:bg-orange-950/30 dark:hover:text-orange-400
`;

const MORE_PILL_CLASS = `
  inline-flex items-center gap-1 rounded-full
  border border-neutral-200 dark:border-neutral-700
  bg-white dark:bg-neutral-900 px-5 py-2.5
  text-sm font-bold text-neutral-800 dark:text-neutral-200
  hover:border-orange-300 dark:hover:border-orange-800
  hover:text-orange-600 dark:hover:text-orange-400
  transition-colors touch-manipulation
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
`;

interface EventListMoreTileProps {
  label: string;
  view?: EventListView;
  href?: string;
  onClick?: () => void;
}

function fillSpanStyle(
  fillSpan: GridFillSpan | undefined,
): { gridColumn: string } | undefined {
  if (fillSpan === "full") return { gridColumn: "1 / -1" };
  if (typeof fillSpan === "number" && fillSpan > 1) {
    return { gridColumn: `span ${fillSpan}` };
  }
  return undefined;
}

/** Load-more control: full-width bar in card grids, compact pill in list view. */
export function EventListMoreTile({
  label,
  view = "cards",
  href,
  onClick,
}: EventListMoreTileProps) {
  const content = (
    <>
      {label}
      <ChevronRight className="h-4 w-4" aria-hidden />
    </>
  );

  if (view === "cards") {
    if (href) {
      return (
        <IntentLink href={href} className={MORE_BAR_CLASS}>
          {content}
        </IntentLink>
      );
    }
    return (
      <button type="button" onClick={onClick} className={MORE_BAR_CLASS}>
        {content}
      </button>
    );
  }

  const pill = href ? (
    <IntentLink href={href} className={MORE_PILL_CLASS}>
      {content}
    </IntentLink>
  ) : (
    <button type="button" onClick={onClick} className={MORE_PILL_CLASS}>
      {content}
    </button>
  );

  return <div className="pt-1 text-center">{pill}</div>;
}

/** Inviting “add your event” / feature promo tile — one per short list. */
export function EventCardPlaceholder({
  title,
  label,
  onClick,
  href,
  view = "cards",
  fillSpan,
  mediaAspectClass = "aspect-[4/3]",
  stretch = false,
}: EventCardPlaceholderProps) {
  if (view === "cards") {
    const spanning = fillSpan === "full" || (typeof fillSpan === "number" && fillSpan > 1);
    const className = spanning
      ? `${PLACEHOLDER_TILE_CLASS} w-full ${fillSpan === "full" ? CARD_GRID_FULL_ROW_CLASS : ""}`
      : `${PLACEHOLDER_TILE_CLASS} w-full`;
    const body = (
      <div
        className={
          stretch || spanning
            ? "flex min-h-[10rem] w-full flex-1 flex-col items-center justify-center gap-3 px-6 py-8 sm:min-h-0"
            : `flex ${mediaAspectClass} w-full flex-col items-center justify-center gap-3 px-4`
        }
      >
        <span
          className="
            flex h-11 w-11 items-center justify-center rounded-full
            border border-neutral-300 bg-white text-neutral-600
            transition-colors
            group-hover:border-orange-400 group-hover:text-orange-600
            dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300
            dark:group-hover:border-orange-500/70 dark:group-hover:text-orange-400
          "
          aria-hidden
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <span className="text-center">
          <span className="block text-base font-bold leading-snug text-neutral-700 dark:text-neutral-200 sm:text-lg">
            {title}
          </span>
          <span className="mt-1 block max-w-sm text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400 sm:text-sm">
            {label}
          </span>
        </span>
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          className={className}
          style={fillSpanStyle(fillSpan)}
        >
          {body}
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={onClick}
        className={className}
        style={fillSpanStyle(fillSpan)}
      >
        {body}
      </button>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className="
          group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5
          border border-dashed border-neutral-300 bg-neutral-50
          transition-colors touch-manipulation
          hover:border-orange-400 hover:bg-orange-50/70
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
          dark:border-neutral-600 dark:bg-neutral-900/60
          dark:hover:border-orange-500/60 dark:hover:bg-orange-950/30
        "
      >
        <span
          className="
            flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
            border border-neutral-300 bg-white text-neutral-600
            transition-colors
            group-hover:border-orange-400 group-hover:text-orange-600
            dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300
            dark:group-hover:border-orange-500/70 dark:group-hover:text-orange-400
          "
          aria-hidden
        >
          <Plus className="h-5 w-5" strokeWidth={2.25} />
        </span>
        <span className="min-w-0 text-left">
          <span className="block text-sm font-bold text-neutral-700 dark:text-neutral-200">
            {title}
          </span>
          <span className="mt-0.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
        </span>
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative flex w-full items-center gap-3 rounded-2xl px-3.5 py-2.5
        border border-dashed border-neutral-300 bg-neutral-50
        transition-colors touch-manipulation
        hover:border-orange-400 hover:bg-orange-50/70
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
        dark:border-neutral-600 dark:bg-neutral-900/60
        dark:hover:border-orange-500/60 dark:hover:bg-orange-950/30
      "
    >
      <span
        className="
          flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full
          border border-neutral-300 bg-white text-neutral-600
          transition-colors
          group-hover:border-orange-400 group-hover:text-orange-600
          dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300
          dark:group-hover:border-orange-500/70 dark:group-hover:text-orange-400
        "
        aria-hidden
      >
        <Plus className="h-5 w-5" strokeWidth={2.25} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-base font-bold leading-snug text-neutral-700 dark:text-neutral-200">
          {title}
        </span>
        <span className="mt-0.5 block text-xs font-medium leading-snug text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
      </span>
    </button>
  );
}

/** Invisible height so short lists can still scroll the filter bar under the header. */
function ListScrollSpacer({
  slots,
  view,
}: {
  slots: number;
  view: EventListView;
}) {
  if (slots <= 0) return null;
  const slotHeight = view === "cards" ? CARD_SLOT_MIN_HEIGHT : LIST_SLOT_MIN_HEIGHT;
  return (
    <div
      className="pointer-events-none col-span-full"
      style={{ minHeight: `calc(${slots} * ${slotHeight})` }}
      aria-hidden
    />
  );
}

/**
 * At most one CTA card, plus a silent spacer for remaining scroll height.
 * Never renders duplicate “add event” tiles.
 */
export function EventListScrollPads({
  count,
  title,
  label,
  onAddEvent,
  view = "cards",
  fillSpan,
}: {
  count: number;
  title: string;
  label: string;
  onAddEvent?: () => void;
  view?: EventListView;
  fillSpan?: GridFillSpan;
}) {
  const deficit = Math.max(0, LIST_SCROLL_PAD_TARGET - count);
  if (deficit === 0) return null;

  const showCta = Boolean(onAddEvent);
  const spacerSlots = showCta ? deficit - 1 : deficit;

  return (
    <>
      {showCta && onAddEvent ? (
        <EventCardPlaceholder
          title={title}
          label={label}
          onClick={onAddEvent}
          view={view}
          fillSpan={fillSpan}
        />
      ) : null}
      <ListScrollSpacer slots={spacerSlots} view={view} />
    </>
  );
}
