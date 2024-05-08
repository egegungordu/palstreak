import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Toaster from "@/components/toaster";
import ThemeProvider from "@/providers/theme-provider";
import SessionProvider from "@/providers/session-provider";
import { auth } from "@/lib/auth";
import LeftSidebar from "@/components/left-sidebar";
import MobileBottomNavbar from "@/components/mobile-bottom-navbar";
import TokenRefresher from "@/components/token-refresher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PalStreak",
  description: "Track your habits with friends",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isLoggedIn = session !== null;
  const isOnboarded = session?.user?.onboardingFinished;

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={cn(inter.className, "text-sm bg-background h-full")}>
        <ThemeProvider>
          <SessionProvider session={session}>
            <Navbar />

            <TokenRefresher />

            {isLoggedIn && isOnboarded && (
              <>
                <div className="flex justify-center lg:justify-between xl:justify-center gap-4 xl:gap-8 2xl:gap-12">
                  <LeftSidebar />
                  {children}
                </div>

                <MobileBottomNavbar />
              </>
            )}

            {isLoggedIn && !isOnboarded && <div className="">{children}</div>}

            {!isLoggedIn && <div className="">{children}</div>}

            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
