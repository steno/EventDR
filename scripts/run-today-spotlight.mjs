#!/usr/bin/env node

/**
 * Orchestrate today's Facebook album + individual Instagram image posts as
 * short API steps. Netlify kills a long publish after ~26s; this script loops
 * until done. Instagram: one feed photo per event (specials first, then
 * happening-today). No Reels.
 *
 *   SITE_URL=https://pop-event.com CRON_SECRET=... node scripts/run-today-spotlight.mjs
 *
 * Env:
 *   DRY_RUN=true             Preview without publishing
 *   INSTAGRAM_ONLY=true      Skip Facebook
 *   FACEBOOK_ONLY=true       Skip Instagram
 *   FORCE=true               Ignore today's lock and start over
 *   FEATURE_EVENT_ID=...     Pin this event first (cover image)
 *   EXCLUDE_EVENT_IDS=a,b    Skip these ids
 *   ONLY_EVENT_IDS=a,b       Post exactly these (“run this post”)
 *   SKIP_PHOTO_TAGS=true     Do not photo-tag venue Instagram accounts
 *   SKIP_LOCATIONS=true      Do not tag Instagram map locations
 *   TODAY_SPECIALS=true      Today’s specials only
 *   TOMORROW_SPECIALS=true   Tomorrow’s specials only
 *   SOURCE=today|today-specials|tomorrow-specials|manual
 *   LOCALE=es|en|fr          Caption locale (default en)
 */

const SITE_URL = (process.env.SITE_URL || "https://pop-event.com").replace(
  /\/$/,
  "",
);
const CRON_SECRET = process.env.CRON_SECRET || "";
const DRY_RUN = process.env.DRY_RUN === "true";
const INSTAGRAM_ONLY = process.env.INSTAGRAM_ONLY === "true";
const FACEBOOK_ONLY = process.env.FACEBOOK_ONLY === "true";
const FORCE = process.env.FORCE === "true";
const FEATURE_EVENT_ID = process.env.FEATURE_EVENT_ID?.trim() || "";
const EXCLUDE_EVENT_IDS = (process.env.EXCLUDE_EVENT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0);
const ONLY_EVENT_IDS = (process.env.ONLY_EVENT_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0);
const TODAY_SPECIALS =
  process.env.TODAY_SPECIALS === "true" ||
  process.env.SOURCE === "today-specials";
const TOMORROW_SPECIALS =
  process.env.TOMORROW_SPECIALS === "true" ||
  process.env.SOURCE === "tomorrow-specials";
const SPOTLIGHT_SOURCE = ONLY_EVENT_IDS.length
  ? "manual"
  : TOMORROW_SPECIALS
    ? "tomorrow-specials"
    : TODAY_SPECIALS
      ? "today-specials"
      : process.env.SOURCE === "manual"
        ? "manual"
        : "today";
const SKIP_PHOTO_TAGS = process.env.SKIP_PHOTO_TAGS === "true";
const SKIP_LOCATIONS = process.env.SKIP_LOCATIONS === "true";
const MAX_STEPS = 80;
const WAIT_MS = 4_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function post(body) {
  const response = await fetch(`${SITE_URL}/api/cron/meta-post`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CRON_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.includes('"ping"'));
    const last = lines.at(-1);
    if (last) {
      try {
        json = JSON.parse(last);
      } catch {
        json = null;
      }
    }
  }
  return { http: response.status, json, text };
}

function progressFrom(json) {
  if (!json || typeof json !== "object") return {};
  return {
    facebookId: json.facebook?.ok ? json.facebook.id : json.facebookId,
    instagramId: json.instagram?.ok ? json.instagram.id : json.instagramId,
    instagramIds: json.instagramIds,
    instagramPostedEventIds: json.instagramPostedEventIds,
    instagramChildIds: json.instagramChildIds,
    caption: json.caption,
    eventCaptions: json.eventCaptions,
    photoTagUsernames: json.photoTagUsernames,
    locationIds: json.locationIds,
    imageUrls: json.imageUrls,
    videoUrls: json.videoUrls,
    link: json.link,
    eventIds: json.eventIds,
  };
}

async function main() {
  if (!CRON_SECRET) {
    console.error("CRON_SECRET is not set.");
    process.exit(1);
  }
  if (EXCLUDE_EVENT_IDS.length) {
    console.log(`Skipping event ids: ${EXCLUDE_EVENT_IDS.join(", ")}`);
  }
  if (ONLY_EVENT_IDS.length) {
    console.log(`Only event ids: ${ONLY_EVENT_IDS.join(", ")}`);
  }

  const payload = {
    source: SPOTLIGHT_SOURCE,
    locale: process.env.LOCALE || "en",
    dryRun: DRY_RUN,
    force: FORCE || undefined,
    featureEventId: FEATURE_EVENT_ID || undefined,
    excludeEventIds: EXCLUDE_EVENT_IDS.length ? EXCLUDE_EVENT_IDS : undefined,
    onlyEventIds: ONLY_EVENT_IDS.length ? ONLY_EVENT_IDS : undefined,
    skipPhotoTags: SKIP_PHOTO_TAGS || undefined,
    skipLocations: SKIP_LOCATIONS || undefined,
    facebook: INSTAGRAM_ONLY ? false : undefined,
    instagram: FACEBOOK_ONLY ? false : undefined,
  };

  if (DRY_RUN) {
    console.log(
      ONLY_EVENT_IDS.length
        ? `Dry run — manual spotlight for ${ONLY_EVENT_IDS.join(", ")}.`
        : TOMORROW_SPECIALS
          ? "Dry run — building tomorrow’s specials spotlight without publishing."
          : TODAY_SPECIALS
            ? "Dry run — building today's specials spotlight without publishing."
            : "Dry run — building today’s spotlight without publishing.",
    );
    const { http, json, text } = await post(payload);
    console.log(json ? JSON.stringify(json, null, 2) : text);
    if (http === 422) {
      console.log(
        SPOTLIGHT_SOURCE === "tomorrow-specials"
          ? "No tomorrow specials to spotlight."
          : SPOTLIGHT_SOURCE === "today-specials"
            ? "No today specials to spotlight."
            : SPOTLIGHT_SOURCE === "manual"
              ? "No matching events to spotlight."
              : "No today events to spotlight.",
      );
      process.exit(0);
    }
    if (http >= 200 && http < 300 && json?.success) {
      console.log("Dry run succeeded.");
      process.exit(0);
    }
    console.error(`Dry run failed with HTTP ${http}.`);
    process.exit(1);
  }

  let sendForce = FORCE;
  let progress = {};

  for (let attempt = 1; attempt <= MAX_STEPS; attempt++) {
    const { http, json, text } = await post({
      ...payload,
      ...progress,
      force: sendForce || undefined,
    });
    const body = json ?? { raw: text };
    const phase = body.phase ?? "unknown";
    console.log(`Step ${attempt}/${MAX_STEPS} HTTP ${http} phase=${phase}`);
    console.log(JSON.stringify(body));

    progress = { ...progress, ...progressFrom(json) };
    if (body.inProgress || phase === "prepared" || phase === "facebook") {
      sendForce = false;
    }

    if (http === 422) {
      console.log(
        SPOTLIGHT_SOURCE === "tomorrow-specials"
          ? "No tomorrow specials to spotlight."
          : SPOTLIGHT_SOURCE === "today-specials"
            ? "No today specials to spotlight."
            : SPOTLIGHT_SOURCE === "manual"
              ? "No matching events to spotlight."
              : "No today events to spotlight.",
      );
      process.exit(0);
    }
    if (http === 401) {
      console.error("Unauthorized. Check that CRON_SECRET matches Netlify.");
      process.exit(1);
    }
    if (http === 503) {
      console.error("Meta posting is not configured on Netlify.");
      process.exit(1);
    }
    if (http === 429 || body.rateLimited) {
      console.error(
        "Facebook rate-limited this app. Wait 15–30 minutes before retrying.",
      );
      process.exit(1);
    }
    if (http === 502 || (http >= 400 && !body.inProgress)) {
      console.error(body.error || `Today spotlight failed with HTTP ${http}.`);
      process.exit(1);
    }
    if (body.skipped) {
      console.log(
        "Skipping: this channel would post the same events as the other spotlight.",
      );
      process.exit(0);
    }
    if (body.reused || body.done) {
      if (body.reused) {
        console.log("Today's spotlight was already posted.");
      } else {
        const igCount = Array.isArray(body.instagramPostedEventIds)
          ? body.instagramPostedEventIds.length
          : body.instagramIds?.length;
        console.log(
          igCount
            ? `Successfully published ${igCount} Instagram post(s).`
            : "Successfully finished today's spotlight.",
        );
      }
      process.exit(0);
    }
    if (body.success === false) {
      console.error(body.error || "Today spotlight step failed.");
      process.exit(1);
    }

    const wait = phase === "instagram-wait" || phase === "wait" ? WAIT_MS : 800;
    await sleep(wait);
  }

  console.error("Timed out waiting for spotlight steps to finish.");
  process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
