import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_EVENT_LIST_VIEW,
  isEventListView,
  parseEventListView,
} from "./event-list-view";

describe("isEventListView", () => {
  it("accepts list and cards", () => {
    assert.equal(isEventListView("list"), true);
    assert.equal(isEventListView("cards"), true);
  });

  it("rejects unknown values", () => {
    assert.equal(isEventListView("gallery"), false);
    assert.equal(isEventListView(""), false);
    assert.equal(isEventListView(null), false);
  });
});

describe("parseEventListView", () => {
  it("returns cards as the discovery default", () => {
    assert.equal(parseEventListView(undefined), DEFAULT_EVENT_LIST_VIEW);
    assert.equal(parseEventListView(null), "cards");
    assert.equal(parseEventListView("nope"), "cards");
  });

  it("passes through stored preferences", () => {
    assert.equal(parseEventListView("list"), "list");
    assert.equal(parseEventListView("cards"), "cards");
  });
});
