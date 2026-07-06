"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RefreshCw, CheckCircle, ExternalLink } from "lucide-react";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { formatEventDateShort } from "@/lib/format-date";
import { formatEventPlace } from "@/lib/event-location";

interface ModeratePanelProps {
  dict: Dictionary;
  locale: Locale;
}

export function ModeratePanel({ dict, locale }: ModeratePanelProps) {
  const searchParams = useSearchParams();
  const secret = searchParams.get("key") ?? "";
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [firebaseDown, setFirebaseDown] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!secret) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setFirebaseDown(false);
    try {
      const res = await fetch(`/api/moderate?secret=${encodeURIComponent(secret)}`);
      if (res.status === 401) {
        setUnauthorized(true);
        setEvents([]);
        return;
      }
      if (res.status === 503) {
        setFirebaseDown(true);
        setEvents([]);
        return;
      }
      const data = (await res.json()) as { events?: Event[] };
      setEvents(data.events ?? []);
      setUnauthorized(false);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [secret]);

  useEffect(() => {
    load();
  }, [load]);

  async function moderate(id: string, action: "approve" | "reject") {
    const res = await fetch(`/api/moderate?secret=${encodeURIComponent(secret)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (!res.ok) return;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setActionMsg(action === "approve" ? dict.moderate.approved : dict.moderate.rejected);
    setTimeout(() => setActionMsg(null), 2500);
  }

  if (unauthorized) {
    return (
      <div className="text-center py-16 space-y-2">
        <p className="text-red-500 font-medium">{dict.moderate.unauthorized}</p>
        <p className="text-sm text-neutral-400">{dict.moderate.unauthorizedHint}</p>
      </div>
    );
  }

  if (firebaseDown) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-red-500 font-medium">{dict.moderate.firebaseRequired}</p>
        <p className="text-sm text-neutral-500">{dict.moderate.firebaseHint}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {events.length > 0
            ? `${events.length} pending`
            : dict.moderate.empty}
        </p>
        <button
          type="button"
          onClick={() => load()}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-600 hover:text-neutral-900"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {dict.moderate.refresh}
        </button>
      </div>

      {actionMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 text-green-800 px-4 py-3 text-sm font-semibold">
          <CheckCircle className="h-4 w-4" />
          {actionMsg}
        </div>
      )}

      {loading ? (
        <p className="text-center text-neutral-400 py-8">{dict.events.loading}</p>
      ) : (
        events.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm"
          >
            <h3 className="font-bold text-neutral-900">{event.title}</h3>
            <p className="text-sm text-neutral-600 mt-1">{event.description}</p>
            <p className="text-xs text-neutral-400 mt-2">
              {formatEventDateShort(event.date, locale)}
              {event.time ? ` · ${event.time}` : ""} · {formatEventPlace(event)}
            </p>
            {event.sourceType && (
              <p className="text-xs text-violet-600 font-medium mt-1">
                {dict.moderate.source}: {event.sourceType}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => moderate(event.id, "approve")}
                className="flex-1 rounded-xl bg-green-600 text-white py-2.5 text-sm font-bold"
              >
                {dict.moderate.approve}
              </button>
              <button
                type="button"
                onClick={() => moderate(event.id, "reject")}
                className="flex-1 rounded-xl bg-neutral-100 text-neutral-700 py-2.5 text-sm font-bold"
              >
                {dict.moderate.reject}
              </button>
            </div>
          </article>
        ))
      )}

      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 mt-6"
      >
        <ExternalLink className="h-4 w-4" />
        {dict.moderate.viewLive}
      </Link>
    </div>
  );
}
