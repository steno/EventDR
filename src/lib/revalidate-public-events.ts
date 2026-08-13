import { clearCachedEvents } from "@/lib/cache";

/**
 * Bust listing caches after an approved-event write.
 * Immediate expire so moderate/ingest is not served stale (Route Handler,
 * not a Server Action — `updateTag` is unavailable here).
 * No-ops outside a Next.js request (scripts, scheduled functions).
 */
export function revalidatePublicEvents(): void {
  clearCachedEvents();
  void import("next/cache")
    .then(({ revalidateTag, revalidatePath }) => {
      try {
        revalidateTag("events", { expire: 0 });
        revalidatePath("/", "layout");
      } catch {
        // No Next cache scope (Netlify scheduled functions, seed scripts).
      }
    })
    .catch(() => {});
}
