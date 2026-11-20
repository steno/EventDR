import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import path from "node:path";
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

  it("embeds a flyer fetched from origin across the cream card", async () => {
    const flyerPath = path.join(
      process.cwd(),
      "public/events/latin-disco-semaforo-yeffrey-estrella-2026-11-20.jpg",
    );
    const flyer = readFileSync(flyerPath);
    const server = createServer((req, res) => {
      if (req.url?.includes("latin-disco")) {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(flyer);
        return;
      }
      res.writeHead(404);
      res.end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    const origin = `http://127.0.0.1:${port}`;

    try {
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
        origin,
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
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
  });
});
