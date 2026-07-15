import { createHash, randomBytes } from "crypto";
import { FieldValue } from "firebase-admin/firestore";
import { isValidLocale, type Locale } from "@/i18n/config";
import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { formatEventDateRange } from "@/lib/format-date";
import { buildPartnerDigest, type PartnerDigest } from "@/lib/partner-digest";
import { SITE_URL } from "@/lib/site-url";

const COLLECTION = "mailboxSubscriptions";
/** Resend free plan hard limit — stay under it on Friday blasts. */
const FREE_DAILY_SEND_CAP = 100;

export type MailboxSubscriber = {
  email: string;
  locale: Locale;
  unsubscribeToken: string;
  createdAt?: unknown;
  updatedAt?: unknown;
};

export function isMailboxEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.MAIL_FROM?.trim());
}

export function mailboxDocId(email: string): string {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function normalizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return null;
  if (trimmed.length > 254) return null;
  return trimmed;
}

function normalizeLocale(locale: string | undefined): Locale {
  return locale && isValidLocale(locale) ? locale : "en";
}

/** Persist signup for weekly digests. Returns false if Firebase is unavailable. */
export async function saveMailboxSubscriber(input: {
  email: string;
  locale?: string;
}): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const email = normalizeEmail(input.email);
  if (!email) return { ok: false, error: "invalid_email" };
  if (!isFirebaseConfigured()) return { ok: false, error: "firebase_unavailable" };

  const db = getFirestoreDb();
  if (!db) return { ok: false, error: "firebase_unavailable" };

  const id = mailboxDocId(email);
  const ref = db.collection(COLLECTION).doc(id);
  const existing = await ref.get();
  const locale = normalizeLocale(input.locale);
  const unsubscribeToken =
    (existing.exists && (existing.data()?.unsubscribeToken as string | undefined)) ||
    randomBytes(24).toString("hex");

  await ref.set(
    {
      email,
      locale,
      unsubscribeToken,
      updatedAt: FieldValue.serverTimestamp(),
      ...(existing.exists ? {} : { createdAt: FieldValue.serverTimestamp() }),
    },
    { merge: true },
  );

  return { ok: true, email };
}

/** Best-effort mirror into Netlify Forms dashboard (free). */
export async function mirrorToNetlifyForms(email: string, locale: Locale): Promise<void> {
  try {
    await fetch(`${SITE_URL}/__forms.html`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "events-mailbox",
        email,
        locale,
      }).toString(),
    });
  } catch (err) {
    console.warn("Netlify Forms mirror failed:", err);
  }
}

export async function unsubscribeMailbox(token: string): Promise<boolean> {
  const trimmed = token.trim();
  if (!trimmed || trimmed.length < 16) return false;
  if (!isFirebaseConfigured()) return false;

  const db = getFirestoreDb();
  if (!db) return false;

  const snap = await db
    .collection(COLLECTION)
    .where("unsubscribeToken", "==", trimmed)
    .limit(1)
    .get();

  if (snap.empty) return false;
  await snap.docs[0]!.ref.delete();
  return true;
}

async function listActiveSubscribers(): Promise<MailboxSubscriber[]> {
  const db = getFirestoreDb();
  if (!db) return [];

  const snap = await db.collection(COLLECTION).get();
  const subscribers: MailboxSubscriber[] = [];
  for (const doc of snap.docs) {
    const data = doc.data();
    const email = typeof data.email === "string" ? normalizeEmail(data.email) : null;
    const token = typeof data.unsubscribeToken === "string" ? data.unsubscribeToken : null;
    if (!email || !token) continue;
    subscribers.push({
      email,
      locale: normalizeLocale(data.locale as string | undefined),
      unsubscribeToken: token,
    });
  }
  return subscribers;
}

function subjectFor(digest: PartnerDigest): string {
  const subjects: Record<Locale, string> = {
    en: `This weekend on the North Coast — ${digest.eventCount} events`,
    es: `Este fin de semana en la Costa Norte — ${digest.eventCount} eventos`,
    fr: `Ce week-end sur la Côte Nord — ${digest.eventCount} événements`,
  };
  return subjects[digest.locale];
}

function introFor(locale: Locale): string {
  const intros: Record<Locale, string> = {
    en: "Your free weekend picks for Puerto Plata, Sosúa & Cabarete.",
    es: "Tu selección gratis del fin de semana para Puerto Plata, Sosúa y Cabarete.",
    fr: "Votre sélection gratuite du week-end pour Puerto Plata, Sosúa et Cabarete.",
  };
  return intros[locale];
}

function browseLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "Browse all weekend events",
    es: "Ver todos los eventos del fin de semana",
    fr: "Voir tous les événements du week-end",
  };
  return labels[locale];
}

function unsubscribeLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: "Unsubscribe",
    es: "Cancelar suscripción",
    fr: "Se désabonner",
  };
  return labels[locale];
}

function buildEmailBodies(
  digest: PartnerDigest,
  unsubscribeUrl: string,
): { html: string; text: string } {
  const { locale, weekendLabel, events, links } = digest;
  const top = events.slice(0, 12);

  const textLines = [
    weekendLabel,
    introFor(locale),
    "",
    ...top.map((e) => {
      const when = formatEventDateRange(e.date, locale, { short: true });
      const timePart = e.time ? ` · ${e.time}` : "";
      return `• ${e.title}\n  ${when}${timePart} · ${e.place}\n  ${e.url}`;
    }),
    "",
    `${browseLabel(locale)}: ${links.weekend}`,
    "",
    `${unsubscribeLabel(locale)}: ${unsubscribeUrl}`,
  ];

  const eventRows = top
    .map((e) => {
      const when = formatEventDateRange(e.date, locale, { short: true });
      const timePart = e.time ? ` · ${e.time}` : "";
      return `<tr>
  <td style="padding:12px 0;border-bottom:1px solid #eee;font-family:system-ui,sans-serif;">
    <a href="${e.url}" style="color:#111;font-weight:700;text-decoration:none;font-size:15px;">${escapeHtml(e.title)}</a>
    <div style="color:#666;font-size:13px;margin-top:4px;">${escapeHtml(`${when}${timePart}`)} · ${escapeHtml(e.place)}</div>
  </td>
</tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<body style="margin:0;padding:24px;background:#fafafa;color:#111;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:28px 24px;">
    <tr><td>
      <div style="font-size:12px;font-weight:700;letter-spacing:0.04em;color:#f97316;">POP Events</div>
      <h1 style="margin:8px 0 6px;font-size:22px;line-height:1.25;font-family:system-ui,sans-serif;">${escapeHtml(weekendLabel)}</h1>
      <p style="margin:0 0 20px;color:#555;font-size:14px;font-family:system-ui,sans-serif;">${escapeHtml(introFor(locale))}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${eventRows}</table>
      <p style="margin:24px 0 0;">
        <a href="${links.weekend}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:999px;font-family:system-ui,sans-serif;">${escapeHtml(browseLabel(locale))}</a>
      </p>
      <p style="margin:28px 0 0;font-size:12px;color:#999;font-family:system-ui,sans-serif;">
        <a href="${unsubscribeUrl}" style="color:#999;">${escapeHtml(unsubscribeLabel(locale))}</a>
      </p>
    </td></tr>
  </table>
</body>
</html>`;

  return { html, text: textLines.join("\n") };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendViaResend(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY!.trim();
  const from = process.env.MAIL_FROM!.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.warn("Resend send failed:", res.status, body);
    return false;
  }
  return true;
}

/**
 * Friday weekend digest to mailbox subscribers via Resend free tier.
 * Skips cleanly when RESEND_API_KEY / MAIL_FROM are unset.
 */
export async function sendMailboxWeekendDigest(): Promise<{
  attempted: number;
  sent: number;
  skippedUnconfigured: boolean;
}> {
  if (!isMailboxEmailConfigured()) {
    return { attempted: 0, sent: 0, skippedUnconfigured: true };
  }

  const subscribers = await listActiveSubscribers();
  if (subscribers.length === 0) {
    return { attempted: 0, sent: 0, skippedUnconfigured: false };
  }

  const digests = {
    en: await buildPartnerDigest("en"),
    es: await buildPartnerDigest("es"),
    fr: await buildPartnerDigest("fr"),
  };

  // Cap to free daily quota so we never trigger overage.
  const queue = subscribers.slice(0, FREE_DAILY_SEND_CAP);
  let sent = 0;

  for (const sub of queue) {
    const digest = digests[sub.locale];
    const unsubscribeUrl = `${SITE_URL}/api/mailbox/unsubscribe?token=${encodeURIComponent(sub.unsubscribeToken)}`;
    const { html, text } = buildEmailBodies(digest, unsubscribeUrl);
    const ok = await sendViaResend({
      to: sub.email,
      subject: subjectFor(digest),
      html,
      text,
    });
    if (ok) sent++;
  }

  if (subscribers.length > FREE_DAILY_SEND_CAP) {
    console.warn(
      `Mailbox digest capped at ${FREE_DAILY_SEND_CAP} (Resend free daily limit); ${subscribers.length - FREE_DAILY_SEND_CAP} deferred`,
    );
  }

  return { attempted: queue.length, sent, skippedUnconfigured: false };
}
