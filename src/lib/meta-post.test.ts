import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clipMetaCaption,
  createInstagramMediaContainers,
  defaultMetaImageUrl,
  instagramContainersFinished,
  instagramContainerFailure,
  isAllowedMetaImageUrl,
  isMetaRateLimitError,
  META_CAPTION_MAX,
  metaGraphRequest,
  publishToMeta,
  type MetaPostConfig,
} from "./meta-post";

const config: MetaPostConfig = {
  pageId: "page-1",
  pageAccessToken: "token",
  instagramAccountId: "ig-1",
  graphVersion: "v22.0",
};

describe("meta-post", () => {
  it("allows HTTPS images on pop-event.com", () => {
    assert.equal(
      isAllowedMetaImageUrl("https://pop-event.com/cities/cabarete.jpg"),
      true,
    );
    assert.equal(
      isAllowedMetaImageUrl("https://www.pop-event.com/icons/icon-512.png"),
      true,
    );
  });

  it("rejects non-https and off-site image URLs", () => {
    assert.equal(isAllowedMetaImageUrl("http://pop-event.com/og-image.jpg"), false);
    assert.equal(
      isAllowedMetaImageUrl("https://evil.example/photo.jpg"),
      false,
    );
    assert.equal(isAllowedMetaImageUrl("not-a-url"), false);
  });

  it("clips captions to Instagram's limit", () => {
    const long = "x".repeat(META_CAPTION_MAX + 40);
    const clipped = clipMetaCaption(long);
    assert.equal(clipped.length, META_CAPTION_MAX);
    assert.equal(clipped.endsWith("…"), true);
  });

  it("dry-run publishes without calling Graph", async () => {
    const published = await publishToMeta(config, {
      caption: " Weekend on the North Coast ",
      dryRun: true,
    });
    assert.equal(published.ok, true);
    if (!published.ok) return;
    assert.equal(published.result.dryRun, true);
    assert.equal(published.result.caption, "Weekend on the North Coast");
    assert.equal(published.result.imageUrl, defaultMetaImageUrl());
    assert.deepEqual(published.result.facebook, { ok: true, id: "dry-run" });
    assert.deepEqual(published.result.instagram, { ok: true, id: "dry-run" });
  });

  it("keeps a feed link on dry-run", async () => {
    const published = await publishToMeta(config, {
      caption: "Today on the North Coast.",
      link: "https://pop-event.com/en/when/today",
      imageUrls: [
        "https://pop-event.com/events/a.jpg",
        "https://pop-event.com/events/b.jpg",
      ],
      dryRun: true,
    });
    assert.equal(published.ok, true);
    if (!published.ok) return;
    assert.equal(
      published.result.link,
      "https://pop-event.com/en/when/today",
    );
    assert.equal(published.result.imageUrls?.length, 2);
  });

  it("requires a caption", async () => {
    const published = await publishToMeta(config, { caption: "  ", dryRun: true });
    assert.equal(published.ok, false);
  });

  it("attaches event photos to Facebook even when a link is set", async () => {
    const calls: Array<{ path: string; params: URLSearchParams }> = [];
    let photoCount = 0;
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = new URL(String(input));
      const method = (init?.method ?? "GET").toUpperCase();
      const params =
        method === "GET"
          ? url.searchParams
          : new URLSearchParams(String(init?.body ?? ""));
      const path = url.pathname.replace(/^\/v[\d.]+/, "");
      calls.push({ path, params });
      if (method === "GET" && path.endsWith("/page-1")) {
        return jsonResponse({ access_token: "page-token" });
      }
      if (path.endsWith("/photos")) {
        photoCount += 1;
        return jsonResponse({ id: `photo-${photoCount}` });
      }
      if (path.endsWith("/feed")) {
        return jsonResponse({ id: "feed-1" });
      }
      return jsonResponse({ error: { message: `unexpected ${path}` } }, 400);
    };

    const published = await publishToMeta(
      config,
      {
        caption: "Today on the North Coast.",
        link: "https://pop-event.com/en/when/today",
        imageUrls: [
          "https://pop-event.com/events/a.jpg",
          "https://pop-event.com/events/b.jpg",
        ],
        instagram: false,
      },
      fetchImpl,
    );

    assert.equal(published.ok, true);
    if (!published.ok) return;
    assert.deepEqual(published.result.facebook, { ok: true, id: "feed-1" });

    const photoUploads = calls.filter((call) => call.path.endsWith("/photos"));
    assert.equal(photoUploads.length, 2);
    assert.equal(photoUploads[0]?.params.get("published"), "false");
    assert.equal(
      photoUploads[0]?.params.get("url"),
      "https://pop-event.com/events/a.jpg",
    );

    const feed = calls.find((call) => call.path.endsWith("/feed"));
    assert.ok(feed);
    assert.equal(feed?.params.get("link"), null);
    assert.equal(
      feed?.params.get("attached_media[0]"),
      JSON.stringify({ media_fbid: "photo-1" }),
    );
    assert.equal(
      feed?.params.get("attached_media[1]"),
      JSON.stringify({ media_fbid: "photo-2" }),
    );
  });

  it("detects Insights / app rate-limit errors", () => {
    assert.equal(
      isMetaRateLimitError({
        message:
          "There have been too many calls from this app. Wait a bit and try again.",
        code: 4,
        errorSubcode: 1504018,
      }),
      true,
    );
    assert.equal(
      isMetaRateLimitError({
        message: "API access blocked.",
        type: "OAuthException",
        code: 200,
      }),
      false,
    );
  });

  it("retries Graph calls once after a rate-limit error", async () => {
    let n = 0;
    const fetchImpl: typeof fetch = async () => {
      n += 1;
      if (n === 1) {
        return jsonResponse(
          {
            error: {
              message: "There have been too many calls from this app.",
              code: 4,
              error_subcode: 1504018,
            },
          },
          400,
        );
      }
      return jsonResponse({ id: "feed-ok" });
    };

    const result = await metaGraphRequest<{ id: string }>(
      config,
      "page-1/feed",
      { method: "POST", fetchImpl, retryDelaysMs: [0] },
    );
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.data.id, "feed-ok");
    assert.equal(n, 2);
  });

  it("creates Instagram carousel children without polling container status", async () => {
    const paths: string[] = [];
    const fetchImpl: typeof fetch = async (input, init) => {
      const url = new URL(String(input));
      const path = url.pathname.replace(/^\/v[\d.]+/, "");
      paths.push(`${init?.method ?? "GET"} ${path}`);
      return jsonResponse({ id: `ig-${paths.length}` });
    };
    const created = await createInstagramMediaContainers(
      config,
      {
        imageUrls: [
          "https://pop-event.com/events/a.jpg",
          "https://pop-event.com/events/b.jpg",
        ],
        carousel: true,
      },
      fetchImpl,
    );
    assert.equal(created.ok, true);
    if (!created.ok) return;
    assert.deepEqual(created.ids, ["ig-1", "ig-2"]);
    assert.deepEqual(paths, ["POST /ig-1/media", "POST /ig-1/media"]);
  });

  it("treats only FINISHED Instagram containers as ready", () => {
    assert.equal(
      instagramContainersFinished(["a", "b"], { a: "FINISHED", b: "FINISHED" }),
      true,
    );
    assert.equal(
      instagramContainersFinished(["a", "b"], { a: "FINISHED", b: "IN_PROGRESS" }),
      false,
    );
    assert.equal(
      instagramContainerFailure(["a"], { a: "ERROR" }),
      "a:ERROR",
    );
  });
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
