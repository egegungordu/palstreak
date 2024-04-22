import React from "react";
import AccountDropdown from "./account-dropdown";
import { auth } from "@/lib/auth";
import { SignIn } from "./sign-in";
import NavLinks from "./nav-links";

export default async function Navbar() {
  const session = await auth();
  const loggedIn = session !== null;

  return (
    <nav className="shadow w-full bg-neutral-900">
      <div className="max-w-screen-md flex p-1 items-center mx-auto">
        {/* <NavLinks /> */}

        <div className="flex-1" />

        {loggedIn && <AccountDropdown session={session}/>}
        {!loggedIn && <SignIn />}
      </div>
    </nav>
  );
}
