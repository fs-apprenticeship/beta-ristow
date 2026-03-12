import getCurrentUserId from "@/lib/clerk/get-current-user-id";
import getClient from "@/lib/prisma/get-client";

const prisma = getClient();

export default async function requireCurrentAccount() {
  const clerkUserId = await getCurrentUserId();

  if (!clerkUserId) {
    throw Error("Unable to get account; current clerkUserId is null");
  }

  return prisma.account.findUniqueOrThrow({
    where: { clerkUserId },
  });
}
