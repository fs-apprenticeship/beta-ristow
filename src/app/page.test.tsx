import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { AccountFactory } from "@/test/factories/account-factory";

import Home from "./page";

const { mockGetCurrentAccount } = vi.hoisted(() => ({
  mockGetCurrentAccount: vi.fn(),
}));

vi.mock("@/features/identity/actions/get-current-account", () => ({
  default: mockGetCurrentAccount,
}));

describe("Home page", () => {
  beforeEach(() => {
    mockGetCurrentAccount.mockReset();
    mockGetCurrentAccount.mockResolvedValue(AccountFactory.build());
  });

  it("asks signed-out users to log in", async () => {
    mockGetCurrentAccount.mockResolvedValueOnce(null);
    const home = await Home();

    render(home);

    expect(
      screen.getByText("Please sign in to see the number of accounts."),
    ).toBeInTheDocument();
  });

  it("says hello", async () => {
    const home = await Home();

    render(home);

    expect(
      screen.getByRole("heading", { name: "Hello, world." }),
    ).toBeInTheDocument();
  });

  it("handles a lack of accounts", async () => {
    const home = await Home();

    render(home);

    expect(screen.getByText("There are 0 account(s).")).toBeInTheDocument();
  });

  it("handles a plethora of accounts", async () => {
    await AccountFactory.createList(3);
    const home = await Home();

    render(home);

    expect(screen.getByText("There are 3 account(s).")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const home = await Home();
    const { container } = render(home);
    expect(await axe(container)).toHaveNoViolations();
  });
});
