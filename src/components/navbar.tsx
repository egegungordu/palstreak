import React from "react";
import Link from "next/link";
import NavbarGridCanvas from "./navbar-grid-canvas";
import Logo from "./logo";
import AccountDropdown from "./account-dropdown";
import { auth } from "@/lib/auth";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(() => import("./theme-switcher"), { ssr: false });

export default async function Navbar() {
  const session = await auth();
  const isLoggedIn = session && session.user;

  return (
    <nav className="shadow top-0 left-0 fixed shadow-shadow w-full bg-foreground border-b border-border h-14 z-10">
      <div className="flex max-w-screen-xl items-center mx-auto h-full px-3 sm:px-2 xl:px-16 relative isolate">
        <NavbarGridCanvas />

        <Link href="/" className="flex items-center font-bold text-base group">
          <div className="mr-2 mt-1">
            <Logo />
          </div>
          Pal
          <span className="text-transparent bg-gradient-to-br from-logo to-logo-light bg-clip-text group-hover:brightness-150 transition-all">
            Streak
          </span>
          <div className="text-2xs ml-2 rounded-full shadow shadow-shadow px-2 bg-foreground text-text-strong border border-border">
            BETA
          </div>
        </Link>

        <div className="flex-1" />

        {!isLoggedIn && (
          <ThemeSwitcher withTooltip side="bottom" className="size-8 justify-center" />
        )}

        <div className="md:hidden">
          {isLoggedIn && <AccountDropdown session={session} />}
        </div>
      </div>
    </nav>
  );
}
