import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Toaster from "@/components/toaster";
import ThemeProvider from "@/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PalStreak",
  description: "Track your habits with friends",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "text-sm bg-background")}>
        <ThemeProvider>
          <Navbar />

          {children}

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
