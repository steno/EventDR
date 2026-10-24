import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EVENT_PATH_REDIRECTS,
  resolveEventPathRedirect,
} from "./removed-seeds";

describe("EVENT_PATH_REDIRECTS (GSC soft 404s)", () => {
  it("maps renamed Nueve and Disney cruise nights to live ids", () => {
    assert.equal(
      resolveEventPathRedirect("nueve-80s-90s-por-siempre-2026-10-10"),
      "/event/nueve-80s-90s-por-siempre-2026-10-24",
    );
    assert.equal(
      resolveEventPathRedirect("disney-dream-taino-bay-2026-10-08"),
      "/event/disney-dream-taino-bay-2026-10-06",
    );
  });

  it("sends ended Colibrí karaoke series to the venue hub", () => {
    assert.equal(
      resolveEventPathRedirect("el-colibri-karaoke-battle-2026"),
      "/venue/el-colibri-hotel",
    );
  });

  it("keeps every redirect path locale-free and absolute within the app", () => {
    for (const [id, path] of Object.entries(EVENT_PATH_REDIRECTS)) {
      assert.ok(path.startsWith("/"), `${id} → ${path}`);
      assert.doesNotMatch(path, /^\/(en|es|fr)\//, `${id} → ${path}`);
    }
  });
});
