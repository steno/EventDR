"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import {
  resolveLiveStatusDisplay,
  type LiveStatusDisplay,
  type LiveStatusDisplayOptions,
} from "@/lib/event-status-label";

/** Client-only live labels — avoids SSR/client clock drift hydration mismatches. */
export function useLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  options?: LiveStatusDisplayOptions,
): LiveStatusDisplay | null {
  const [display, setDisplay] = useState<LiveStatusDisplay | null>(null);
  const listTimeRange = options?.listTimeRange;

  useEffect(() => {
    const update = () =>
      setDisplay(resolveLiveStatusDisplay(event, dict, new Date(), options));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [dict, event.date, event.endDate, event.time, event.recurrence, listTimeRange]);

  return display;
}
