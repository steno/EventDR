import { isResendConfigured } from "@/lib/newsletter";
import { SITE_URL } from "@/lib/site-url";
import { formatEventPlace } from "@/lib/event-location";
import type { Event } from "@/lib/types";

const DEFAULT_NOTIFY_EMAIL = "popeventdr@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function moderatorNotifyEmail(): string | null {
  const configured = process.env.MODERATOR_NOTIFY_EMAIL?.trim().toLowerCase();
  const email = configured || DEFAULT_NOTIFY_EMAIL;
  if (!EMAIL_PATTERN.test(email)) return null;
  return email;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Email the moderator when a community event lands in the pending queue.
 * Never throws to the caller — submit must succeed even if mail fails.
 */
export async function sendModeratorSubmissionEmail(
  event: Event,
): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  if (!isResendConfigured()) {
    return { ok: false, skipped: true, error: "not-configured" };
  }
  const to = moderatorNotifyEmail();
  if (!to) return { ok: false, skipped: true, error: "no-recipient" };

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (!apiKey || !from) {
    return { ok: false, skipped: true, error: "not-configured" };
  }

  const moderateUrl = `${SITE_URL}/en/moderate`;
  const place = formatEventPlace(event);
  const when = [event.date, event.time].filter(Boolean).join(" · ");
  const subject = `New POP submission: ${event.title}`;
  const text = [
    "A community event is waiting for review.",
    "",
    `Title: ${event.title}`,
    `When: ${when}`,
    `Where: ${place}`,
    `Id: ${event.id}`,
    "",
    `Moderate: ${moderateUrl}`,
  ].join("\n");
  const html = `
<p style="margin:0 0 12px;font-size:16px;font-weight:700">New community submission</p>
<p style="margin:0 0 8px"><strong>${escapeHtml(event.title)}</strong></p>
<p style="margin:0 0 4px;color:#525252">${escapeHtml(when)}</p>
<p style="margin:0 0 16px;color:#525252">${escapeHtml(place)}</p>
<p style="margin:0 0 20px"><a href="${moderateUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:10px 16px;border-radius:999px;font-weight:700;font-size:14px">Open moderation queue</a></p>
<p style="margin:0;color:#a3a3a3;font-size:12px">${escapeHtml(event.id)}</p>
`.trim();

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: DEFAULT_NOTIFY_EMAIL,
        subject,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as {
        message?: string;
        error?: { message?: string };
      };
      const error =
        body.error?.message ?? body.message ?? `http-${response.status}`;
      console.error("moderator-notify: send failed:", error);
      return { ok: false, error };
    }
    return { ok: true };
  } catch (err) {
    console.error("moderator-notify: send error:", err);
    return { ok: false, error: "network" };
  }
}
