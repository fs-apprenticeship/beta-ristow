import "server-only";
import { cookies } from "next/headers";

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  const value = cookieStore.get(name)?.value ?? null;

  cookieStore.delete(name);

  return value;
}

export async function setCookie(name: string, value: string) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  });

  return value;
}
