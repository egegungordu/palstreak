"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Avatar from "boring-avatars";

export default function AccountDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto hover:bg-neutral-300/50 transition-colors rounded-lg px-4 py-2 flex items-center gap-2">
          <Avatar
            size={28}
            name="Ege Gungordu"
            variant="marble"
            // colors={["#2c2b4b", "#a75293", "#9c7a9d", "#9ddacb", "#f8dcb4"]}
            colors={["#e25858", "#e9d6af", "#ffffdd", "#c0efd2", "#384252"]}
          />
          Ege Gungordu
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white rounded-md p-1 shadow"
          sideOffset={5}
        >
          <DropdownMenu.Item className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-neutral-200 transition-colors">
            Log out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
