import type { Event } from "./types";
import { isAllDayTimePlaceholder } from "./event-status";

const LIST_TIME_MAX = 34;

/** Drop redundant :00 and normalize separators for card rows. */
function compactClockCopy(raw: string): string {
  return raw
    .replace(/\s+/g, " ")
    .replace(/:00\s*(AM|PM)/gi, " $1")
    .replace(/\s*[-–—]\s*/g, "–")
    .replace(/\s*;\s*/g, " · ")
    .trim();
}

/** Strip a leading weekday range when daily recurrence already signals it. */
function stripLeadingDayRange(segment: string): string {
  return segment.replace(
    /^(?:Mon(?:day)?(?:[–-]Sat(?:urday)?)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?(?:[–-]Sat(?:urday)?)?)\s+/i,
    "",
  );
}

/**
 * Short list-row time — keeps one line on cards.
 * Full schedule stays in `title` for hover / screen readers.
 */
export function formatEventTimeForList(
  time: string | undefined,
  options?: Pick<Event, "recurrence"> & { allDayLabel?: string },
): { display: string; full: string } {
  const full = time?.trim() ?? "";
  if (!full) return { display: "", full: "" };

  // Midnight-only multi-day placeholders are not a real clock time.
  if (isAllDayTimePlaceholder(full)) {
    const label = options?.allDayLabel?.trim() || "All day";
    return { display: label, full: label };
  }

  let display = compactClockCopy(full);

  if (options?.recurrence === "daily" && /;\s*/.test(full)) {
    const segments = full.split(/\s*;\s*/).map(compactClockCopy);
    display = segments
      .map((segment, index) =>
        index === 0 ? stripLeadingDayRange(segment) : segment,
      )
      .filter(Boolean)
      .join(" · ");
  }

  if (display.length > LIST_TIME_MAX) {
    display = `${display.slice(0, LIST_TIME_MAX - 1).trimEnd()}…`;
  }

  return { display, full };
}
