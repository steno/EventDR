#!/usr/bin/env node

/**
 * Orchestrate today's Facebook + Instagram spotlight as short API steps.
 * Netlify kills a single publish after ~26s; this script loops until done.
 *
 *   SITE_URL=https://pop-event.com CRON_SECRET=... node scripts/run-today-spotlight.mjs
 *
 * Env:
 *   DRY_RUN=true          Preview without publishing
 *   INSTAGRAM_ONLY=true   Skip Facebook
 *   FACEBOOK_ONLY=true    Skip Instagram
 *   FORCE=true            Ignore today's lock and start over
 *   FEATURE_EVENT_ID=...  Pin this event first (cover image)
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
const MAX_STEPS = 30;
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
    instagramChildIds: json.instagramChildIds,
    instagramParentId: json.instagramParentId,
    caption: json.caption,
    imageUrls: json.imageUrls,
    link: json.link,
    eventIds: json.eventIds,
  };
}

/** Instagram feed rejects wider than 1.91:1; Netlify Image CDN cover-crops to 1:1. */
function instagramSafeImageUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (
      host !== "pop-event.com" &&
      host !== "www.pop-event.com" &&
      host !== "popevent.netlify.app"
    ) {
      return url;
    }
    if (parsed.pathname.startsWith("/.netlify/images")) return url;
    const origin = "https://pop-event.com";
    const params = new URLSearchParams({
      url: parsed.pathname,
      fit: "cover",
      w: "1080",
      h: "1080",
      fm: "jpg",
    });
    return `${origin}/.netlify/images?${params.toString()}`;
  } catch {
    return url;
  }
}

async function readLock() {
  const response = await fetch(`${SITE_URL}/api/cron/meta-post?lock=1`, {
    headers: { Authorization: `Bearer ${CRON_SECRET}` },
  });
  const json = await response.json().catch(() => null);
  return json?.lock ?? null;
}

async function publishInstagramWithSafeImages(progress) {
  const lock = await readLock();
  const imageUrls = (progress.imageUrls ?? lock?.imageUrls ?? []).map(
    instagramSafeImageUrl,
  );
  const caption = progress.caption ?? lock?.caption;
  const link = progress.link ?? lock?.link;
  if (!imageUrls.length) {
    return { ok: false, error: "No image URLs to retry Instagram with." };
  }
  if (!caption) {
    return { ok: false, error: "No caption to retry Instagram with." };
  }
  const { http, json, text } = await post({
    caption,
    imageUrls,
    link,
    facebook: false,
    instagram: true,
  });
  console.log(`Instagram retry HTTP ${http}`);
  console.log(json ? JSON.stringify(json) : text);
  const instagram = json?.instagram;
  if (http >= 200 && http < 300 && instagram?.ok) {
    console.log("Successfully posted today's events to Instagram.");
    return { ok: true };
  }
  const err =
    json?.error ||
    instagram?.error?.message ||
    `Instagram retry failed with HTTP ${http}.`;
  return { ok: false, error: err };
}

async function main() {
  if (!CRON_SECRET) {
    console.error("CRON_SECRET is not set.");
    process.exit(1);
  }

  const payload = {
    source: "today",
    locale: "en",
    dryRun: DRY_RUN,
    force: FORCE || undefined,
    featureEventId: FEATURE_EVENT_ID || undefined,
    facebook: INSTAGRAM_ONLY ? false : undefined,
    instagram: FACEBOOK_ONLY ? false : undefined,
  };

  if (DRY_RUN) {
    console.log("Dry run — building today's spotlight without publishing.");
    const { http, json, text } = await post(payload);
    console.log(json ? JSON.stringify(json, null, 2) : text);
    if (http === 422) {
      console.log("No today events to spotlight.");
      process.exit(0);
    }
    if (http >= 200 && http < 300 && json?.success) {
      console.log("Dry run succeeded.");
      process.exit(0);
    }
    console.error(`Dry run failed with HTTP ${http}.`);
    process.exit(1);
  }

  if (INSTAGRAM_ONLY) {
    const lock = await readLock();
    if (lock?.facebookId && !lock?.instagramId) {
      console.log(
        "Facebook already posted. Publishing Instagram with 1:1 crops.",
      );
      const ig = await publishInstagramWithSafeImages({
        caption: lock.caption,
        imageUrls: lock.imageUrls,
        link: lock.link,
      });
      if (ig.ok) process.exit(0);
      console.error(ig.error);
      process.exit(1);
    }
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
      console.log("No today events to spotlight.");
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
      const aspectRatio =
        typeof body.error === "string" &&
        /aspect ratio is not supported/i.test(body.error);
      if (aspectRatio && (INSTAGRAM_ONLY || progress.facebookId)) {
        console.log(
          "Instagram rejected an image aspect ratio. Retrying Instagram with 1:1 crops.",
        );
        const ig = await publishInstagramWithSafeImages(progress);
        if (ig.ok) process.exit(0);
        console.error(ig.error);
        process.exit(1);
      }
      console.error(body.error || `Today spotlight failed with HTTP ${http}.`);
      process.exit(1);
    }
    if (body.reused || body.done) {
      if (body.reused) {
        console.log("Today's spotlight was already posted.");
      } else {
        console.log("Successfully posted today's events to Facebook and Instagram.");
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
