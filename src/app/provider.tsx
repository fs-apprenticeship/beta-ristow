import { ClerkProvider } from "@clerk/nextjs";

import getAuthRedirectUrl from "@/lib/clerk/get-auth-redirect-url";

type AppProviderProps = {
  children: React.ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  const forceRedirectUrl = getAuthRedirectUrl();

  return (
    <ClerkProvider
      signInForceRedirectUrl={forceRedirectUrl}
      signUpForceRedirectUrl={forceRedirectUrl}
    >
      {children}
    </ClerkProvider>
  );
}
