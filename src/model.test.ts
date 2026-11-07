import { describe, it, expect } from "vitest";
import { blank, seed, day, issue, unavailable, csv, committed } from "./model";
describe("order and availability rules", () => {
  it("issues distinct pending records with unguessable access tokens", () => {
    const a = issue(blank(), "Customer"),
      b = issue(blank(), "Customer");
    expect(a.id).not.toBe(b.id);
    expect(a.token).not.toBe(b.token);
    expect(a.token).toHaveLength(36);
    expect(committed(a)).toBe(false);
    expect(a.events[0].actor).toBe("Customer");
  });
  it("enforces closures, pickup hours and configured capacity without inventing a limit", () => {
    const db = seed();
    const date = day(4);
    db.settings.sundayClosed = false;
    expect(unavailable(date, "10:00", db)).toBe("");
    db.settings.closed = date;
    expect(unavailable(date, "10:00", db)).toContain("closed");
    db.settings.closed = "";
    expect(unavailable(date, "01:00", db)).toContain("opening hours");
    db.settings.capacity = 1;
    db.orders[0].date = date;
    expect(unavailable(date, "10:00", db)).toContain("capacity");
    expect(unavailable(date, "10:00", db, db.orders[0].id)).toBe("");
  });
  it("does not count requests as production capacity", () => {
    const db = seed();
    db.settings.sundayClosed = false;
    db.settings.capacity = 1;
    db.orders = [issue({ ...blank(), date: day(4) }, "Customer")];
    expect(unavailable(day(4), "10:00", db)).toBe("");
  });
  it("exports quotes, commas and line breaks as escaped CSV cells", () => {
    const o = {
      ...blank(),
      name: 'Sample, "Customer"',
      description: "Line one\nLine two",
    };
    const content = csv([o]);
    expect(content).toContain('"Sample, ""Customer"""');
    expect(content).toContain('"Line one\nLine two"');
  });
});
