"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  CalendarPlus,
  Share2,
  Heart,
  Building2,
  Mic2,
  Phone,
  Ticket,
  Users,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import type { Event, EventOpinion } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { formatEventDateRange } from "@/lib/format-date";
import { formatEventTimeForList } from "@/lib/event-time-display";
import { getDirectionsUrl } from "@/lib/maps";
import { ShareMenu } from "@/components/ShareMenu";
import { CalendarMenu } from "@/components/CalendarMenu";
import { matchVenueSlug } from "@/lib/venues-seed";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { EventImage } from "@/components/EventImage";
import { EventDetailMedia, hasEventDetailHero } from "@/components/EventDetailMedia";
import { EventOpinionBlock } from "@/components/EventOpinionBlock";
import { resolveEventCoords } from "@/lib/event-coords";
import { formatEventPlace } from "@/lib/event-location";
import { areEventOpinionsEnabled, getEventOpinion, withGoogleRating, googleRatingFromAssessment } from "@/lib/event-opinions";
import {
  resolveTicketUrl,
  isEventFree,
  resolveAdmissionPrice,
  showsPaidAdmission,
  showsCallForPricing,
  showsAdmissionVaries,
  formatPaidAdmissionLabel,
} from "@/lib/event-tickets";
import { EventCallLink } from "@/components/EventCallLink";
import { formatPhoneTel } from "@/lib/event-phone";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import { scrollBehaviorPreference } from "@/lib/list-scroll";
import { eventDetailPath, venueDetailPath } from "@/lib/event-navigation";

type ActionMenu = "share" | "calendar";

function ActionFlyout({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) {
  if (!open) return null;
  
  return (
    <div className="relative z-0 pb-3 animate-in slide-in-from-bottom duration-500 fade-in">
      {children}
    </div>
  );
}

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  isSaved: boolean;
  onToggleSave: (event: Pick<Event, "id" | "title">) => void;
  /** Clears stale home scroll/tab state when sharing externally. */
  returnTo?: string | null;
  /** Pre-formatted on the server so SSR matches hydration (Node vs browser Intl). */
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
  /** Use h1 when this sheet is the primary page content (dedicated event route). */
  standalone?: boolean;
  /** Optional approved draft / preloaded opinion (seed still wins via getEventOpinion). */
  opinionOverride?: EventOpinion | null;
}

export function EventDetailSheet({
  event,
  onClose,
  dict,
  locale,
  isSaved,
  onToggleSave,
  returnTo,
  formattedDateRange,
  recurrenceLabel: recurrenceLabelProp,
  standalone = false,
  opinionOverride = null,
}: EventDetailSheetProps) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [openAction, setOpenAction] = useState<ActionMenu | null>(null);
  const [fetchedOpinion, setFetchedOpinion] = useState<EventOpinion | null>(
    null,
  );
  const [venueRating, setVenueRating] = useState<{
    rating: number;
    reviewCount?: number;
  } | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const shareOpen = openAction === "share";
  const calendarOpen = openAction === "calendar";

  const toggleAction = useCallback((action: ActionMenu) => {
    setOpenAction((current) => (current === action ? null : action));
  }, []);

  useEffect(() => {
    setOpenAction(null);
    setShareMsg(null);
    setFetchedOpinion(null);
    setVenueRating(null);
  }, [event?.id]);

  useEffect(() => {
    if (!event || !areEventOpinionsEnabled()) return;

    const seed = getEventOpinion(event);
    const base = seed ?? opinionOverride ?? null;
    // Always load opinion API when no seed — also when seed lacks ★ so ratings attach.
    const needsFetch = !base || typeof base.googleRating !== "number";
    if (!needsFetch && seed) return;

    const controller = new AbortController();
    const id = encodeURIComponent(event.id);

    fetch(`/api/events/${id}/opinion`, { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { opinion?: EventOpinion | null } | null) => {
        if (data?.opinion?.body) setFetchedOpinion(data.opinion);
      })
      .catch(() => {
        /* ignore abort / network */
      });

    return () => controller.abort();
  }, [event, opinionOverride]);

  useEffect(() => {
    if (!event || !areEventOpinionsEnabled()) return;
    const slug =
      event.venueSlug ??
      matchVenueSlug(event.venue) ??
      matchVenueSlug(event.location);
    if (!slug) return;

    const base =
      getEventOpinion(event) ?? opinionOverride ?? fetchedOpinion;
    if (base && typeof base.googleRating === "number") return;

    const controller = new AbortController();
    fetch(`/api/venues/${encodeURIComponent(slug)}/assessment`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (data: {
          assessment?: {
            sources?: { kind: string; rating?: number; reviewCount?: number }[];
          } | null;
        } | null) => {
          const rating = googleRatingFromAssessment(data?.assessment ?? null);
          if (rating) setVenueRating(rating);
        },
      )
      .catch(() => {
        /* ignore */
      });

    return () => controller.abort();
  }, [event, opinionOverride, fetchedOpinion]);

  useEffect(() => {
    if (!event || standalone) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [event, standalone]);

  useEffect(() => {
    if (!openAction) return;

    function handlePointerDown(e: PointerEvent) {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(e.target as Node)
      ) {
        setOpenAction(null);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openAction]);

  // Standalone event pages: flyout opens above the action bar — ease into view
  // instead of letting the browser snap scroll when the panel expands.
  useEffect(() => {
    if (!openAction || !standalone) return;
    const node = actionsRef.current;
    if (!node) return;

    const behavior = scrollBehaviorPreference();
    const frame = requestAnimationFrame(() => {
      node.scrollIntoView({ behavior, block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [openAction, standalone]);

  const {
    sheetRef,
    sheetStyle,
    dragZoneProps,
    dismiss: dismissSheet,
    backdropOpacity,
    swipeEnabled,
  } = useSwipeToDismiss(
    onClose,
    !standalone && Boolean(event) && openAction == null,
  );

  const requestClose = useCallback(() => {
    if (swipeEnabled) {
      dismissSheet();
      return;
    }
    onClose();
  }, [dismissSheet, onClose, swipeEnabled]);

  if (!event) return null;

  const category = getCategoryMeta(event.category, dict.categories);
  const emoji = event.imageEmoji ?? category?.emoji ?? "📅";
  const dateLabel =
    formattedDateRange ??
    formatEventDateRange(event.date, locale, { endDate: event.endDate });
  const recurrenceLabel =
    recurrenceLabelProp !== undefined
      ? recurrenceLabelProp
      : formatRecurrenceLabel(event, locale, dict);
  const venueSlug =
    event.venueSlug ?? matchVenueSlug(event.venue) ?? matchVenueSlug(event.location);
  const eventOpinionRaw =
    // Prefer API opinion when it carries Google ★ (seed body + venue rating).
    (fetchedOpinion && typeof fetchedOpinion.googleRating === "number"
      ? fetchedOpinion
      : null) ??
    getEventOpinion(event) ??
    opinionOverride ??
    fetchedOpinion;
  const eventOpinion = eventOpinionRaw
    ? withGoogleRating(eventOpinionRaw, venueRating)
    : null;
  const liveDisplay = useLiveStatusDisplay(event, dict);
  const liveStatus = liveDisplay?.status ?? null;
  const liveStatusLabel = liveDisplay?.label ?? null;
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });
  const TitleTag = standalone ? "h1" : "h2";
  const showHero = hasEventDetailHero(event);
  const hasMapCoords = resolveEventCoords(event) != null;
  const isPhysical = event.format !== "digital";
  const showBottomDirections = isPhysical && !hasMapCoords;
  const ticketUrl = resolveTicketUrl(event);
  const showFreeAdmission = !ticketUrl && isEventFree(event);
  const admissionPrice = resolveAdmissionPrice(event);
  const showPaidAdmission = showsPaidAdmission(event);
  const showCallForPricing = showsCallForPricing(event);
  const showAdmissionVaries = showsAdmissionVaries(event);
  const paidAdmissionLabel = admissionPrice
    ? formatPaidAdmissionLabel(admissionPrice, dict)
    : dict.detail.paidAdmissionUnknown;

  const iconActionClass =
    "flex h-12 w-full items-center justify-center rounded-2xl touch-manipulation transition-all active:scale-[0.98]";
  const iconActionIdleClass =
    "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200/80 hover:bg-white hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-300 dark:ring-neutral-700/80 dark:hover:bg-neutral-700 dark:hover:text-neutral-100";
  const iconActionActiveClass =
    "bg-gradient-to-br from-orange-500 to-rose-600 text-white shadow-[0_8px_20px_-12px_rgba(244,63,94,0.7)]";

  function handleShareFeedback(message: string, durationMs = 5000) {
    setShareMsg(message);
    setTimeout(() => setShareMsg(null), durationMs);
  }

  function handleViewVenue() {
    if (!venueSlug || !event) return;
    const from = eventDetailPath(locale, event.id);
    router.push(venueDetailPath(locale, venueSlug, from, event.title));
  }

  const contentSection = (
    <>
      {event.communitySubmitted && (
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-3">
          <Users className="h-3.5 w-3.5" />
          {dict.detail.community}
        </span>
      )}

      <TitleTag className="text-2xl font-black text-neutral-900 dark:text-neutral-100 leading-tight tracking-tight lg:text-[1.75rem]">
        {event.title}
      </TitleTag>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="inline-flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <Calendar className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="font-medium" suppressHydrationWarning>
              {dateLabel}
            </span>
          </div>
          {liveStatusLabel && liveStatus && (
            <EventStatusBadge label={liveStatusLabel} status={liveStatus} />
          )}
        </div>
        {(timeLabel.display || recurrenceLabel) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-copy-meta text-neutral-800 dark:text-neutral-200">
            {timeLabel.display && (
              <span
                className="inline-flex items-center gap-2.5"
                title={
                  timeLabel.full !== timeLabel.display ? timeLabel.full : undefined
                }
              >
                <Clock className="h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
                <span className="font-medium">{timeLabel.display}</span>
              </span>
            )}
            {recurrenceLabel && (
              <span className="inline-flex shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-xs font-bold leading-none text-neutral-600 dark:text-neutral-400">
                {recurrenceLabel}
              </span>
            )}
          </div>
        )}
        {isPhysical ? (
          <a
            href={getDirectionsUrl(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="group/place flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
          >
            <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover/place:text-orange-600 dark:text-neutral-400" />
            <span className="min-w-0 font-medium leading-snug transition-colors group-hover/place:text-orange-600">
              {formatEventPlace(event)}
            </span>
          </a>
        ) : (
          <div className="flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="min-w-0 font-medium leading-snug">
              {formatEventPlace(event)}
            </span>
          </div>
        )}
        {event.phone && (
          <div className="group/phone flex items-center gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <Phone className="h-[1.125rem] w-[1.125rem] shrink-0 text-emerald-600 dark:text-emerald-400 group-hover/phone:text-neutral-500 transition-colors" />
            <EventCallLink
              phone={event.phone}
              label={dict.detail.call}
              variant="row"
            />
          </div>
        )}
        {venueSlug && (
          <button
            type="button"
            onClick={handleViewVenue}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-bold text-neutral-800 dark:text-neutral-200 hover:border-orange-300 dark:hover:border-orange-800 hover:text-orange-600 dark:hover:text-orange-400 transition-colors touch-manipulation"
          >
            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
            {dict.detail.viewVenue}
          </button>
        )}
      </div>

      <p className="mt-5 text-copy">{event.description}</p>

      {eventOpinion ? (
        <EventOpinionBlock
          opinion={eventOpinion}
          dict={dict}
          locale={locale}
          className="mt-5 mb-1"
        />
      ) : null}

      {event.lineup && event.lineup.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-2 text-neutral-500 mb-2">
            <Mic2 className="h-4 w-4 flex-shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wide">
              {dict.detail.lineup}
            </span>
          </div>
          <ul className="flex flex-wrap gap-2">
            {event.lineup.map((name) => (
              <li
                key={name}
                className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-copy font-medium text-neutral-800 dark:text-neutral-200"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {(ticketUrl ||
        (showCallForPricing && event.phone) ||
        showAdmissionVaries ||
        showFreeAdmission ||
        showPaidAdmission) && (
        <div className="mt-5 flex flex-col items-start gap-2.5">
          {ticketUrl && (
            <a
              href={ticketUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4" aria-hidden />
              {dict.detail.buyTickets}
            </a>
          )}
          {showCallForPricing && event.phone && (
            <a
              href={`tel:${formatPhoneTel(event.phone)}`}
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {dict.detail.callForPricing}
            </a>
          )}
          {showAdmissionVaries && (
            <div
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
              role="status"
            >
              <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
              {dict.detail.admissionVaries}
            </div>
          )}
          {showFreeAdmission && (
            <div
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              role="status"
            >
              <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />
              {dict.detail.freeAdmission}
            </div>
          )}
          {showPaidAdmission && (
            <div
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3 text-sm font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
              role="status"
            >
              <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
              {paidAdmissionLabel}
            </div>
          )}
        </div>
      )}
    </>
  );

  const actionsSection = (
    <>
      {openAction && standalone && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setOpenAction(null)}
          aria-hidden="true"
        />
      )}
      <div
        ref={actionsRef}
        className="relative isolate border-t border-neutral-100 bg-white px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-7 lg:pb-6"
        style={{ zIndex: openAction && standalone ? 50 : undefined }}
      >
        <ActionFlyout open={calendarOpen}>
          <CalendarMenu
            event={event}
            dict={dict}
            onClose={() => setOpenAction(null)}
          />
        </ActionFlyout>
        <ActionFlyout open={shareOpen}>
          <ShareMenu
            event={event}
            locale={locale}
            dict={dict}
            onClose={() => setOpenAction(null)}
            onFeedback={handleShareFeedback}
          />
        </ActionFlyout>
        {shareMsg && (
          <p
            className="relative z-0 mb-2 text-center text-xs font-semibold text-orange-600 dark:text-orange-400"
            role="status"
            aria-live="polite"
          >
            {shareMsg}
          </p>
        )}
        <div
          className={`relative z-10 grid gap-2.5 ${showBottomDirections ? "grid-cols-4" : "grid-cols-3"}`}
        >
          {showBottomDirections && (
            <a
              href={getDirectionsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${iconActionClass} ${iconActionIdleClass}`}
              aria-label={dict.detail.directions}
              title={dict.detail.directions}
            >
              <Navigation className="h-5 w-5" aria-hidden />
            </a>
          )}
          <button
            type="button"
            onClick={() => toggleAction("calendar")}
            className={`${iconActionClass} ${
              calendarOpen ? iconActionActiveClass : iconActionIdleClass
            }`}
            aria-label={dict.detail.calendar}
            title={dict.detail.calendar}
            aria-expanded={calendarOpen}
            aria-pressed={calendarOpen}
          >
            <CalendarPlus className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => toggleAction("share")}
            className={`${iconActionClass} ${
              shareOpen || shareMsg ? iconActionActiveClass : iconActionIdleClass
            }`}
            aria-label={shareMsg ?? dict.detail.share}
            title={shareMsg ?? dict.detail.share}
            aria-expanded={shareOpen}
            aria-pressed={shareOpen}
          >
            <Share2 className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => {
              setOpenAction(null);
              onToggleSave(event);
            }}
            className={`${iconActionClass} ${
              isSaved ? iconActionActiveClass : iconActionIdleClass
            }`}
            aria-label={isSaved ? dict.detail.saved : dict.detail.save}
            title={isSaved ? dict.detail.saved : dict.detail.save}
            aria-pressed={isSaved}
          >
            <Heart
              className={`h-5 w-5 ${isSaved ? "fill-current" : ""}`}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </>
  );

  const emojiFallback = (
    <div className="flex items-start px-5 pt-5">
      <div
        className={`
          flex h-14 w-14 items-center justify-center rounded-2xl
          bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
          text-2xl shadow-sm
        `}
      >
        {emoji}
      </div>
    </div>
  );

  if (standalone) {
    return (
      <article className="mt-1 w-full overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-neutral-200/70 dark:bg-neutral-900 dark:ring-neutral-800 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
        <div className="relative h-[min(32dvh,13rem)] sm:h-[min(38dvh,18rem)] lg:h-auto lg:min-h-[32rem]">
          {showHero ? (
            <div className="h-full lg:absolute lg:inset-0">
              <EventDetailMedia
                event={event}
                dict={dict}
                emoji={emoji}
                gradient={category?.gradient}
                variant="standalone"
                priority
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-50 dark:bg-neutral-950/40 lg:absolute lg:inset-0">
              {emojiFallback}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex-1 px-5 pt-4 pb-3 sm:px-6 lg:px-7 lg:pt-7 lg:pb-5">
            {contentSection}
          </div>
          {actionsSection}
        </div>
      </article>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      {event.imageUrl && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <EventImage
            src={event.imageUrl}
            alt=""
            sizes="100vw"
            priority
            className="object-cover object-center scale-110 blur-xl opacity-70"
          />
        </div>
      )}
      <button
        type="button"
        className={
          event.imageUrl
            ? "absolute inset-0 bg-black/25"
            : "absolute inset-0 bg-black/40 backdrop-blur-sm"
        }
        style={
          swipeEnabled
            ? { opacity: event.imageUrl ? 0.25 * backdropOpacity : 0.4 * backdropOpacity }
            : undefined
        }
        onClick={requestClose}
        aria-label={dict.detail.close}
      />
      <div
        ref={sheetRef}
        style={sheetStyle}
        className="
          relative z-10 flex w-full max-w-lg sm:max-w-2xl flex-col
          max-h-[92dvh] overflow-hidden
          bg-white dark:bg-neutral-900 rounded-t-3xl shadow-2xl
          pb-[env(safe-area-inset-bottom)]
          animate-in slide-in-from-bottom duration-300
        "
      >
        <div className="shrink-0">
          {swipeEnabled && (
            <div
              {...dragZoneProps}
              className="flex justify-center touch-none cursor-grab active:cursor-grabbing pt-2.5 pb-1"
              aria-hidden
            >
              <div className="h-1 w-10 rounded-full bg-neutral-300/90 dark:bg-neutral-600/90" />
            </div>
          )}
          {showHero ? (
            <EventDetailMedia
              event={event}
              dict={dict}
              emoji={emoji}
              gradient={category?.gradient}
              variant="sheet"
              onClose={requestClose}
              priority
            />
          ) : (
            <div className="flex shrink-0 items-start justify-between px-4 pt-4 pb-2">
              <div
                className={`
                  flex h-14 w-14 items-center justify-center rounded-2xl
                  bg-gradient-to-br ${category?.gradient ?? "from-neutral-200 to-neutral-300"}
                  text-2xl shadow-sm
                `}
              >
                {emoji}
              </div>
              <button
                type="button"
                onClick={requestClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800"
                aria-label={dict.detail.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain touch-pan-y px-5 pt-4 pb-3">
          {contentSection}
        </div>

        <div className="shrink-0">{actionsSection}</div>
      </div>
    </div>
  );
}
