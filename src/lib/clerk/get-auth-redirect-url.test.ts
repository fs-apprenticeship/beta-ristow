import { describe, expect, it } from "vitest";

import getAuthRedirectUrl from "./get-auth-redirect-url";

describe("getAuthRedirectUrl", () => {
  it("returns the sync route when there is no redirect url", () => {
    expect(getAuthRedirectUrl()).toBe("/api/auth/sync");
  });

  it("preserves the original destination in the sync redirect", () => {
    expect(getAuthRedirectUrl("/protected?lesson=intro")).toBe(
      "/api/auth/sync?redirect_url=%2Fprotected%3Flesson%3Dintro",
    );
  });
});
