import { NextRequest, NextResponse } from "next/server";
import {
  availableReminderTimings,
  computeRemindAt,
  type ReminderOffset,
  REMINDER_OFFSETS,
} from "@/lib/event-reminders";
import {
  deleteEventReminder,
  isPushConfigured,
  saveSubscription,
  upsertEventReminder,
} from "@/lib/push";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitResponse,
} from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

type RemindBody = {
  action?: "set" | "cancel";
  eventId?: string;
  eventTitle?: string;
  eventDate?: string;
  eventTime?: string;
  offset?: ReminderOffset;
  locale?: string;
  url?: string;
  subscription?: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
};

function isOffset(value: unknown): value is ReminderOffset {
  return (
    typeof value === "string" &&
    (REMINDER_OFFSETS as string[]).includes(value)
  );
}

export async function POST(request: NextRequest) {
  const limited = checkRateLimit(request, {
    ...RATE_LIMITS.pushSubscribe,
    key: "push-remind",
  });
  if (!limited.ok) return rateLimitResponse(limited);

  if (!isPushConfigured()) {
    return NextResponse.json({ error: "Push not configured" }, { status: 503 });
  }

  try {
    const body = (await request.json()) as RemindBody;
    const endpoint = body.subscription?.endpoint;
    const keys = body.subscription?.keys;
    const eventId = body.eventId?.trim();

    if (!endpoint || !keys?.p256dh || !keys?.auth || !eventId) {
      return NextResponse.json({ error: "Invalid reminder" }, { status: 400 });
    }

    if (body.action === "cancel") {
      const ok = await deleteEventReminder(endpoint, eventId);
      if (!ok) {
        return NextResponse.json(
          { error: "Could not cancel reminder" },
          { status: 503 },
        );
      }
      return NextResponse.json({ success: true, active: false });
    }

    if (body.action !== "set") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const eventTitle = body.eventTitle?.trim();
    const eventDate = body.eventDate?.trim();
    if (!eventTitle || !eventDate || !isOffset(body.offset)) {
      return NextResponse.json({ error: "Invalid reminder" }, { status: 400 });
    }

    const timings = availableReminderTimings({
      date: eventDate,
      time: body.eventTime,
    });
    const chosen = timings.find((t) => t.offset === body.offset);
    if (!chosen) {
      return NextResponse.json(
        { error: "Reminder time unavailable" },
        { status: 400 },
      );
    }

    // Recompute server-side so clients can't schedule arbitrary far-past/future.
    const remindAt =
      computeRemindAt(eventDate, body.eventTime, body.offset) ?? chosen.remindAt;

    const locale = body.locale === "es" || body.locale === "fr" ? body.locale : "en";
    const url =
      body.url?.startsWith("/") ? body.url : `/${locale}/event/${eventId}`;

    await saveSubscription({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      locale,
    });

    const ok = await upsertEventReminder({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      locale,
      eventId,
      eventTitle,
      eventDate,
      eventTime: body.eventTime,
      offset: body.offset,
      remindAt: remindAt.toISOString(),
      url,
    });

    if (!ok) {
      return NextResponse.json(
        { error: "Could not save reminder" },
        { status: 503 },
      );
    }

    return NextResponse.json({
      success: true,
      active: true,
      offset: body.offset,
      remindAt: remindAt.toISOString(),
    });
  } catch {
    return NextResponse.json({ error: "Reminder failed" }, { status: 500 });
  }
}
