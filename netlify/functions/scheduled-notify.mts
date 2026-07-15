import type { Config } from "@netlify/functions";

export default async () => {
  try {
    const { countWeekendEvents } = await import("../../src/lib/firebase/events");
    const { sendWeekendDigest, isPushConfigured } = await import("../../src/lib/push");
    const {
      sendMailboxWeekendDigest,
      isMailboxEmailConfigured,
    } = await import("../../src/lib/mailbox");

    const pushConfigured = isPushConfigured();
    const emailConfigured = isMailboxEmailConfigured();

    if (!pushConfigured && !emailConfigured) {
      console.log("Neither push nor mailbox email configured, skipping");
      return {
        statusCode: 503,
        body: JSON.stringify({ error: "Nothing configured to send" }),
      };
    }

    console.log("Running scheduled weekend digest...");
    const count = await countWeekendEvents();

    const pushSent = pushConfigured
      ? await sendWeekendDigest(Math.max(count, 1))
      : 0;

    const mailbox = emailConfigured
      ? await sendMailboxWeekendDigest()
      : { attempted: 0, sent: 0, skippedUnconfigured: true };

    console.log(
      `Weekend digest: push=${pushSent}, mailbox=${mailbox.sent}/${mailbox.attempted} for ${count} events`,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        count,
        pushSent,
        mailbox,
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
