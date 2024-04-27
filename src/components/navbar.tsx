import React from "react";
import AccountDropdown from "./account-dropdown";
import { auth } from "@/lib/auth";
import { SignIn } from "./sign-in";
import NavLinks from "./nav-links";

export default async function Navbar() {
  const session = await auth();
  const loggedIn = session !== null;

  return (
    <nav className="shadow top-0 left-0 fixed shadow-shadow w-full bg-foreground border-b border-border h-12 px-6 z-10">
      <div className="flex p-1 items-center mx-auto h-full">
        {/* <NavLinks /> */}

        <div className="flex-1" />

        {loggedIn && <AccountDropdown session={session} />}
        {!loggedIn && <SignIn />}
      </div>
    </nav>
  );
}
