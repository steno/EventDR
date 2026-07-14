"use client";

import { useMemo } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import {
  resolveLiveStatusDisplay,
  type LiveStatusDisplay,
  type LiveStatusDisplayOptions,
} from "@/lib/event-status-label";
import { useLiveClockMs } from "@/hooks/useLiveClock";

/** Client-only live labels — avoids SSR/client clock drift hydration mismatches. */
export function useLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time" | "recurrence">,
  dict: Dictionary,
  options?: LiveStatusDisplayOptions,
): LiveStatusDisplay | null {
  const nowMs = useLiveClockMs();
  const listTimeRange = options?.listTimeRange;

  return useMemo(() => {
    // getServerSnapshot is 0 — keep null through SSR and the hydration match pass.
    if (nowMs === 0) return null;
    return resolveLiveStatusDisplay(event, dict, new Date(nowMs), {
      listTimeRange,
    });
  }, [
    dict,
    event.date,
    event.endDate,
    event.time,
    event.recurrence,
    listTimeRange,
    nowMs,
  ]);
}
