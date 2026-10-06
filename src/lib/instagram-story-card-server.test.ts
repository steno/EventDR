import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import type { Event } from "./types";
import {
  FEED_CARD_H,
  FEED_CARD_W,
  buildInstagramFeedCardJpeg,
} from "./instagram-story-card-server";

describe("buildInstagramFeedCardJpeg", () => {
  it("renders the share card at a 4:5 feed size", async () => {
    const jpeg = await buildInstagramFeedCardJpeg(
      {
        id: "card-test",
        title: "BandItalia Aperitivo",
        date: "2026-10-06",
        time: "5:00 PM",
        location: "Sosúa",
        venue: "Parada Típica El Choco",
        category: "music",
        format: "physical",
        sourceType: "seed",
        status: "approved",
      } as Event,
      "en",
    );
    const meta = await sharp(jpeg).metadata();
    assert.equal(meta.format, "jpeg");
    assert.equal(meta.width, FEED_CARD_W);
    assert.equal(meta.height, FEED_CARD_H);
  });
});
