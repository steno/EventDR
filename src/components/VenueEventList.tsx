"use client";

import { useEffect, useRef } from "react";
import { FilteredEventList } from "@/components/FilteredEventList";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EVENT_LIST_VIEW_STORAGE_KEY } from "@/lib/event-list-view";

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
}

/**
 * Venue-specific event list that forces list view and hides the toggle.
 * This wrapper temporarily overrides the global view preference.
 */
export function VenueEventList(props: VenueEventListProps) {
  const originalView = useRef<string | null>(null);

  useEffect(() => {
    // Save original preference
    try {
      originalView.current = localStorage.getItem(EVENT_LIST_VIEW_STORAGE_KEY);
      // Force list view
      localStorage.setItem(EVENT_LIST_VIEW_STORAGE_KEY, "list");
    } catch {
      // Private mode / blocked storage
    }

    return () => {
      // Restore original preference on unmount
      try {
        if (originalView.current !== null) {
          localStorage.setItem(EVENT_LIST_VIEW_STORAGE_KEY, originalView.current);
        }
      } catch {
        // Private mode / blocked storage
      }
    };
  }, []);

  return (
    <div className="venue-event-list [&_[role='group'][aria-label]]:hidden">
      <FilteredEventList
        {...props}
        defaultTimeRange="all"
      />
    </div>
  );
}
