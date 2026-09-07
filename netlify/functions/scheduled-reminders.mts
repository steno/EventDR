import type { Config } from "@netlify/functions";

export default async () => {
  try {
    const { isPushConfigured, sendDueEventReminders } = await import(
      "../../src/lib/push"
    );

    if (!isPushConfigured()) {
      console.log("Push not configured, skipping event reminders");
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Push not configured" }),
      };
    }

    console.log("Running scheduled event reminders...");
    const result = await sendDueEventReminders();
    console.log(
      `Event reminders: sent=${result.sent} failed=${result.failed} skipped=${result.skipped}`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, ...result }),
    };
  } catch (error) {
    console.error("Scheduled reminders failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Reminders failed",
        details: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

/** Hourly — catches day-before / morning / 2h-before windows. */
export const config: Config = {
  schedule: "0 * * * *",
};
