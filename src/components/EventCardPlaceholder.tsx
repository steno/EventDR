import { Plus } from "lucide-react";
import type { EventListView } from "@/lib/event-list-view";

/**
 * Minimum list “slots” so short tabs have enough document height for
 * scrollToListTop to park the filter bar under the sticky header.
 * Extra height beyond one CTA uses a silent spacer — not duplicate cards.
 */
export const LIST_SCROLL_PAD_TARGET = 3;

/** Approximate card/list row heights for silent scroll padding. */
const CARD_SLOT_MIN_HEIGHT = "14rem";
const LIST_SLOT_MIN_HEIGHT = "5.5rem";

interface EventCardPlaceholderProps {
  title: string;
  label: string;
  onClick: () => void;
  view?: EventListView;
}

/** Inviting “add your event” tile — one per short list, never duplicated. */
export function EventCardPlaceholder({
  title,
  label,
  onClick,
  view = "cards",
}: EventCardPlaceholderProps) {
  if (view === "cards") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="
          group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl
          border border-dashed border-neutral-300 bg-neutral-50
          transition-colors touch-manipulation
          hover:border-orange-400 hover:bg-orange-50/70
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
          dark:border-neutral-600 dark:bg-neutral-900/60
          dark:hover:border-orange-500/60 dark:hover:bg-orange-950/30
        "
      >
        <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 px-4">
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
            <span className="block text-[15px] font-bold leading-snug text-neutral-700 dark:text-neutral-200">
              {title}
            </span>
            <span className="mt-1 block text-[13px] font-medium leading-snug text-neutral-500 dark:text-neutral-400">
              {label}
            </span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group relative flex w-full items-center gap-3.5 rounded-2xl px-4 py-[1.125rem]
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
          flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full
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
        <span className="block text-[15px] font-bold leading-snug text-neutral-700 dark:text-neutral-200">
          {title}
        </span>
        <span className="mt-0.5 block text-[13px] font-medium leading-snug text-neutral-500 dark:text-neutral-400">
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
}: {
  count: number;
  title: string;
  label: string;
  onAddEvent?: () => void;
  view?: EventListView;
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
        />
      ) : null}
      <ListScrollSpacer slots={spacerSlots} view={view} />
    </>
  );
}
