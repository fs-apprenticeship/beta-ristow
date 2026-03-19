import type { Metadata } from "next";

import { Fira_Sans, Open_Sans } from "next/font/google";

import AppProvider from "@/app/provider";
import AppHeader from "@/components/layouts/app-header";

import "./globals.css";

export const firaSans = Fira_Sans({
  subsets: ["latin"],
  variable: "--font-fira-sans",
  weight: ["400", "700", "800"],
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  description: "An experimental copy of Beverly Ristow",
  title: "Beta Ristow",
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaSans.variable} ${openSans.variable}`}>
        <AppProvider>
          <AppHeader />
          <main className="container">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}
