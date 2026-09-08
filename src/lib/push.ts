import webpush from "web-push";
import { getFirestoreDb, isFirebaseConfigured, subscriptionDocId } from "./firebase/admin";
import {
  reminderDocId,
  type ReminderOffset,
} from "./event-reminders";
import {
  canUseLocalPushStore,
  deleteLocalEventReminder,
  saveLocalSubscription,
  upsertLocalEventReminder,
} from "./push-local-store";

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT,
  );
}

export function getVapidPublicKey(): string | null {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? process.env.VAPID_PUBLIC_KEY ?? null;
}

function configureWebPush() {
  if (!isPushConfigured()) return false;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  return true;
}

export async function saveSubscription(sub: {
  endpoint: string;
  p256dh: string;
  auth: string;
  locale?: string;
  lat?: number;
  lng?: number;
}): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    return canUseLocalPushStore() ? saveLocalSubscription(sub) : false;
  }
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await db
      .collection("pushSubscriptions")
      .doc(subscriptionDocId(sub.endpoint))
      .set({
        endpoint: sub.endpoint,
        p256dh: sub.p256dh,
        auth: sub.auth,
        locale: sub.locale ?? "en",
        lat: sub.lat ?? null,
        lng: sub.lng ?? null,
      });
    return true;
  } catch (err) {
    console.error("saveSubscription:", err);
    return false;
  }
}

export async function sendWeekendDigest(count: number): Promise<number> {
  if (!configureWebPush()) return 0;

  const db = getFirestoreDb();
  if (!db) return 0;

  const snap = await db.collection("pushSubscriptions").get();
  if (snap.empty) return 0;

  let sent = 0;
  for (const doc of snap.docs) {
    const sub = doc.data();
    const locale = (sub.locale as string | undefined) ?? "en";
    const title =
      locale === "es"
        ? `${count} eventos nuevos este fin de semana`
        : locale === "fr"
          ? `${count} nouveaux événements ce week-end`
          : `${count} new events near you this weekend`;
    const body =
      locale === "es"
        ? "Descubre qué pasa en la Costa Norte de RD"
        : locale === "fr"
          ? "Découvrez la Côte Nord de RD"
          : "Discover what's happening on the North Coast of DR";

    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint as string,
          keys: {
            p256dh: sub.p256dh as string,
            auth: sub.auth as string,
          },
        },
        JSON.stringify({
          title,
          body,
          url: `/${locale}`,
        }),
      );
      sent++;
    } catch (err) {
      console.warn("Push failed for endpoint:", err);
    }
  }
  return sent;
}

export type EventReminderRecord = {
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

export async function upsertEventReminder(
  reminder: Omit<EventReminderRecord, "sent" | "createdAt"> & {
    createdAt?: string;
  },
): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    return canUseLocalPushStore() ? upsertLocalEventReminder(reminder) : false;
  }
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const id = reminderDocId(reminder.endpoint, reminder.eventId);
    await db
      .collection("eventReminders")
      .doc(id)
      .set({
        ...reminder,
        sent: false,
        createdAt: reminder.createdAt ?? new Date().toISOString(),
      });
    return true;
  } catch (err) {
    console.error("upsertEventReminder:", err);
    return false;
  }
}

export async function deleteEventReminder(
  endpoint: string,
  eventId: string,
): Promise<boolean> {
  if (!isFirebaseConfigured()) {
    return canUseLocalPushStore()
      ? deleteLocalEventReminder(endpoint, eventId)
      : false;
  }
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    await db
      .collection("eventReminders")
      .doc(reminderDocId(endpoint, eventId))
      .delete();
    return true;
  } catch (err) {
    console.error("deleteEventReminder:", err);
    return false;
  }
}

function reminderCopy(
  locale: string,
  eventTitle: string,
): { title: string; body: string } {
  if (locale === "es") {
    return {
      title: "Recordatorio de evento",
      body: `${eventTitle} — ¡es pronto!`,
    };
  }
  if (locale === "fr") {
    return {
      title: "Rappel d'événement",
      body: `${eventTitle} — c'est bientôt !`,
    };
  }
  return {
    title: "Event reminder",
    body: `${eventTitle} — happening soon`,
  };
}

/** Send due event reminders and mark them sent. */
export async function sendDueEventReminders(
  now: Date = new Date(),
): Promise<{ sent: number; failed: number; skipped: number }> {
  if (!configureWebPush()) {
    return { sent: 0, failed: 0, skipped: 0 };
  }

  const db = getFirestoreDb();
  if (!db) return { sent: 0, failed: 0, skipped: 0 };

  const snap = await db
    .collection("eventReminders")
    .where("sent", "==", false)
    .get();

  if (snap.empty) return { sent: 0, failed: 0, skipped: 0 };

  const nowMs = now.getTime();
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const doc of snap.docs) {
    const data = doc.data() as EventReminderRecord;
    const remindAtMs = Date.parse(data.remindAt);
    if (!Number.isFinite(remindAtMs) || remindAtMs > nowMs) {
      skipped += 1;
      continue;
    }

    const locale = data.locale || "en";
    const copy = reminderCopy(locale, data.eventTitle);

    try {
      await webpush.sendNotification(
        {
          endpoint: data.endpoint,
          keys: {
            p256dh: data.p256dh,
            auth: data.auth,
          },
        },
        JSON.stringify({
          title: copy.title,
          body: copy.body,
          url: data.url || `/${locale}/event/${data.eventId}`,
        }),
      );
      await doc.ref.update({
        sent: true,
        sentAt: now.toISOString(),
      });
      sent += 1;
    } catch (err) {
      console.warn("Event reminder push failed:", err);
      failed += 1;
      // Drop dead subscriptions so we don't retry forever.
      const status =
        err && typeof err === "object" && "statusCode" in err
          ? Number((err as { statusCode?: number }).statusCode)
          : 0;
      if (status === 404 || status === 410) {
        await doc.ref.delete().catch(() => {});
      }
    }
  }

  return { sent, failed, skipped };
}
