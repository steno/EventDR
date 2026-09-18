import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildEventShareCaption,
  buildWhatsAppShareMessage,
  getShareUrl,
} from "./share";
import type { Event } from "./types";

const sample: Event = {
  id: "allison-sade-aura-2026-09-17",
  title: "Allison Sade at Aura",
  description:
    "Long body with https://instagram.com/someone that must not lead WhatsApp's preview.",
  date: "2026-09-17",
  time: "8:00 PM",
  location: "Cabarete",
  category: "concert",
  format: "physical",
};

describe("buildWhatsAppShareMessage", () => {
  it("puts the canonical event URL first so WhatsApp previews POP", () => {
    const message = buildWhatsAppShareMessage(sample, "en");
    assert.match(
      message,
      /^https:\/\/pop-event\.com\/en\/event\/allison-sade-aura-2026-09-17\n\n/,
    );
    assert.doesNotMatch(message, /instagram\.com/);
    assert.equal(message.includes(sample.title), true);
  });
});

describe("getShareUrl(whatsapp)", () => {
  it("encodes the URL-first WhatsApp message", () => {
    const href = getShareUrl("whatsapp", sample, "en");
    assert.ok(href);
    assert.equal(href.startsWith("https://wa.me/?text="), true);
    const text = decodeURIComponent(href.slice("https://wa.me/?text=".length));
    assert.equal(text, buildWhatsAppShareMessage(sample, "en"));
  });
});

describe("buildEventShareCaption", () => {
  it("omits the long description", () => {
    const caption = buildEventShareCaption(sample, "en");
    assert.equal(caption.includes(sample.description), false);
    assert.equal(caption.includes(sample.title), true);
  });
});
