import React from "react";
import AccountDropdown from "./account-dropdown";
import { auth } from "@/lib/auth";
import { SignIn } from "./sign-in";
import NavLinks from "./nav-links";
import Link from "next/link";
import NavbarGridCanvas from "./navbar-grid-canvas";
import Logo from "./logo";

export default async function Navbar() {
  const session = await auth();
  const loggedIn = session !== null;

  return (
    <nav className="shadow top-0 left-0 fixed shadow-shadow w-full bg-foreground border-b border-border h-12 z-10 isolate">
      <div className="flex p-1 items-center mx-auto h-full px-6">
        <NavbarGridCanvas />

        {/* <NavLinks /> */}

        <Link href="/" className="flex items-center font-bold text-base group">
          <div className="mr-2 mt-1">
          <Logo />
          </div>
          Pal
          <span className="text-transparent bg-gradient-to-br from-logo to-logo-light bg-clip-text group-hover:brightness-150 transition-all">
            Streak
          </span>
        </Link>

        <div className="flex-1" />

        {loggedIn && <AccountDropdown session={session} />}
        {!loggedIn && <SignIn />}
      </div>
    </nav>
  );
}
