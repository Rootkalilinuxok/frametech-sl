import { describe, it, expect, vi, afterEach } from "vitest";

vi.mock("../andamento/_components/chart-area-interactive", () => ({ ChartAreaInteractive: {} }));
vi.mock("./_components/data-table", () => ({ DataTable: {} }));
vi.mock("./_components/section-cards", () => ({ SectionCards: {} }));

import getRows from "./page";

// Ensure fetch is restored after tests
const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("getRows", () => {
  it("throws when the API response is not ok", async () => {
    const mockFetch = vi.fn().mockResolvedValue(new Response("fail", { status: 500, statusText: "Server Error" }));
    global.fetch = mockFetch;

    await expect(getRows()).rejects.toThrow();
  });
});
