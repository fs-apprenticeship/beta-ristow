/*
 * NOTE: this test, like the page under test, is a placeholder and an
 * example. We can remove it whenever actual tests are added.
 */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

import { AccountFactory } from "@/test/factories/account-factory";

import Home from "./page";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: mockAuth,
}));

describe("Home page", () => {
  beforeEach(() => {
    mockAuth.mockReset();
    mockAuth.mockResolvedValue({ userId: "user_123" });
  });

  it("asks signed-out users to log in", async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });
    const home = await Home();

    render(home);

    expect(
      screen.getByText("Please sign in to see the number of accounts."),
    ).toBeInTheDocument();
  });

  it("says hello", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user_123" });
    const home = await Home();

    render(home);

    expect(
      screen.getByRole("heading", { name: "Hello, world." }),
    ).toBeInTheDocument();
  });

  it("handles a lack of accounts", async () => {
    mockAuth.mockResolvedValueOnce({ userId: "user_123" });
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
    mockAuth.mockResolvedValueOnce({ userId: "user_123" });
    const home = await Home();
    const { container } = render(home);
    expect(await axe(container)).toHaveNoViolations();
  });
});
