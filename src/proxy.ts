import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/courses(.*)", "/protected(.*)"]);

export default clerkMiddleware(async (auth, request): Promise<void> => {
  if (isProtectedRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url).toString();

    await auth.protect({
      unauthenticatedUrl: signInUrl,
    });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes.
    "/(api|trpc)(.*)",
  ],
};
