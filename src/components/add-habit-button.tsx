"use client";

import { LuPlus } from "react-icons/lu";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import Button from "./button";
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import addHabit from "@/actions/add-habit";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { HABIT_COLORS } from "@/globals";

type AddHabitInputs = {
  name: string;
  colorIndex: number;
};

export default function AddHabitButton() {
  const timezone = -new Date().getTimezoneOffset() / 60;
  const timezoneSign = timezone > 0 ? "+" : "-";
  const [pending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AddHabitInputs>({
    defaultValues: {
      name: "",
      colorIndex: 0,
    },
  });

  const selectedColorIndex = watch("colorIndex");

  const onSubmit: SubmitHandler<AddHabitInputs> = async (data) => {
    startTransition(async () => {
      // TODO: the value on the radio button ins a string, but ts types expect a number
      await addHabit({
        timezoneOffset: new Date().getTimezoneOffset(),
        name: data.name,
        colorIndex: parseInt(data.colorIndex as unknown as string),
      });

      toast.success("Habit added successfully", {
        description: "Be consistent and keep it up! 💪",
      });

      reset();
      setIsDialogOpen(false);
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    reset();
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <Button className="ml-4 rounded-full gap-1.5 pr-3">
          Add habit
          <LuPlus className="w-4 h-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            New habit
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Add a new habit to your list. You can always edit it later.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center gap-5">
              <label
                className="w-[90px] text-right text-xs text-faded"
                htmlFor="habit-name"
              >
                Name
              </label>
              <input
                className={cn(
                  "inline-flex h-[35px] w-full flex-1 border border-border items-center justify-center rounded-md px-4 leading-none shadow shadow-shadow outline-none",
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

            <div className="flex items-center gap-5 mt-3">
              <label className="w-[90px] text-right text-xs text-text-faded">
                Color
              </label>
              <div className="grid grid-cols-6 items-center gap-1">
                {HABIT_COLORS.map((color, index) => (
                  <label
                    key={index}
                    className="inline-flex items-center justify-center rounded-full cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={index}
                      {...register("colorIndex", {
                        valueAsNumber: true,
                      })}
                    />
                    <span
                      className={cn(
                        "block w-5 h-5 border border-border rounded-md hover:brightness-110",
                        color,
                        {
                          "ring-2 ring-text-strong":
                            selectedColorIndex.toString() === index.toString(),
                        },
                      )}
                    />
                  </label>
                ))}
              </div>
            </div>

            <small className="block text-xs text-text-disabled mt-4">
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
