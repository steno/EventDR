import type { Event } from "./types";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toIcsDate(date: Date): string {
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

export function downloadCalendarEvent(event: Event): void {
  const start = new Date(event.date);
  const parsed = parseTime(event.time);
  if (parsed) {
    start.setHours(parsed.hours, parsed.minutes, 0, 0);
  } else {
    start.setHours(18, 0, 0, 0);
  }

  const end = new Date(start);
  end.setHours(end.getHours() + 2);

  const location = [event.venue, event.location].filter(Boolean).join(", ");
  const uid = `${event.id}@eventdr.app`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//POP Events//North Coast DR//EN",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${event.title.replace(/[,;\\]/g, "")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, "\\n").replace(/[,;\\]/g, "")}`,
    `LOCATION:${location.replace(/[,;\\]/g, "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
