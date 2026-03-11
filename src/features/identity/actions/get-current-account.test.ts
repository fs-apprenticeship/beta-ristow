import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockGetClient, mockGetCurrentUserId } = vi.hoisted(() => ({
  mockGetClient: vi.fn(),
  mockGetCurrentUserId: vi.fn(),
}));

vi.mock("@/lib/clerk/get-current-user-id", () => ({
  default: mockGetCurrentUserId,
}));

vi.mock("@/lib/prisma/get-client", () => ({
  default: mockGetClient,
}));

import getCurrentAccount from "./get-current-account";

describe("getCurrentAccount", () => {
  beforeEach(() => {
    mockGetCurrentUserId.mockReset();
    mockGetClient.mockReset();

    mockGetCurrentUserId.mockResolvedValue("user_123");
  });

  it("returns the account for the given Clerk user id", async () => {
    const clerkUserId = "user_123";
    const account = {
      clerkUserId,
      id: "account_123",
    };
    const findUnique = vi.fn().mockResolvedValue(account);

    mockGetClient.mockReturnValue({
      account: { findUnique },
    });

    const found = await getCurrentAccount();

    expect(found).toMatchObject({
      clerkUserId,
      id: account.id,
    });
    expect(findUnique).toHaveBeenCalledWith({
      where: { clerkUserId },
    });
  });

  it("returns null when no account exists for the Clerk user id", async () => {
    const findUnique = vi.fn().mockResolvedValue(null);

    mockGetClient.mockReturnValue({
      account: { findUnique },
    });

    const found = await getCurrentAccount();

    expect(found).toBeNull();
    expect(findUnique).toHaveBeenCalledWith({
      where: { clerkUserId: "user_123" },
    });
  });

  it("returns undefined when there is no current Clerk user id", async () => {
    mockGetCurrentUserId.mockResolvedValueOnce(null);

    const found = await getCurrentAccount();

    expect(found).toBeUndefined();
    expect(mockGetClient).not.toHaveBeenCalled();
  });
});
