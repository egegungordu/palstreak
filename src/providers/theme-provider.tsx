"use client";

import { ThemeProvider as _ThemeProvider } from "next-themes";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <_ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </_ThemeProvider>
  );
}
