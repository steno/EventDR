"use client";

import {
  MapPin,
  Calendar,
  Clock,
  Building2,
  Mic2,
  Phone,
  Ticket,
  Users,
  BadgeCheck,
  CircleDollarSign,
} from "lucide-react";
import { useState } from "react";
import type { Event, EventOpinion } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { EventLiveStatus } from "@/lib/event-status";
import { getDirectionsUrl } from "@/lib/maps";
import { IntentLink } from "@/components/IntentLink";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { EventOpinionBlock } from "@/components/EventOpinionBlock";
import { formatEventPlace } from "@/lib/event-location";
import { EventCallLink } from "@/components/EventCallLink";
import { formatPhoneTel } from "@/lib/event-phone";
import {
  eventDetailPath,
  rememberReturnPath,
  venueDetailPath,
} from "@/lib/event-navigation";
import { NearbyTonight, PocketPlaceHint } from "@/components/NearbyTonight";
import type { NearbyTonightResult } from "@/lib/nearby-events";
import type { WalkablePocket } from "@/lib/walkable-pockets";

export interface EventDetailContentProps {
  event: Event;
  dict: Dictionary;
  locale: Locale;
  standalone: boolean;
  dateLabel: string;
  recurrenceLabel: string | null;
  liveStatus: EventLiveStatus | null;
  liveStatusLabel: string | null;
  timeLabel: { display: string; full: string };
  isPhysical: boolean;
  venueSlug: string | undefined;
  walkablePocket: WalkablePocket | null;
  onViewVenue: () => void;
  /** Prefetch venue route on press (View venue button). */
  onWarmVenue?: () => void;
  eventOpinion: EventOpinion | null;
  nearbyTonight: NearbyTonightResult | null;
  ticketUrl: string | undefined;
  showCallForPricing: boolean;
  showAdmissionVaries: boolean;
  showFreeAdmission: boolean;
  showPaidAdmission: boolean;
  paidAdmissionLabel: string;
}

export function EventDetailContent({
  event,
  dict,
  locale,
  standalone,
  dateLabel,
  recurrenceLabel,
  liveStatus,
  liveStatusLabel,
  timeLabel,
  isPhysical,
  venueSlug,
  walkablePocket,
  onViewVenue,
  onWarmVenue,
  eventOpinion,
  nearbyTonight,
  ticketUrl,
  showCallForPricing,
  showAdmissionVaries,
  showFreeAdmission,
  showPaidAdmission,
  paidAdmissionLabel,
}: EventDetailContentProps) {
  const TitleTag = standalone ? "h1" : "h2";
  const [venuePending, setVenuePending] = useState(false);

  return (
    <>
      {event.communitySubmitted && (
        <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 dark:bg-violet-950/50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-3">
          <Users className="h-3.5 w-3.5" />
          {dict.detail.community}
        </span>
      )}

      <TitleTag className="text-title font-extrabold leading-snug text-neutral-900 dark:text-neutral-100 lg:text-display">
        {event.title}
      </TitleTag>

      <div className={standalone ? "mt-3 space-y-2" : "mt-4 space-y-3"}>
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
              <span className="inline-flex shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 text-sm font-bold leading-none text-neutral-700 dark:text-neutral-200">
                {recurrenceLabel}
              </span>
            )}
          </div>
        )}
        {isPhysical ? (
          venueSlug ? (
            <IntentLink
              href={venueDetailPath(
                locale,
                venueSlug,
                eventDetailPath(locale, event.id),
                event.title,
                true,
              )}
              onClick={() => {
                rememberReturnPath(eventDetailPath(locale, event.id), event.title);
              }}
              className="group/place flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
            >
              <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover/place:text-orange-600 dark:text-neutral-400" />
              <span className="min-w-0 font-medium leading-snug transition-colors group-hover/place:text-orange-600">
                {formatEventPlace(event)}
                {walkablePocket ? (
                  <PocketPlaceHint
                    pocket={walkablePocket}
                    locale={locale}
                    dict={dict}
                  />
                ) : null}
              </span>
            </IntentLink>
          ) : (
            <a
              href={getDirectionsUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="group/place flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200 touch-manipulation"
            >
              <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 transition-colors group-hover/place:text-orange-600 dark:text-neutral-400" />
              <span className="min-w-0 font-medium leading-snug transition-colors group-hover/place:text-orange-600">
                {formatEventPlace(event)}
                {walkablePocket ? (
                  <PocketPlaceHint
                    pocket={walkablePocket}
                    locale={locale}
                    dict={dict}
                  />
                ) : null}
              </span>
            </a>
          )
        ) : (
          <div className="flex items-start gap-2.5 text-copy-meta text-neutral-800 dark:text-neutral-200">
            <MapPin className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 text-neutral-500 dark:text-neutral-400" />
            <span className="min-w-0 font-medium leading-snug">
              {formatEventPlace(event)}
              {walkablePocket ? (
                <PocketPlaceHint
                  pocket={walkablePocket}
                  locale={locale}
                  dict={dict}
                />
              ) : null}
            </span>
          </div>
        )}
        {(event.phone || ticketUrl) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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
            {ticketUrl && (
              <a
                href={ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/tickets flex items-center gap-2.5 text-copy-meta touch-manipulation"
              >
                <Ticket className="h-[1.125rem] w-[1.125rem] shrink-0 text-rose-600 dark:text-rose-400 transition-colors group-hover/tickets:text-neutral-500" />
                <span className="font-semibold text-rose-700 dark:text-rose-400 transition-colors group-hover/tickets:text-neutral-700 dark:group-hover/tickets:text-neutral-300">
                  {dict.detail.buyTickets}
                </span>
              </a>
            )}
          </div>
        )}
      </div>

      <p
        className={
          standalone
            ? "mt-3 text-copy leading-[1.35]"
            : "mt-5 text-copy"
        }
      >
        {event.description}
      </p>

      {eventOpinion ? (
        <EventOpinionBlock
          opinion={eventOpinion}
          dict={dict}
          locale={locale}
          className={standalone ? "mt-3 mb-1" : "mt-5 mb-1"}
        />
      ) : null}

      {event.lineup && event.lineup.length > 0 && (
        <div className={standalone ? "mt-3" : "mt-5"}>
          <div className="flex items-center gap-2 text-neutral-500 mb-2">
            <Mic2 className="h-4 w-4 flex-shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wide">
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

      {(venueSlug ||
        showAdmissionVaries ||
        showFreeAdmission ||
        showPaidAdmission ||
        (showCallForPricing && event.phone)) && (
        <div
          className={`flex flex-wrap items-center gap-2 ${standalone ? "mt-3" : "mt-5"}`}
        >
          {venueSlug && (
            <button
              type="button"
              aria-busy={venuePending || undefined}
              onClick={() => {
                setVenuePending(true);
                onViewVenue();
              }}
              onPointerDown={onWarmVenue}
              onFocus={onWarmVenue}
              className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98] ${
                venuePending ? "scale-[0.98] brightness-95" : "hover:brightness-105"
              }`}
            >
              <Building2 className="h-4 w-4 shrink-0" aria-hidden />
              {dict.detail.viewVenue}
            </button>
          )}
          {showAdmissionVaries && (
            <div
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
              role="status"
            >
              <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
              {dict.detail.admissionVaries}
            </div>
          )}
          {showFreeAdmission && (
            <div
              className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
              role="status"
            >
              <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden />
              {dict.detail.freeAdmission}
            </div>
          )}
          {showPaidAdmission && (
            <div
              className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-bold text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
              role="status"
            >
              <CircleDollarSign className="h-4 w-4 shrink-0" aria-hidden />
              {paidAdmissionLabel}
            </div>
          )}
          {showCallForPricing && event.phone && (
            <a
              href={`tel:${formatPhoneTel(event.phone)}`}
              className="inline-flex w-fit max-w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-fuchsia-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm touch-manipulation transition-transform active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {dict.detail.callForPricing}
            </a>
          )}
        </div>
      )}

      {nearbyTonight && nearbyTonight.hits.length > 0 ? (
        <NearbyTonight
          nearby={nearbyTonight}
          locale={locale}
          dict={dict}
          returnTo={eventDetailPath(locale, event.id)}
          returnTitle={event.title}
          sourceStatus={liveStatus}
          daytimeSource={
            event.recurrence === "daily" || event.recurrence === "weekdays"
          }
        />
      ) : null}
    </>
  );
}
