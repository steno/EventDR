import { createHash } from "node:crypto";

/** Firestore / local-store id. Server-only — `node:crypto` must not reach the client bundle. */
export function reminderDocId(endpoint: string, eventId: string): string {
  return createHash("sha256").update(`${endpoint}\0${eventId}`).digest("hex");
}
