"use client";

import { useEffect, useState } from "react";
import {
  fetchEventInterestCount,
  isInterestSynced,
  isInterestSyncedOrPending,
  sendEventInterest,
} from "@/lib/event-interest-client";

type Loaded = {
  eventId: string;
  count: number;
  /** Whether the fetched count already included this device. */
  includesDevice: boolean;
};

/**
 * Public interest count for one event. Loads after hydration (detail HTML is
 * ISR-cached) and follows this device's Save toggle without a refetch.
 */
export function useEventInterestCount(
  eventId: string | undefined,
  isSaved: boolean,
): number | null {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    void fetchEventInterestCount(eventId).then((count) => {
      if (cancelled || count === null) return;
      setLoaded({ eventId, count, includesDevice: isInterestSynced(eventId) });
    });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // Saved before interest counts existed — count it once.
  useEffect(() => {
    if (eventId && isSaved && !isInterestSyncedOrPending(eventId)) {
      void sendEventInterest([eventId], "add");
    }
  }, [eventId, isSaved]);

  if (!loaded || loaded.eventId !== eventId) return null;
  const others = loaded.count - (loaded.includesDevice ? 1 : 0);
  return Math.max(0, others) + (isSaved ? 1 : 0);
}
