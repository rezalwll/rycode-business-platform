import { expect, test } from "@playwright/test";

test("Persian and English public routes render with the correct direction", async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydration|server rendered/i.test(message.text())) {
      hydrationErrors.push(message.text());
    }
  });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "fa");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

test("service catalogue and detail are server-rendered", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const detail = page.locator('a[href^="/services/"]').first();
  await expect(detail).toBeVisible();
  await detail.click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("public lead form validates without accepting an empty request", async ({ page }) => {
  await page.goto("/start-project");
  const submit = page.getByRole("button", { name: /ثبت|send|submit/i });
  await expect(submit).toBeVisible();
  await submit.click();
  await expect(page.locator("form :invalid").first()).toBeVisible();
});

test("protected workspaces redirect anonymous visitors", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/login/);
});

test("a signed-in customer is redirected away from administration", async ({ page }) => {
  test.skip(!process.env.E2E_CUSTOMER_EMAIL || !process.env.E2E_CUSTOMER_PASSWORD);
  await page.goto("/login");
  await page.getByLabel(/ایمیل|email/i).fill(process.env.E2E_CUSTOMER_EMAIL!);
  await page.getByLabel(/گذرواژه|password/i).fill(process.env.E2E_CUSTOMER_PASSWORD!);
  await page.getByRole("button", { name: /ورود|sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard(?:$|\/)/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard(?:$|\/)/);
  await expect(page.getByText("OPS", { exact: true })).toHaveCount(0);
});

test("a bootstrapped administrator can open administration", async ({ page }) => {
  test.skip(!process.env.E2E_ADMIN_EMAIL || !process.env.E2E_ADMIN_PASSWORD);
  await page.goto("/login");
  await page.getByLabel(/ایمیل|email/i).fill(process.env.E2E_ADMIN_EMAIL!);
  await page.getByLabel(/گذرواژه|password/i).fill(process.env.E2E_ADMIN_PASSWORD!);
  await page.getByRole("button", { name: /ورود|sign in/i }).click();
  await expect(page).toHaveURL(/\/dashboard(?:$|\/)/);
  await page.goto("/admin");
  await expect(page.getByText("OPS", { exact: true })).toBeVisible();
});
