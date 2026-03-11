import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import ProtectedPage from "./page";

const { mockGetCurrentAccount } = vi.hoisted(() => ({
  mockGetCurrentAccount: vi.fn(),
}));

vi.mock("@/features/identity/actions/get-current-account", () => ({
  default: mockGetCurrentAccount,
}));

describe("Protected page", () => {
  beforeEach(() => {
    mockGetCurrentAccount.mockReset();
    mockGetCurrentAccount.mockResolvedValue({
      clerkUserId: "user_123",
    });
  });

  it("renders the protected page heading", async () => {
    const page = await ProtectedPage();
    render(page);

    expect(mockGetCurrentAccount).toHaveBeenCalledOnce();
    expect(
      screen.getByRole("heading", { name: "Protected page" }),
    ).toBeInTheDocument();
  });
});
