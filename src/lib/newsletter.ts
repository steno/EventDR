import { getFirestoreDb, isFirebaseConfigured } from "@/lib/firebase/admin";
import { isValidLocale, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site-url";
import type { PartnerDigest, PartnerDigestEvent } from "@/lib/partner-digest";
import { formatEventDateRange } from "@/lib/format-date";
import { getDictionary } from "@/i18n/dictionaries";

export const NEWSLETTER_COLLECTION = "newsletterSubscribers";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidNewsletterEmail(email: string): boolean {
  return email.length > 0 && email.length <= 254 && EMAIL_PATTERN.test(email);
}

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
}

export type NewsletterSubscriber = {
  email: string;
  locale: Locale;
  token: string;
};

function newsletterUrl(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${SITE_URL}${path}${sep}utm_source=newsletter&utm_medium=email&utm_campaign=weekend`;
}

export function unsubscribeUrl(locale: Locale, token: string): string {
  return `${SITE_URL}/${locale}/newsletter/unsubscribe?t=${encodeURIComponent(token)}`;
}

type ResendResult = { ok: boolean; id?: string; error?: string };

async function resendSend(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}): Promise<ResendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) return { ok: false, error: "not-configured" };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      reply_to: "popeventdr@gmail.com",
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      headers: payload.headers,
    }),
  });

  const body = (await response.json().catch(() => ({}))) as {
    id?: string;
    message?: string;
    error?: { message?: string };
  };
  if (!response.ok) {
    return {
      ok: false,
      error: body.error?.message ?? body.message ?? `http-${response.status}`,
    };
  }
  return { ok: true, id: body.id };
}

const WELCOME_SUBJECT: Record<Locale, string> = {
  en: "You’re in — North Coast weekends from POP Events",
  es: "Listo — fines de semana de la Costa Norte con POP Eventos",
  fr: "C’est noté — week-ends Côte Nord avec POP Events",
};

export async function sendWelcomeEmail(
  email: string,
  locale: Locale,
  token: string,
): Promise<ResendResult> {
  const home = newsletterUrl(`/${locale}`);
  const unsub = unsubscribeUrl(locale, token);
  const copy: Record<Locale, { html: string; text: string }> = {
    en: {
      text: `Thanks for subscribing to POP Events.\n\nEvery Friday we’ll email what’s on this weekend in Puerto Plata, Sosúa, and Cabarete.\n\nBrowse now: ${home}\n\nUnsubscribe: ${unsub}`,
      html: `<p>Thanks for subscribing to POP Events.</p><p>Every Friday we’ll email what’s on this weekend in Puerto Plata, Sosúa, and Cabarete.</p><p><a href="${home}">Browse the calendar</a></p><p style="color:#737373;font-size:12px"><a href="${unsub}">Unsubscribe</a></p>`,
    },
    es: {
      text: `Gracias por suscribirte a POP Eventos.\n\nCada viernes te enviaremos lo que hay este fin de semana en Puerto Plata, Sosúa y Cabarete.\n\nVer el calendario: ${home}\n\nCancelar: ${unsub}`,
      html: `<p>Gracias por suscribirte a POP Eventos.</p><p>Cada viernes te enviaremos lo que hay este fin de semana en Puerto Plata, Sosúa y Cabarete.</p><p><a href="${home}">Ver el calendario</a></p><p style="color:#737373;font-size:12px"><a href="${unsub}">Cancelar suscripción</a></p>`,
    },
    fr: {
      text: `Merci de vous être inscrit à POP Events.\n\nChaque vendredi, nous envoyons ce qu’il se passe ce week-end à Puerto Plata, Sosúa et Cabarete.\n\nVoir le calendrier : ${home}\n\nSe désinscrire : ${unsub}`,
      html: `<p>Merci de vous être inscrit à POP Events.</p><p>Chaque vendredi, nous envoyons ce qu’il se passe ce week-end à Puerto Plata, Sosúa et Cabarete.</p><p><a href="${home}">Voir le calendrier</a></p><p style="color:#737373;font-size:12px"><a href="${unsub}">Se désinscrire</a></p>`,
    },
  };
  const body = copy[locale];
  return resendSend({
    to: email,
    subject: WELCOME_SUBJECT[locale],
    html: wrapEmailHtml(body.html),
    text: body.text,
    headers: {
      "List-Unsubscribe": `<${unsub}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function eventLine(event: PartnerDigestEvent, locale: Locale): { html: string; text: string } {
  const dict = getDictionary(locale);
  const when = formatEventDateRange(event.date, locale, { short: true });
  const timePart = event.time ? ` · ${event.time}` : "";
  const url = newsletterUrl(`/${locale}/event/${event.id}`);
  const cat = dict.categories[event.category];
  return {
    text: `• ${event.title} (${when}${timePart})\n  ${event.place} · ${cat}\n  ${url}`,
    html: `<p style="margin:0 0 14px"><a href="${url}" style="color:#0a0a0a;font-weight:700;text-decoration:none">${escapeHtml(event.title)}</a><br/><span style="color:#525252;font-size:14px">${escapeHtml(when)}${escapeHtml(timePart)} · ${escapeHtml(event.place)} · ${escapeHtml(cat)}</span></p>`,
  };
}

export function buildWeekendNewsletter(
  digest: PartnerDigest,
  token: string,
): { subject: string; html: string; text: string } {
  const { locale } = digest;
  const highlights = digest.events.slice(0, 12);
  const weekend = newsletterUrl(`/${locale}/when/weekend`);
  const unsub = unsubscribeUrl(locale, token);
  const browse: Record<Locale, string> = {
    en: "See all weekend events",
    es: "Ver todos los eventos del fin de semana",
    fr: "Voir tous les événements du week-end",
  };
  const empty: Record<Locale, string> = {
    en: "Quiet weekend in the listings — check the calendar for daily spots and recurring nights.",
    es: "Fin de semana tranquilo en la agenda — mira el calendario para planes diarios y noches fijas.",
    fr: "Week-end calme au calendrier — consultez les spots du quotidien et les soirées récurrentes.",
  };

  const lines = highlights.map((event) => eventLine(event, locale));
  const intro =
    highlights.length > 0
      ? lines.map((line) => line.text).join("\n\n")
      : empty[locale];
  const text = [
    digest.weekendLabel,
    "",
    intro,
    "",
    `${browse[locale]}: ${weekend}`,
    "",
    `Unsubscribe: ${unsub}`,
  ].join("\n");

  const inner =
    highlights.length > 0
      ? lines.map((line) => line.html).join("")
      : `<p>${escapeHtml(empty[locale])}</p>`;

  const html = wrapEmailHtml(
    `<h1 style="font-size:22px;margin:0 0 8px">${escapeHtml(digest.weekendLabel)}</h1>
<p style="color:#525252;margin:0 0 20px">POP Events · ${escapeHtml(String(digest.eventCount))} listings</p>
${inner}
<p style="margin:24px 0 0"><a href="${weekend}" style="display:inline-block;background:#f97316;color:#fff;font-weight:700;text-decoration:none;padding:12px 18px;border-radius:999px">${escapeHtml(browse[locale])}</a></p>
<p style="color:#737373;font-size:12px;margin:28px 0 0"><a href="${unsub}" style="color:#737373">Unsubscribe</a></p>`,
  );

  return { subject: digest.weekendLabel, html, text };
}

function wrapEmailHtml(inner: string): string {
  return `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#fafafa;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#0a0a0a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#fff;border-radius:16px;padding:28px;border:1px solid #f5f5f5">
<tr><td>${inner}</td></tr>
</table></td></tr></table></body></html>`;
}

export async function listActiveNewsletterSubscribers(): Promise<
  NewsletterSubscriber[]
> {
  if (!isFirebaseConfigured()) return [];
  const db = getFirestoreDb();
  if (!db) return [];
  const snap = await db
    .collection(NEWSLETTER_COLLECTION)
    .where("active", "==", true)
    .get();
  const out: NewsletterSubscriber[] = [];
  for (const doc of snap.docs) {
    const data = doc.data() as { email?: string; locale?: string };
    const email = data.email?.trim().toLowerCase() ?? "";
    if (!isValidNewsletterEmail(email)) continue;
    const locale = data.locale && isValidLocale(data.locale) ? data.locale : "en";
    out.push({ email, locale, token: doc.id });
  }
  return out;
}

export async function unsubscribeByToken(token: string): Promise<boolean> {
  const trimmed = token.trim();
  if (!trimmed || trimmed.length < 16 || trimmed.length > 128) return false;
  if (!isFirebaseConfigured()) return false;
  const db = getFirestoreDb();
  if (!db) return false;
  const ref = db.collection(NEWSLETTER_COLLECTION).doc(trimmed);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.set({ active: false, unsubscribedAt: new Date().toISOString() }, { merge: true });
  return true;
}

/** Free-tier safe: Resend allows 100 emails/day. Leave headroom. */
export const NEWSLETTER_SEND_CAP = 80;

export async function sendWeekendNewsletters(digests: {
  en: PartnerDigest;
  es: PartnerDigest;
  fr: PartnerDigest;
}): Promise<{ sent: number; failed: number; skipped: number; total: number }> {
  const subscribers = await listActiveNewsletterSubscribers();
  const result = { sent: 0, failed: 0, skipped: 0, total: subscribers.length };
  if (!isResendConfigured()) {
    result.skipped = subscribers.length;
    return result;
  }

  for (const subscriber of subscribers.slice(0, NEWSLETTER_SEND_CAP)) {
    const digest = digests[subscriber.locale];
    const payload = buildWeekendNewsletter(digest, subscriber.token);
    const unsub = unsubscribeUrl(subscriber.locale, subscriber.token);
    try {
      const send = await resendSend({
        to: subscriber.email,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        headers: {
          "List-Unsubscribe": `<${unsub}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });
      if (send.ok) result.sent += 1;
      else result.failed += 1;
    } catch {
      result.failed += 1;
    }
  }
  result.skipped += Math.max(0, subscribers.length - NEWSLETTER_SEND_CAP);
  return result;
}
