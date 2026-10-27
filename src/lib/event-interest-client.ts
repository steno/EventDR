import {
  INTEREST_BATCH_MAX,
  type InterestAction,
  type InterestCounts,
} from "@/lib/event-interest";

const DEVICE_KEY = "eventdr-device-id";
/** Event ids this device has already counted on the server. */
const SYNCED_KEY = "eventdr-interest-synced";
const BACKFILL_KEY = "eventdr-interest-backfilled";

function readSynced(): Set<string> {
  try {
    const raw = localStorage.getItem(SYNCED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function writeSynced(ids: Set<string>) {
  try {
    localStorage.setItem(SYNCED_KEY, JSON.stringify([...ids]));
  } catch {
    /* ignore */
  }
}

function getDeviceId(): string | null {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

const pendingAdds = new Set<string>();

export function isInterestSynced(eventId: string): boolean {
  return readSynced().has(eventId);
}

export function isInterestSyncedOrPending(eventId: string): boolean {
  return pendingAdds.has(eventId) || isInterestSynced(eventId);
}

/** POST interest; returns server counts, or null when the API is unavailable. */
export async function sendEventInterest(
  eventIds: string[],
  action: InterestAction,
): Promise<InterestCounts | null> {
  const deviceId = getDeviceId();
  if (!deviceId || eventIds.length === 0) return null;
  const ids = eventIds.slice(0, INTEREST_BATCH_MAX);
  for (const id of ids) {
    if (action === "add") pendingAdds.add(id);
    else pendingAdds.delete(id);
  }

  try {
    const res = await fetch("/api/events/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, deviceId, eventIds: ids }),
      keepalive: true,
    });
    if (!res.ok) return null;
    const { counts } = (await res.json()) as { counts: InterestCounts };

    const synced = readSynced();
    for (const id of Object.keys(counts)) {
      if (action === "add") synced.add(id);
      else synced.delete(id);
    }
    writeSynced(synced);
    return counts;
  } catch {
    return null;
  } finally {
    if (action === "add") for (const id of ids) pendingAdds.delete(id);
  }
}

export async function fetchEventInterestCount(
  eventId: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `/api/events/interest?ids=${encodeURIComponent(eventId)}`,
    );
    if (!res.ok) return null;
    const { counts } = (await res.json()) as { counts: InterestCounts };
    return counts[eventId] ?? 0;
  } catch {
    return null;
  }
}

/** Count Saves made before interest existed — once per device. */
let backfillStarted = false;

export async function backfillSavedInterest(eventIds: string[]) {
  if (backfillStarted) return;
  try {
    if (localStorage.getItem(BACKFILL_KEY)) return;
  } catch {
    return;
  }
  backfillStarted = true;
  const synced = readSynced();
  const pending = eventIds.filter((id) => !synced.has(id));
  const done =
    pending.length === 0 || (await sendEventInterest(pending, "add")) !== null;
  if (done) {
    try {
      localStorage.setItem(BACKFILL_KEY, "1");
    } catch {
      /* ignore */
    }
  }
}
