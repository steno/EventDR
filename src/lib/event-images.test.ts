import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { attachEventImage, getEventImageUrl } from "./event-images";

describe("attachEventImage", () => {
  it("aliases ingest-deep-caves-tour to the curated El Choco cave photo", () => {
    const curated = getEventImageUrl("el-choco-cave-tour-swimming-daily");
    assert.ok(curated?.startsWith("/events/el-choco-cave-tour-swimming-daily.jpg"));

    const attached = attachEventImage({
      id: "ingest-deep-caves-tour",
      venueSlug: "parque-nacional-el-choco",
      imageUrl:
        "https://a.veronikasadventure.com/tour/deep-caves-in-cabarete-with-guided-tour-and-swimming-t1048496-3.jpg",
    });

    assert.equal(attached.imageUrl, getEventImageUrl("ingest-deep-caves-tour"));
    assert.ok(
      attached.imageUrl?.startsWith("/events/el-choco-cave-tour-swimming-daily.jpg"),
    );
  });

  it("drops CSP-blocked remote heroes and falls back to the venue photo", () => {
    const attached = attachEventImage({
      id: "some-random-ingest",
      venueSlug: "parque-nacional-el-choco",
      imageUrl:
        "https://a.veronikasadventure.com/tour/deep-caves-in-cabarete-with-guided-tour-and-swimming-t1048496-3.jpg",
    });

    assert.ok(attached.imageUrl?.startsWith("/venues/parque-nacional-el-choco-cave.jpg"));
  });

  it("keeps local curated paths", () => {
    const attached = attachEventImage({
      id: "local-hero-event",
      imageUrl: "/events/el-choco-cave-tour-swimming-daily.jpg?v=abc",
    });
    assert.equal(
      attached.imageUrl,
      "/events/el-choco-cave-tour-swimming-daily.jpg?v=abc",
    );
  });
});
