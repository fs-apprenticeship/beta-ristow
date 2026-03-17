import { afterEach, describe, expect, it, vi } from "vitest";

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

import { deleteCookie, setCookie } from "./cookie-store";

describe("cookie-store", () => {
  afterEach(() => {
    cookiesMock.mockReset();
  });

  it("stores a cookie with the default options", async () => {
    const setMock = vi.fn();

    cookiesMock.mockResolvedValue({
      get: vi.fn(),
      set: setMock,
    });

    await expect(
      setCookie("afterOnboardingPath", "/courses/focus/lessons/routines"),
    ).resolves.toBe("/courses/focus/lessons/routines");

    expect(setMock).toHaveBeenCalledWith(
      "afterOnboardingPath",
      "/courses/focus/lessons/routines",
      expect.objectContaining({
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      }),
    );
  });

  it("returns the previous value when deleting a cookie", async () => {
    const deleteMock = vi.fn();

    cookiesMock.mockResolvedValue({
      delete: deleteMock,
      get: vi
        .fn()
        .mockReturnValue({ value: "/courses/focus/lessons/routines" }),
    });

    await expect(deleteCookie("afterOnboardingPath")).resolves.toBe(
      "/courses/focus/lessons/routines",
    );

    expect(deleteMock).toHaveBeenCalledWith("afterOnboardingPath");
  });
});
