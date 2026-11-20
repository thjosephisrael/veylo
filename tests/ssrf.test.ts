import { describe, it, expect } from "vitest";
import { validateWalletUrl } from "../src/lib/open-payments/ssrf";

describe("SSRF Protection and Wallet Address Validation", () => {
  it("accepts valid HTTPS Open Payments URLs", () => {
    const res = validateWalletUrl("https://wallet.interledger-test.dev/tomiade");
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe("https://wallet.interledger-test.dev/tomiade");
  });

  it("normalizes payment pointer notation starting with $", () => {
    const res = validateWalletUrl("$wallet.interledger-test.dev/chioma");
    expect(res.isValid).toBe(true);
    expect(res.normalizedUrl).toBe("https://wallet.interledger-test.dev/chioma");
  });

  it("blocks plain HTTP when allowHttpInDev is false", () => {
    const res = validateWalletUrl("http://wallet.interledger-test.dev/tomiade", false);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("HTTPS is strictly required");
  });

  it("blocks localhost and loopback targets", () => {
    const localhostRes = validateWalletUrl("https://localhost/alice", false);
    expect(localhostRes.isValid).toBe(false);
    expect(localhostRes.error).toContain("private or loopback");

    const loopbackRes = validateWalletUrl("https://127.0.0.1/admin", false);
    expect(loopbackRes.isValid).toBe(false);

    const zeroRes = validateWalletUrl("https://0.0.0.0/test", false);
    expect(zeroRes.isValid).toBe(false);
  });

  it("blocks cloud metadata service IP (169.254.169.254)", () => {
    const res = validateWalletUrl("https://169.254.169.254/latest/meta-data", false);
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });

  it("blocks RFC 1918 private IPv4 subnets", () => {
    expect(validateWalletUrl("https://10.0.1.5/wallet", false).isValid).toBe(false);
    expect(validateWalletUrl("https://172.16.0.10/wallet", false).isValid).toBe(false);
    expect(validateWalletUrl("https://192.168.1.1/wallet", false).isValid).toBe(false);
  });

  it("blocks non-standard network ports", () => {
    const res = validateWalletUrl("https://wallet.interledger-test.dev:8443/alice", false);
    expect(res.isValid).toBe(false);
    expect(res.error).toContain("Non-standard network ports");
  });
});
