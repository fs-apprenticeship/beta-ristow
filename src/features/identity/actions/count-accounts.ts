import getClient from "@/lib/prisma/get-client";

export default async function countAccounts() {
  const prisma = getClient();

  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
  });

  return accounts.length;
}
