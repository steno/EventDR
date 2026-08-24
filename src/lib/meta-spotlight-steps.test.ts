import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextSpotlightWork } from "./meta-spotlight-steps";

describe("nextSpotlightWork", () => {
  it("posts Facebook before touching Instagram", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: true,
        imageCount: 3,
        childrenFinished: false,
        parentFinished: false,
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
        imageCount: 3,
        childrenFinished: false,
        parentFinished: false,
      }),
      "instagram-children",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        imageCount: 1,
        childrenFinished: false,
        parentFinished: false,
      }),
      "instagram-children",
    );
  });

  it("waits for carousel children, then creates the parent", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        instagramChildIds: ["a", "b", "c"],
        imageCount: 3,
        childrenFinished: false,
        parentFinished: false,
      }),
      "instagram-wait",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        instagramChildIds: ["a", "b", "c"],
        imageCount: 3,
        childrenFinished: true,
        parentFinished: false,
      }),
      "instagram-parent",
    );
  });

  it("publishes a single Instagram photo without a carousel parent", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        instagramChildIds: ["solo"],
        imageCount: 1,
        childrenFinished: true,
        parentFinished: false,
      }),
      "instagram-publish",
    );
  });

  it("waits for the carousel parent before publishing", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        instagramChildIds: ["a", "b"],
        instagramParentId: "parent",
        imageCount: 2,
        childrenFinished: true,
        parentFinished: false,
      }),
      "instagram-wait",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: false,
        wantInstagram: true,
        instagramChildIds: ["a", "b"],
        instagramParentId: "parent",
        imageCount: 2,
        childrenFinished: true,
        parentFinished: true,
      }),
      "instagram-publish",
    );
  });

  it("is done when requested channels have ids", () => {
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: true,
        facebookId: "fb",
        instagramId: "ig",
        imageCount: 3,
        childrenFinished: true,
        parentFinished: true,
      }),
      "done",
    );
    assert.equal(
      nextSpotlightWork({
        wantFacebook: true,
        wantInstagram: false,
        facebookId: "fb",
        imageCount: 3,
        childrenFinished: false,
        parentFinished: false,
      }),
      "done",
    );
  });
});
