import type { NextRequest } from "next/server";

import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/db", () => {
  const mockOrderBy = vi.fn().mockRejectedValue(new Error("fail"));
  const mockWhere = vi.fn(() => ({ orderBy: mockOrderBy }));
  const mockFrom = vi.fn(() => ({ where: mockWhere }));
  const mockSelect = vi.fn(() => ({ from: mockFrom }));
  return { db: { select: mockSelect } };
});
vi.mock("@/lib/schema", () => ({ receiptsLive: {} }));

import { GET } from "./route";

describe("receipts history GET API", () => {
  it("returns 500 on database error", async () => {
    const req = { url: "http://example.com/api/receipts/history" } as NextRequest;
    const res = await GET(req);
    expect(res.status).toBe(500);
    const json = await res.json();
    expect(json).toEqual({ error: "Database error" });
  });
});
