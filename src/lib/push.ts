import webpush from "web-push";
import { getFirestoreDb, isFirebaseConfigured, subscriptionDocId } from "./firebase/admin";

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
  if (!isFirebaseConfigured()) return false;
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
