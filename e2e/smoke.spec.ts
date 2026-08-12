import { expect, test } from "@playwright/test";

test.describe("POP Events smoke", () => {
  test("home loads and opens an event detail", async ({ page }) => {
    await page.goto("/en", { waitUntil: "domcontentloaded" });

    await expect(page).toHaveTitle(/POP/i);
    await expect(page.locator("main, #main-content, body").first()).toBeVisible();

    // Prefer a real event card/link; fall back to browsing if the home feed is empty.
    const eventLink = page.locator('a[href*="/en/event/"]').first();
    if ((await eventLink.count()) === 0) {
      await page.goto("/en/browse", { waitUntil: "domcontentloaded" });
    }

    await expect(page.locator('a[href*="/en/event/"]').first()).toBeVisible({
      timeout: 20_000,
    });
    await page.locator('a[href*="/en/event/"]').first().click();
    await expect(page).toHaveURL(/\/en\/event\//);
    await expect(page.locator("h1, h2").first()).toBeVisible();
  });

  test("public status endpoint stays minimal", async ({ request }) => {
    const res = await request.get("/api/status");
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as Record<string, unknown>;
    expect(body).toHaveProperty("ok");
    expect(body).toHaveProperty("firebase");
    expect(body).not.toHaveProperty("cronConfigured");
    expect(body).not.toHaveProperty("openaiConfigured");
    expect(body).not.toHaveProperty("pendingIds");
  });
});
