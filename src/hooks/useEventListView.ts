"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EVENT_LIST_VIEW_STORAGE_KEY,
  isEventListView,
  type EventListView,
} from "@/lib/event-list-view";

function readStoredView(): EventListView {
  try {
    const stored = localStorage.getItem(EVENT_LIST_VIEW_STORAGE_KEY);
    return isEventListView(stored) ? stored : "cards";
  } catch {
    return "cards";
  }
}

export function useEventListView() {
  const [view, setViewState] = useState<EventListView>("cards");

  useEffect(() => {
    setViewState(readStoredView());
  }, []);

  const setView = useCallback((next: EventListView) => {
    setViewState(next);
    try {
      localStorage.setItem(EVENT_LIST_VIEW_STORAGE_KEY, next);
    } catch {
      // Private mode / blocked storage — keep in-memory preference.
    }
  }, []);

  return { view, setView };
}
