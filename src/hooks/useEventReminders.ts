"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";
import {
  type ReminderOffset,
  availableReminderTimings,
} from "@/lib/event-reminders";
import { eventDetailPath } from "@/lib/event-navigation";

const STORAGE_KEY = "eventdr-reminders";

export type StoredReminder = {
  offset: ReminderOffset;
  remindAt: string;
  title: string;
};

type ReminderMap = Record<string, StoredReminder>;

function readStore(): ReminderMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ReminderMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(map: ReminderMap) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function decodeVapidKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes;
}

async function ensurePushSubscription(locale: Locale): Promise<{
  endpoint: string;
  keys: { p256dh: string; auth: string };
} | null> {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return null;
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();
  if (permission !== "granted") return null;

  const keyResponse = await fetch("/api/push/vapid-key");
  const keyData = (await keyResponse.json()) as {
    configured?: boolean;
    publicKey?: string;
  };
  if (!keyResponse.ok || !keyData.configured || !keyData.publicKey) {
    return null;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decodeVapidKey(keyData.publicKey),
    }));

  const serialized = subscription.toJSON();
  if (!serialized.endpoint || !serialized.keys?.p256dh || !serialized.keys?.auth) {
    return null;
  }

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subscription: {
        endpoint: serialized.endpoint,
        keys: serialized.keys,
      },
      locale,
    }),
  });

  return {
    endpoint: serialized.endpoint,
    keys: {
      p256dh: serialized.keys.p256dh,
      auth: serialized.keys.auth,
    },
  };
}

export function useEventReminders(locale: Locale) {
  const [reminders, setReminders] = useState<ReminderMap>({});
  const [ready, setReady] = useState(false);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const can =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;
    const frame = window.requestAnimationFrame(() => {
      setSupported(can);
      setReminders(readStore());
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const isReminded = useCallback(
    (eventId: string) => Boolean(reminders[eventId]),
    [reminders],
  );

  const getReminder = useCallback(
    (eventId: string) => reminders[eventId] ?? null,
    [reminders],
  );

  const canRemind = useCallback((event: Pick<Event, "date" | "time">) => {
    return availableReminderTimings(event).length > 0;
  }, []);

  const setReminder = useCallback(
    async (
      event: Pick<Event, "id" | "title" | "date" | "time">,
      offset: ReminderOffset,
    ): Promise<{ ok: boolean; remindAt?: string; error?: "unsupported" | "permission" | "failed" }> => {
      if (!supported) return { ok: false, error: "unsupported" };
      setLoadingEventId(event.id);
      try {
        const subscription = await ensurePushSubscription(locale);
        if (!subscription) return { ok: false, error: "permission" };

        const response = await fetch("/api/push/remind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set",
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.date,
            eventTime: event.time,
            offset,
            locale,
            url: eventDetailPath(locale, event.id),
            subscription,
          }),
        });

        const data = (await response.json()) as {
          success?: boolean;
          remindAt?: string;
        };
        if (!response.ok || !data.success || !data.remindAt) {
          return { ok: false, error: "failed" };
        }

        const next: ReminderMap = {
          ...readStore(),
          [event.id]: {
            offset,
            remindAt: data.remindAt,
            title: event.title,
          },
        };
        writeStore(next);
        setReminders(next);
        return { ok: true, remindAt: data.remindAt };
      } catch {
        return { ok: false, error: "failed" };
      } finally {
        setLoadingEventId(null);
      }
    },
    [locale, supported],
  );

  const cancelReminder = useCallback(
    async (
      eventId: string,
    ): Promise<{ ok: boolean; error?: "unsupported" | "permission" | "failed" }> => {
      if (!supported) return { ok: false, error: "unsupported" };
      setLoadingEventId(eventId);
      try {
        const subscription = await ensurePushSubscription(locale);
        if (!subscription) {
          // Still clear local state if permission was revoked.
          const next = { ...readStore() };
          delete next[eventId];
          writeStore(next);
          setReminders(next);
          return { ok: true };
        }

        const response = await fetch("/api/push/remind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "cancel",
            eventId,
            subscription,
          }),
        });
        if (!response.ok) return { ok: false, error: "failed" };

        const next = { ...readStore() };
        delete next[eventId];
        writeStore(next);
        setReminders(next);
        return { ok: true };
      } catch {
        return { ok: false, error: "failed" };
      } finally {
        setLoadingEventId(null);
      }
    },
    [locale, supported],
  );

  return {
    ready,
    supported,
    loadingEventId,
    isReminded,
    getReminder,
    canRemind,
    setReminder,
    cancelReminder,
  };
}
