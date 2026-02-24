/*
 * NOTE: everything below, including the imported function, is temporary,
 * just to confirm our Prisma setup across environments.
 */

import countAccounts from "@/features/identity/count-accounts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const count = await countAccounts();

  return (
    <main>
      <h1>Hello, world.</h1>
      <p>There are {count} account(s).</p>
    </main>
  );
}
