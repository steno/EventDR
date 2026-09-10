import type { Config } from "@netlify/functions";

export default async () => {
  try {
    const { deleteExpiredEvents, deleteRemovedVenues, isFirebaseConfigured } =
      await import("../../src/lib/firebase/events");

    if (!isFirebaseConfigured()) {
      console.log("Firebase not configured, skipping cleanup");
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Firebase not configured" }),
      };
    }

    console.log("Running scheduled cleanup of expired events and dumped venues...");
    const [expired, venues] = await Promise.all([
      deleteExpiredEvents(),
      deleteRemovedVenues(),
    ]);

    console.log(
      `Cleanup complete: ${expired.deleted} events deleted, ${expired.errors} event errors, ${venues.deleted} venues deleted, ${venues.errors} venue errors`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deleted: expired.deleted,
        errors: expired.errors,
        venuesDeleted: venues.deleted,
        venueErrors: venues.errors,
        message: `Cleaned up ${expired.deleted} expired events and ${venues.deleted} dumped venue(s)`,
      }),
    };
  } catch (error) {
    console.error("Scheduled cleanup failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Cleanup failed",
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export const config: Config = {
  schedule: "@daily",
};
