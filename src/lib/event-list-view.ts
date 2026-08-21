export const EVENT_LIST_VIEW_STORAGE_KEY = "eventdr-list-view";

/** Compact rows vs image-forward tiles. Cards stay the discovery default. */
export type EventListView = "list" | "cards";

export const DEFAULT_EVENT_LIST_VIEW: EventListView = "cards";

export function isEventListView(value: string | null): value is EventListView {
  return value === "list" || value === "cards";
}

export function parseEventListView(
  value: string | null | undefined,
): EventListView {
  if (value === "list" || value === "cards") return value;
  return DEFAULT_EVENT_LIST_VIEW;
}
