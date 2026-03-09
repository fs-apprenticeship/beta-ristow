import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ProtectedPage from "./page";

describe("Protected page", () => {
  it("renders the temporary protected-route smoke content", () => {
    render(<ProtectedPage />);

    expect(
      screen.getByRole("heading", { name: "Protected page" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "This route is temporary and only exists as an auth protection sample.",
      ),
    ).toBeInTheDocument();
  });
});
