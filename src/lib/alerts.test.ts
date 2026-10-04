import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "@/i18n/dictionaries";
import {
  applyActiveEditorialClosure,
  applyActiveEditorialClosureToVenue,
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

  it("drops Iberostar, VOYVOY, and Iván García after their windows", () => {
    const alerts = getHomeAlerts({
      locale: "en",
      dict: dict,
      now: new Date("2026-10-27T16:00:00.000Z"),
    });
    const ids = alerts.map((a) => a.id);
    assert.ok(ids.includes("teleferico-rebuild-2026"));
    assert.ok(ids.includes("dr-jazz-festival-2026"));
    assert.ok(!ids.includes("ivan-garcia-teatro-mantenimiento-2026"));
    assert.ok(!ids.includes("iberostar-costa-dorada-refurb-2026"));
    assert.ok(!ids.includes("voyvoy-cabarete-closed-2026-10"));
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

describe("applyActiveEditorialClosure", () => {
  const iberostar: {
    id: string;
    venueSlug: string;
    temporarilyClosed?: boolean;
  } = {
    id: "iberostar-costa-dorada-day-pass",
    venueSlug: "iberostar-waves-costa-dorada",
  };

  it("marks the Iberostar day pass closed during the refurb window", () => {
    const closed = applyActiveEditorialClosure(iberostar, "2026-09-01");
    assert.equal(closed.temporarilyClosed, true);
  });

  it("clears the day pass after the hotel reopens", () => {
    const open = applyActiveEditorialClosure(iberostar, "2026-10-27");
    assert.equal(open.temporarilyClosed, undefined);
  });

  it("marks the Iberostar venue closed during the same window", () => {
    const venueInput: { slug: string; temporarilyClosed?: boolean } = {
      slug: "iberostar-waves-costa-dorada",
    };
    const venue = applyActiveEditorialClosureToVenue(venueInput, "2026-09-01");
    assert.equal(venue.temporarilyClosed, true);
    const reopen = applyActiveEditorialClosureToVenue(venueInput, "2026-10-27");
    assert.equal(reopen.temporarilyClosed, undefined);
  });

  it("marks VOYVOY closed through 5 Oct and clears on reopen day 6 Oct", () => {
    const venueInput: { slug: string; temporarilyClosed?: boolean } = {
      slug: "voyvoy-cabarete",
    };
    const closed = applyActiveEditorialClosureToVenue(venueInput, "2026-09-16");
    assert.equal(closed.temporarilyClosed, true);
    const lastClosed = applyActiveEditorialClosureToVenue(venueInput, "2026-10-05");
    assert.equal(lastClosed.temporarilyClosed, true);
    const reopen = applyActiveEditorialClosureToVenue(venueInput, "2026-10-06");
    assert.equal(reopen.temporarilyClosed, undefined);
  });

  it("marks Gypsy Bowls closed after Last Bowl Call through 14 Oct, open 15 Oct", () => {
    const venueInput: { slug: string; temporarilyClosed?: boolean } = {
      slug: "gypsy-bowls-cabarete",
    };
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-03").temporarilyClosed,
      undefined,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-04").temporarilyClosed,
      true,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-14").temporarilyClosed,
      true,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-15").temporarilyClosed,
      undefined,
    );
  });

  it("marks Iván García closed through 23 Oct and open on reapertura day 24 Oct", () => {
    const venueInput: { slug: string; temporarilyClosed?: boolean } = {
      slug: "ivan-garcia-teatro-escuela",
    };
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-23").temporarilyClosed,
      true,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-24").temporarilyClosed,
      undefined,
    );
  });

  it("keeps Last Bowl Call listable on event day while remodel closure is armed", () => {
    const event: { id: string; venueSlug: string; temporarilyClosed?: boolean } =
      {
        id: "gypsy-bowls-last-bowl-call-2026-10-03",
        venueSlug: "gypsy-bowls-cabarete",
      };
    assert.equal(
      applyActiveEditorialClosure(event, "2026-10-03").temporarilyClosed,
      undefined,
    );
    assert.equal(
      applyActiveEditorialClosure(event, "2026-10-04").temporarilyClosed,
      undefined,
    );
  });

  it("marks VOYVOY Monday live closed while the bar is shut", () => {
    const event: { id: string; venueSlug: string; temporarilyClosed?: boolean } =
      {
        id: "voyvoy-monday-live-music",
        venueSlug: "voyvoy-cabarete",
      };
    assert.equal(
      applyActiveEditorialClosure(event, "2026-09-20").temporarilyClosed,
      true,
    );
    assert.equal(
      applyActiveEditorialClosure(event, "2026-10-06").temporarilyClosed,
      undefined,
    );
  });

  it("keeps Teleférico groundbreaking listable while the gondola rebuild stays closed", () => {
    const ceremony: {
      id: string;
      venueSlug: string;
      temporarilyClosed?: boolean;
    } = {
      id: "teleferico-inicio-obras-2026-10-03",
      venueSlug: "teleferico-puerto-plata",
    };
    const daily: {
      id: string;
      venueSlug: string;
      temporarilyClosed?: boolean;
    } = {
      id: "teleferico-puerto-plata-daily",
      venueSlug: "teleferico-puerto-plata",
    };
    assert.equal(
      applyActiveEditorialClosure(ceremony, "2026-09-29").temporarilyClosed,
      undefined,
    );
    assert.equal(
      applyActiveEditorialClosure(daily, "2026-09-29").temporarilyClosed,
      true,
    );
  });
});

describe("VOYVOY closure on Cabarete home", () => {
  it("surfaces the VOYVOY notice on Cabarete during the closed window", () => {
    const alerts = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "cabarete",
      now: new Date("2026-09-16T16:00:00.000Z"),
    });
    assert.ok(alerts.some((a) => a.id === "voyvoy-cabarete-closed-2026-10"));
  });

  it("drops the VOYVOY notice on 6 October when they reopen", () => {
    const alerts = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "cabarete",
      now: new Date("2026-10-06T16:00:00.000Z"),
    });
    assert.ok(!alerts.some((a) => a.id === "voyvoy-cabarete-closed-2026-10"));
  });
});

describe("Atléticos Serie Final Game 4 rain postponement", () => {
  it("keeps a Puerto Plata watch notice while the makeup is TBA", () => {
    const alert = EDITORIAL_ALERTS.find(
      (a) => a.id === "atleticos-serie-final-g4-postponed-2026-10",
    );
    assert.ok(alert);
    assert.equal(alert.kind, "watch");
    assert.deepEqual(alert.citySlugs, ["puerto-plata"]);
    assert.equal(isAlertActive(alert, "2026-10-03"), true);
    assert.equal(isAlertActive(alert, "2026-10-12"), true);
    assert.equal(isAlertActive(alert, "2026-10-13"), false);

    // Closures fill the default home cap — raise limit to assert city scoping.
    const pp = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "puerto-plata",
      now: new Date("2026-10-04T00:00:00.000Z"),
      limit: 20,
    });
    assert.ok(pp.some((a) => a.id === alert.id));

    const cab = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "cabarete",
      now: new Date("2026-10-04T00:00:00.000Z"),
      limit: 20,
    });
    assert.ok(!cab.some((a) => a.id === alert.id));
  });
});

describe("Zona Acapella Club closure until further notice", () => {
  it("marks the venue and Oct 4 Domingo Típico closed from 2 Oct", () => {
    const venueInput: { slug: string; temporarilyClosed?: boolean } = {
      slug: "zona-acapella-club",
    };
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-01").temporarilyClosed,
      undefined,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-10-02").temporarilyClosed,
      true,
    );
    assert.equal(
      applyActiveEditorialClosureToVenue(venueInput, "2026-11-01").temporarilyClosed,
      true,
    );

    const event: { id: string; venueSlug: string; temporarilyClosed?: boolean } =
      {
        id: "chiche-almonte-zona-acapella-2026-10-04",
        venueSlug: "zona-acapella-club",
      };
    assert.equal(
      applyActiveEditorialClosure(event, "2026-10-04").temporarilyClosed,
      true,
    );
  });

  it("surfaces on Puerto Plata home and stays off Cabarete", () => {
    const pp = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "puerto-plata",
      now: new Date("2026-10-02T16:00:00.000Z"),
    });
    assert.ok(pp.some((a) => a.id === "zona-acapella-club-closed-2026-10"));

    const cab = getHomeAlerts({
      locale: "en",
      dict,
      citySlug: "cabarete",
      now: new Date("2026-10-02T16:00:00.000Z"),
    });
    assert.ok(!cab.some((a) => a.id === "zona-acapella-club-closed-2026-10"));
  });
});
