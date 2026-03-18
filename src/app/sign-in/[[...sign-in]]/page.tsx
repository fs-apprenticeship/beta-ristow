import { SignIn } from "@clerk/nextjs";

import getAuthRedirectUrl from "@/lib/clerk/get-auth-redirect-url";

type SignInPageProps = {
  searchParams?: Promise<{
    redirect_url?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const redirectUrl = params?.redirect_url;
  const signUpUrl = redirectUrl
    ? `/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`
    : "/sign-up";
  const forceRedirectUrl = getAuthRedirectUrl(redirectUrl);

  return (
    <SignIn
      forceRedirectUrl={forceRedirectUrl}
      signUpForceRedirectUrl={forceRedirectUrl}
      signUpUrl={signUpUrl}
    />
  );
}
