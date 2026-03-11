import { type User } from "@clerk/backend";
import { beforeEach, describe, expect, it, vi } from "vitest";
const { mockGetClient } = vi.hoisted(() => ({
  mockGetClient: vi.fn(),
}));

vi.mock("@/lib/prisma/get-client", () => ({
  default: mockGetClient,
}));

import ensureAccountForClerkUser from "./ensure-account-from-clerk-user";

describe("ensureAccountForClerkUser", () => {
  beforeEach(() => {
    mockGetClient.mockReset();
  });

  it("creates an account for the given Clerk user", async () => {
    const clerkUser = { id: "user_123" } as User;
    const account = { clerkUserId: clerkUser.id, id: "account_123" };
    const upsert = vi.fn().mockResolvedValue(account);

    mockGetClient.mockReturnValue({ account: { upsert } });

    const result = await ensureAccountForClerkUser(clerkUser);

    expect(result).toMatchObject(account);
    expect(upsert).toHaveBeenCalledWith({
      create: { clerkUserId: clerkUser.id },
      update: {},
      where: { clerkUserId: clerkUser.id },
    });
  });

  it("returns the existing account when called again with the same Clerk user", async () => {
    const clerkUser = { id: "user_123" } as User;
    const existingAccount = { clerkUserId: clerkUser.id, id: "account_123" };
    const upsert = vi.fn().mockResolvedValue(existingAccount);

    mockGetClient.mockReturnValue({ account: { upsert } });

    await ensureAccountForClerkUser(clerkUser);
    const result = await ensureAccountForClerkUser(clerkUser);

    expect(result).toMatchObject(existingAccount);
    expect(upsert).toHaveBeenCalledTimes(2);
  });
});
