import { NextRequest, NextResponse } from "next/server";
import { checkCronSecret } from "@/lib/ops-auth";
import { isValidLocale, type Locale } from "@/i18n/config";
import { buildPartnerDigest } from "@/lib/partner-digest";
import { SITE_URL } from "@/lib/site-url";
import { buildTodayMetaPost } from "@/lib/meta-spotlight";
import {
  inspectMetaAccounts,
  publishToMeta,
  readMetaPostConfig,
  weekendMetaHashtags,
  type MetaPublishInput,
} from "@/lib/meta-post";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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

  const inspect = await inspectMetaAccounts(parsed.config);
  if (!inspect.ok) {
    return NextResponse.json(
      { error: "Meta Graph rejected the Page token", details: inspect.error },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ready: true,
    facebook: inspect.facebook,
    instagram: inspect.instagram,
    envInstagramId: parsed.config.instagramAccountId,
    graphVersion: parsed.config.graphVersion,
  });
}

type PostBody = Partial<MetaPublishInput> & {
  source?: "weekend" | "today";
  locale?: string;
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

  const published = await publishToMeta(parsed.config, {
    caption,
    imageUrl,
    imageUrls,
    link,
    facebook: body.facebook,
    instagram: body.instagram,
    dryRun: body.dryRun,
  });

  if (!published.ok) {
    return NextResponse.json({ error: published.error }, { status: 400 });
  }

  const facebookFailed =
    published.result.facebook && !published.result.facebook.ok;
  const instagramFailed =
    published.result.instagram && !published.result.instagram.ok;
  const status = facebookFailed || instagramFailed ? 502 : 200;

  return NextResponse.json(
    { success: !facebookFailed && !instagramFailed, eventIds: spotlightIds, ...published.result },
    { status },
  );
}
