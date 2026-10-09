import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveMapPinThumb } from "./map-pin-thumb";

describe("resolveMapPinThumb", () => {
  it("returns null for empty sources", () => {
    assert.equal(resolveMapPinThumb(undefined), null);
    assert.equal(resolveMapPinThumb(""), null);
    assert.equal(resolveMapPinThumb("   "), null);
  });

  it("routes local heroes through /_next/image at pin size", () => {
    const thumb = resolveMapPinThumb("/events/sosua-diving-adventures-daily.jpg");
    assert.ok(thumb);
    assert.match(
      thumb.src,
      /^\/_next\/image\?url=%2Fevents%2Fsosua-diving-adventures-daily\.jpg&w=96&q=65$/,
    );
    assert.match(thumb.srcSet ?? "", /w=96.*1x/);
    assert.match(thumb.srcSet ?? "", /w=128.*2x/);
    assert.equal(thumb.sizes, "48px");
  });

  it("strips local cache-busters before optimizing", () => {
    const thumb = resolveMapPinThumb("/events/aura.jpg?v=1");
    assert.ok(thumb);
    assert.equal(
      thumb.src,
      "/_next/image?url=%2Fevents%2Faura.jpg&w=96&q=65",
    );
  });

  it("passes through URLs Next cannot optimize", () => {
    const remote = "https://example.com/flyer.jpg";
    const thumb = resolveMapPinThumb(remote);
    assert.deepEqual(thumb, { src: remote, sizes: "48px" });
  });
});
