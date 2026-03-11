import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockCurrentUser, mockEnsureAccountForClerkUser } = vi.hoisted(() => ({
  mockCurrentUser: vi.fn(),
  mockEnsureAccountForClerkUser: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  currentUser: mockCurrentUser,
}));

vi.mock("@/features/identity/actions/ensure-account-from-clerk-user", () => ({
  default: mockEnsureAccountForClerkUser,
}));

import { GET } from "./route";

describe("auth sync route", () => {
  beforeEach(() => {
    mockCurrentUser.mockReset();
    mockEnsureAccountForClerkUser.mockReset();
  });

  it("creates an account for the current Clerk user and redirects home", async () => {
    const user = { id: "user_123" };
    const request = new Request("https://example.com/api/auth/sync");
    mockCurrentUser.mockResolvedValue(user);

    const response = await GET(request);

    expect(mockCurrentUser).toHaveBeenCalledOnce();
    expect(mockEnsureAccountForClerkUser).toHaveBeenCalledWith(user);
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
  });

  it("redirects home without creating an account when there is no current user", async () => {
    const request = new Request("https://example.com/api/auth/sync");
    mockCurrentUser.mockResolvedValue(null);

    const response = await GET(request);

    expect(mockCurrentUser).toHaveBeenCalledOnce();
    expect(mockEnsureAccountForClerkUser).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/");
  });
});
