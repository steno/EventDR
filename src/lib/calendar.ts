import type { Event } from "./types";
import { formatEventPlace } from "./event-location";

import { parseLocalDate } from "./event-dates";

export type CalendarProvider = "google" | "apple" | "outlook" | "download";

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

function toIsoLocalDate(date: Date): string {
  const raw = toIcsLocalDate(date);
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T${raw.slice(9, 11)}:${raw.slice(11, 13)}:${raw.slice(13, 15)}`;
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
  if (event.endDate && event.endDate !== event.date) {
    const start = parseLocalDate(event.date);
    start.setHours(0, 0, 0, 0);
    const end = parseLocalDate(event.endDate);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }

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
  const uid = `${event.id}@pop-event.com`;

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

export function googleCalendarUrl(
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

export function outlookCalendarUrl(
  event: Event,
  start: Date,
  end: Date,
  location: string,
): string {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    body: event.description,
    location,
    startdt: toIsoLocalDate(start),
    enddt: toIsoLocalDate(end),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function isAppleCalendarAvailable(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return (
    /iPad|iPhone|iPod|Macintosh|Mac OS X/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

/** Open a calendar web URL — same-tab navigation when pop-ups are blocked. */
export function openExternalCalendar(url: string): void {
  const tab = window.open(url, "_blank", "noopener,noreferrer");
  if (!tab) {
    window.location.assign(url);
  }
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

async function addToAppleCalendar(ics: string, filename: string): Promise<void> {
  if (await shareIcsFile(ics, filename)) return;
  if (openIcsBlob(ics)) return;
  downloadIcs(ics, filename);
}

/** Add event via the chosen calendar provider. */
export async function addToCalendarProvider(
  event: Event,
  provider: CalendarProvider,
): Promise<void> {
  const { start, end } = getEventDateRange(event);
  const location = formatEventPlace(event);
  const ics = buildIcs(event, start, end);
  const filename = icsFilename(event);

  switch (provider) {
    case "google":
      openExternalCalendar(googleCalendarUrl(event, start, end, location));
      return;
    case "outlook":
      openExternalCalendar(outlookCalendarUrl(event, start, end, location));
      return;
    case "apple":
      await addToAppleCalendar(ics, filename);
      return;
    case "download":
      downloadIcs(ics, filename);
      return;
  }
}

/** @deprecated Use addToCalendarProvider */
export async function addToCalendar(event: Event): Promise<void> {
  await addToCalendarProvider(event, "google");
}

/** @deprecated Use addToCalendarProvider */
export function downloadCalendarEvent(event: Event): void {
  const { start, end } = getEventDateRange(event);
  downloadIcs(buildIcs(event, start, end), icsFilename(event));
}
