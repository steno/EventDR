import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import { NextRequest } from "next/server";
import { checkCronSecret, checkModeratorSecret } from "./ops-auth";

const PREV_CRON = process.env.CRON_SECRET;
const PREV_MOD = process.env.MODERATOR_SECRET;

function req(
  headers: Record<string, string>,
  url = "https://pop-event.com/api/ingest",
): NextRequest {
  return new NextRequest(url, { headers });
}

describe("ops-auth", () => {
  beforeEach(() => {
    process.env.CRON_SECRET = "cron-test-secret-value";
    process.env.MODERATOR_SECRET = "mod-test-secret-value";
  });

  afterEach(() => {
    if (PREV_CRON === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = PREV_CRON;
    if (PREV_MOD === undefined) delete process.env.MODERATOR_SECRET;
    else process.env.MODERATOR_SECRET = PREV_MOD;
  });

  it("accepts Authorization Bearer for cron", () => {
    assert.equal(
      checkCronSecret(req({ Authorization: "Bearer cron-test-secret-value" })),
      true,
    );
  });

  it("accepts x-cron-secret header", () => {
    assert.equal(
      checkCronSecret(req({ "x-cron-secret": "cron-test-secret-value" })),
      true,
    );
  });

  it("rejects query-string cron secrets", () => {
    assert.equal(
      checkCronSecret(
        new NextRequest(
          "https://pop-event.com/api/ingest?secret=cron-test-secret-value",
        ),
      ),
      false,
    );
  });

  it("rejects wrong cron secret", () => {
    assert.equal(
      checkCronSecret(req({ Authorization: "Bearer wrong" })),
      false,
    );
  });

  it("fails closed when CRON_SECRET unset", () => {
    delete process.env.CRON_SECRET;
    assert.equal(
      checkCronSecret(req({ Authorization: "Bearer cron-test-secret-value" })),
      false,
    );
  });

  it("accepts Bearer for moderator", () => {
    assert.equal(
      checkModeratorSecret(
        req({ Authorization: "Bearer mod-test-secret-value" }),
      ),
      true,
    );
  });

  it("rejects query-string moderator secrets", () => {
    assert.equal(
      checkModeratorSecret(
        new NextRequest(
          "https://pop-event.com/api/moderate?secret=mod-test-secret-value",
        ),
      ),
      false,
    );
  });
});
