"use client";

import { useCallback, useEffect, useState } from "react";
import type { Event } from "@/lib/types";

const STORAGE_KEY = "eventdr-saved";

export function useSavedEvents() {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
    setSavedIds(new Set(ids));
  }, []);

  const toggleSave = useCallback(
    (id: string) => {
      const next = new Set(savedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      persist(next);
    },
    [savedIds, persist],
  );

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const filterSaved = useCallback(
    (events: Event[]) => events.filter((e) => savedIds.has(e.id)),
    [savedIds],
  );

  return { savedIds, toggleSave, isSaved, filterSaved, ready };
}
