import { describe, it, expect } from "vitest";
import { getUserByVeyloNumberOrHandle, createServerSession, getServerSession } from "../src/lib/db";

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

  it("creates and retrieves a valid server session", () => {
    const session = createServerSession("usr_chioma");
    expect(session.sessionId).toBeDefined();
    expect(session.userId).toBe("usr_chioma");

    const retrieved = getServerSession(session.sessionId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.userId).toBe("usr_chioma");
  });
});
