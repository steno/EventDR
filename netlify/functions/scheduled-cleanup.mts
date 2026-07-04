import type { Config } from "@netlify/functions";

export default async () => {
  try {
    const { deleteExpiredEvents, isFirebaseConfigured } = await import(
      "../../src/lib/firebase/events"
    );

    if (!isFirebaseConfigured()) {
      console.log("Firebase not configured, skipping cleanup");
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Firebase not configured" }),
      };
    }

    console.log("Running scheduled cleanup of expired events...");
    const result = await deleteExpiredEvents();

    console.log(`Cleanup complete: ${result.deleted} deleted, ${result.errors} errors`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        deleted: result.deleted,
        errors: result.errors,
        message: `Cleaned up ${result.deleted} expired events`,
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
