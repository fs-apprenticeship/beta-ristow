/*
 * NOTE: this test, like the page under test, is a placeholder and an
 * example. We can remove it whenever actual tests are added.
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";

import accountFactory from "@/test/factories/account-factory";

import Home from "./page";

describe("Home page", () => {
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
    await accountFactory.createList(3);
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
