import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import type { Event } from "./types";
import {
  FEED_CARD_H,
  FEED_CARD_W,
  buildInstagramFeedCardJpeg,
} from "./instagram-story-card-server";
import { FEED_CARD_PAD } from "./instagram-story-card-layout";

describe("buildInstagramFeedCardJpeg", () => {
  it("renders a 4:5 flyer-only card", async () => {
    const jpeg = await buildInstagramFeedCardJpeg(
      {
        id: "card-test",
        title: "BandItalia Aperitivo",
        description: "Test event",
        date: "2026-10-06",
        location: "Cabarete",
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
    assert.ok((meta.size ?? 0) > 5_000);
  });

  it("embeds a local public flyer across the cream card", async () => {
    const jpeg = await buildInstagramFeedCardJpeg(
      {
        id: "latin-disco-semaforo-yeffrey-estrella-2026-11-20",
        title: "Latin Disco Club Semaforo Party",
        description: "Test flyer embed",
        date: "2026-11-20",
        location: "Sosúa",
        imageUrl: "/events/latin-disco-semaforo-yeffrey-estrella-2026-11-20.jpg",
        category: "parties",
        format: "physical",
        sourceType: "seed",
        status: "approved",
      } as Event,
      "en",
    );

    const meta = await sharp(jpeg).metadata();
    assert.equal(meta.width, FEED_CARD_W);
    assert.equal(meta.height, FEED_CARD_H);
    // Cream-only cards are tiny; a real flyer still compresses much larger.
    assert.ok(
      (meta.size ?? 0) > 40_000,
      `expected embedded flyer bytes, got size=${meta.size}`,
    );

    const cardH = FEED_CARD_H - FEED_CARD_PAD * 2;
    assert.ok(cardH > 1100, `expected tall flyer card, got cardH=${cardH}`);
  });
});
