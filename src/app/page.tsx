import countAccounts from "@/features/identity/actions/count-accounts";
import getCurrentAccount from "@/features/identity/actions/get-current-account";

export const dynamic = "force-dynamic";

export default async function Home() {
  const account = await getCurrentAccount();
  if (!account) {
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
