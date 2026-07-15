import { NextRequest, NextResponse } from "next/server";
import { isValidLocale } from "@/i18n/config";
import {
  mirrorToNetlifyForms,
  saveMailboxSubscriber,
} from "@/lib/mailbox";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const email = typeof record.email === "string" ? record.email : "";
  const localeRaw = typeof record.locale === "string" ? record.locale : "en";
  const botField = typeof record["bot-field"] === "string" ? record["bot-field"] : "";

  // Honeypot tripped — pretend success.
  if (botField.trim()) {
    return NextResponse.json({ ok: true });
  }

  const result = await saveMailboxSubscriber({
    email,
    locale: isValidLocale(localeRaw) ? localeRaw : "en",
  });

  if (!result.ok) {
    const status = result.error === "invalid_email" ? 400 : 503;
    return NextResponse.json({ error: result.error }, { status });
  }

  const locale = isValidLocale(localeRaw) ? localeRaw : "en";
  // Fire-and-forget mirror into Netlify Forms UI.
  void mirrorToNetlifyForms(result.email, locale);

  return NextResponse.json({ ok: true });
}
