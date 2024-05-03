"use client";

import React, { forwardRef, useState, useTransition } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import Avatar from "boring-avatars";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { LuLogOut, LuMoon, LuSettings, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";
import { CheckIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Button from "./button";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AVATAR_COLORS, USERNAME_REGEX } from "@/globals";
import updateSettings from "@/actions/update-settings";
import { useRouter } from "next/navigation";

const THEMES = [
  { value: "dark", Icon: LuMoon },
  { value: "light", Icon: LuSun },
  { value: "system", Icon: LuSettings },
];

export default function AccountDropdown({ session }: { session: Session }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="mt-auto text-xs hover:bg-background-button-hover transition-colors rounded-lg p-2 xl:px-4 xl:py-1 flex justify-center xl:justify-start items-center gap-2">
          <div className="relative after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
            <Avatar
              size={30}
              name={session.user?.username || ""}
              variant="marble"
              colors={AVATAR_COLORS}
            />
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
            <ThemeSelector />
          </DropdownMenu.Item>

          {session && (
            <DropdownMenu.Item asChild>
              <SettingsButton username={session.user.username ?? ""} />
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

const ThemeSelector = forwardRef(function ThemeSelector(_, ref) {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  return (
    <Select.Root onValueChange={handleThemeChange} defaultValue={theme}>
      <Select.Trigger
        ref={ref as any}
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
          side="right"
          sideOffset={8}
          align="start"
          alignOffset={-4}
          className="overflow-hidden bg-foreground rounded-lg shadow shadow-shadow"
        >
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              {THEMES.map(({ value }) => {
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
                );
              })}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});

const SignOutButton = forwardRef<HTMLButtonElement>(
  function SignOutButton(_, ref) {
    return (
      <button
        ref={ref}
        onClick={() => signOut()}
        className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-background-button-hover transition-colors w-full"
      >
        <LuLogOut className="w-4 h-4 mr-2" />
        Sign out
      </button>
    );
  },
);

type SettingsInputs = {
  username: string;
};

const SettingsButton = forwardRef(function SettingsButton(
  { username }: { username: string },
  ref,
) {
  const [isOpened, setIsOpened] = useState(false);
  const [pending, startTransition] = useTransition();
  const { update } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsInputs>({
    defaultValues: {
      username: username,
    },
  });

  const onSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    startTransition(async () => {
      await updateSettings({
        username: data.username,
      });

      toast.success("Settings saved!");

      await update({});

      reset({ username: data.username });

      setIsOpened(false);

      router.refresh();
    });
  };

  const handleOpenChange = (open: boolean) => {
    reset();
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
          className="data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[525px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            Settings
          </Dialog.Title>

          <div className="flex gap-2 justify-between mt-4 items-start">
            <div className="font-medium rounded-xl p-1">
              <div className="bg-foreground h-7 pr-8 flex items-center justify-start">
                General
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-xs text-faded"
                  htmlFor="habit-name"
                >
                  Username
                </label>
                <input
                  className={cn(
                    "inline-flex h-[35px] w-full flex-1 border border-border items-center justify-center rounded-md px-4 leading-none shadow shadow-shadow outline-none",
                    errors.username && "border-red-500",
                  )}
                  type="text"
                  autoComplete="off"
                  id="habit-name"
                  placeholder="Do 100 pushups"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "This field is required",
                    },
                    pattern: {
                      value: USERNAME_REGEX,
                      message: "Invalid username format",
                    },
                  })}
                />
              </div>

              <div className="text-xs text-text-faded text-end w-full my-1">
                3-15 characters, letters, numbers, or underscores only.
              </div>

              {errors.username && (
                <div className="mt-2 text-end text-red-500 text-xs">
                  {errors.username.message}
                </div>
              )}

              <div className="mt-12 flex justify-end">
                <Button loading={pending} disabled={pending}>
                  Save
                </Button>
              </div>
            </form>
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
