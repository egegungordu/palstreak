"use client";

import Tooltip from "./tooltip";
import { LuPlus } from "react-icons/lu";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Button from "./button";
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import addHabit from "@/actions/add-habit";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type AddHabitInputs = {
  name: string;
};

export default function AddHabit() {
  const timezone = -new Date().getTimezoneOffset() / 60;
  const timezoneSign = timezone > 0 ? "+" : "-";
  const [pending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddHabitInputs>();

  const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
    startTransition(async () => {
      await addHabit({
        name: data.name,
      });

      toast("Habit added successfully", {
        description: "Be consistent and keep it up! 💪",
        action: {
          label: "Undo",
          onClick: () => {}
        },
      });

      setIsDialogOpen(false);
    });
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Tooltip content="Create new habit" side="bottom">
        <Dialog.Trigger asChild>
          <button className="bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center text-neutral-500 hover:bg-stone-200">
            <LuPlus className="w-4 h-4 text-neutral-800" />
          </button>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow focus:outline-none"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            New habit
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Add a new habit to your list. You can always edit it later.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
            <fieldset className="gap-5">
              <div className="flex items-center gap-5">
                <label
                  className="w-[90px] text-right text-xs text-neutral-600"
                  htmlFor="habit-name"
                >
                  Name
                </label>
                <input
                  className={cn(
                    "inline-flex h-[35px] w-full flex-1 border items-center justify-center rounded-md px-4 leading-none shadow outline-none",
                    errors.name && "border-red-500",
                  )}
                  type="text"
                  autoComplete="off"
                  id="habit-name"
                  placeholder="Do 100 pushups"
                  {...register("name", { required: true })}
                />
              </div>

              {errors.name && (
                <div className="mt-2 text-end text-red-500 text-xs">
                  This field is required
                </div>
              )}
            </fieldset>

            <small className="block text-xs text-neutral-600 mt-4">
              Streaks reset at 12:00 AM in your local timezone (GMT
              {timezoneSign}
              {timezone})
            </small>

            <div className="mt-5 flex justify-end">
              <Button disabled={pending} loading={pending}>
                Add habit
              </Button>
            </div>
          </form>

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
