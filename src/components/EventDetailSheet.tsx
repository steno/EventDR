"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import type { Event, EventOpinion } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { getCategoryMeta } from "@/lib/categories";
import { formatEventDateRange } from "@/lib/format-date";
import { formatEventTimeForList } from "@/lib/event-time-display";
import { formatRecurrenceLabel } from "@/lib/recurrence-label";
import { useLiveStatusDisplay } from "@/hooks/useLiveStatusDisplay";
import { EventImage } from "@/components/EventImage";
import { EventDetailMedia, hasEventDetailHero } from "@/components/EventDetailMedia";
import {
  resolveTicketUrl,
  isEventFree,
  resolveAdmissionPrice,
  showsPaidAdmission,
  showsAdmissionVaries,
  formatPaidAdmissionLabel,
} from "@/lib/event-tickets";
import { useSwipeToDismiss } from "@/hooks/useSwipeToDismiss";
import { scrollBehaviorPreference } from "@/lib/list-scroll";
import { eventDetailPath, rememberReturnPath, resolveEventVenueSlug, venueDetailPath } from "@/lib/event-navigation";
import { navigateSoft } from "@/lib/nav-feedback";
import {
  getOnboardingCopy,
  hasSeenOnboarding,
  markOnboardingSeen,
} from "@/lib/onboarding";
import { usePushSubscription } from "@/hooks/usePushSubscription";
import type { NearbyTonightResult } from "@/lib/nearby-events";
import type { VenueSiblingNight } from "@/lib/venue-recurring-siblings";
import { getPocketForEvent } from "@/lib/walkable-pockets";
import { areEventOpinionsEnabled, getEventOpinion, withGoogleRating, googleRatingFromAssessment } from "@/lib/event-opinions";
import { EventDetailContent } from "@/components/event-detail/EventDetailContent";
import { EventDetailActions } from "@/components/event-detail/EventDetailActions";
import { DETAIL_HERO_PHOTO_HEIGHT_CLASS } from "@/lib/page-shell";

type ActionMenu = "share" | "calendar";

const EMPTY_STATUS_EVENT = {
  date: "",
  endDate: undefined,
  time: undefined,
  recurrence: undefined,
};

interface EventDetailSheetProps {
  event: Event | null;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  isSaved: boolean;
  onToggleSave: (event: Pick<Event, "id" | "title">) => void;
  /** Pre-formatted on the server so SSR matches hydration (Node vs browser Intl). */
  formattedDateRange?: string;
  recurrenceLabel?: string | null;
  /** Use h1 when this sheet is the primary page content (dedicated event route). */
  standalone?: boolean;
  /** Optional approved draft / preloaded opinion (seed still wins via getEventOpinion). */
  opinionOverride?: EventOpinion | null;
  /** SSR venue ★ — skips the post-paint assessment fetch when present. */
  initialVenueRating?: { rating: number; reviewCount?: number } | null;
  /** Same-day walkable events near this one (server-computed). */
  nearbyTonight?: NearbyTonightResult | null;
  /** Other recurring events at the same venue (server-computed). */
  venueOtherNights?: VenueSiblingNight[];
}

export function EventDetailSheet({
  event,
  onClose,
  dict,
  locale,
  isSaved,
  onToggleSave,
  formattedDateRange,
  recurrenceLabel: recurrenceLabelProp,
  standalone = false,
  opinionOverride = null,
  initialVenueRating = null,
  nearbyTonight = null,
  venueOtherNights = [],
}: EventDetailSheetProps) {
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [openAction, setOpenAction] = useState<ActionMenu | null>(null);
  const [showActionsCoach, setShowActionsCoach] = useState(false);
  const [showSaveCelebration, setShowSaveCelebration] = useState(false);
  const [showPushPrompt, setShowPushPrompt] = useState(false);
  const [pushAfterCalendar, setPushAfterCalendar] = useState(false);
  const [fetchedOpinion, setFetchedOpinion] = useState<EventOpinion | null>(
    null,
  );
  const [venueRating, setVenueRating] = useState<{
    rating: number;
    reviewCount?: number;
  } | null>(() => initialVenueRating);
  const actionsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const shareOpen = openAction === "share";
  const calendarOpen = openAction === "calendar";
  const onboardingCopy = getOnboardingCopy(locale);
  const pushSubscription = usePushSubscription(locale);
  const liveDisplay = useLiveStatusDisplay(event ?? EMPTY_STATUS_EVENT, dict);
  const eventId = event?.id;

  const toggleAction = useCallback((action: ActionMenu) => {
    setOpenAction((current) => (current === action ? null : action));
  }, []);

  useEffect(() => {
    const resetTimer = window.setTimeout(() => {
      setOpenAction(null);
      setShareMsg(null);
      setShowActionsCoach(false);
      setShowSaveCelebration(false);
      setShowPushPrompt(false);
      setPushAfterCalendar(false);
      setFetchedOpinion(null);
      setVenueRating(null);
    }, 0);
    const coachTimer =
      eventId && !hasSeenOnboarding("event-actions-coached")
        ? window.setTimeout(() => setShowActionsCoach(true), 1200)
        : null;
    return () => {
      window.clearTimeout(resetTimer);
      if (coachTimer) window.clearTimeout(coachTimer);
    };
  }, [eventId]);

  useEffect(() => {
    if (!event || !areEventOpinionsEnabled()) return;

    const seed = getEventOpinion(event);
    const base = seed ?? opinionOverride ?? null;
    // Always load opinion API when no seed — also when seed lacks ★ so ratings attach.
    const needsFetch = !base || typeof base.googleRating !== "number";
    if (!needsFetch) return;
    // SSR already supplied ★ via opinionOverride or initialVenueRating — skip waterfall.
    if (
      base &&
      (typeof initialVenueRating?.rating === "number" ||
        typeof base.googleRating === "number")
    ) {
      return;
    }

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
  }, [event, opinionOverride, initialVenueRating]);

  useEffect(() => {
    if (!event || !areEventOpinionsEnabled()) return;
    if (typeof initialVenueRating?.rating === "number") return;
    const slug = resolveEventVenueSlug(event);
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
  }, [event, opinionOverride, fetchedOpinion, initialVenueRating]);

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

  // Standalone event pages: panel expands above the action bar — ease into view
  // instead of letting the browser snap scroll when content grows.
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
  const venueSlug = resolveEventVenueSlug(event);
  const walkablePocket = nearbyTonight?.pocket ?? getPocketForEvent(event);
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
  const liveStatus = event.temporarilyClosed
    ? ("temporarilyClosed" as const)
    : liveDisplay?.status ?? null;
  const liveStatusLabel = event.temporarilyClosed
    ? dict.events.temporarilyClosed
    : liveDisplay?.label ?? null;
  const timeLabel = formatEventTimeForList(event.time, {
    recurrence: event.recurrence,
    allDayLabel: dict.events.allDay,
  });
  const showHero = hasEventDetailHero(event);
  const isPhysical = event.format !== "digital";
  // Calendar CTA lives in the save celebration — hide the duplicate bar icon.
  const showCalendarAction = !showSaveCelebration;
  const actionCols = (showCalendarAction ? 1 : 0) + 2;
  const ticketUrl = resolveTicketUrl(event);
  const showFreeAdmission = !ticketUrl && isEventFree(event);
  const admissionPrice = resolveAdmissionPrice(event);
  const showPaidAdmission = showsPaidAdmission(event);
  const showAdmissionVaries = showsAdmissionVaries(event);
  const paidAdmissionLabel = admissionPrice
    ? formatPaidAdmissionLabel(admissionPrice, dict)
    : dict.detail.paidAdmissionUnknown;

  const iconActionClass =
    "flex h-10 w-full items-center justify-center rounded-xl touch-manipulation transition-colors active:scale-[0.98]";
  const iconActionIdleClass =
    "bg-neutral-100/90 text-neutral-500 hover:bg-neutral-200/80 hover:text-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100";
  const iconActionActiveClass =
    "bg-gradient-to-br from-orange-500 to-rose-600 text-white";

  function handleShareFeedback(message: string, durationMs = 5000) {
    setShareMsg(message);
    setTimeout(() => setShareMsg(null), durationMs);
  }

  function dismissActionsCoach() {
    markOnboardingSeen("event-actions-coached");
    setShowActionsCoach(false);
  }

  function handleSave() {
    if (!event) return;
    setOpenAction(null);
    dismissActionsCoach();
    const saving = !isSaved;
    onToggleSave(event);
    if (saving && !hasSeenOnboarding("first-save-celebrated")) {
      markOnboardingSeen("first-save-celebrated");
      setShowSaveCelebration(true);
    } else if (
      saving &&
      pushSubscription.supported &&
      !pushSubscription.enabled &&
      !hasSeenOnboarding("push-prompt-seen")
    ) {
      setShowPushPrompt(true);
    }
  }

  function offerPushPrompt() {
    if (
      pushSubscription.supported &&
      !pushSubscription.enabled &&
      !hasSeenOnboarding("push-prompt-seen")
    ) {
      setShowPushPrompt(true);
    }
  }

  function handleViewVenue() {
    if (!venueSlug || !event) return;
    const from = eventDetailPath(locale, event.id);
    rememberReturnPath(from, event.title);
    navigateSoft(
      router,
      venueDetailPath(locale, venueSlug, from, event.title, true),
    );
  }

  function warmVenueRoute() {
    if (!venueSlug || !event) return;
    void router.prefetch(
      venueDetailPath(
        locale,
        venueSlug,
        eventDetailPath(locale, event.id),
        event.title,
        true,
      ),
    );
  }

  const contentSection = (
    <EventDetailContent
      event={event}
      dict={dict}
      locale={locale}
      standalone={standalone}
      dateLabel={dateLabel}
      recurrenceLabel={recurrenceLabel}
      liveStatus={liveStatus}
      liveStatusLabel={liveStatusLabel}
      timeLabel={timeLabel}
      isPhysical={isPhysical}
      venueSlug={venueSlug}
      walkablePocket={walkablePocket}
      onViewVenue={handleViewVenue}
      onWarmVenue={warmVenueRoute}
      eventOpinion={eventOpinion}
      nearbyTonight={nearbyTonight}
      venueOtherNights={venueOtherNights}
      ticketUrl={ticketUrl}
      showAdmissionVaries={showAdmissionVaries}
      showFreeAdmission={showFreeAdmission}
      showPaidAdmission={showPaidAdmission}
      paidAdmissionLabel={paidAdmissionLabel}
    />
  );

  const actionsSection = (
    <EventDetailActions
      event={event}
      dict={dict}
      locale={locale}
      standalone={standalone}
      actionsRef={actionsRef}
      isSaved={isSaved}
      shareMsg={shareMsg}
      shareOpen={shareOpen}
      calendarOpen={calendarOpen}
      showSaveCelebration={showSaveCelebration}
      showPushPrompt={showPushPrompt}
      showActionsCoach={showActionsCoach}
      showCalendarAction={showCalendarAction}
      actionCols={actionCols}
      pushAfterCalendar={pushAfterCalendar}
      onboardingCopy={onboardingCopy}
      pushSubscription={pushSubscription}
      iconActionClass={iconActionClass}
      iconActionIdleClass={iconActionIdleClass}
      iconActionActiveClass={iconActionActiveClass}
      onToggleAction={toggleAction}
      onShareFeedback={handleShareFeedback}
      onDismissActionsCoach={dismissActionsCoach}
      onSave={handleSave}
      onOfferPushPrompt={offerPushPrompt}
      onSetOpenAction={setOpenAction}
      onSetShowSaveCelebration={setShowSaveCelebration}
      onSetShowPushPrompt={setShowPushPrompt}
      onSetPushAfterCalendar={setPushAfterCalendar}
    />
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
      <article className="mt-0 w-full overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-neutral-200/60 dark:bg-neutral-900 dark:ring-neutral-800 lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-stretch">
        <div className={`relative ${DETAIL_HERO_PHOTO_HEIGHT_CLASS}`}>
          {showHero ? (
            <div className="h-full lg:absolute lg:inset-0">
              <EventDetailMedia
                event={event}
                dict={dict}
                variant="standalone"
                priority
                venueHref={
                  venueSlug
                    ? venueDetailPath(locale, venueSlug)
                    : undefined
                }
                onNavigateToVenue={() => {
                  rememberReturnPath(
                    eventDetailPath(locale, event.id),
                    event.title,
                  );
                }}
              />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-50 dark:bg-neutral-950/40 lg:absolute lg:inset-0">
              {emojiFallback}
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex-1 px-4 pt-3 pb-2 sm:px-5 lg:px-5 lg:pt-4 lg:pb-3">
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
              variant="sheet"
              onClose={requestClose}
              priority
              venueHref={
                venueSlug
                  ? venueDetailPath(locale, venueSlug)
                  : undefined
              }
              onNavigateToVenue={() => {
                rememberReturnPath(
                  eventDetailPath(locale, event.id),
                  event.title,
                );
              }}
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
