import { beforeEach, describe, expect, it, vi } from "vitest";

import { AccountFactory } from "@/test/factories/account-factory";

const { getCurrentUserId } = vi.hoisted(() => ({
  getCurrentUserId: vi.fn(),
}));

vi.mock("@/lib/clerk/get-current-user-id", () => ({
  default: getCurrentUserId,
}));

import requireCurrentAccount from "./require-current-account";

describe("requireCurrentAccount", () => {
  beforeEach(() => {
    getCurrentUserId.mockReset();
  });

  it("returns the account for the current Clerk ID", async () => {
    getCurrentUserId.mockResolvedValue("user_123");
    const account = await AccountFactory.create({ clerkUserId: "user_123" });

    const result = await requireCurrentAccount();

    expect(result).toEqual(account);
  });

  it("throws if there is no account matching the current Clerk ID", async () => {
    getCurrentUserId.mockResolvedValue("user_123");

    await expect(requireCurrentAccount()).rejects.toThrow(
      /Invalid `prisma.account/,
    );
  });

  it("throws if there is no current Clerk ID", async () => {
    getCurrentUserId.mockResolvedValueOnce(null);

    await expect(requireCurrentAccount()).rejects.toThrow(
      "Unable to get account; current clerkUserId is null",
    );
  });
});
