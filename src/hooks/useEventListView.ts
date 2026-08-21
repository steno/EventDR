"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  DEFAULT_EVENT_LIST_VIEW,
  EVENT_LIST_VIEW_STORAGE_KEY,
  parseEventListView,
  type EventListView,
} from "@/lib/event-list-view";

const listeners = new Set<() => void>();
/** In-memory preference so private-mode storage failures still update the UI. */
let memoryView: EventListView | null = null;

function readStoredView(): EventListView {
  if (memoryView) return memoryView;
  if (typeof window === "undefined") return DEFAULT_EVENT_LIST_VIEW;
  try {
    return parseEventListView(localStorage.getItem(EVENT_LIST_VIEW_STORAGE_KEY));
  } catch {
    return DEFAULT_EVENT_LIST_VIEW;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener();
}

export function useEventListView() {
  const view = useSyncExternalStore(
    subscribe,
    readStoredView,
    () => DEFAULT_EVENT_LIST_VIEW,
  );

  const setView = useCallback((next: EventListView) => {
    memoryView = next;
    try {
      localStorage.setItem(EVENT_LIST_VIEW_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage — keep the in-memory preference.
    }
    emit();
  }, []);

  return { view, setView };
}
