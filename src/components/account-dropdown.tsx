"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Avatar from "boring-avatars";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";

export default function AccountDropdown({session}: {session: Session}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto text-neutral-100 text-xs hover:bg-neutral-600/50 transition-colors rounded-lg px-4 py-1 flex items-center gap-2">
          <Avatar
            size={28}
            name={session.user?.name || ""}
            variant="marble"
            // colors={["#2c2b4b", "#a75293", "#9c7a9d", "#9ddacb", "#f8dcb4"]}
            colors={["#e25858", "#e9d6af", "#ffffdd", "#c0efd2", "#384252"]}
          />
          {session.user?.name}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-1 shadow"
          sideOffset={5}
        >
          <DropdownMenu.Item asChild>
            <button
              onClick={() => signOut()}
              className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-neutral-200 transition-colors w-full"
            >
              Sign out
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
