import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { storyCardImageSrc, wrapTextLines } from "./instagram-story-card";

describe("wrapTextLines", () => {
  it("wraps to a max line count and ellipsizes overflow", () => {
    const lines = wrapTextLines("Allison Sade live at Aura Beach Club tonight", 12, 2);
    assert.equal(lines.length, 2);
    assert.match(lines[1] ?? "", /…$/);
  });

  it("keeps a short title on one line", () => {
    assert.deepEqual(wrapTextLines("Aura Saturdays", 28, 3), ["Aura Saturdays"]);
  });
});

describe("storyCardImageSrc", () => {
  it("keeps site-relative event and OG paths", () => {
    assert.equal(storyCardImageSrc("/events/aura.jpg?v=1"), "/events/aura.jpg?v=1");
    assert.equal(
      storyCardImageSrc("https://pop-event.com/og/events/aura.jpg"),
      "/og/events/aura.jpg",
    );
  });

  it("rejects unrelated remote hosts", () => {
    assert.equal(storyCardImageSrc("https://cdn.example.com/flyer.jpg"), null);
  });
});
