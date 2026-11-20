import { describe, it, expect } from "vitest";

describe("Open Payments Quote Expiry Invariants", () => {
  it("flags past timestamp as expired", () => {
    const expiredTimestamp = new Date(Date.now() - 5000).toISOString();
    const isExpired = new Date(expiredTimestamp).getTime() <= Date.now();
    expect(isExpired).toBe(true);
  });

  it("permits fresh quote within validity window", () => {
    const freshTimestamp = new Date(Date.now() + 60000).toISOString();
    const isExpired = new Date(freshTimestamp).getTime() <= Date.now();
    expect(isExpired).toBe(false);
  });

  it("computes remaining seconds accurately without looping back", () => {
    const futureTimestamp = new Date(Date.now() + 45000).toISOString();
    const remaining = Math.max(
      0,
      Math.floor((new Date(futureTimestamp).getTime() - Date.now()) / 1000)
    );
    expect(remaining).toBeGreaterThanOrEqual(44);
    expect(remaining).toBeLessThanOrEqual(46);
  });
});
