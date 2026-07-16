export const EVENT_LIST_VIEW_STORAGE_KEY = "eventdr-list-view";

export type EventListView = "list" | "cards";

export function isEventListView(value: string | null): value is EventListView {
  return value === "list" || value === "cards";
}
