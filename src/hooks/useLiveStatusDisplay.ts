"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Event } from "@/lib/types";
import {
  resolveLiveStatusDisplay,
  type LiveStatusDisplay,
} from "@/lib/event-status-label";

/** Client-only live labels — avoids SSR/client clock drift hydration mismatches. */
export function useLiveStatusDisplay(
  event: Pick<Event, "date" | "endDate" | "time">,
  dict: Dictionary,
): LiveStatusDisplay | null {
  const [display, setDisplay] = useState<LiveStatusDisplay | null>(null);

  useEffect(() => {
    const update = () => setDisplay(resolveLiveStatusDisplay(event, dict));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, [dict, event.date, event.endDate, event.time]);

  return display;
}
