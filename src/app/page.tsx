/*
 * NOTE: everything below, including the imported function, is temporary,
 * just to confirm our Prisma and authentication setup across environments.
 */

import { auth } from "@clerk/nextjs/server";

import countAccounts from "@/features/identity/count-accounts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main>
        <h1>Hello, world.</h1>
        <p>Please sign in to see the number of accounts.</p>
      </main>
    );
  }

  const count = await countAccounts();

  return (
    <main>
      <h1>Hello, world.</h1>
      <p>There are {count} account(s).</p>
    </main>
  );
}
