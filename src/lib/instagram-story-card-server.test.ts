import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import type { Event } from "./types";
import {
  FEED_CARD_H,
  FEED_CARD_W,
  buildInstagramFeedCardJpeg,
} from "./instagram-story-card-server";
import {
  CARD_H,
  CARD_X,
  CARD_Y,
  IMAGE_H,
  STORY_COLORS,
} from "./instagram-story-card-layout";

describe("buildInstagramFeedCardJpeg", () => {
  it("renders the share card at a 4:5 feed size with readable title ink", async () => {
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

    // Cream panel under the hero — title must paint dark ink (not tofu/empty).
    const feedTop = CARD_Y + CARD_H - FEED_CARD_H;
    const titleTopInFeed = CARD_Y + IMAGE_H + 36 - feedTop;
    const { data, info } = await sharp(jpeg)
      .extract({
        left: CARD_X + 48,
        top: Math.max(0, titleTopInFeed),
        width: 700,
        height: 80,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let dark = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i] ?? 255;
      const g = data[i + 1] ?? 255;
      const b = data[i + 2] ?? 255;
      // Title color #7c2d12 vs cream #fff7ed — count clearly inked pixels.
      if (r < 180 && g < 140 && b < 100) dark += 1;
    }
    assert.ok(
      dark > 200,
      `expected title ink on cream panel, got ${dark} dark pixels (card cream ${STORY_COLORS.card})`,
    );
  });
});
