import { type User } from "@clerk/backend";

import getClient from "@/lib/prisma/get-client";

export default async function ensureAccountForClerkUser(clerkUser: User) {
  const prisma = getClient();

  return prisma.account.upsert({
    create: { clerkUserId: clerkUser.id },
    update: {},
    where: { clerkUserId: clerkUser.id },
  });
}
