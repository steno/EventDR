/**
 * Local-only special event marks (WIP before you commit).
 *
 * Edit this file to preview home / city / weekend specials without touching
 * the committed `SPECIAL_EVENTS` list in `special-events.ts`. Leave empty when
 * shipping — or move entries into `SPECIAL_EVENTS` when ready to deploy.
 *
 * Example:
 * ```ts
 * export const SPECIAL_EVENTS_LOCAL = [
 *   {
 *     eventId: "my-event-id",
 *     placements: ["home-hero", "city-hero", "weekend-list"],
 *     citySlug: "cabarete",
 *     until: "2026-07-25",
 *   },
 * ];
 * ```
 *
 * Or set in `.env.local` (no code edit):
 *   NEXT_PUBLIC_SPECIAL_EVENT_ID=my-event-id
 *   NEXT_PUBLIC_SPECIAL_EVENT_CITY=cabarete
 */
export const SPECIAL_EVENTS_LOCAL: {
  eventId: string;
  placements: ("home-hero" | "city-hero" | "weekend-list")[];
  citySlug?: string;
  until?: string;
}[] = [];
