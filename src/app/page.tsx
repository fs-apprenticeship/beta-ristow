/*
 * NOTE: everything below is temporary, just to confirm our Prisma setup
 * across environments.
 */

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../prisma/generated/client";

export const dynamic = "force-dynamic";

export default async function Home() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  const accounts = await prisma.account.findMany({
    orderBy: { createdAt: "desc" },
  });
  await prisma.$disconnect();

  return (
    <main>
      <h1>Hello, world.</h1>
      <p>There are {accounts.length} account(s).</p>
    </main>
  );
}
