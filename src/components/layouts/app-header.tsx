import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import SignInLink from "@/components/layouts/sign-in-link";

export default function AppHeader() {
  return (
    <header className="container">
      <nav aria-label="Main navigation">
        <ul>
          <li>
            <strong>Beta Ristow</strong>
          </li>
        </ul>

        <ul>
          <li>
            <SignedOut>
              <SignInLink />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </li>
        </ul>
      </nav>
    </header>
  );
}
