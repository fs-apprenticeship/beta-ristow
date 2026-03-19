import { SignUp } from "@clerk/nextjs";

import getAuthRedirectUrl from "@/lib/clerk/get-auth-redirect-url";

type SignUpPageProps = {
  searchParams?: Promise<{
    redirect_url?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const redirectUrl = params?.redirect_url;
  const signInUrl = redirectUrl
    ? `/sign-in?redirect_url=${encodeURIComponent(redirectUrl)}`
    : "/sign-in";
  const forceRedirectUrl = getAuthRedirectUrl(redirectUrl);

  return (
    // @ts-expect-error React typings do not include the legacy align attribute.
    <div align="center">
      <SignUp forceRedirectUrl={forceRedirectUrl} signInUrl={signInUrl} />
    </div>
  );
}
