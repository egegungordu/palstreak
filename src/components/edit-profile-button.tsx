"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import Button from "./button";
import { LuPencil } from "react-icons/lu";
import ProfileSettings from "./profile-settings";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function EditProfileButton() {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpened(open);
  };

  return (
    <Dialog.Root open={isOpened} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="rounded-full gap-2 py-1 px-3 text-xs bg-transparent text-text-strong hover:bg-transparent hover:opacity-80">
          <LuPencil className="w-3.5 h-3.5" /> Edit profile
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[525px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="mb-6 text-base font-medium">
            Edit profile
          </Dialog.Title>

          <ProfileSettings onSave={() => setIsOpened(false)} />

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
}
