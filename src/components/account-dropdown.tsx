"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import Avatar from "boring-avatars";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LuLogOut, LuMoon, LuSettings, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { AnimatePresence, MotionValue, motion } from "framer-motion";

const THEMES = [
  { value: "dark", Icon: LuMoon },
  { value: "light", Icon: LuSun },
  { value: "system", Icon: LuSettings },
];

export default function AccountDropdown({ session }: { session: Session }) {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  console.log("hello", theme);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto text-xs hover:bg-background-button-hover transition-colors rounded-lg px-4 py-1 flex items-center gap-2">
          <div className="relative after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
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
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="min-w-[220px] bg-foreground rounded-md p-1 shadow shadow-shadow"
          sideOffset={10}
        >
          <DropdownMenu.Item asChild>
            <button
              onClick={() => signOut()}
              className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-background-button-hover transition-colors w-full"
            >
              <LuLogOut className="w-4 h-4 mr-2" />
              Sign out
            </button>
          </DropdownMenu.Item>

          <DropdownMenu.Item asChild>
            <Select.Root onValueChange={handleThemeChange} defaultValue={theme}>
              <Select.Trigger
                className="leading-none capitalize rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-background-button-hover transition-colors w-full"
                aria-label="Theme"
              >
                <Select.Icon className="mr-2">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {THEMES.filter(({ value }) => value === theme).map(
                      ({ Icon, value }) => (
                        <motion.div
                          key={value}
                          initial={{ opacity: 0, rotate: -280 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 280 }}
                        >
                          {theme === value && <Icon className="w-4 h-4" />}
                        </motion.div>
                      ),
                    )}
                  </AnimatePresence>
                </Select.Icon>
                Change theme
                <Select.Icon className="ml-2">
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content
                  position="popper"
                  sideOffset={6}
                  align="start"
                  alignOffset={22}
                  className="overflow-hidden bg-foreground rounded-lg shadow shadow-shadow"
                >
                  <Select.Viewport className="p-[5px]">
                    <Select.Group>
                      {THEMES.map(({ value }) => {
                        console.log({ value, eq: value === theme });
                        return (
                        <Select.Item
                          value={value}
                          key={value}
                          className="leading-none capitalize rounded-md flex items-center text-xs gap-2 h-7 px-2 min-w-20 relative select-none hover:bg-background-button-hover outline-none"
                        >
                          <Select.ItemText>{value}</Select.ItemText>
                          <Select.ItemIndicator>
                            {value === theme && <CheckIcon />}
                          </Select.ItemIndicator>
                        </Select.Item>
                      )})}
                    </Select.Group>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
