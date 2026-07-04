import type { Config } from "@netlify/functions";

export default async () => {
  try {
    const { countWeekendEvents } = await import("../../src/lib/firebase/events");
    const { sendWeekendDigest, isPushConfigured } = await import("../../src/lib/push");

    if (!isPushConfigured()) {
      console.log("Push not configured, skipping notifications");
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Push not configured" }),
      };
    }

    console.log("Running scheduled weekend digest...");
    const count = await countWeekendEvents();
    const sent = await sendWeekendDigest(Math.max(count, 1));

    console.log(`Weekend digest sent: ${sent} notifications for ${count} events`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count,
        sent,
      }),
    };
  } catch (error) {
    console.error("Scheduled notify failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Notification failed",
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export const config: Config = {
  schedule: "0 9 * * 5",
};
