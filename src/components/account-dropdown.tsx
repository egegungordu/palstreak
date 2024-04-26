"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Avatar from "boring-avatars";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LuLogOut } from "react-icons/lu";

export default function AccountDropdown({session}: {session: Session}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto text-xs hover:bg-stone-200 transition-colors rounded-lg px-4 py-1 flex items-center gap-2">
          <div className="relative after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-black/20 after:rounded-full">
            <Avatar
              size={30}
              name={session.user?.name || ""}
              variant="beam"
              colors={["#fee9a6", "#fec0ab", "#fa5894", "#660860", "#9380b7"]}
            />
          </div>
          {session.user?.name}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-1 shadow"
          sideOffset={10}
        >
          <DropdownMenu.Item asChild>
            <button
              onClick={() => signOut()}
              className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-neutral-200 transition-colors w-full"
            >
              <LuLogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
