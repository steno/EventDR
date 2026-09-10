import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterRemovedVenues,
  isRemovedVenueSlug,
  REMOVED_VENUE_SLUGS,
} from "./removed-venues";

describe("removed venues", () => {
  it("lists the empty and out-of-scope stubs that are safe to dump", () => {
    assert.deepEqual(
      [...REMOVED_VENUE_SLUGS].sort(),
      [
        "cabarete-bay",
        "cabarete-beach",
        "cabarete-surf-school",
        "cafe-del-mar",
        "caleton-beach-club",
        "rafaella-s-studio",
      ],
    );
  });

  it("dumps Caleton Beach Club (Cap Cana, outside North Coast)", () => {
    assert.equal(isRemovedVenueSlug("caleton-beach-club"), true);
  });

  it("filters dumped slugs from venue lists", () => {
    const kept = filterRemovedVenues([
      { slug: "lax-cabarete" },
      { slug: "cafe-del-mar" },
      { slug: "caleton-beach-club" },
    ]);
    assert.deepEqual(
      kept.map((venue) => venue.slug),
      ["lax-cabarete"],
    );
  });
});
