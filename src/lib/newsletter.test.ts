import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PartnerDigest } from "./partner-digest";
import {
  NEWSLETTER_LOGO_URL,
  buildWeekendNewsletter,
  isValidNewsletterEmail,
  unsubscribeUrl,
} from "./newsletter";

describe("isValidNewsletterEmail", () => {
  it("accepts a normal address", () => {
    assert.equal(isValidNewsletterEmail("you@email.com"), true);
  });

  it("rejects empty, too long, or malformed", () => {
    assert.equal(isValidNewsletterEmail(""), false);
    assert.equal(isValidNewsletterEmail("not-an-email"), false);
    assert.equal(isValidNewsletterEmail(`${"a".repeat(250)}@x.com`), false);
  });
});

describe("unsubscribeUrl", () => {
  it("keeps the token in the query string", () => {
    const url = unsubscribeUrl("es", "abc123");
    assert.ok(url.includes("/es/newsletter/unsubscribe?t=abc123"));
  });
});

describe("buildWeekendNewsletter", () => {
  it("includes the hosted POP logo in the HTML body", () => {
    const digest: PartnerDigest = {
      generatedAt: "2026-09-14T12:00:00.000Z",
      locale: "en",
      weekendLabel: "This weekend on the North Coast",
      eventCount: 2,
      events: [
        {
          id: "demo-event",
          title: "Demo Night",
          date: "2026-09-18",
          place: "Sosúa",
          city: "sosua",
          category: "culture",
          url: "https://pop-event.com/en/event/demo-event",
        },
      ],
      eventsByCity: {},
      links: {
        home: "https://pop-event.com/en",
        weekend: "https://pop-event.com/en/when/weekend",
        cities: {
          "puerto-plata": "https://pop-event.com/en/puerto-plata",
          sosua: "https://pop-event.com/en/sosua",
          cabarete: "https://pop-event.com/en/cabarete",
        },
      },
      markdown: "",
      whatsapp: "",
      socialDrafts: [],
    };
    const { html } = buildWeekendNewsletter(digest, "token-abc");
    assert.ok(html.includes(NEWSLETTER_LOGO_URL));
    assert.ok(html.includes('alt="POP Events"'));
    assert.ok(html.includes("background:#f6f3ee"));
    assert.ok(NEWSLETTER_LOGO_URL.startsWith("https://"));
    assert.ok(NEWSLETTER_LOGO_URL.endsWith("/poplogo-safe.png"));
  });
});
