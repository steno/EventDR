import { getDeviceId } from "@/lib/device-id";

/** Fire-and-forget share credit for home Local/Visitor ranking. */
export function recordVenueShare(eventId: string): void {
  const deviceId = getDeviceId();
  if (!deviceId || !eventId) return;
  void fetch("/api/venues/engagement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "share", eventId, deviceId }),
    keepalive: true,
  }).catch(() => {
    /* ranking is best-effort */
  });
}
