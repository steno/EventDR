import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getDictionary } from "../i18n/dictionaries";
import type { Event } from "./types";
import { formatRecurrenceLabel } from "./recurrence-label";

function weekly(days?: number[], day?: number): Event {
  return {
    id: "recurring-test",
    title: "Test night",
    description: "Recurrence label fixture.",
    date: "2026-01-01",
    location: "Puerto Plata",
    category: "music",
    format: "physical",
    recurrence: "weekly",
    recurrenceDay: day,
    recurrenceDays: days,
  };
}

describe("formatRecurrenceLabel", () => {
  const en = getDictionary("en");
  const es = getDictionary("es");
  const fr = getDictionary("fr");

  it("names the one closed day instead of listing six open days", () => {
    const meclao = weekly([0, 2, 3, 4, 5, 6]);
    assert.equal(formatRecurrenceLabel(meclao, "en", en), "Closed on Mondays");
    assert.equal(formatRecurrenceLabel(meclao, "es", es), "Cerrado los lunes");
    assert.equal(formatRecurrenceLabel(meclao, "fr", fr), "Fermé le lundi");
  });

  it("names two closed days when that is shorter than listing five open days", () => {
    assert.equal(
      formatRecurrenceLabel(weekly([2, 3, 4, 5, 6]), "en", en),
      "Closed on Sundays & Mondays",
    );
  });

  it("keeps listing open days when only a couple run each week", () => {
    assert.equal(
      formatRecurrenceLabel(weekly([2, 4]), "en", en),
      "Every Tue & Thu",
    );
    assert.equal(formatRecurrenceLabel(weekly(undefined, 2), "en", en), "Every Tue");
  });

  it("collapses full-week and weekend patterns to the existing short labels", () => {
    assert.equal(formatRecurrenceLabel(weekly([0, 1, 2, 3, 4, 5, 6]), "en", en), "Daily");
    assert.equal(formatRecurrenceLabel(weekly([1, 2, 3, 4, 5]), "en", en), "Weekdays");
    assert.equal(formatRecurrenceLabel(weekly([0, 6]), "en", en), "Weekends");
  });
});
