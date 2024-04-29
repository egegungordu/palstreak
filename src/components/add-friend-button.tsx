"use client";

import { useState, useTransition } from "react";
import Tooltip from "./tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import Button from "./button";
import { LuPlus } from "react-icons/lu";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { SubmitHandler, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import sendFriendRequest from "@/actions/send-friend-request";

type AddFriendInputs = {
  username: string;
};

export default function AddFriendButton({ username }: { username: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<AddFriendInputs>({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit: SubmitHandler<AddFriendInputs> = async (data) => {
    if (data.username === username) {
      setError("username", {
        type: "manual",
        message: "You can't add yourself as a friend, silly!",
      });
      return;
    }

    startTransition(async () => {
      const success = await sendFriendRequest({
        friendUsername: data.username,
      });

      if (success) {
        toast.success("Friend request sent!");
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to send friend request.", {
          description:
            "Please make sure the username is correct and try again.",
        });
      }

      reset({ username: "" });
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    reset();
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenChange}>
      <Tooltip content="Delete habit" side="top">
        <Dialog.Trigger asChild>
          <Button className="ml-4 rounded-full gap-1.5 pr-3">
            Add friend
            <LuPlus className="w-4 h-4" />
          </Button>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            Add a friend
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Search for a friend by their username.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-5">
              <label
                className="w-[90px] text-right text-xs text-text-faded"
                htmlFor="username"
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
                id="username"
                placeholder="Username"
                {...register("username", {
                  required: { value: true, message: "This field is required" },
                })}
              />
            </div>

            {errors.username && (
              <div className="mt-2 text-end text-red-500 text-xs">
                {errors.username.message}
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <Button disabled={pending} loading={pending}>
                Send request
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
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
}
