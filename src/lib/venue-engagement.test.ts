import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  engagementDecay,
  ENGAGEMENT_HALF_LIFE_DAYS,
  ENGAGEMENT_SAVE_WEIGHT,
  ENGAGEMENT_SHARE_WEIGHT,
  pruneEngagementDays,
  scoreVenueEngagement,
} from "./venue-engagement";
import { getFeaturedVenues } from "./home-layout";
import type { Venue } from "./types";

describe("venue engagement scoring", () => {
  it("weights a share three times a save on the same day", () => {
    const now = new Date("2026-11-05T16:00:00.000Z");
    const shareOnly = scoreVenueEngagement(
      { "2026-11-05": { shares: 1, saves: 0 } },
      now,
    );
    const saveOnly = scoreVenueEngagement(
      { "2026-11-05": { shares: 0, saves: 1 } },
      now,
    );
    assert.equal(shareOnly, ENGAGEMENT_SHARE_WEIGHT);
    assert.equal(saveOnly, ENGAGEMENT_SAVE_WEIGHT);
    assert.equal(shareOnly, saveOnly * 3);
  });

  it("decays to half after the half-life window", () => {
    assert.ok(Math.abs(engagementDecay(ENGAGEMENT_HALF_LIFE_DAYS) - 0.5) < 1e-9);
  });

  it("ignores buckets older than 90 days", () => {
    const now = new Date("2026-11-05T16:00:00.000Z");
    const score = scoreVenueEngagement(
      {
        "2026-08-01": { shares: 100, saves: 100 },
        "2026-11-05": { shares: 1, saves: 0 },
      },
      now,
    );
    assert.equal(score, ENGAGEMENT_SHARE_WEIGHT);
  });

  it("prunes days outside the ranking window", () => {
    const now = new Date("2026-11-05T16:00:00.000Z");
    const pruned = pruneEngagementDays(
      {
        "2026-08-01": { shares: 9, saves: 0 },
        "2026-10-20": { shares: 1, saves: 0 },
      },
      now,
    );
    assert.equal(pruned["2026-08-01"], undefined);
    assert.equal(pruned["2026-10-20"]?.shares, 1);
  });
});

describe("getFeaturedVenues engagement ranking", () => {
  const venues: Venue[] = [
    {
      slug: "ground-zero-disco",
      name: "Ground Zero",
      city: "Sosúa",
      description: "Nightclub",
      lat: 19.8,
      lng: -70.5,
    },
    {
      slug: "smileys-bar-sosua",
      name: "Smiley's",
      city: "Sosúa",
      description: "Bar",
      lat: 19.8,
      lng: -70.5,
    },
    {
      slug: "finish-line-sosua",
      name: "Finish Line",
      city: "Sosúa",
      description: "Bar",
      lat: 19.8,
      lng: -70.5,
    },
  ];

  it("ranks higher engagement ahead of the daily shuffle", () => {
    const ranked = getFeaturedVenues(venues, "local", 2, {
      seed: "2026-11-05",
      engagementScores: {
        "finish-line-sosua": 12,
        "smileys-bar-sosua": 3,
      },
    });
    assert.equal(ranked[0]?.slug, "finish-line-sosua");
    assert.equal(ranked[1]?.slug, "smileys-bar-sosua");
  });

  it("falls back to the seeded shuffle when scores are empty", () => {
    const a = getFeaturedVenues(venues, "local", 3, {
      seed: "2026-11-05",
      engagementScores: {},
    }).map((v) => v.slug);
    const b = getFeaturedVenues(venues, "local", 3, {
      seed: "2026-11-05",
    }).map((v) => v.slug);
    assert.deepEqual(a, b);
  });
});
