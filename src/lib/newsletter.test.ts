import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
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
