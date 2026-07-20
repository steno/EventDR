"use client";

import { FilteredEventList } from "@/components/FilteredEventList";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

interface VenueEventListProps {
  events: Event[];
  loading: boolean;
  dict: Dictionary;
  locale: Locale;
  emptyMessage: string;
  sectionTitle?: string;
  returnTo?: string;
  initialExpanded?: boolean;
  onAddEvent?: () => void;
  addEventLabel?: string;
}

/** Venue schedules use the compact list layout (no view toggle). */
export function VenueEventList(props: VenueEventListProps) {
  return (
    <FilteredEventList
      {...props}
      defaultTimeRange="all"
      view="list"
      scrollOnFilterChange={false}
      addEventCta="inline"
    />
  );
}
