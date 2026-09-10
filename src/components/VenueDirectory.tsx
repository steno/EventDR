"use client";

import { MapPin } from "lucide-react";
import { EventImage } from "@/components/EventImage";
import { EventViewToggle } from "@/components/EventViewToggle";
import { IntentLink } from "@/components/IntentLink";
import { useEventListView } from "@/hooks/useEventListView";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { EventListView } from "@/lib/event-list-view";
import {
  venueDirectoryLetterHasVenues,
  venueDirectoryLetters,
  venueDirectorySectionId,
  type VenueDirectoryEntry,
  type VenueDirectoryGroup,
} from "@/lib/venues-directory";
import { StickyListFilters } from "@/components/StickyListFilters";
import { fillTemplate } from "@/lib/seo";
import { CARD_GRID_CLASS, SECTION_TITLE_CLASS } from "@/lib/page-shell";

interface VenueDirectoryProps {
  locale: Locale;
  dict: Dictionary;
  groups: VenueDirectoryGroup[];
}

function upcomingLabel(dict: Dictionary, count: number): string {
  if (count === 1) {
    return fillTemplate(dict.venues.directory.upcomingOne, { count: "1" });
  }
  return fillTemplate(dict.venues.directory.upcomingMany, {
    count: String(count),
  });
}

function LetterJumpNav({
  groups,
  dict,
  className = "",
}: {
  groups: VenueDirectoryGroup[];
  dict: Dictionary;
  className?: string;
}) {
  const letters = venueDirectoryLetters(groups);

  return (
    <nav
      aria-label={dict.venues.directory.letterNav}
      className={`flex flex-wrap justify-center gap-0.5 sm:gap-1 ${className}`}
    >
      {letters.map((letter) => {
        const active = venueDirectoryLetterHasVenues(groups, letter);
        if (!active) {
          return (
            <span
              key={letter}
              className="inline-flex h-8 min-w-8 items-center justify-center px-1 text-xs font-bold text-neutral-300 dark:text-neutral-700"
              aria-hidden
            >
              {letter}
            </span>
          );
        }
        return (
          <a
            key={letter}
            href={`#${venueDirectorySectionId(letter)}`}
            className="
              inline-flex h-8 min-w-8 items-center justify-center rounded-md px-1
              text-xs font-bold text-neutral-600 transition-colors touch-manipulation
              hover:bg-orange-50 hover:text-orange-700
              dark:text-neutral-300 dark:hover:bg-orange-950/40 dark:hover:text-orange-300
            "
          >
            {letter}
          </a>
        );
      })}
    </nav>
  );
}

function VenueListRow({
  entry,
  locale,
  dict,
  returnTo,
  returnTitle,
}: {
  entry: VenueDirectoryEntry;
  locale: Locale;
  dict: Dictionary;
  returnTo: string;
  returnTitle: string;
}) {
  const { venue, upcomingCount } = entry;

  return (
    <IntentLink
      href={`/${locale}/venue/${venue.slug}`}
      returnTo={returnTo}
      returnTitle={returnTitle}
      className="
        flex items-center gap-3 py-3 transition-colors touch-manipulation
        hover:bg-neutral-50/80 dark:hover:bg-neutral-900/50
        -mx-2 px-2 rounded-xl
      "
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-800">
        {venue.imageUrl ? (
          <EventImage
            src={venue.imageUrl}
            alt=""
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-xl"
            aria-hidden
          >
            {venue.emoji ?? "📍"}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-neutral-900 dark:text-neutral-100">
          {venue.name}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-neutral-500 dark:text-neutral-400">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{venue.city}</span>
        </p>
        {venue.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {venue.description}
          </p>
        ) : null}
        {upcomingCount > 0 ? (
          <p className="mt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            {upcomingLabel(dict, upcomingCount)}
          </p>
        ) : null}
      </div>
    </IntentLink>
  );
}

function VenueCard({
  entry,
  locale,
  dict,
  returnTo,
  returnTitle,
}: {
  entry: VenueDirectoryEntry;
  locale: Locale;
  dict: Dictionary;
  returnTo: string;
  returnTitle: string;
}) {
  const { venue, upcomingCount } = entry;

  return (
    <IntentLink
      href={`/${locale}/venue/${venue.slug}`}
      returnTo={returnTo}
      returnTitle={returnTitle}
      className="
        group flex h-full flex-col overflow-hidden rounded-2xl
        border border-neutral-200/90 bg-white
        shadow-[0_8px_24px_-16px_rgba(0,0,0,0.22)]
        transition-colors touch-manipulation
        hover:border-orange-300/70 dark:border-neutral-800 dark:bg-neutral-950
        dark:shadow-[0_8px_24px_-16px_rgba(0,0,0,0.6)] dark:hover:border-orange-700/50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500
      "
      aria-label={venue.name}
    >
      <div className="relative aspect-[2.4/1] w-full shrink-0 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {venue.imageUrl ? (
          <EventImage
            src={venue.imageUrl}
            alt=""
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-cover object-top sm:object-center card-media-zoom"
          />
        ) : (
          <span
            className="flex h-full w-full items-center justify-center text-2xl"
            aria-hidden
          >
            {venue.emoji ?? "📍"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 py-2.5 sm:px-3.5 sm:py-3">
        <h3 className="font-sans text-sm font-semibold leading-snug tracking-tight text-neutral-950 dark:text-neutral-50 sm:text-base">
          {venue.name}
        </h3>
        <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">
          {venue.city}
        </p>
        {venue.description ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-400 sm:text-sm">
            {venue.description}
          </p>
        ) : null}
        {upcomingCount > 0 ? (
          <p className="mt-auto pt-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
            {upcomingLabel(dict, upcomingCount)}
          </p>
        ) : null}
      </div>
    </IntentLink>
  );
}

function VenueGroupList({
  entries,
  locale,
  dict,
  view,
  returnTo,
  returnTitle,
}: {
  entries: VenueDirectoryEntry[];
  locale: Locale;
  dict: Dictionary;
  view: EventListView;
  returnTo: string;
  returnTitle: string;
}) {
  if (view === "cards") {
    return (
      <ul className={`mt-3 ${CARD_GRID_CLASS}`}>
        {entries.map((entry) => (
          <li key={entry.venue.slug} className="min-w-0">
            <VenueCard
              entry={entry}
              locale={locale}
              dict={dict}
              returnTo={returnTo}
              returnTitle={returnTitle}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="mt-3 divide-y divide-neutral-100 dark:divide-neutral-800">
      {entries.map((entry) => (
        <li key={entry.venue.slug}>
          <VenueListRow
            entry={entry}
            locale={locale}
            dict={dict}
            returnTo={returnTo}
            returnTitle={returnTitle}
          />
        </li>
      ))}
    </ul>
  );
}

/** A–Z venue index with list/card layouts and letter jump strips. */
export function VenueDirectory({ locale, dict, groups }: VenueDirectoryProps) {
  const { view, setView } = useEventListView();
  const returnTo = `/${locale}/venues`;
  const returnTitle = dict.venues.directory.title;

  if (groups.length === 0) return null;

  return (
    <div className="space-y-6">
      <StickyListFilters className="mb-0">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <LetterJumpNav groups={groups} dict={dict} className="sm:flex-1" />
          <div className="flex justify-end">
            <EventViewToggle value={view} onChange={setView} dict={dict} />
          </div>
        </div>
      </StickyListFilters>

      {groups.map((group) => (
        <section
          key={group.id}
          id={`venues-${group.id}`}
          aria-labelledby={`venues-${group.id}-heading`}
          className="scroll-mt-[calc(var(--sticky-list-header-height,3.5rem)+5.5rem)]"
        >
          <h2
            id={`venues-${group.id}-heading`}
            className={`${SECTION_TITLE_CLASS} tracking-tight`}
          >
            {group.label}
          </h2>
          <VenueGroupList
            entries={group.entries}
            locale={locale}
            dict={dict}
            view={view}
            returnTo={returnTo}
            returnTitle={returnTitle}
          />
        </section>
      ))}

      <LetterJumpNav groups={groups} dict={dict} className="pt-2" />
    </div>
  );
}
