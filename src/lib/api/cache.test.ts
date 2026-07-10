import { describe, expect, it, vi } from "vitest";

import { cachedFetch, cacheSize, clearCache } from "./cache";

describe("cachedFetch", () => {
  it("parses and caches successful responses", async () => {
    clearCache();
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ value: 42 }),
    });

    const result = await cachedFetch(
      "https://example.test/a",
      (data) => (data as { value: number }).value,
      fetchFn as unknown as typeof fetch
    );

    expect(result).toBe(42);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("does not re-fetch a cached url", async () => {
    clearCache();
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ value: 1 }),
    });

    await cachedFetch(
      "https://example.test/b",
      (d) => d,
      fetchFn as unknown as typeof fetch
    );
    await cachedFetch(
      "https://example.test/b",
      (d) => d,
      fetchFn as unknown as typeof fetch
    );

    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(cacheSize()).toBeGreaterThan(0);
  });

  it("throws when the response is not ok", async () => {
    clearCache();
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, status: 404 });

    await expect(
      cachedFetch(
        "https://example.test/missing",
        (d) => d,
        fetchFn as unknown as typeof fetch
      )
    ).rejects.toThrow("404");
  });
});
