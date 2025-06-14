import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => {
  const mockFrom = vi.fn().mockResolvedValue([{ totalEur: "10", total: "10", newCustomers: "1", activeAccounts: "1" }]);
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return { db: { select: mockSelect } };
});
vi.mock("@/lib/schema", () => ({ receiptsLive: {} }));
vi.mock("drizzle-orm/sql", () => ({
  sum: vi.fn(),
  count: vi.fn(),
  countDistinct: vi.fn(),
}));

import { GET } from "./route";

describe("dashboard costi metrics API", () => {
  it("returns metrics keys", async () => {
    const res = await GET();
    const json = await res.json();
    expect(json).toHaveProperty("totalRevenue");
    expect(json).toHaveProperty("newCustomers");
    expect(json).toHaveProperty("activeAccounts");
    expect(json).toHaveProperty("growthRate");
  });
});
