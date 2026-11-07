import { test, expect } from "@playwright/test";
async function login(page: any, role = "Manager") {
  await page.goto("/staff/login");
  await page
    .getByRole("button", { name: "Demo " + role, exact: false })
    .click();
}
async function data(page: any) {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("cakedesk-demo-v1") || "null"),
  );
}
async function futureOpen(page: any) {
  return page.evaluate(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}
test("online request → image note → staff quote → verified approval → production → pickup, with revisions preserved", async ({
  page,
}) => {
  await page.goto("/order?kind=custom");
  const date = await futureOpen(page);
  await page.getByLabel("Requested pickup date").fill(date);
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Cake inscription").fill("Happy birthday!");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Describe your cake").fill("Blue floral birthday cake");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=",
    "base64",
  );
  await page.getByLabel("Reference photo").setInputFiles({
    name: "reference.png",
    mimeType: "image/png",
    buffer: png,
  });
  await page.getByLabel("Write a note").fill("Make the flowers blue");
  await page
    .getByRole("button", { name: "Add note to reference image" })
    .click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Your name").fill("Fictional Test Customer");
  await page.getByLabel("Phone number").fill("3025550199");
  await page.getByLabel("I understand").check();
  await page.getByRole("button", { name: "Send cake request" }).click();
  await expect(
    page.getByRole("heading", { name: "Request received." }),
  ).toBeVisible();
  const db = await data(page);
  expect(
    db.orders.filter((o: any) => o.name === "Fictional Test Customer"),
  ).toHaveLength(1);
  const order = db.orders[0];
  expect(order.markers[0].note).toBe("Make the flowers blue");
  expect(order.status).toBe("Awaiting Review");
  await login(page);
  await page.goto("/staff/production");
  await page.getByLabel("Production date").fill(date);
  await expect(
    page.getByRole("heading", { name: "Blue floral birthday cake" }),
  ).toHaveCount(0);
  await page.goto("/staff/orders/" + order.id);
  await page.getByLabel("Decoration labor ($)").fill("25");
  await page.getByLabel("I reviewed the design").check();
  await page.getByRole("button", { name: "Send quote for approval" }).click();
  expect((await data(page)).orders[0].quotes[0].total).toBe(73);
  await page.goto("/request/" + order.token);
  await page.getByLabel("Verify your order contact number").fill("wrong");
  await page.getByRole("button", { name: "Accept quote v1" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Enter the contact number",
  );
  await page.getByLabel("Verify your order contact number").fill("3025550199");
  await page.getByRole("button", { name: "Accept quote v1" }).click();
  expect((await data(page)).orders[0].status).toBe("Awaiting Approval");
  await page.goto("/staff/orders/" + order.id);
  await page.getByRole("button", { name: "Confirm approved order" }).click();
  expect((await data(page)).orders[0].status).toBe("Confirmed");
  await page.goto("/request/" + order.token);
  await page
    .getByLabel("Proposed design changes")
    .fill("Blue floral cake with yellow butterflies");
  await page.getByRole("button", { name: "Request a change" }).click();
  expect((await data(page)).orders[0].approvedDesign).toBe(
    "Blue floral birthday cake",
  );
  await page.goto("/staff/orders/" + order.id);
  await page.getByLabel("I reviewed the design").check();
  await page.getByRole("button", { name: "Send quote for approval" }).click();
  expect((await data(page)).orders[0].quotes).toHaveLength(2);
  await page.goto("/request/" + order.token);
  await page.getByLabel("Verify your order contact number").fill("3025550199");
  await page.getByRole("button", { name: "Accept quote v2" }).click();
  expect((await data(page)).orders[0].approvedDesign).toBe(
    "Blue floral cake with yellow butterflies",
  );
  await page.goto("/staff/production");
  await page.getByLabel("Production date").fill(date);
  const card = page.locator(".production-card").filter({ hasText: order.id });
  await expect(card).toContainText("Blue floral cake with yellow butterflies");
  await card.getByRole("button", { name: "Start preparation" }).click();
  await card.getByRole("button", { name: "Mark ready" }).click();
  await card.getByRole("button", { name: "Mark picked up" }).click();
  expect((await data(page)).orders[0].status).toBe("Picked Up");
  await page.reload();
  expect((await data(page)).orders[0].status).toBe("Picked Up");
});
test("fast phone intake restores draft, warns on duplicate and searches by customer, ID and date", async ({
  page,
}) => {
  await login(page);
  await page.goto("/staff/orders/new");
  await page.getByLabel("Customer name").fill("Fictional Phone Customer");
  await page.reload();
  await expect(page.getByLabel("Customer name")).toHaveValue(
    "Fictional Phone Customer",
  );
  await page.getByLabel("Phone or another").fill("3025550100");
  await page.getByLabel("Cake description").fill("Chocolate sheet cake");
  await page.getByRole("button", { name: "Save order" }).click();
  const order = (await data(page)).orders[0];
  expect(order.source).toBe("PHONE");
  expect(order.status).toBe("Awaiting Review");
  await page.goto("/staff/orders");
  for (const q of ["Fictional Phone Customer", order.id, order.date]) {
    await page.getByLabel("Search orders").fill(q);
    await expect(
      page.getByRole("link", { name: "Open " + order.id, exact: true }),
    ).toBeVisible();
  }
  await page.goto("/staff/orders/new");
  await page.getByLabel("Customer name").fill("Fictional Phone Customer");
  await page.getByLabel("Phone or another").fill("3025550100");
  await page.getByLabel("Cake description").fill("Duplicate");
  await expect(
    page.getByText("A similar customer and pickup date"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save order" }).click();
  expect(
    (await data(page)).orders.filter((o: any) => o.phone === "3025550100"),
  ).toHaveLength(1);
});
test("demo role restrictions, invalid private links and customer cost isolation", async ({
  page,
}) => {
  await login(page, "Baker");
  await page.goto("/staff/settings");
  await expect(
    page.getByRole("heading", { name: "This demo role does not have access." }),
  ).toBeVisible();
  await page.goto("/staff/quotes");
  await expect(
    page.getByRole("heading", { name: "This demo role does not have access." }),
  ).toBeVisible();
  await page.goto("/request/not-a-token");
  await expect(
    page.getByRole("heading", { name: "Order link not found." }),
  ).toBeVisible();
  await login(page);
  await page.goto("/staff/orders/B-1043");
  await page.getByLabel("Estimated direct cost ($)").fill("19");
  await page.getByLabel("I reviewed").check();
  await page.getByRole("button", { name: "Send quote for approval" }).click();
  const order = (await data(page)).orders.find((o: any) => o.id === "B-1043");
  await page.goto("/request/" + order.token);
  await expect(page.getByText("Estimated direct cost")).toHaveCount(0);
  await expect(page.getByText("Estimated margin")).toHaveCount(0);
});
test("owner backup exports and restores orders and embedded images; CSV export succeeds", async ({
  page,
}) => {
  await login(page, "Owner");
  await page.goto("/staff/settings");
  const event = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download full local backup" })
    .click();
  const file = await event;
  expect(file.suggestedFilename()).toMatch(/bings-bakery-backup/);
  const path = await file.path();
  expect(path).toBeTruthy();
  await page
    .getByLabel("Restore a Bing’s Bakery JSON export")
    .setInputFiles(path!);
  await expect(page.getByText("5 records validated")).toBeVisible();
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Restore validated backup" }).click();
  expect((await data(page)).orders).toHaveLength(5);
  await page.goto("/staff/reports");
  const csvEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export orders CSV" }).click();
  expect((await csvEvent).suggestedFilename()).toBe("bings-bakery-orders.csv");
});
test("mobile public flow and tablet dashboard fit viewport", async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Have a cake in mind?" }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await login(page);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `test-results/dashboard-${width}.png`,
      fullPage: true,
    });
  }
});

test("cross-tab approval is live and required deposit prevents premature confirmation", async ({
  page,
  context,
}) => {
  await login(page, "Owner");
  await page.goto("/staff/settings");
  await page.getByLabel("Required verified deposit ($)").fill("25");
  await page
    .getByRole("button", { name: "Save settings", exact: true })
    .click();
  await page.goto("/staff/orders/B-1043");
  await page.getByRole("button", { name: "Confirm approved order" }).click();
  await expect(page.getByRole("status")).toContainText("customer must approve");
  await page.getByLabel("I reviewed the design").check();
  await page.getByRole("button", { name: "Send quote for approval" }).click();
  const order = (await data(page)).orders.find((o: any) => o.id === "B-1043");
  const customer = await context.newPage();
  await customer.goto("/request/" + order.token);
  await customer
    .getByLabel("Verify your order contact number")
    .fill(order.phone);
  await customer.getByRole("button", { name: "Accept quote v1" }).click();
  await expect(
    page.getByText("Customer approved quote v1", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirm approved order" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Verify the required deposit",
  );
  await page
    .getByRole("button", { name: "Edit cake & pickup details" })
    .click();
  await page.getByLabel("I verified the payment externally.").check();
  await page.getByLabel("Payment record").selectOption("Verified deposit");
  await page.getByLabel("Verified amount received ($)").fill("25");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByRole("button", { name: "Confirm approved order" }).click();
  await expect(
    customer.getByText("Confirmed", { exact: true }).first(),
  ).toBeVisible();
  expect(
    (await data(page)).orders.find((o: any) => o.id === "B-1043").status,
  ).toBe("Confirmed");
  await customer.close();
});

test("storage failure never reports a saved order", async ({ page }) => {
  await login(page);
  await page.goto("/staff/orders/new");
  await page.getByLabel("Customer name").fill("Unsaved fictional order");
  await page.getByLabel("Phone or another").fill("3025550110");
  await page.getByLabel("Cake description").fill("Should not save");
  await page.evaluate(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    };
  });
  await page.getByRole("button", { name: "Save order" }).click();
  await expect(page.getByRole("status")).toContainText("Could not save");
  expect(page.url()).toContain("/staff/orders/new");
  expect(
    (await data(page)).orders.filter(
      (o: any) => o.name === "Unsaved fictional order",
    ),
  ).toHaveLength(0);
});

test("counter summary exports exclude internal cost estimates", async ({
  page,
}) => {
  await login(page, "Counter");
  await page.goto("/staff/orders/B-1042");
  await expect(page.getByLabel("Estimated direct cost ($)")).toHaveCount(0);
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CakeCard" }).click();
  const exported = await pending;
  const { readFile } = await import("node:fs/promises");
  const summary = JSON.parse(await readFile((await exported.path())!, "utf8"));
  expect(summary.quotes).toHaveLength(1);
  expect(summary.quotes[0]).not.toHaveProperty("cost");
});
