import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { isValidLocale, type Locale } from "@/i18n/config";
import { buildPartnerDigest } from "@/lib/partner-digest";
import { SITE_URL } from "@/lib/site-url";
import {
  buildTodayMetaPost,
  resolveSpotlightChannel,
  spotlightPickOptionsForSource,
  spotlightSlotId,
} from "@/lib/meta-spotlight";
import {
  inspectMetaAccounts,
  isMetaRateLimitError,
  metaPublishIsRateLimited,
  publishToMeta,
  readMetaPostConfig,
  weekendMetaHashtags,
  type MetaPublishInput,
} from "@/lib/meta-post";
import {
  mergeSpotlightExclusions,
  readSpotlightLocks,
  spotlightLockForChannel,
  spotlightPeerLocks,
} from "@/lib/meta-spotlight-lock";
import { localDateISO } from "@/lib/event-dates";
import {
  runTodaySpotlightStep,
  type TodaySpotlightProgress,
} from "@/lib/meta-spotlight-run";
import { uploadSpotlightReelBytes, uploadSpotlightStoryCardBytes } from "@/lib/firebase/images";
import { buildInstagramStoryCardPng } from "@/lib/instagram-story-card-server";
import { getPublicEvents } from "@/lib/public-events";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function notConfigured(missing: string[]) {
  return NextResponse.json(
    {
      error: "Meta posting is not configured",
      missing,
      hint: "Add META_PAGE_ID and META_PAGE_ACCESS_TOKEN (and META_INSTAGRAM_ACCOUNT_ID for Instagram) in Netlify env.",
    },
    { status: 503 },
  );
}

export async function GET(request: NextRequest) {
  if (!checkCronSecret(request)) return unauthorized();
  const parsed = readMetaPostConfig();
  if (!parsed.ok) return notConfigured(parsed.missing);

  if (request.nextUrl.searchParams.get("lock") === "1") {
    const locks = await readSpotlightLocks();
    return NextResponse.json({
      ready: true,
      lock: locks.today,
      specialsLock: locks.specials,
      tomorrowSpecialsLock: locks.tomorrowSpecials,
      manualLock: locks.manual,
    });
  }

  const inspectLive = request.nextUrl.searchParams.get("inspect") === "1";
  if (!inspectLive) {
    return NextResponse.json({
      ready: true,
      inspect: false,
      pageId: parsed.config.pageId,
      instagramConfigured: Boolean(parsed.config.instagramAccountId),
      envInstagramId: parsed.config.instagramAccountId,
      graphVersion: parsed.config.graphVersion,
      hint: "Add ?inspect=1 to call Graph (uses API quota). Add ?lock=1 to read today's spotlight lock.",
    });
  }

  const inspect = await inspectMetaAccounts(parsed.config);
  if (!inspect.ok) {
    const rateLimited = isMetaRateLimitError(inspect.error);
    return NextResponse.json(
      { error: "Meta Graph rejected the Page token", details: inspect.error },
      { status: rateLimited ? 429 : 502 },
    );
  }

  return NextResponse.json({
    ready: true,
    inspect: true,
    facebook: inspect.facebook,
    instagram: inspect.instagram,
    envInstagramId: parsed.config.instagramAccountId,
    graphVersion: parsed.config.graphVersion,
  });
}

type PostBody = Partial<MetaPublishInput> &
  TodaySpotlightProgress & {
    source?:
      | "weekend"
      | "today"
      | "today-specials"
      | "tomorrow-specials"
      | "manual";
    locale?: string;
    force?: boolean;
    featureEventId?: string;
    /** Event ids to skip for this run only. */
    excludeEventIds?: string[];
    /** Post exactly these ids (“run this post”). */
    onlyEventIds?: string[];
    /** Skip Instagram photo tags. */
    skipPhotoTags?: boolean;
    /** Per-event photo-tag overrides (id → username, or "" to skip). */
    photoTagOverrides?: Record<string, string>;
    /** Skip Instagram location tags. */
    skipLocations?: boolean;
    /** Per-event Facebook Page location overrides (id → page id, or "" to skip). */
    locationOverrides?: Record<string, string>;
    /** One IG/FB album image per curated gallery slide. */
    expandGallery?: boolean;
    step?: "next" | "all";
    /** Upload a still-derived MP4 for Instagram Reels hosting. */
    action?: "upload-reel" | "render-story-card";
    eventId?: string;
    /** Raw base64 (no data-url prefix) of an MP4. */
    videoBase64?: string;
  };

export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) return unauthorized();

  let body: PostBody = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.action === "render-story-card") {
    const eventId = body.eventId?.trim();
    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }
    const localeParam = body.locale ?? "en";
    const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";
    try {
      const events = await getPublicEvents({ locale, when: "today" });
      let event = events.find((item) => item.id === eventId);
      if (!event) {
        const all = await getPublicEvents({ locale });
        event = all.find((item) => item.id === eventId);
      }
      if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
      }
      const jpeg = await buildInstagramStoryCardPng(event, locale);
      const uploaded = await uploadSpotlightStoryCardBytes(
        eventId,
        jpeg,
        localDateISO(),
      );
      if (!uploaded.ok) {
        return NextResponse.json(
          { error: `Story card upload failed: ${uploaded.reason}` },
          { status: uploaded.reason === "storage_unavailable" ? 503 : 502 },
        );
      }
      return NextResponse.json({ success: true, imageUrl: uploaded.url });
    } catch (error) {
      console.error("render-story-card failed", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  }

  if (body.action === "upload-reel") {
    const eventId = body.eventId?.trim();
    const videoBase64 = body.videoBase64?.trim();
    if (!eventId || !videoBase64) {
      return NextResponse.json(
        { error: "eventId and videoBase64 are required" },
        { status: 400 },
      );
    }
    let bytes: Buffer;
    try {
      bytes = Buffer.from(videoBase64, "base64");
    } catch {
      return NextResponse.json({ error: "Invalid videoBase64" }, { status: 400 });
    }
    if (!bytes.length || bytes.length > 8_000_000) {
      return NextResponse.json(
        { error: "Reel video must be between 1 byte and 8MB" },
        { status: 400 },
      );
    }
    const uploaded = await uploadSpotlightReelBytes(
      eventId,
      bytes,
      localDateISO(),
    );
    if (!uploaded.ok) {
      return NextResponse.json(
        { error: `Reel upload failed: ${uploaded.reason}` },
        { status: uploaded.reason === "storage_unavailable" ? 503 : 502 },
      );
    }
    return NextResponse.json({ success: true, videoUrl: uploaded.url });
  }

  const parsed = readMetaPostConfig();
  if (!parsed.ok) return notConfigured(parsed.missing);

  const localeParam = body.locale ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";

  const onlyEventIds = (body.onlyEventIds ?? [])
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  // Keep explicit today/tomorrow-specials when onlyEventIds is set (one-by-one).
  const spotlightSource = resolveSpotlightChannel(body.source, onlyEventIds);

  if (spotlightSource) {
    const channel = spotlightSource;
    if (body.dryRun) {
      let built: Awaited<ReturnType<typeof buildTodayMetaPost>>;
      try {
        const locks = await readSpotlightLocks();
        const today = localDateISO();
        const own = spotlightLockForChannel(locks, channel);
        const peers = spotlightPeerLocks(locks, channel);
        const specialsAlreadyPosted =
          channel === "today" &&
          Boolean(
            locks.specials &&
              locks.specials.date === today &&
              locks.specials.status !== "failed" &&
              locks.specials.eventIds.length > 0,
          );
        const exclusions = mergeSpotlightExclusions(own, peers, today, {
          force: body.force,
        });
        const excludeEventIds = (body.excludeEventIds ?? [])
          .map((id) => id.trim())
          .filter((id) => id.length > 0);
        built = await buildTodayMetaPost(locale, undefined, {
          ...exclusions,
          hardExcludeIds: [...exclusions.hardExcludeIds, ...excludeEventIds],
          featureEventId: body.featureEventId,
          onlyEventIds: onlyEventIds.length ? onlyEventIds : undefined,
          skipPhotoTags: body.skipPhotoTags,
          photoTagOverrides: body.photoTagOverrides,
          skipLocations: body.skipLocations,
          locationOverrides: body.locationOverrides,
          expandGallery: body.expandGallery === true,
          ...spotlightPickOptionsForSource(channel, { specialsAlreadyPosted }),
        });
      } catch (error) {
        console.error("buildTodayMetaPost failed", error);
        return NextResponse.json(
          {
            success: false,
            error: error instanceof Error ? error.message : String(error),
          },
          { status: 500 },
        );
      }
      if (!built.ok) {
        return NextResponse.json({ error: built.error }, { status: 422 });
      }
      const dry = await publishToMeta(parsed.config, {
        caption: built.post.caption,
        imageUrl: built.post.imageUrl,
        imageUrls: built.post.imageUrls,
        link: built.post.link,
        facebook: body.facebook,
        instagram: body.instagram,
        dryRun: true,
      });
      const dryPayload = publishPayload(
        dry,
        built.post.events.map((event) => spotlightSlotId(event)),
      );
      return NextResponse.json(
        {
          ...dryPayload,
          eventCaptions: built.post.eventCaptions,
          photoTagUsernames: built.post.photoTagUsernames,
          locationIds: built.post.locationIds,
          gallerySlides: built.post.events.map((event) => ({
            eventId: event.id,
            slotId: spotlightSlotId(event),
            gallerySlide: event.gallerySlide ?? null,
            galleryLabel: event.galleryLabel ?? null,
            imageUrl: event.imageUrl,
          })),
          photoTags: built.post.events.map((event, index) => {
            const usernames = (event.photoTagUsernames?.length
              ? event.photoTagUsernames
              : (built.post.photoTagUsernames[index] ?? "")
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean));
            return {
              eventId: event.id,
              slotId: spotlightSlotId(event),
              username: usernames[0] ?? null,
              usernames,
              source: usernames.length ? "curated" : null,
            };
          }),
          locations: built.post.events.map((event, index) => ({
            eventId: event.id,
            slotId: spotlightSlotId(event),
            locationId: built.post.locationIds[index] || null,
            name: event.locationName ?? event.place ?? null,
            source: built.post.locationIds[index] ? "venue" : null,
          })),
        },
        {
          status: dryPayload.rateLimited
            ? 429
            : !dry.ok
              ? 400
              : dryPayload.success
                ? 200
                : 502,
          headers: dryPayload.rateLimited
            ? { "Retry-After": "300" }
            : undefined,
        },
      );
    }

    try {
      const stepped = await runTodaySpotlightStep({
        config: parsed.config,
        locale,
        wantFacebook: body.facebook !== false,
        wantInstagram: body.instagram !== false,
        force: body.force,
        featureEventId: body.featureEventId,
        excludeEventIds: body.excludeEventIds,
        onlyEventIds: onlyEventIds.length ? onlyEventIds : undefined,
        skipPhotoTags: body.skipPhotoTags,
        photoTagOverrides: body.photoTagOverrides,
        skipLocations: body.skipLocations,
        locationOverrides: body.locationOverrides,
        expandGallery: body.expandGallery === true,
        channel,
        progress: {
          facebookId: body.facebookId,
          instagramId: body.instagramId,
          instagramIds: body.instagramIds,
          instagramPostedEventIds: body.instagramPostedEventIds,
          instagramChildIds: body.instagramChildIds,
          caption: body.caption,
          eventCaptions: body.eventCaptions,
          photoTagUsernames: body.photoTagUsernames,
          locationIds: body.locationIds,
          imageUrls: body.imageUrls,
          videoUrls: body.videoUrls,
          link: body.link,
          eventIds: body.eventIds,
        },
      });
      return NextResponse.json(stepped.body, {
        status: stepped.status,
        headers: stepped.body.rateLimited ? { "Retry-After": "300" } : undefined,
      });
    } catch (error) {
      console.error("runTodaySpotlightStep failed", error);
      return NextResponse.json(
        {
          success: false,
          done: false,
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 },
      );
    }
  }

  let caption = body.caption ?? "";
  let imageUrl = body.imageUrl;
  let imageUrls = body.imageUrls;
  let link = body.link;
  const spotlightIds: string[] = [];

  if (body.source === "weekend") {
    const digest = await buildPartnerDigest(locale);
    const draft = digest.socialDrafts[0];
    if (!draft) {
      return NextResponse.json(
        { error: "No weekend events to post" },
        { status: 422 },
      );
    }
    caption = `${draft}\n\n${weekendMetaHashtags()}`;
    link =
      link ??
      `${SITE_URL.replace(/\/$/, "")}/${locale}/when/weekend?utm_source=meta&utm_medium=social&utm_campaign=weekend`;
  }

  const input: MetaPublishInput = {
    caption,
    imageUrl,
    imageUrls,
    link,
    facebook: body.facebook,
    instagram: body.instagram,
    dryRun: body.dryRun,
  };

  if (body.dryRun) {
    return jsonPublishResult(await publishToMeta(parsed.config, input), spotlightIds);
  }

  // Stream pings so Netlify's inactivity gateway does not 504 mid-publish.
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const writeLine = async (payload: unknown) => {
    await writer.write(encoder.encode(`${JSON.stringify(payload)}\n`));
  };

  void (async () => {
    const ping = setInterval(() => {
      void writeLine({ ping: true, t: Date.now() });
    }, 4000);
    try {
      await writeLine({
        phase: "publish",
        source: body.source ?? "custom",
      });
      const published = await publishToMeta(parsed.config, input);
      await writeLine(publishPayload(published, spotlightIds));
    } catch (err) {
      await writeLine({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      clearInterval(ping);
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

function publishPayload(
  published: Awaited<ReturnType<typeof publishToMeta>>,
  spotlightIds: string[],
) {
  if (!published.ok) {
    return {
      success: false,
      error: published.error,
      eventIds: spotlightIds,
      rateLimited: isMetaRateLimitError({ message: published.error }),
    };
  }
  const facebookFailed =
    published.result.facebook && !published.result.facebook.ok;
  const instagramFailed =
    published.result.instagram && !published.result.instagram.ok;
  return {
    success: !facebookFailed && !instagramFailed,
    eventIds: spotlightIds,
    rateLimited: metaPublishIsRateLimited(published),
    ...published.result,
  };
}

function jsonPublishResult(
  published: Awaited<ReturnType<typeof publishToMeta>>,
  spotlightIds: string[],
) {
  const payload = publishPayload(published, spotlightIds);
  if (payload.rateLimited) {
    return NextResponse.json(payload, {
      status: 429,
      headers: { "Retry-After": "300" },
    });
  }
  if (!published.ok) {
    return NextResponse.json(payload, { status: 400 });
  }
  return NextResponse.json(payload, { status: payload.success ? 200 : 502 });
}
