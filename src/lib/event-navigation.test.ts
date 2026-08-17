import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { getDictionary } from "../i18n/dictionaries";
import {
  rememberReturnPath,
  resetReturnPathReplayForTests,
  resolveBackLabel,
  resolveListingBackLabel,
  takeReturnPath,
} from "./event-navigation";

const RETURN_STORAGE_KEY = "pop-event-return";

function installSessionStorageMock(pathname = "/en/venue/macorix-house-of-rum") {
  const store = new Map<string, string>();
  const sessionStorage = {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
  };
  const win = {
    sessionStorage,
    location: { pathname },
  } as Window & typeof globalThis;
  global.window = win;
  global.sessionStorage = sessionStorage as Storage;
  return { store, setPathname: (path: string) => {
    (global.window as Window & { location: { pathname: string } }).location.pathname = path;
  } };
}

describe("takeReturnPath", () => {
  beforeEach(() => {
    resetReturnPathReplayForTests();
    installSessionStorageMock("/en/venue/macorix-house-of-rum");
  });

  it("replays the same context when Strict Mode remounts in dev", () => {
    rememberReturnPath("/en/event/macorix-tours", "Macorix House of Rum — Tours & Tastings");
    const first = takeReturnPath("en");
    const second = takeReturnPath("en");

    assert.deepEqual(first, {
      path: "/en/event/macorix-tours",
      title: "Macorix House of Rum — Tours & Tastings",
    });
    assert.deepEqual(second, first);
    assert.equal(global.window.sessionStorage.getItem(RETURN_STORAGE_KEY), null);
  });

  it("starts fresh after a new rememberReturnPath call", () => {
    rememberReturnPath("/en/event/old-event", "Old event");
    takeReturnPath("en");

    rememberReturnPath("/en/event/new-event", "New event");
    assert.deepEqual(takeReturnPath("en"), {
      path: "/en/event/new-event",
      title: "New event",
    });
  });

  it("does not replay venue context when returning to the same venue page", () => {
    const { setPathname } = installSessionStorageMock("/en/venue/macorix-house-of-rum");

    rememberReturnPath("/en/event/macorix-tours", "Macorix tours");
    takeReturnPath("en");

    setPathname("/en/event/nearby-show");
    rememberReturnPath(
      "/en/venue/macorix-house-of-rum",
      "Macorix House of Rum",
    );
    takeReturnPath("en");

    setPathname("/en/venue/macorix-house-of-rum");
    rememberReturnPath("/en/event/macorix-tours", "Macorix tours");
    assert.deepEqual(takeReturnPath("en"), {
      path: "/en/event/macorix-tours",
      title: "Macorix tours",
    });
  });

  it("ignores a stored return path that points at the current page", () => {
    installSessionStorageMock("/en/venue/macorix-house-of-rum");
    rememberReturnPath("/en/venue/macorix-house-of-rum", "Macorix House of Rum");
    assert.equal(takeReturnPath("en"), null);
  });
});

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
