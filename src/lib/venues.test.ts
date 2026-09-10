import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Venue } from "./types";
import { mergeVenueLists } from "./venues";

function venue(
  partial: Partial<Venue> & Pick<Venue, "slug" | "name">,
): Venue {
  return {
    city: "Cabarete",
    description: `${partial.name} on the North Coast.`,
    lat: 19.75,
    lng: -70.41,
    ...partial,
  };
}

describe("mergeVenueLists", () => {
  it("drops dumped ingest stubs from the remote overlay", () => {
    const merged = mergeVenueLists(
      [venue({ slug: "lax-cabarete", name: "LAX" })],
      [
        venue({ slug: "cafe-del-mar", name: "Cafe del Mar" }),
        venue({ slug: "cabarete-bay", name: "Cabarete Bay" }),
        venue({
          slug: "lax-cabarete",
          name: "LAX",
          googlePlaceId: "place-1",
        }),
      ],
    );

    assert.deepEqual(
      merged.map((entry) => entry.slug),
      ["lax-cabarete"],
    );
    assert.equal(merged[0]?.googlePlaceId, "place-1");
  });
});
