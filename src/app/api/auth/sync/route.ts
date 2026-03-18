import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import ensureAccountForClerkUser from "@/features/identity/actions/ensure-account-from-clerk-user";

export async function GET(request: Request) {
  const user = await currentUser();

  if (user) {
    await ensureAccountForClerkUser(user);
  }

  return NextResponse.redirect(getSafeRedirectUrl(request));
}

function getSafeRedirectUrl(request: Request) {
  const requestUrl = new URL(request.url);
  const redirectUrl = requestUrl.searchParams.get("redirect_url");

  if (!redirectUrl) {
    return new URL("/", requestUrl);
  }

  const isProtocolRelative = redirectUrl.startsWith("//");

  if (isProtocolRelative) {
    return new URL("/", requestUrl);
  }

  const candidateUrl = new URL(redirectUrl, requestUrl);
  const isSameOrigin = candidateUrl.origin === requestUrl.origin;

  if (!isSameOrigin) {
    return new URL("/", requestUrl);
  }

  return candidateUrl;
}
