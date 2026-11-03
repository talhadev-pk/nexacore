import { describe, it, expect } from "vitest";
import { seed, totals, group } from "../data/seed";
import { csvParse, toCSV, rowSchema, kpiStatus } from "./data";
import { defaults, workspaceSchema } from "../store/useStore";
describe("consistent data model", () => {
  it("validates all seed records", () =>
    expect(rowSchema.array().parse(seed)).toHaveLength(144));
  it("reconciles monthly and regional totals", () => {
    const t = totals(seed);
    expect(group(seed).reduce((s, r) => s + r.revenue, 0)).toBe(t.revenue);
    expect(group(seed, "region").reduce((s, r) => s + r.revenue, 0)).toBe(
      t.revenue,
    );
    expect(t.profit).toBe(t.revenue - t.expenses);
  });
  it("handles empty records safely", () => {
    expect(totals([]).margin).toBe(0);
    expect(group([])).toEqual([]);
  });
});
describe("CSV integrity", () => {
  it("round trips every field", () =>
    expect(rowSchema.array().parse(csvParse(toCSV(seed)))).toEqual(seed));
  it("supports commas, quotes, and newlines", () => {
    const rows = [{ a: "A, B", b: 'Say "hello"\nthere' }];
    expect(csvParse(toCSV(rows))).toEqual(rows);
  });
  it("rejects malformed quotes", () =>
    expect(() => csvParse('a,b\n"open,field')).toThrow());
  it("rejects wrong column counts", () =>
    expect(() => csvParse("a,b\n1,2,3")).toThrow());
  it("rejects duplicate headers", () =>
    expect(() => csvParse("a,a\n1,2")).toThrow());
  it("rejects negative values and invalid dates", () =>
    expect(
      rowSchema.safeParse({ ...seed[0], revenue: -1, date: "bad" }).success,
    ).toBe(false));
});
describe("workspace and targets", () => {
  it("preserves customized profiles through serialization", () => {
    const customized = {
      ...defaults,
      profile: { name: "Changed", email: "changed@example.com" },
    };
    expect(
      workspaceSchema.parse(JSON.parse(JSON.stringify(customized))).profile,
    ).toEqual(customized.profile);
  });
  it("rejects invalid backup", () =>
    expect(workspaceSchema.safeParse({ profile: { name: "x" } }).success).toBe(
      false,
    ));
  it("calculates documented boundaries", () => {
    expect(kpiStatus(100, 100)).toBe("On Track");
    expect(kpiStatus(80, 100)).toBe("Needs Attention");
    expect(kpiStatus(79, 100)).toBe("Below Target");
  });
});
