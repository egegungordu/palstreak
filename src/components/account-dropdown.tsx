"use client";

import React, { forwardRef, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import Avatar from "boring-avatars";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { AVATAR_COLORS } from "@/globals";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./theme-switcher";
import ProfileSettings from "./profile-settings";

export default function AccountDropdown({ session }: { session: Session }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto text-xs hover:bg-background-button-hover transition-colors rounded-lg p-2 xl:px-4 xl:py-1 flex justify-center xl:justify-start items-center gap-2">
          <div className="relative after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
            {session.user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={session.user.image}
                alt="Profile picture"
                className="rounded-full w-[30px] h-[30px] shrink-0 min-w-[30px] min-h-[30px]"
              />
            ) : (
              <Avatar
                size={30}
                name={session.user?.username || ""}
                variant="marble"
                colors={AVATAR_COLORS}
              />
            )}
          </div>
          <span className="font-medium xl:block hidden">
            {session.user.username ?? "Account"}
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="min-w-[190px] bg-foreground rounded-md p-1 shadow shadow-shadow flex flex-col gap-1"
          sideOffset={10}
          align="start"
        >
          <DropdownMenu.Item asChild>
            <ThemeSwitcher className="h-8 px-3">
              <div className="ml-2">Change theme</div>
              <Select.Icon className="ml-2">
                <ChevronDownIcon />
              </Select.Icon>
            </ThemeSwitcher>
          </DropdownMenu.Item>

          {session && (
            <DropdownMenu.Item asChild>
              <SettingsButton />
            </DropdownMenu.Item>
          )}

          <DropdownMenu.Separator className="bg-foreground-darker h-px" />

          <DropdownMenu.Item asChild>
            <SignOutButton />
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const SignOutButton = forwardRef<HTMLButtonElement>(
  function SignOutButton(_, ref) {
    const router = useRouter();
    return (
      <button
        ref={ref}
        onClick={async () => {
          await signOut();
          router.refresh();
        }}
        className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-background-button-hover transition-colors w-full"
      >
        <LuLogOut className="w-4 h-4 mr-2" />
        Sign out
      </button>
    );
  },
);

const SettingsButton = forwardRef(function SettingsButton(ref) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpened(open);
  };

  return (
    <Dialog.Root open={isOpened} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          ref={ref as any}
          className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-background-button-hover transition-colors w-full"
        >
          <LuSettings className="w-4 h-4 mr-2" />
          Settings
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[525px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            Settings
          </Dialog.Title>

          <div className="flex flex-col sm:flex-row gap-2 justify-between mt-4">
            <div className="font-medium rounded-xl">
              <div className="h-7 pr-8 flex items-center justify-start text-xs">
                Profile
              </div>
            </div>

            <ProfileSettings onSave={() => setIsOpened(false)} />
          </div>

          <Dialog.Close asChild>
            <button
              className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
