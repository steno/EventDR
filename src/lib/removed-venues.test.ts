import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canonicalizeVenueSlug,
  filterRemovedVenues,
  isRemovedVenueSlug,
  REMOVED_VENUE_SLUGS,
  resolveVenueSlugRedirect,
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
        "cowork-cabarete",
        "freestyle-catamaran",
        "grecialand",
        "parque-de-beisbol-jose-briceno",
        "rafaella-s-studio",
      ],
    );
  });

  it("dumps Caleton Beach Club (Cap Cana, outside North Coast)", () => {
    assert.equal(isRemovedVenueSlug("caleton-beach-club"), true);
  });

  it("dumps the truncated Grecialand ingest stub (canonical is grecialandia)", () => {
    assert.equal(isRemovedVenueSlug("grecialand"), true);
    assert.equal(isRemovedVenueSlug("grecialandia"), false);
  });

  it("dumps the Parque de Béisbol José Briceño ingest stub", () => {
    assert.equal(isRemovedVenueSlug("parque-de-beisbol-jose-briceno"), true);
    assert.equal(
      resolveVenueSlugRedirect("parque-de-beisbol-jose-briceno"),
      "parque-jose-briceno",
    );
    assert.equal(
      canonicalizeVenueSlug("parque-de-beisbol-jose-briceno"),
      "parque-jose-briceno",
    );
    assert.equal(isRemovedVenueSlug("parque-jose-briceno"), false);
  });

  it("filters dumped slugs from venue lists", () => {
    const kept = filterRemovedVenues([
      { slug: "lax-cabarete" },
      { slug: "cafe-del-mar" },
      { slug: "caleton-beach-club" },
      { slug: "grecialand" },
      { slug: "parque-de-beisbol-jose-briceno" },
    ]);
    assert.deepEqual(
      kept.map((venue) => venue.slug),
      ["lax-cabarete"],
    );
  });
});
