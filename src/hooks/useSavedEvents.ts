"use client";

import { useCallback, useEffect, useState } from "react";
import { eventSaveKey } from "@/lib/curated-events";
import type { Event } from "@/lib/types";

const STORAGE_KEY = "eventdr-saved";

type SavedEventRef = Pick<Event, "id" | "title">;

function legacyIdToSaveKey(id: string): string | null {
  const timestamped = id.replace(/^ingest-\d+-\d+-/, "");
  if (timestamped !== id) return timestamped.slice(0, 48);

  if (id.startsWith("ingest-")) {
    return id.slice("ingest-".length).slice(0, 48);
  }

  return null;
}

function normalizeSavedKeys(stored: string[], events: Event[]): Set<string> {
  const eventsById = new Map(events.map((e) => [e.id, e]));
  const keys = new Set<string>();

  for (const entry of stored) {
    const byId = eventsById.get(entry);
    if (byId) {
      keys.add(eventSaveKey(byId.title));
      continue;
    }

    const fromLegacy = legacyIdToSaveKey(entry);
    if (fromLegacy) {
      const match = events.find((e) => eventSaveKey(e.title) === fromLegacy);
      keys.add(match ? eventSaveKey(match.title) : fromLegacy);
      continue;
    }

    keys.add(entry);
  }

  return keys;
}

function setsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}

export function useSavedEvents() {
  const [savedKeys, setSavedKeys] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedKeys(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((keys: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...keys]));
    setSavedKeys(new Set(keys));
  }, []);

  const reconcileWithEvents = useCallback(
    (events: Event[]) => {
      if (!ready || events.length === 0) return;

      setSavedKeys((current) => {
        const normalized = normalizeSavedKeys([...current], events);
        if (setsEqual(current, normalized)) return current;
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...normalized]));
        return normalized;
      });
    },
    [ready],
  );

  const isSaved = useCallback(
    (event: SavedEventRef) => {
      const key = eventSaveKey(event.title);
      return savedKeys.has(key) || savedKeys.has(event.id);
    },
    [savedKeys],
  );

  const toggleSave = useCallback(
    (event: SavedEventRef) => {
      const key = eventSaveKey(event.title);
      const next = new Set(savedKeys);

      for (const entry of savedKeys) {
        if (entry === event.id || entry === key) next.delete(entry);
        else {
          const legacy = legacyIdToSaveKey(entry);
          if (legacy === key) next.delete(entry);
        }
      }

      const wasSaved = savedKeys.has(key) || savedKeys.has(event.id);
      if (!wasSaved) next.add(key);

      persist(next);
    },
    [savedKeys, persist],
  );

  const filterSaved = useCallback(
    (events: Event[]) => events.filter((e) => isSaved(e)),
    [isSaved],
  );

  return {
    savedKeys,
    toggleSave,
    isSaved,
    filterSaved,
    reconcileWithEvents,
    ready,
  };
}
