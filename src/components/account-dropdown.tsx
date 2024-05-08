/* eslint-disable @next/next/no-img-element */
"use client";

import React, { forwardRef, useState, useTransition } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import Avatar from "boring-avatars";
import { signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";
import { LuCamera, LuLoader, LuLogOut, LuSettings } from "react-icons/lu";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import Button from "./button";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { AVATAR_COLORS, USERNAME_REGEX } from "@/globals";
import updateSettings from "@/actions/update-settings";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "./theme-switcher";
import uploadProfilePicture from "@/actions/upload-profile-picture";
import imageCompression from "browser-image-compression";

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
              <SettingsButton
                userId={session.user.id}
                image={session.user.image}
                username={session.user.username ?? ""}
              />
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

type SettingsInputs = {
  username: string;
};

const SettingsButton = forwardRef(function SettingsButton(
  {
    userId,
    image,
    username,
  }: { userId: string; image: string | null | undefined; username: string },
  ref,
) {
  const [isOpened, setIsOpened] = useState(false);
  const [pending, startTransition] = useTransition();
  const [profilePicturePending, startProfilePictureTransition] =
    useTransition();
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

      // router.refresh();
    });
  };

  const handleOpenChange = (open: boolean) => {
    reset();
    setIsOpened(open);
  };

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const form = e.target.form;
    if (!form) return;
    const formData = new FormData(form);
    const image = formData.get("file") as File;
    if (!image) return;

    startProfilePictureTransition(async () => {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };
      const compressedImage = await imageCompression(image, options);
      formData.append("userId", userId);
      formData.set("file", compressedImage, image.name);
      await uploadProfilePicture(formData);

      await update({});

      toast.success("Profile picture updated!");

      // router.refresh();
    });
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
            <div className="font-medium rounded-xl">
              <div className="bg-foreground h-7 pr-8 flex items-center justify-start">
                General
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              <form className="flex gap-5">
                <div className="w-[90px] text-right text-xs text-faded">
                  Profile picture
                </div>

                <label
                  className={cn(
                    "cursor-pointer flex items-center gap-2 rounded-full overflow-hidden mx-auto relative isolate group",
                    {
                      "opacity-80 pointer-events-none": profilePicturePending,
                    },
                  )}
                  htmlFor="file"
                >
                  {profilePicturePending && (
                    <div className="absolute inset-0 flex items-center justify-center text-text-strong">
                      <LuLoader className="w-5 h-5 animate-spin" />
                    </div>
                  )}

                  <div className="group-hover:opacity-30 transition-opacity">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile picture"
                        className="size-24"
                      />
                    ) : (
                      <Avatar
                        size={96}
                        name={username}
                        variant="marble"
                        colors={AVATAR_COLORS}
                      />
                    )}
                  </div>

                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-2xs text-center leading-tight">
                    <LuCamera className="w-4 h-4" />
                    Change profile picture
                  </div>
                </label>

                <input
                  className="hidden"
                  id="file"
                  type="file"
                  name="file"
                  onChange={handlePictureUpload}
                />
              </form>

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
