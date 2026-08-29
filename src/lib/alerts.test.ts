import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "@/i18n/dictionaries";
import {
  EDITORIAL_ALERTS,
  getHomeAlerts,
  isAlertActive,
  resolveAlertHref,
} from "./alerts";
import type { Venue } from "./types";

const dict = getDictionary("en");

const TODAY = new Date("2026-08-29T16:00:00.000Z"); // Sat 29 Aug 2026, AST afternoon

describe("isAlertActive", () => {
  it("includes the from and until days", () => {
    assert.equal(isAlertActive({ from: "2026-08-29", until: "2026-10-26" }, "2026-08-29"), true);
    assert.equal(isAlertActive({ from: "2026-08-29", until: "2026-10-26" }, "2026-10-26"), true);
    assert.equal(isAlertActive({ from: "2026-08-29", until: "2026-10-26" }, "2026-08-28"), false);
    assert.equal(isAlertActive({ from: "2026-08-29", until: "2026-10-26" }, "2026-10-27"), false);
  });
});

describe("getHomeAlerts", () => {
  it("surfaces Teleférico, Iberostar, and Jazz on 29 Aug 2026", () => {
    const alerts = getHomeAlerts({
      locale: "en",
      dict: dict,
      now: TODAY,
    });
    assert.equal(alerts.length, 3);
    assert.equal(alerts[0]?.id, "teleferico-rebuild-2026");
    assert.equal(alerts[0]?.kind, "closure");
    assert.equal(alerts[1]?.id, "iberostar-costa-dorada-refurb-2026");
    assert.equal(alerts[2]?.id, "dr-jazz-festival-2026");
    assert.equal(alerts[2]?.external, true);
  });

  it("drops Iberostar after the refurb window and promotes Anfiteatro", () => {
    const alerts = getHomeAlerts({
      locale: "en",
      dict: dict,
      now: new Date("2026-10-27T16:00:00.000Z"),
    });
    const ids = alerts.map((a) => a.id);
    assert.ok(ids.includes("teleferico-rebuild-2026"));
    assert.ok(ids.includes("dr-jazz-festival-2026"));
    assert.ok(ids.includes("anfiteatro-la-puntilla-renovation"));
    assert.ok(!ids.includes("iberostar-costa-dorada-refurb-2026"));
  });

  it("resolves internal vs official-site hrefs", () => {
    const tele = EDITORIAL_ALERTS[0]!;
    assert.equal(resolveAlertHref(tele.href, "en"), "/en/event/teleferico-puerto-plata-daily");
    const jazz = EDITORIAL_ALERTS.find((a) => a.id === "dr-jazz-festival-2026")!;
    assert.equal(resolveAlertHref(jazz.href, "es"), "https://www.drjazzfestival.com/");
  });

  it("does not duplicate an editorial closure as an auto venue card", () => {
    const venues: Venue[] = [
      {
        slug: "teleferico-puerto-plata",
        name: "Teleférico Puerto Plata",
        city: "Puerto Plata",
        description: "",
        lat: 0,
        lng: 0,
        temporarilyClosed: true,
      },
    ];
    const alerts = getHomeAlerts({
      locale: "en",
      dict: dict,
      venues,
      now: TODAY,
    });
    assert.equal(alerts.filter((a) => a.id.includes("teleferico")).length, 1);
  });
});
