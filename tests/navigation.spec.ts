import { test, expect, type Page } from "@playwright/test";

async function login(page: Page, role = "Manager") {
  await page.goto("/staff/login");
  await page
    .getByRole("button", { name: "Demo " + role, exact: false })
    .click();
}

async function publicNavigation(page: Page) {
  const menu = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  if (await menu.isVisible()) await menu.click();
  return page.getByRole("navigation", { name: "Main navigation" });
}

test("public navigation opens distinct pages and highlights the current destination", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Bing's Bakery");
  await expect(page.locator("header").first()).toContainText(
    /Bing[’']s Bakery/,
  );

  const destinations = [
    ["/cakes", /custom cakes/i, "Custom cakes"],
    ["/how-it-works", /how it works/i, "How it works"],
    ["/contact", /^contact$/i, "Contact"],
  ] as const;
  const headings = new Set<string>();
  for (const [path, name, title] of destinations) {
    const nav = await publicNavigation(page);
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(path);
    await expect(page).toHaveTitle(`${title} | Bing's Bakery`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    headings.add(
      (await page.getByRole("heading", { level: 1 }).textContent()) || "",
    );
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .locator(`a[href="${path}"]`),
    ).toHaveAttribute("aria-current", "page");
  }
  expect(headings.size).toBe(3);
  await page.goto("/order?kind=custom");
  await expect(
    page
      .getByRole("navigation", { name: "Main navigation" })
      .locator('a[href="/order"]'),
  ).toHaveAttribute("aria-current", "page");
});

test("public navigation and contact form remain usable on a phone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  for (const [path, label] of [
    ["/cakes", /custom cakes/i],
    ["/how-it-works", /how it works/i],
    ["/contact", /^contact$/i],
  ] as const) {
    const nav = await publicNavigation(page);
    await expect(
      nav.getByRole("link", { name: label, exact: true }),
    ).toBeVisible();
    await nav.getByRole("link", { name: label, exact: true }).click();
    await expect(page).toHaveURL(path);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await expect(page.getByLabel("Your name", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Your message", { exact: true })).toBeVisible();
});

test("contact enquiries validate, persist and can be resolved in the staff inbox", async ({
  page,
}) => {
  await page.goto("/contact");
  await page
    .getByRole("button", { name: "Save demo message", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your message is saved.", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();

  await page
    .getByLabel("Your name", { exact: true })
    .fill("Fictional Contact Customer");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("contact-test@example.com");
  await page
    .getByRole("combobox", { name: "What can we help with?", exact: true })
    .selectOption({ label: "General question" });
  await page
    .getByLabel("Your message", { exact: true })
    .fill("Could we discuss a cake for our fictional garden celebration?");
  await page
    .getByLabel(
      "I understand this is a local demonstration and no email will be sent.",
      { exact: true },
    )
    .check();
  await page
    .getByRole("button", { name: "Save demo message", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your message is saved.", exact: true }),
  ).toBeVisible();
  await expect(page.locator("main")).toContainText(/no email|not.*sent/i);

  await page.reload();
  await login(page);
  await page.goto("/staff/messages");
  await expect(
    page.getByRole("heading", { name: "Contact enquiries", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Search contact enquiries", { exact: true })
    .fill("Fictional Contact Customer");
  const enquiry = page.getByRole("button", {
    name: "Open enquiry from Fictional Contact Customer",
    exact: true,
  });
  await expect(enquiry).toHaveCount(1);
  await enquiry.click();
  await expect(page.locator("main")).toContainText(
    "Could we discuss a cake for our fictional garden celebration?",
  );
  await page
    .getByRole("button", { name: "Mark resolved", exact: true })
    .click();
  await page
    .getByLabel("Filter contact enquiries", { exact: true })
    .selectOption({ label: "Resolved" });
  await enquiry.click();
  await expect(
    page.getByRole("button", { name: "Reopen enquiry", exact: true }),
  ).toBeVisible();
  await page.reload();
  await page
    .getByLabel("Filter contact enquiries", { exact: true })
    .selectOption({ label: "Resolved" });
  await page
    .getByRole("button", {
      name: "Open enquiry from Fictional Contact Customer",
      exact: true,
    })
    .click();
  await page
    .getByRole("button", { name: "Reopen enquiry", exact: true })
    .click();
  await page
    .getByLabel("Filter contact enquiries", { exact: true })
    .selectOption({ label: "Open" });
  await expect(
    page.getByRole("button", {
      name: "Open enquiry from Fictional Contact Customer",
      exact: true,
    }),
  ).toBeVisible();
});

test("dashboard navigation selects the correct section on both section and nested order routes", async ({
  page,
}) => {
  await login(page, "Owner");
  const nav = page.getByRole("navigation", { name: "Bakery workspace" });
  const routes = [
    ["/staff", "/staff"],
    ["/staff/orders/new", "/staff/orders/new"],
    ["/staff/orders/B-1042", "/staff/orders"],
    ["/staff/quotes", "/staff/quotes"],
    ["/staff/production", "/staff/production"],
    ["/staff/calendar", "/staff/calendar"],
    ["/staff/reports", "/staff/reports"],
    ["/staff/messages", "/staff/messages"],
    ["/staff/settings", "/staff/settings"],
  ];
  for (const [path, active] of routes) {
    await page.goto(path);
    await expect(page).toHaveURL(path);
    await expect(nav.locator('a[aria-current="page"]')).toHaveCount(1);
    await expect(nav.locator(`a[href="${active}"]`)).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
  await page.goto("/staff/calendar");
  const days = page.getByRole("button", { name: /^View pickups for / });
  await expect(days).toHaveCount(7);
  const selectedDate = (await days.nth(2).getAttribute("aria-label"))!.replace(
    "View pickups for ",
    "",
  );
  await days.nth(2).click();
  await expect(page.getByLabel("Production date", { exact: true })).toHaveValue(
    selectedDate,
  );
  await expect(page.getByLabel("Week view", { exact: true })).not.toBeChecked();
});

test("dashboard summary cards open the date and status they advertise", async ({
  page,
}) => {
  await login(page);
  const tomorrow = await page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  await page.getByRole("link", { name: /Tomorrow[’']s pickups/ }).click();
  await expect(page.getByLabel("Production date", { exact: true })).toHaveValue(
    tomorrow,
  );
  expect(new URL(page.url()).pathname).toBe("/staff/production");
  expect(new URL(page.url()).searchParams.get("date")).toBe(tomorrow);

  await page.goto("/staff");
  await page
    .getByRole("link", { name: /Awaiting approval.*With the customer/ })
    .click();
  await expect(
    page.getByLabel("Filter order status", { exact: true }),
  ).toHaveValue("Awaiting Approval");

  await page.goto("/staff");
  await page
    .getByRole("link", { name: /Needs review.*A little attention needed/ })
    .click();
  await expect(
    page.getByLabel("Filter order status", { exact: true }),
  ).toHaveValue("Needs review");
  await expect(
    page.getByRole("link", { name: "Open B-1043", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open B-1046", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Open B-1042", exact: true }),
  ).toHaveCount(0);
});
