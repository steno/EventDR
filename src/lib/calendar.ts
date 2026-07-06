import type { Event } from "./types";
import { formatEventPlace } from "./event-location";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Local floating datetime for ICS (no Z suffix — interpreted in the user's timezone). */
function toIcsLocalDate(date: Date): string {
  return (
    date.getFullYear() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

function parseTime(timeStr?: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (meridiem === "PM" && hours < 12) hours += 12;
  if (meridiem === "AM" && hours === 12) hours = 0;
  return { hours, minutes };
}

function toIcsUtcStamp(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

export function getEventDateRange(event: Event): { start: Date; end: Date } {
  const start = new Date(event.date + "T00:00:00");
  const parsed = parseTime(event.time);
  if (parsed) {
    start.setHours(parsed.hours, parsed.minutes, 0, 0);
  } else {
    start.setHours(18, 0, 0, 0);
  }

  const end = new Date(start);
  end.setHours(end.getHours() + 2);
  return { start, end };
}

function buildIcs(event: Event, start: Date, end: Date): string {
  const location = formatEventPlace(event);
  const uid = `${event.id}@popevent.app`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//POP Events//North Coast DR//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtcStamp(new Date())}`,
    `DTSTART:${toIcsLocalDate(start)}`,
    `DTEND:${toIcsLocalDate(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function icsFilename(event: Event): string {
  const slug = event.title
    .slice(0, 40)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || event.id}.ics`;
}

function googleCalendarUrl(
  event: Event,
  start: Date,
  end: Date,
  location: string,
): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toIcsLocalDate(start)}/${toIcsLocalDate(end)}`,
    details: event.description,
    location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function isMobileDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

async function shareIcsFile(ics: string, filename: string): Promise<boolean> {
  if (typeof navigator.share !== "function" || typeof File === "undefined") {
    return false;
  }

  const file = new File([ics], filename, { type: "text/calendar" });
  if (navigator.canShare && !navigator.canShare({ files: [file] })) {
    return false;
  }

  try {
    await navigator.share({ files: [file], title: filename });
    return true;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") return true;
    return false;
  }
}

function openIcsBlob(ics: string): boolean {
  try {
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.location.assign(url);
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return true;
  } catch {
    return false;
  }
}

function downloadIcs(ics: string, filename: string): void {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Add event to the user's calendar — native share on mobile, Google Calendar or .ics on desktop. */
export async function addToCalendar(event: Event): Promise<void> {
  const { start, end } = getEventDateRange(event);
  const location = formatEventPlace(event);
  const ics = buildIcs(event, start, end);
  const filename = icsFilename(event);

  // iOS / Android: share sheet → "Add to Calendar" / Google Calendar / etc.
  if (await shareIcsFile(ics, filename)) return;

  if (isMobileDevice()) {
    // iOS Safari: opening the blob often prompts to import into Calendar
    if (isIOS() && openIcsBlob(ics)) return;

    // Android & fallback: Google Calendar opens the native app when installed
    window.open(
      googleCalendarUrl(event, start, end, location),
      "_blank",
      "noopener,noreferrer",
    );
    return;
  }

  // Desktop: Google Calendar (or download if pop-up blocked)
  const url = googleCalendarUrl(event, start, end, location);
  const tab = window.open(url, "_blank", "noopener,noreferrer");
  if (!tab) downloadIcs(ics, filename);
}

/** @deprecated Use addToCalendar */
export function downloadCalendarEvent(event: Event): void {
  const { start, end } = getEventDateRange(event);
  downloadIcs(buildIcs(event, start, end), icsFilename(event));
}
