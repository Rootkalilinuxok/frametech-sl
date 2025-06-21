import type { NextRequest } from "next/server";

import { describe, it, expect, vi } from "vitest";

let mockInsert: ReturnType<typeof vi.fn>;
let mockValues: ReturnType<typeof vi.fn>;

vi.mock("@/lib/db", () => {
  mockValues = vi.fn();
  mockInsert = vi.fn(() => ({ values: mockValues }));
  return { db: { insert: mockInsert } };
});
vi.mock("@/lib/schema", () => ({ receiptsLive: {} }));

import { POST } from "./route";

describe("receipts POST API", () => {
  it("inserts data into receipts_live", async () => {
    const req = {
      json: vi.fn().mockResolvedValue({ id: "1", date: "2024-01-01", currency: "EUR", total: 10, source_hash: "x" }),
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(mockInsert).toHaveBeenCalledWith(expect.anything());
    expect(mockValues).toHaveBeenCalled();
    const json = await res.json();
    expect(json).toEqual({ success: true });
  });
});
