import { describe, expect, it, vi } from "vitest";

const {
  callbackStore,
  clerkMiddlewareMock,
  createRouteMatcherMock,
  isProtectedRouteMock,
} = vi.hoisted(() => {
  const callbackStore: {
    callback?: (
      auth: {
        protect: (options?: {
          unauthenticatedUrl?: string;
        }) => Promise<Response | void>;
      },
      request: unknown,
    ) => Promise<Response | void>;
  } = {};

  const isProtectedRouteMock = vi.fn<(request: unknown) => boolean>();
  const createRouteMatcherMock = vi.fn(() => isProtectedRouteMock);
  const clerkMiddlewareMock = vi.fn((callback) => {
    callbackStore.callback = callback;
    return "mock-clerk-middleware";
  });

  return {
    callbackStore,
    clerkMiddlewareMock,
    createRouteMatcherMock,
    isProtectedRouteMock,
  };
});

vi.mock("@clerk/nextjs/server", () => ({
  clerkMiddleware: clerkMiddlewareMock,
  createRouteMatcher: createRouteMatcherMock,
}));

import middleware from "./proxy";

describe("proxy middleware", () => {
  const requestUrl = "https://example.com/courses/testing";
  const request = {
    nextUrl: {
      pathname: "/protected",
      search: "",
    },
    url: requestUrl,
  };

  it("builds middleware with the protected route matcher", () => {
    expect(middleware).toBe("mock-clerk-middleware");
    expect(createRouteMatcherMock).toHaveBeenCalledWith([
      "/courses(.*)",
      "/protected(.*)",
    ]);
    expect(clerkMiddlewareMock).toHaveBeenCalledTimes(1);
  });

  it("protects requests that match protected routes", async () => {
    const protect = vi.fn(() => Promise.resolve());
    isProtectedRouteMock.mockReturnValue(true);

    await callbackStore.callback?.({ protect }, request);

    expect(protect).toHaveBeenCalledTimes(1);
    expect(protect).toHaveBeenCalledWith({
      unauthenticatedUrl:
        "https://example.com/sign-in?redirect_url=%2Fprotected",
    });
  });

  it("delegates unauthenticated redirect behavior to auth.protect", async () => {
    const redirectResponse = new Response(null, {
      headers: { location: "/sign-in" },
      status: 307,
    });
    const protect = vi.fn(() => Promise.resolve(redirectResponse));
    isProtectedRouteMock.mockReturnValue(true);

    await callbackStore.callback?.({ protect }, request);

    expect(protect).toHaveBeenCalledTimes(1);
    expect(protect).toHaveBeenCalledWith({
      unauthenticatedUrl:
        "https://example.com/sign-in?redirect_url=%2Fprotected",
    });
    await expect(protect.mock.results[0]?.value).resolves.toBe(
      redirectResponse,
    );
    await expect(protect.mock.results[0]?.value).resolves.toMatchObject({
      status: 307,
    });
  });

  it("does not protect requests that do not match protected routes", async () => {
    const protect = vi.fn(() => Promise.resolve());
    isProtectedRouteMock.mockReturnValue(false);

    await callbackStore.callback?.({ protect }, request);

    expect(protect).not.toHaveBeenCalled();
  });

  it("preserves the protected page query string in the redirect url", async () => {
    const protect = vi.fn(() => Promise.resolve());
    isProtectedRouteMock.mockReturnValue(true);

    await callbackStore.callback?.(
      {
        protect,
      },
      {
        ...request,
        nextUrl: {
          pathname: "/protected",
          search: "?lesson=intro",
        },
        url: "https://example.com/protected?lesson=intro",
      },
    );

    expect(protect).toHaveBeenCalledWith({
      unauthenticatedUrl:
        "https://example.com/sign-in?redirect_url=%2Fprotected%3Flesson%3Dintro",
    });
  });
});
