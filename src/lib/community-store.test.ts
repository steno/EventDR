import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSubmitValidationError } from "./community-store";

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    title: "Sunset beach yoga",
    description: "Morning stretch session on Kite Beach with certified instructors.",
    date: "2026-08-20",
    location: "Cabarete",
    category: "sports",
    format: "physical",
    ...overrides,
  };
}

describe("getSubmitValidationError", () => {
  it("accepts a minimal valid payload", () => {
    assert.equal(getSubmitValidationError(validBody()), null);
  });

  it("rejects short titles and descriptions", () => {
    assert.equal(getSubmitValidationError(validBody({ title: "Yo" })), "title");
    assert.equal(
      getSubmitValidationError(validBody({ description: "Too short" })),
      "description",
    );
  });

  it("rejects bad dates and locations", () => {
    assert.equal(
      getSubmitValidationError(validBody({ date: "08/20/2026" })),
      "date",
    );
    assert.equal(getSubmitValidationError(validBody({ location: "x" })), "location");
  });

  it("rejects unknown categories and formats", () => {
    assert.equal(
      getSubmitValidationError(validBody({ category: "not-real" })),
      "category",
    );
    assert.equal(
      getSubmitValidationError(validBody({ format: "vr" })),
      "format",
    );
  });

  it("requires weekly recurrence day(s)", () => {
    assert.equal(
      getSubmitValidationError(validBody({ recurrence: "weekly" })),
      "recurrence",
    );
    assert.equal(
      getSubmitValidationError(
        validBody({ recurrence: "weekly", recurrenceDay: 2 }),
      ),
      null,
    );
    assert.equal(
      getSubmitValidationError(
        validBody({ recurrence: "weekly", recurrenceDays: [2, 4] }),
      ),
      null,
    );
  });

  it("validates paid and ticket admission", () => {
    assert.equal(
      getSubmitValidationError(validBody({ admissionKind: "paid" })),
      "admission",
    );
    assert.equal(
      getSubmitValidationError(
        validBody({ admissionKind: "paid", admissionPrice: "RD$500" }),
      ),
      null,
    );
    assert.equal(
      getSubmitValidationError(
        validBody({ admissionKind: "tickets", ticketUrl: "not-a-url" }),
      ),
      "admission",
    );
    assert.equal(
      getSubmitValidationError(
        validBody({
          admissionKind: "tickets",
          ticketUrl: "https://tickets.example.com/event",
        }),
      ),
      null,
    );
  });

  it("rejects non-objects", () => {
    assert.equal(getSubmitValidationError(null), "invalid");
    assert.equal(getSubmitValidationError("x"), "invalid");
  });
});
