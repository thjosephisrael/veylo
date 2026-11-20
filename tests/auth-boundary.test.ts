import { describe, it, expect } from "vitest";
import {
  getUserByVeyloNumberOrHandle,
  createServerSession,
  getServerSession,
  createUser,
} from "../src/lib/db";

describe("Authentication & Session Security Boundaries", () => {
  it("resolves valid seeded demo account by handle", () => {
    const user = getUserByVeyloNumberOrHandle("@tomiade");
    expect(user).not.toBeNull();
    expect(user?.name).toBe("Tomi Adebayo");
  });

  it("resolves valid seeded demo account by account number", () => {
    const user = getUserByVeyloNumberOrHandle("482 193 7604");
    expect(user).not.toBeNull();
    expect(user?.id).toBe("usr_tomi");
  });

  it("fails closed on unknown account identifier and returns null", () => {
    const user = getUserByVeyloNumberOrHandle("unknown_user_9999");
    expect(user).toBeNull();
  });

  it("creates a brand-new user with distinct 10-digit account number", () => {
    const uniqueEmail = `test_${Date.now()}@example.com`;
    const newUser = createUser({
      name: "Marcus Aurelius",
      email: uniqueEmail,
      role: "business",
      handle: "marcus_a",
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe("Marcus Aurelius");
    expect(newUser.email).toBe(uniqueEmail);
    expect(newUser.role).toBe("business");
    expect(newUser.veyloAccountNumber).toMatch(/^\d{3}\s\d{3}\s\d{4}$/);
    expect(newUser.openPaymentsAddress).toBe("https://ilp.interledger-test.dev/marcus_a");

    // Can be resolved by handle
    const resolved = getUserByVeyloNumberOrHandle("@marcus_a");
    expect(resolved?.id).toBe(newUser.id);
  });

  it("creates and retrieves a valid server session", () => {
    const session = createServerSession("usr_chioma");
    expect(session.sessionId).toBeDefined();
    expect(session.userId).toBe("usr_chioma");

    const retrieved = getServerSession(session.sessionId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.userId).toBe("usr_chioma");
  });
});
