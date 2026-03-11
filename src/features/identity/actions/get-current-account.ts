import getCurrentUserId from "@/lib/clerk/get-current-user-id";
import getClient from "@/lib/prisma/get-client";

export default async function getCurrentAccount() {
  const clerkUserId = await getCurrentUserId();

  if (clerkUserId) {
    const prisma = getClient();

    return prisma.account.findUnique({
      where: { clerkUserId },
    });
  }
}
