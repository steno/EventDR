import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextSpotlightWork } from "./meta-spotlight-steps";

describe("nextSpotlightWork", () => {
  it("posts Facebook before touching Instagram", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: true,
        eventCount: 3,
        instagramPostedCount: 0,
        creationFinished: false,
      }),
      "facebook",
    );
  });

  it("skips Facebook when it is already posted or not requested", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: true,
        facebookId: "fb",
        eventCount: 3,
        instagramPostedCount: 0,
        creationFinished: false,
      }),
      "instagram-create",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        eventCount: 1,
        instagramPostedCount: 0,
        creationFinished: false,
      }),
      "instagram-create",
    );
  });

  it("creates, waits, then publishes one Instagram post at a time", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        eventCount: 3,
        instagramPostedCount: 0,
        instagramCreationId: "c1",
        creationFinished: false,
      }),
      "instagram-wait",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        eventCount: 3,
        instagramPostedCount: 0,
        instagramCreationId: "c1",
        creationFinished: true,
      }),
      "instagram-publish",
    );
  });

  it("starts the next event after one Instagram post is done", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        eventCount: 3,
        instagramPostedCount: 1,
        creationFinished: false,
      }),
      "instagram-create",
    );
  });

  it("is done when every event has an Instagram post", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: true,
        facebookId: "fb",
        eventCount: 3,
        instagramPostedCount: 3,
        creationFinished: true,
      }),
      "done",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: false,
        facebookId: "fb",
        eventCount: 3,
        instagramPostedCount: 0,
        creationFinished: false,
      }),
      "done",
    );
  });
});
