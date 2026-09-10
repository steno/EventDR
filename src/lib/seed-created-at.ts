import type { Event } from "@/lib/types";

/**
 * When a seed listing first landed in the catalog (commit day, noon UTC).
 * Used for home “New” when Firebase isn’t available (local) or a seed has no
 * Firestore `createdAt` yet. Prefer real `createdAt` from the DB when present.
 *
 * Add an entry whenever you ship a new seed id — keep dates ISO.
 */
export const SEED_CREATED_AT: Readonly<Record<string, string>> = {
  "los-tres-cocos-dinner": "2026-08-25T12:00:00.000Z",
  "flip-flop-live-sports-daily": "2026-08-26T12:00:00.000Z",
  "flip-flop-monday-happy-hour": "2026-08-26T12:00:00.000Z",
  "flip-flop-taco-tuesday": "2026-08-26T12:00:00.000Z",
  "flip-flop-wing-wednesday": "2026-08-26T12:00:00.000Z",
  "ingest-hidden-river-kayak-adventure": "2026-08-26T12:00:00.000Z",
  "gran-ventana-day-pass": "2026-08-27T12:00:00.000Z",
  "cofresi-palm-day-pass": "2026-08-27T12:00:00.000Z",
  "cigar-town-acustico-humos-2026-08-28": "2026-08-28T12:00:00.000Z",
  "nonas-grill-kitchen-daily": "2026-09-03T12:00:00.000Z",
  "chill-and-grill-sunday-bingo": "2026-09-05T12:00:00.000Z",
  "chill-and-grill-saturday-karaoke": "2026-09-05T12:00:00.000Z",
  "taino-bay-village-daily": "2026-09-06T12:00:00.000Z",
  "amber-cove-village-daily": "2026-09-06T12:00:00.000Z",
  "cheers-mandarin-mondays": "2026-09-07T12:00:00.000Z",
  "cheers-fire-ice-thursdays": "2026-09-09T12:00:00.000Z",
  "cigar-town-noche-bohemia-2026-09-12": "2026-09-07T12:00:00.000Z",
  "cigar-town-la-pena-thursdays": "2026-09-07T12:00:00.000Z",
  "cigar-town-ron-humos": "2026-09-07T12:00:00.000Z",
  "restaurant-week-puerto-plata-2026": "2026-09-07T12:00:00.000Z",
  "super-mega-urban-fest-2026-11-04": "2026-09-07T12:00:00.000Z",
  "masters-surf-reunion-10-2026": "2026-09-07T12:00:00.000Z",
  "todos-somos-luperon-2026-09-08": "2026-09-08T12:00:00.000Z",
  "faro-puerto-plata-daily": "2026-09-09T12:00:00.000Z",
  "cuartel-bomberos-puerto-plata-daily": "2026-09-09T12:00:00.000Z",
  "el-carey-bohemian-wednesday": "2026-09-10T12:00:00.000Z",
  "el-carey-sabado-de-son": "2026-09-10T12:00:00.000Z",
  "tasty-food-park-karaoke-wednesday": "2026-09-10T12:00:00.000Z",
  "ernesto-betances-rancho-catalina-2026-09-13": "2026-09-10T12:00:00.000Z",
  "el-cuarteto-del-swing-zona-acapella-2026-09-13": "2026-09-10T12:00:00.000Z",
  "cabarete-run-festival-5k-2026-11-08": "2026-09-10T12:00:00.000Z",
  "latinwok-ramen-party-2026-09-17": "2026-09-10T12:00:00.000Z",
  "hard-rock-karaoke-wednesday": "2026-09-10T12:00:00.000Z",
  "sosua-neon-partyrun-2026-10-24": "2026-09-10T12:00:00.000Z",
  "hard-rock-casa-mickey-2026-09-26": "2026-09-10T12:00:00.000Z",
};

/** Fill missing `createdAt` from {@link SEED_CREATED_AT} (does not overwrite). */
export function attachSeedCreatedAt<T extends Event>(events: T[]): T[] {
  return events.map((event) => {
    if (event.createdAt) return event;
    const createdAt = SEED_CREATED_AT[event.id];
    return createdAt ? { ...event, createdAt } : event;
  });
}
