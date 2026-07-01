"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Event } from "@/lib/types";
import type { Dictionary } from "@/i18n/dictionaries";

interface ModeratePanelProps {
  dict: Dictionary;
}

export function ModeratePanel({ dict }: ModeratePanelProps) {
  const searchParams = useSearchParams();
  const secret = searchParams.get("key") ?? "";
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  const load = useCallback(async () => {
    if (!secret) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/moderate?secret=${encodeURIComponent(secret)}`);
      if (res.status === 401) {
        setUnauthorized(true);
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
    await fetch(`/api/moderate?secret=${encodeURIComponent(secret)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (unauthorized) {
    return (
      <p className="text-center text-red-500 font-medium py-16">
        {dict.moderate.unauthorized}
      </p>
    );
  }

  if (loading) {
    return <p className="text-center text-neutral-400 py-16">{dict.events.loading}</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-neutral-500 py-16">{dict.moderate.empty}</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <article
          key={event.id}
          className="rounded-2xl bg-white border border-neutral-100 p-4 shadow-sm"
        >
          <h3 className="font-bold text-neutral-900">{event.title}</h3>
          <p className="text-sm text-neutral-600 mt-1 line-clamp-3">{event.description}</p>
          <p className="text-xs text-neutral-400 mt-2">
            {event.date} · {event.location}
            {event.sourceType && (
              <> · {dict.moderate.source}: {event.sourceType}</>
            )}
          </p>
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
      ))}
    </div>
  );
}
