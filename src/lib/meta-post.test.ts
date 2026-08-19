import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  clipMetaCaption,
  defaultMetaImageUrl,
  isAllowedMetaImageUrl,
  META_CAPTION_MAX,
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

  it("requires a caption", async () => {
    const published = await publishToMeta(config, { caption: "  ", dryRun: true });
    assert.equal(published.ok, false);
  });
});
