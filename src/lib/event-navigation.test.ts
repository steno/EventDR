import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "../i18n/dictionaries";
import {
  resolveBackLabel,
  resolveListingBackLabel,
} from "./event-navigation";

describe("resolveListingBackLabel", () => {
  const dict = getDictionary("en");

  it("does not repeat the current city next to the area picker", () => {
    assert.equal(
      resolveListingBackLabel("en", "/en/city/sosua", dict, "sosua"),
      dict.browse.allEvents,
    );
  });

  it("keeps Discover when leaving a city hub for home", () => {
    assert.equal(
      resolveListingBackLabel("en", "/en", dict, "sosua"),
      dict.nav.discover,
    );
  });

  it("still names the city on detail pages with no picker", () => {
    assert.equal(resolveBackLabel("en", "/en/city/sosua", dict), "Sosúa");
  });
});
