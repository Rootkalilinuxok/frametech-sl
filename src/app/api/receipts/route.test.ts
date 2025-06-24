import type { NextRequest } from "next/server";
import { describe, it, expect, vi, type Mock } from "vitest";

const mockValues: Mock<[], unknown> = vi.fn();
const mockInsert: Mock<[], { values: Mock<[], unknown> }> = vi.fn(() => ({
  values: mockValues,
}));

vi.doMock("@/lib/db", () => ({ db: { insert: mockInsert } }));
vi.mock("@/lib/schema", () => ({ receiptsLive: {} }));

describe("receipts POST API", () => {
  it("inserts data into receipts_live", async () => {
    const { POST } = await import("./route");
    const req = {
      json: vi.fn().mockResolvedValue({
        id: "1",
        date: "2024-01-01",
        currency: "EUR",
        total: 10,
        sourceHash: "x",
      }),
    } as unknown as NextRequest;

    const res = await POST(req);
    expect(mockInsert).toHaveBeenCalledWith(expect.anything());
    expect(mockValues).toHaveBeenCalled();
    const json = await res.json();
    expect(json).toEqual({ success: true });
  });
});