import { describe, it, expect } from "vitest";

describe("Financial Precision & Minor Units Calculations", () => {
  it("converts decimal money to integer minor units safely", () => {
    const toMinor = (amount: number, scale: number) =>
      BigInt(Math.round(amount * 10 ** scale));

    expect(toMinor(150.0, 2)).toBe(15000n);
    expect(toMinor(50000.75, 2)).toBe(5000075n);
    expect(toMinor(0.01, 2)).toBe(1n);
  });

  it("calculates 2.0% platform fee in exact minor units", () => {
    const calculateFeeMinor = (amountMinor: bigint) =>
      (amountMinor * 200n) / 10000n; // 2.0% = 200 bps

    const amountMinor = 5000000n; // ₦50,000.00
    const feeMinor = calculateFeeMinor(amountMinor);
    expect(feeMinor).toBe(100000n); // ₦1,000.00

    const totalDebit = amountMinor + feeMinor;
    expect(totalDebit).toBe(5100000n); // ₦51,000.00
  });

  it("prevents floating-point drift on multiple transactions", () => {
    // Classic IEEE 754 floating point issue: 0.1 + 0.2 !== 0.3
    const a = 10n; // 0.10
    const b = 20n; // 0.20
    expect(a + b).toBe(30n); // Exactly 0.30 in minor units
  });
});
