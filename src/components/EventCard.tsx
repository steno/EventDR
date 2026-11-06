import { memo } from "react";
import { ChevronDown, Flame } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { ImageStoryEnlarge } from "@/components/ImageStoryEnlarge";
import { EventCardMeta } from "@/components/EventCardMeta";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { IntentLink } from "@/components/IntentLink";
import { getCategoryMeta } from "@/lib/categories";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import {
  eventDetailPath,
  rememberReturnPath,
} from "@/lib/event-navigation";
import { EventCallLink } from "@/components/EventCallLink";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import type { EventLiveStatus } from "@/lib/event-status";
import type { TimeRange } from "@/lib/filters";
import type { EventListView } from "@/lib/event-list-view";
import type { EventWithVenueSiblings } from "@/lib/venue-recurring-siblings";
import { getEventCardObjectPosition } from "@/lib/event-images";
import { formatEventDateRange } from "@/lib/format-date";
import { formatEventPlace } from "@/lib/event-location";
import { formatEventTimeForList } from "@/lib/event-time-display";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { CARD_GRID_FULL_ROW_CLASS } from "@/lib/page-shell";
import type { GridFillSpan } from "@/lib/card-grid";

interface EventCardProps {
  event: EventWithVenueSiblings;
  dict: Dictionary;
  locale: Locale;
  returnTo?: string;
  returnTitle?: string | null;
  compact?: boolean;
  listTimeRange?: TimeRange;
  /** List = horizontal row; cards = image-forward grid tile. */
  view?: EventListView;
  /** Extra guest hint (e.g. cruise walk/taxi + visit time). */
  note?: string;
  /** Tap-to-navigate busy state (orange ring until the detail page mounts). */
  pending?: boolean;
  /** Soften sibling cards while another is pending. */
  dimmed?: boolean;
  /** Fired on navigate so the parent can set `pending`. */
  onNavigate?: () => void;
  /** Story enlarge control on card images (off on category grids). */
  showEnlarge?: boolean;
  /**
   * Image-only tile (map pin sheet) — hide title + meta; parent owns chrome.
   */
  mediaOnly?: boolean;
  /**
   * Map pin sheet: expand chrome via “Read more” (image tap enlarges when
   * `showEnlarge` is on).
   */
  onMediaActivate?: () => void;
  /** `aria-expanded` when the parent sheet is open. */
  mediaExpanded?: boolean;
  /**
   * Stretch across leftover columns on the 2-col grid (Weekend day groups /
   * short final rows). Desktop auto-fill keeps span 1 so tiles stay compact.
   */
  fillSpan?: GridFillSpan;
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

function EventCardMedia({
  event,
  emoji,
  gradient,
  sizes,
  imageClassName,
  frameClassName,
  emojiClassName,
  enlargeLabel,
  closeLabel,
  showEnlarge = true,
  enlargeHitArea = "control",
  statusBadge = null,
  mediaAction = null,
}: {
  event: EventWithVenueSiblings;
  emoji: string;
  gradient: string;
  sizes: string;
  imageClassName: string;
  frameClassName: string;
  emojiClassName?: string;
  enlargeLabel: string;
  closeLabel: string;
  showEnlarge?: boolean;
  enlargeHitArea?: "control" | "media";
  statusBadge?: { label: string; status: EventLiveStatus } | null;
  /** Map pin sheet CTA on the photo (e.g. Read more → expand). */
  mediaAction?: { label: string; onClick: () => void } | null;
}) {
  const frame = `
    relative overflow-hidden pointer-events-none
    ${event.imageUrl ? "bg-neutral-100 dark:bg-neutral-800" : `bg-gradient-to-br ${gradient}`}
    ${frameClassName}
  `;
  const media = event.imageUrl ? (
    <EventImage
      src={event.imageUrl}
      alt=""
      sizes={sizes}
      className={imageClassName}
    />
  ) : (
    <div
      className={`flex h-full w-full items-center justify-center ${emojiClassName ?? "text-4xl"}`}
      aria-hidden
    >
      {emoji}
    </div>
  );

  return (
    <div className={frame} aria-hidden={!event.imageUrl || undefined}>
      {/* Fill the aspect box so absolute badges anchor to the photo, not a collapsed frame. */}
      <div className="absolute inset-0">{media}</div>
      {event.imageUrl && showEnlarge ? (
        <ImageStoryEnlarge
          src={event.imageUrl}
          alt={event.title}
          enlargeLabel={enlargeLabel}
          closeLabel={closeLabel}
          hitArea={enlargeHitArea}
          showOnDesktop={enlargeHitArea === "media"}
        />
      ) : null}
      {statusBadge || mediaAction ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-2 p-2">
          <div className="min-w-0 shrink">
            {statusBadge ? (
              <EventStatusBadge
                label={statusBadge.label}
                status={statusBadge.status}
                surface="onMedia"
              />
            ) : null}
          </div>
          {mediaAction ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                mediaAction.onClick();
              }}
              className="pointer-events-auto relative z-30 inline-flex max-w-[55%] shrink-0 items-center gap-1 rounded-full bg-black/65 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-md backdrop-blur-sm transition-colors hover:bg-black/80 touch-manipulation"
            >
              <span className="truncate">{mediaAction.label}</span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

const EventCardComponent = ({
  event,
  dict,
  locale,
  returnTo,
  returnTitle = null,
  compact = true,
  listTimeRange,
  view = "cards",
  note,
  pending = false,
  dimmed = false,
  onNavigate,
  showEnlarge = true,
  mediaOnly = false,
  onMediaActivate,
  mediaExpanded = false,
  fillSpan,
}: EventCardProps) => {
  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const href = eventDetailPath(locale, event.id);
  const liveDisplay = useLiveStatusDisplay(event, dict, { listTimeRange });
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const isEndedToday = liveStatus === "ended";
  const isCards = view === "cards";
  const spanning =
    fillSpan === "full" || (typeof fillSpan === "number" && fillSpan > 1);
  /** Full-bleed image tap collapses only when enlarge is off. */
  const activateMedia =
    mediaOnly && onMediaActivate != null && !showEnlarge;

  function handleNavigate() {
    onNavigate?.();
    rememberReturnPath(returnTo, returnTitle);
  }

  // Overlay IntentLink owns :active — style the article via :has(a:active).
  const idleChrome = `
    hover:border-orange-300 hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.25)]
    dark:hover:border-orange-800 dark:hover:shadow-[0_8px_24px_-8px_rgba(251,146,60,0.3)]
    has-[a:active]:scale-[0.99] has-[a:active]:border-orange-400
    dark:has-[a:active]:border-orange-500
    has-[button:active]:scale-[0.99] has-[button:active]:border-orange-400
    dark:has-[button:active]:border-orange-500
  `;
  const pendingChrome =
    "scale-[0.985] border-orange-400 shadow-[0_12px_32px_-16px_rgba(251,146,60,0.45)] ring-2 ring-orange-500/80 dark:border-orange-500 dark:ring-orange-400/70";
  const dimmedChrome = "opacity-45";

  if (isCards) {
    const titleId = `event-card-title-${event.id}`;
    const peekStatus: EventLiveStatus | null = event.temporarilyClosed
      ? "temporarilyClosed"
      : event.soldOut
        ? "soldOut"
        : liveStatus;
    const peekStatusLabel = event.temporarilyClosed
      ? dict.events.temporarilyClosed
      : event.soldOut
        ? dict.events.soldOut
        : liveStatusLabel;
    const dateLabel = formatEventDateRange(event.date, locale, {
      endDate: event.endDate,
      short: true,
    });
    const timeLabel = formatEventTimeForList(event.time, {
      recurrence: event.recurrence,
      allDayLabel: dict.events.allDay,
    });
    const recurrenceLabel = formatRecurrenceLabel(event, locale, dict);
    const placeLabel = formatEventPlace(event);
    const categoryLabel = category?.label ?? dict.categories[event.category];

    return (
      <article
        className={`
          group relative flex h-full min-w-0 flex-col overflow-hidden rounded-xl
          bg-neutral-100 dark:bg-neutral-900
          ${
            mediaOnly
              ? "border-0 shadow-none"
              : "ring-1 ring-black/5 dark:ring-white/10"
          }
          transition-[box-shadow,opacity,transform,ring-color] duration-300 ease-out cursor-pointer
          ${
            pending
              ? pendingChrome
              : dimmed
                ? dimmedChrome
                : mediaOnly
                  ? idleChrome
                  : "hover:ring-orange-400/50 dark:hover:ring-orange-500/40"
          }
          ${isEndedToday && !pending ? "opacity-60" : ""}
          ${fillSpan === "full" ? CARD_GRID_FULL_ROW_CLASS : ""}
        `}
        style={fillSpanStyle(fillSpan)}
        aria-busy={pending || undefined}
      >
        {activateMedia ? (
          <button
            type="button"
            onClick={onMediaActivate}
            className="absolute inset-0 z-0 rounded-xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            aria-labelledby={mediaOnly ? undefined : titleId}
            aria-label={mediaOnly ? event.title : undefined}
            aria-expanded={mediaExpanded}
          />
        ) : (
          <IntentLink
            href={href}
            onClick={handleNavigate}
            className="absolute inset-0 z-0 rounded-xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            aria-labelledby={mediaOnly ? undefined : titleId}
            aria-label={mediaOnly ? event.title : undefined}
          />
        )}
        <div className="relative z-[1] pointer-events-none">
          <EventCardMedia
            event={event}
            emoji={emoji}
            gradient={category?.gradient ?? "from-neutral-200 to-neutral-300"}
            sizes={
              mediaOnly
                ? "(max-width: 640px) 100vw, 360px"
                : spanning
                  ? "(max-width: 640px) 100vw, 480px"
                  : "(max-width: 640px) 50vw, 240px"
            }
            imageClassName={`object-cover card-media-zoom ${getEventCardObjectPosition(event.id)}`}
            frameClassName={
              mediaOnly
                ? // Shorter flyer when meta is open — map height is scarce on phones.
                  mediaExpanded
                    ? "aspect-[2/1] w-full sm:aspect-[4/3]"
                    : "aspect-[16/10] w-full sm:aspect-[4/3]"
                : // Dexter-style poster tile — full flyer, denser grid.
                  "aspect-[2/3] w-full"
            }
            enlargeLabel={dict.detail.enlargeImage}
            closeLabel={dict.detail.close}
            showEnlarge={showEnlarge}
            enlargeHitArea={mediaOnly ? "media" : "control"}
            statusBadge={
              peekStatusLabel && peekStatus
                ? { label: peekStatusLabel, status: peekStatus }
                : null
            }
            mediaAction={
              mediaOnly && onMediaActivate && !mediaExpanded
                ? {
                    label: dict.map.readMore,
                    onClick: onMediaActivate,
                  }
                : null
            }
          />
          {pending ? (
            <div
              className="pointer-events-none absolute inset-0 z-[2] bg-orange-500/10"
              aria-hidden
            />
          ) : null}
          {event.trending && !peekStatusLabel && liveStatus !== "ended" && (
            <span className="pointer-events-none absolute right-2 top-2 z-[3] inline-flex items-center gap-0.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-300 backdrop-blur-sm">
              <Flame className="h-3 w-3" aria-hidden />
              {dict.events.hot}
            </span>
          )}
          {/*
            Full-bleed flyer + Dexter-style peek: hover/focus meta on fine
            pointers; image-only on touch. Title stays in the document via
            sr-only (same pattern as city heroes) — never aria-hidden.
          */}
          {mediaOnly ? null : (
            <div
              className="
                [@media(hover:none)]:sr-only
                [@media(hover:hover)_and_(pointer:fine)]:pointer-events-none
                [@media(hover:hover)_and_(pointer:fine)]:absolute
                [@media(hover:hover)_and_(pointer:fine)]:inset-x-0
                [@media(hover:hover)_and_(pointer:fine)]:bottom-0
                [@media(hover:hover)_and_(pointer:fine)]:z-[4]
                [@media(hover:hover)_and_(pointer:fine)]:flex
                [@media(hover:hover)_and_(pointer:fine)]:flex-col
                [@media(hover:hover)_and_(pointer:fine)]:gap-1.5
                [@media(hover:hover)_and_(pointer:fine)]:bg-gradient-to-t
                [@media(hover:hover)_and_(pointer:fine)]:from-black/95
                [@media(hover:hover)_and_(pointer:fine)]:via-black/70
                [@media(hover:hover)_and_(pointer:fine)]:to-transparent
                [@media(hover:hover)_and_(pointer:fine)]:px-2.5
                [@media(hover:hover)_and_(pointer:fine)]:pb-2.5
                [@media(hover:hover)_and_(pointer:fine)]:pt-12
                [@media(hover:hover)_and_(pointer:fine)]:opacity-0
                [@media(hover:hover)_and_(pointer:fine)]:translate-y-1.5
                [@media(hover:hover)_and_(pointer:fine)]:transition-[opacity,translate]
                [@media(hover:hover)_and_(pointer:fine)]:duration-300
                [@media(hover:hover)_and_(pointer:fine)]:ease-out
                [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100
                [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-y-0
                [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:opacity-100
                [@media(hover:hover)_and_(pointer:fine)]:group-focus-within:translate-y-0
              "
            >
              <h3
                id={titleId}
                className="line-clamp-2 font-sans text-sm font-bold leading-snug text-white sm:text-base"
              >
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold leading-snug text-white/90 sm:text-xs">
                {categoryLabel ? (
                  <span className="max-w-full truncate rounded-full bg-white/15 px-2 py-0.5 font-bold text-white ring-1 ring-white/20">
                    {categoryLabel}
                  </span>
                ) : null}
                <span className="tabular-nums">{dateLabel}</span>
                {timeLabel.display ? (
                  <span
                    className="tabular-nums text-white/80"
                    title={
                      timeLabel.full !== timeLabel.display
                        ? timeLabel.full
                        : undefined
                    }
                  >
                    {timeLabel.display}
                  </span>
                ) : null}
                {recurrenceLabel ? (
                  <span className="rounded-full bg-white/12 px-2 py-0.5 text-white/90 ring-1 ring-white/15">
                    {recurrenceLabel}
                  </span>
                ) : null}
              </div>
              {placeLabel ? (
                <p className="line-clamp-1 text-[11px] font-medium text-white/75 sm:text-xs">
                  {placeLabel}
                </p>
              ) : null}
              {note ? (
                <p className="text-[11px] font-semibold text-orange-200 sm:text-xs">
                  {note}
                </p>
              ) : null}
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article
      className={`
        group relative w-full rounded-2xl bg-white dark:bg-neutral-900 px-3.5 py-2.5
        border border-neutral-200 dark:border-neutral-800
        shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.3)]
        transition-[border-color,box-shadow,opacity,transform] duration-200
        cursor-pointer
        ${
          pending
            ? pendingChrome
            : dimmed
              ? dimmedChrome
              : idleChrome
        }
        ${isEndedToday && !pending ? "opacity-60" : ""}
      `}
      aria-busy={pending || undefined}
    >
      <IntentLink
        href={href}
        onClick={handleNavigate}
        className="absolute inset-0 z-0 rounded-2xl touch-manipulation focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        aria-label={event.title}
      />
      <div className="relative z-[1] flex gap-3 text-left pointer-events-none">
        <EventCardMedia
          event={event}
          emoji={emoji}
          gradient={category?.gradient ?? "from-neutral-200 to-neutral-300"}
          sizes="112px"
          imageClassName="object-cover"
          frameClassName="flex-shrink-0 self-start h-28 w-28 rounded-xl shadow-sm"
          emojiClassName="text-4xl"
          enlargeLabel={dict.detail.enlargeImage}
          closeLabel={dict.detail.close}
          showEnlarge={showEnlarge}
        />

        <div className="flex-1 min-w-0">
          <div className={`flex items-start gap-2 ${compact ? "mb-1" : "mb-2"}`}>
            <h3 className="font-sans text-base font-bold leading-snug text-neutral-950 dark:text-white line-clamp-2 flex-1 sm:text-lg">
              {event.title}
            </h3>
            {event.trending && !liveStatusLabel && liveStatus !== "ended" && (
              <span className="flex-shrink-0 inline-flex items-center gap-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600">
                <Flame className="h-3 w-3" />
                {dict.events.hot}
              </span>
            )}
          </div>

          {!compact && event.description ? (
            <p className="text-copy line-clamp-2 mb-3.5">
              {event.description}
            </p>
          ) : null}

          <EventCardMeta
            event={event}
            locale={locale}
            dict={dict}
            compact={compact}
            liveStatus={liveStatus}
            liveStatusLabel={liveStatusLabel}
          />
          {note ? (
            <p className="mt-1 text-xs font-semibold text-orange-700 dark:text-orange-300">
              {note}
            </p>
          ) : null}
        </div>
      </div>
      {!compact && event.phone && (
        <div className="relative z-[2] mt-4 pl-[4.25rem] pointer-events-auto">
          <EventCallLink phone={event.phone} label={dict.detail.call} />
        </div>
      )}
    </article>
  );
};

export const EventCard = memo(EventCardComponent);
