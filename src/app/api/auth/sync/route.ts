import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import ensureAccountForClerkUser from "@/features/identity/actions/ensure-account-from-clerk-user";

export async function GET(request: Request) {
  const user = await currentUser();

  if (user) {
    await ensureAccountForClerkUser(user);
  }

  return NextResponse.redirect(new URL("/", request.url));
}
