import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { reminderDocId, type ReminderOffset } from "@/lib/event-reminders";

const DATA_DIR = path.join(process.cwd(), ".data");
const SUBS_PATH = path.join(DATA_DIR, "push-subscriptions.json");
const REMINDERS_PATH = path.join(DATA_DIR, "event-reminders.json");

export function canUseLocalPushStore(): boolean {
  return process.env.NODE_ENV === "development";
}

function readJson<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(filePath: string, value: unknown) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(filePath, JSON.stringify(value, null, 2));
}

type LocalSub = {
  endpoint: string;
  p256dh: string;
  auth: string;
  locale: string;
  lat: number | null;
  lng: number | null;
};

type LocalReminder = {
  endpoint: string;
  p256dh: string;
  auth: string;
  locale: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  offset: ReminderOffset;
  remindAt: string;
  url: string;
  sent: boolean;
  createdAt: string;
};

export function saveLocalSubscription(sub: {
  endpoint: string;
  p256dh: string;
  auth: string;
  locale?: string;
  lat?: number;
  lng?: number;
}): boolean {
  const map = readJson<Record<string, LocalSub>>(SUBS_PATH, {});
  map[sub.endpoint] = {
    endpoint: sub.endpoint,
    p256dh: sub.p256dh,
    auth: sub.auth,
    locale: sub.locale ?? "en",
    lat: sub.lat ?? null,
    lng: sub.lng ?? null,
  };
  writeJson(SUBS_PATH, map);
  return true;
}

export function upsertLocalEventReminder(
  reminder: Omit<LocalReminder, "sent" | "createdAt"> & {
    createdAt?: string;
  },
): boolean {
  const map = readJson<Record<string, LocalReminder>>(REMINDERS_PATH, {});
  const id = reminderDocId(reminder.endpoint, reminder.eventId);
  map[id] = {
    ...reminder,
    sent: false,
    createdAt: reminder.createdAt ?? new Date().toISOString(),
  };
  writeJson(REMINDERS_PATH, map);
  return true;
}

export function deleteLocalEventReminder(
  endpoint: string,
  eventId: string,
): boolean {
  const map = readJson<Record<string, LocalReminder>>(REMINDERS_PATH, {});
  delete map[reminderDocId(endpoint, eventId)];
  writeJson(REMINDERS_PATH, map);
  return true;
}
