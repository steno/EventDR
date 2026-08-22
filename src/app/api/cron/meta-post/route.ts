import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { isValidLocale, type Locale } from "@/i18n/config";
import { buildPartnerDigest } from "@/lib/partner-digest";
import { SITE_URL } from "@/lib/site-url";
import { buildTodayMetaPost } from "@/lib/meta-spotlight";
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
  claimTodaySpotlightLock,
  finishTodaySpotlightLock,
} from "@/lib/meta-spotlight-lock";

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

  const inspectLive =
    request.nextUrl.searchParams.get("inspect") === "1";
  if (!inspectLive) {
    return NextResponse.json({
      ready: true,
      inspect: false,
      pageId: parsed.config.pageId,
      instagramConfigured: Boolean(parsed.config.instagramAccountId),
      envInstagramId: parsed.config.instagramAccountId,
      graphVersion: parsed.config.graphVersion,
      hint: "Add ?inspect=1 to call Graph (uses API quota).",
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

type PostBody = Partial<MetaPublishInput> & {
  source?: "weekend" | "today";
  locale?: string;
  force?: boolean;
};

export async function POST(request: NextRequest) {
  if (!checkCronSecret(request)) return unauthorized();
  const parsed = readMetaPostConfig();
  if (!parsed.ok) return notConfigured(parsed.missing);

  let body: PostBody = {};
  try {
    const text = await request.text();
    if (text.trim()) body = JSON.parse(text) as PostBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  let caption = body.caption ?? "";
  let imageUrl = body.imageUrl;
  let imageUrls = body.imageUrls;
  let link = body.link;
  let spotlightIds: string[] = [];

  const localeParam = body.locale ?? "en";
  const locale: Locale = isValidLocale(localeParam) ? localeParam : "en";

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

  if (body.source === "today") {
    const built = await buildTodayMetaPost(locale);
    if (!built.ok) {
      return NextResponse.json({ error: built.error }, { status: 422 });
    }
    caption = built.post.caption;
    imageUrl = built.post.imageUrl;
    imageUrls = built.post.imageUrls;
    link = built.post.link;
    spotlightIds = built.post.events.map((event) => event.id);
  }

  const input: MetaPublishInput = {
    caption,
    imageUrl,
    imageUrls,
    link,
    facebook: body.facebook,
    instagram: body.instagram,
    dryRun: body.dryRun,
    onPosted:
      body.source === "today"
        ? async (update) => {
            await finishTodaySpotlightLock({
              locale,
              eventIds: spotlightIds,
              facebookId: update.facebookId,
              instagramId: update.instagramId,
            });
          }
        : undefined,
  };
  let preservedFacebookId: string | undefined;

  if (body.dryRun) {
    return jsonPublishResult(
      await publishToMeta(parsed.config, input),
      spotlightIds,
    );
  }

  if (body.source === "today" && !body.force) {
    const claimed = await claimTodaySpotlightLock({
      locale,
      eventIds: spotlightIds,
    });
    if (claimed.action === "reuse") {
      return NextResponse.json({
        success: true,
        reused: true,
        eventIds: claimed.record.eventIds,
        facebook: claimed.record.facebookId
          ? { ok: true, id: claimed.record.facebookId }
          : undefined,
        instagram: claimed.record.instagramId
          ? { ok: true, id: claimed.record.instagramId }
          : undefined,
      });
    }
    if (claimed.action === "wait") {
      return NextResponse.json(
        {
          success: true,
          inProgress: true,
          error: "Today's spotlight is already publishing. Not starting another Graph burst.",
          eventIds: claimed.record.eventIds,
        },
        { status: 200 },
      );
    }
    if (claimed.action === "resume-instagram") {
      input.facebook = false;
      preservedFacebookId = claimed.record.facebookId;
    }
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
      if (body.source === "today") {
        const facebookId =
          published.ok && published.result.facebook?.ok
            ? published.result.facebook.id
            : preservedFacebookId;
        const instagramId =
          published.ok && published.result.instagram?.ok
            ? published.result.instagram.id
            : undefined;
        await finishTodaySpotlightLock({
          locale,
          eventIds: spotlightIds,
          facebookId,
          instagramId,
          failed: !published.ok || (!facebookId && !instagramId),
        });
      }
      await writeLine(publishPayload(published, spotlightIds));
    } catch (err) {
      if (body.source === "today") {
        await finishTodaySpotlightLock({
          locale,
          eventIds: spotlightIds,
          failed: true,
        });
      }
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
