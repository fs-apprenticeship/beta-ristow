import getCurrentAccount from "@/features/identity/actions/get-current-account";

export default async function ProtectedPage() {
  const account = await getCurrentAccount();
  return (
    <main>
      <h1>Protected page</h1>
      <p>
        Hello {account?.clerkUserId}. This route is temporary and only exists as
        an auth protection sample.
      </p>
    </main>
  );
}
