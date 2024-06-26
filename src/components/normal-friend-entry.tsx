"use client";

import { LuHeartCrack, LuMoreVertical } from "react-icons/lu";
import CircleButton from "./circle-button";
import Tooltip from "./tooltip";
import FriendEntry from "./friend-entry";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "./button";
import { useTransition, useState, forwardRef } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import removeFriend from "@/actions/remove-friend";
import { toast } from "sonner";

export default function NormalFriendEntry({
  friend,
}: {
  friend: {
    id: string;
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  };
}) {
  return (
    <FriendEntry friend={friend}>
      <DropdownMenu.Root>
        <Tooltip disableHoverableContent content="Manage" side="top">
          <DropdownMenu.Trigger asChild>
            <CircleButton className="ml-auto">
              <LuMoreVertical className="w-4 h-4 text-text-faded" />
            </CircleButton>
          </DropdownMenu.Trigger>
        </Tooltip>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            onCloseAutoFocus={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
            className="min-w-[220px] bg-foreground rounded-md p-1 shadow shadow-shadow flex flex-col gap-1"
            sideOffset={10}
            align="end"
            side="left"
          >
            <DropdownMenu.Item asChild>
              <RemoveFriendButton friendId={friend.id} />
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </FriendEntry>
  );
}

const RemoveFriendButton = forwardRef<HTMLButtonElement, { friendId: string }>(
  function RemoveFriendButton({ friendId }, ref) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pending, startTransition] = useTransition();

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      startTransition(async () => {
        await removeFriend({ friendId });

        toast.success("Friend removed", {
          description: "You have successfully removed this friend",
        });

        setIsDialogOpen(false);
      });
    };

    return (
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Trigger asChild>
          <button
            ref={ref}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="leading-none rounded-md flex items-center h-8 px-3 relative select-none outline-none hover:bg-red-500 hover:text-white transition-colors w-full text-red-500 font-medium"
          >
            <LuHeartCrack className="w-4 h-4 mr-2" />
            Remove friend
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
          <Dialog.Content
            onCloseAutoFocus={(e) => e.preventDefault()}
            className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
          >
            <Dialog.Title className="m-0 text-base font-medium">
              Remove friend
            </Dialog.Title>

            <Dialog.Description className="mt-3 mb-5 leading-normal">
              Are you sure you want to remove this friend? You can always add
              them back later.
            </Dialog.Description>

            <div className="mt-5 flex justify-end">
              <Dialog.Close asChild>
                <Button
                  onClick={(e) => e.stopPropagation()}
                  className="mr-3 bg-transparent hover:bg-foreground-dark text-text shadow-none border-none"
                >
                  Cancel
                </Button>
              </Dialog.Close>

              <Button
                onClick={handleClick}
                disabled={pending}
                loading={pending}
              >
                Delete
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
);
