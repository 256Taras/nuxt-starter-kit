import { expect, test } from "@playwright/test";

test.describe("auth redirect", () => {
  test("anonymous user is sent to /sign-in when visiting a protected route", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/sign-in(\?|$)/);
  });

  test("/sign-in renders the sign-in form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});
