#!/usr/bin/env node

/**
 * Orchestrate today's Facebook album + individual Instagram Reels as short
 * API steps. Netlify kills a long publish after ~26s; this script loops until
 * done. Instagram: one Reel per event (media_type=REELS, not feed/carousel).
 *
 *   SITE_URL=https://pop-event.com CRON_SECRET=... node scripts/run-today-spotlight.mjs
 *
 * Env:
 *   DRY_RUN=true          Preview without publishing
 *   INSTAGRAM_ONLY=true   Skip Facebook
 *   FACEBOOK_ONLY=true    Skip Instagram
 *   FORCE=true            Ignore today's lock and start over
 *   FEATURE_EVENT_ID=...  Pin this event first (cover image)
 *   TODAY_SPECIALS=true   Manual home “Today’s specials” post (not the 08:00 UTC job)
 */

import { stillImageToReelMp4 } from "./still-to-reel.mjs";

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
const TODAY_SPECIALS =
  process.env.TODAY_SPECIALS === "true" ||
  process.env.SOURCE === "today-specials";
const SPOTLIGHT_SOURCE = TODAY_SPECIALS ? "today-specials" : "today";
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
    imageUrls: json.imageUrls,
    videoUrls: json.videoUrls,
    link: json.link,
    eventIds: json.eventIds,
  };
}

/** Vertical 9:16 still for Reel cover (fallback when story card is unavailable). */
function reelSafeImageUrl(url) {
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
      h: "1920",
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

async function renderStoryCard(eventId) {
  const { http, json, text } = await post({
    action: "render-story-card",
    eventId,
    locale: "en",
  });
  if (http >= 200 && http < 300 && json?.imageUrl) {
    return { ok: true, imageUrl: json.imageUrl };
  }
  return {
    ok: false,
    error: json?.error || text || `Story card HTTP ${http}`,
  };
}

async function uploadReelVideo(eventId, mp4) {
  const { http, json, text } = await post({
    action: "upload-reel",
    eventId,
    videoBase64: mp4.toString("base64"),
  });
  if (http >= 200 && http < 300 && json?.videoUrl) {
    return { ok: true, videoUrl: json.videoUrl };
  }
  return {
    ok: false,
    error: json?.error || text || `Reel upload HTTP ${http}`,
  };
}

/**
 * Build Reels from the same POP story-card layout as Share → Instagram,
 * then encode still → MP4 for Meta.
 */
async function ensureReelVideos(progress) {
  const eventIds = progress.eventIds ?? [];
  const imageUrls = progress.imageUrls ?? [];
  const videoUrls = [...(progress.videoUrls ?? [])];
  while (videoUrls.length < eventIds.length) videoUrls.push("");

  for (let i = 0; i < eventIds.length; i += 1) {
    if (videoUrls[i]) continue;
    const eventId = eventIds[i];
    if (!eventId) {
      return {
        ok: false,
        error: `Cannot build Reel for index ${i} (missing event id).`,
      };
    }

    console.log(`Rendering IG story card for ${eventId}…`);
    const card = await renderStoryCard(eventId);
    const frameUrl = card.ok
      ? card.imageUrl
      : reelSafeImageUrl(imageUrls[i] ?? imageUrls[0] ?? "");
    if (!card.ok) {
      console.warn(
        `Story card failed for ${eventId} (${card.error}); falling back to cropped still.`,
      );
    }
    if (!frameUrl) {
      return {
        ok: false,
        error: `Cannot build Reel for ${eventId} (no story card or image).`,
      };
    }

    console.log(`Building Reel MP4 for ${eventId}…`);
    const mp4 = await stillImageToReelMp4(frameUrl);
    console.log(`Uploading Reel MP4 for ${eventId} (${mp4.length} bytes)…`);
    const uploaded = await uploadReelVideo(eventId, mp4);
    if (!uploaded.ok) return uploaded;
    videoUrls[i] = uploaded.videoUrl;
  }

  return { ok: true, videoUrls };
}

async function main() {
  if (!CRON_SECRET) {
    console.error("CRON_SECRET is not set.");
    process.exit(1);
  }

  const payload = {
    source: SPOTLIGHT_SOURCE,
    locale: "en",
    dryRun: DRY_RUN,
    force: FORCE || undefined,
    featureEventId: FEATURE_EVENT_ID || undefined,
    facebook: INSTAGRAM_ONLY ? false : undefined,
    instagram: FACEBOOK_ONLY ? false : undefined,
  };

  if (DRY_RUN) {
    console.log(
      TODAY_SPECIALS
        ? "Dry run — building today's specials spotlight without publishing."
        : "Dry run — building the 08:00 UTC today spotlight without publishing.",
    );
    const { http, json, text } = await post(payload);
    console.log(json ? JSON.stringify(json, null, 2) : text);
    if (http === 422) {
      console.log(
        SPOTLIGHT_SOURCE === "today-specials"
          ? "No today specials to spotlight."
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

  if (INSTAGRAM_ONLY) {
    const lock = await readLock();
    const igDone =
      Array.isArray(lock?.instagramPostedEventIds) &&
      Array.isArray(lock?.eventIds) &&
      lock.instagramPostedEventIds.length >= lock.eventIds.length;
    const hasPartialIg =
      Array.isArray(lock?.instagramPostedEventIds) &&
      lock.instagramPostedEventIds.length > 0;
    if (lock?.facebookId && !igDone && (!lock?.instagramId || hasPartialIg)) {
      console.log("Facebook already posted. Resuming Instagram Reels.");
      progress = {
        facebookId: lock.facebookId,
        caption: lock.caption,
        eventCaptions: lock.eventCaptions,
        imageUrls: lock.imageUrls,
        videoUrls: lock.videoUrls,
        link: lock.link,
        eventIds: lock.eventIds,
        instagramIds: lock.instagramIds,
        instagramPostedEventIds: lock.instagramPostedEventIds,
      };
    }
  }

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
        SPOTLIGHT_SOURCE === "today-specials"
          ? "No today specials to spotlight."
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
            ? `Successfully published ${igCount} Instagram Reel(s).`
            : "Successfully finished today's spotlight.",
        );
      }
      process.exit(0);
    }
    if (body.success === false) {
      console.error(body.error || "Today spotlight step failed.");
      process.exit(1);
    }

    if (phase === "need-reel-video" || phase === "facebook" || phase === "prepared") {
      const needsVideo =
        !FACEBOOK_ONLY &&
        Array.isArray(progress.eventIds) &&
        progress.eventIds.some(
          (id, i) => id && !(progress.videoUrls && progress.videoUrls[i]),
        );
      const shouldBuildNow =
        needsVideo &&
        (phase === "need-reel-video" ||
          phase === "facebook" ||
          (phase === "prepared" && INSTAGRAM_ONLY));
      if (shouldBuildNow) {
        try {
          const reels = await ensureReelVideos(progress);
          if (!reels.ok) {
            console.error(reels.error);
            process.exit(1);
          }
          progress = { ...progress, videoUrls: reels.videoUrls };
          console.log(`Reel videos ready: ${reels.videoUrls.length}`);
        } catch (error) {
          console.error(
            error instanceof Error ? error.message : error,
            "\nInstall ffmpeg (apt/brew) to build Instagram Reels from stills.",
          );
          process.exit(1);
        }
        await sleep(400);
        continue;
      }
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
