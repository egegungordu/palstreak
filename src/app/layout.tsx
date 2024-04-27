import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Toaster from "@/components/toaster";
import ThemeProvider from "@/providers/theme-provider";
import SessionProvider from "@/providers/session-provider";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PalStreak",
  description: "Track your habits with friends",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          inter.className,
          "text-sm bg-background h-full",
        )}
      >
        <ThemeProvider>
          <SessionProvider session={session}>
            <Sidebar />
            <Navbar />

            {children}

            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
