import { ClerkProvider } from "@clerk/nextjs";

type AppProviderProps = {
  children: React.ReactNode;
};

export default function AppProvider({ children }: AppProviderProps) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
