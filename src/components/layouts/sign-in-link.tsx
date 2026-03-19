"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignInLink() {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (isAuthRoute) return null;

  return (
    <Link href="/sign-in" role="button">
      Sign in
    </Link>
  );
}
