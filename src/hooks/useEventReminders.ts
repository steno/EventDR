"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Event } from "@/lib/types";
import {
  type ReminderOffset,
  availableReminderTimings,
  resolveRemindableDate,
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

type PushSubscribeResult =
  | {
      ok: true;
      subscription: {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
    }
  | { ok: false; error: "unsupported" | "permission" | "failed" };

async function ensurePushSubscription(
  locale: Locale,
): Promise<PushSubscribeResult> {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    return { ok: false, error: "unsupported" };
  }

  // Prefer permission already granted in the click handler (Safari user-gesture).
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") {
    return { ok: false, error: "permission" };
  }

  try {
    // Fail fast before waiting on a missing service worker.
    const keyResponse = await fetch("/api/push/vapid-key");
    const keyData = (await keyResponse.json()) as {
      configured?: boolean;
      publicKey?: string;
    };
    if (!keyResponse.ok || !keyData.configured || !keyData.publicKey) {
      return { ok: false, error: "failed" };
    }

    // Local `next dev` used to skip SW registration; wait with a timeout so the
    // UI doesn't hang forever if registration is still settling.
    const registration = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise<null>((resolve) => {
        window.setTimeout(() => resolve(null), 8000);
      }),
    ]);
    if (!registration) {
      return { ok: false, error: "unsupported" };
    }

    const subscription =
      (await registration.pushManager.getSubscription()) ??
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodeVapidKey(keyData.publicKey),
      }));

    const serialized = subscription.toJSON();
    if (
      !serialized.endpoint ||
      !serialized.keys?.p256dh ||
      !serialized.keys?.auth
    ) {
      return { ok: false, error: "failed" };
    }

    const subscribeResponse = await fetch("/api/push/subscribe", {
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
    if (!subscribeResponse.ok) {
      return { ok: false, error: "failed" };
    }

    return {
      ok: true,
      subscription: {
        endpoint: serialized.endpoint,
        keys: {
          p256dh: serialized.keys.p256dh,
          auth: serialized.keys.auth,
        },
      },
    };
  } catch {
    return { ok: false, error: "failed" };
  }
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

  const canRemind = useCallback(
    (
      event: Pick<
        Event,
        | "date"
        | "time"
        | "endDate"
        | "recurrence"
        | "recurrenceDay"
        | "recurrenceDays"
      >,
    ) => {
      return availableReminderTimings(event).length > 0;
    },
    [],
  );

  const setReminder = useCallback(
    async (
      event: Pick<
        Event,
        | "id"
        | "title"
        | "date"
        | "time"
        | "endDate"
        | "recurrence"
        | "recurrenceDay"
        | "recurrenceDays"
      >,
      offset: ReminderOffset,
    ): Promise<{ ok: boolean; remindAt?: string; error?: "unsupported" | "permission" | "failed" }> => {
      if (!supported) return { ok: false, error: "unsupported" };
      setLoadingEventId(event.id);
      try {
        const push = await ensurePushSubscription(locale);
        if (!push.ok) return { ok: false, error: push.error };

        const eventDate = resolveRemindableDate(event) ?? event.date;

        const response = await fetch("/api/push/remind", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "set",
            eventId: event.id,
            eventTitle: event.title,
            eventDate,
            eventTime: event.time,
            offset,
            locale,
            url: eventDetailPath(locale, event.id),
            subscription: push.subscription,
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
        const push = await ensurePushSubscription(locale);
        if (!push.ok) {
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
            subscription: push.subscription,
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
