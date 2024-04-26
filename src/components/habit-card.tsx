"use client";

import { cn, relativeTime } from "@/lib/utils";
import Button from "./button";
import { useEffect, useMemo, useState, useTransition } from "react";
import { type Habit } from "@/app/page";
import markComplete from "@/actions/mark-complete";
import Seperator from "./seperator";
import {
  LuCheckSquare,
  LuChevronDown,
  LuGripVertical,
  LuLoader,
  LuPencil,
  LuSquare,
  LuTrash,
} from "react-icons/lu";
import Tooltip from "./tooltip";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import deleteHabit from "@/actions/delete-habit";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import updateHabit from "@/actions/update-habit";
import { HABIT_COLORS } from "@/globals";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";

export default function HabitCard({ habit }: { habit: Habit }) {
  const [showStats, setShowStats] = useState(false);
  const [pending, startTransiiton] = useTransition();
  const currentDayIndex = useMemo(() => {
    const firstDay = new Date(habit.createdAt.getTime() + 1000 * 60 * 60 * 24);
    const firstDayStart = new Date(
      firstDay.getUTCFullYear(),
      firstDay.getUTCMonth(),
      firstDay.getUTCDate(),
    );
    const today = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    const todayStart = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    return Math.floor(
      (todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000),
    );
  }, [habit.createdAt]);
  const isTodayCompleted = habit.streaks[currentDayIndex]?.value !== 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: habit.id,
    animateLayoutChanges: defaultAnimateLayoutChanges,
  });

  const completeToday = () => {
    startTransiiton(async () => {
      await markComplete({
        habitId: habit.id,
      });
    });
  };

  useEffect(() => {
    if (isDragging) {
      setShowStats(false);
    }
  }, [isDragging]);

  return (
    <motion.li
      initial={{
        height: 0,
        marginBottom: 0,
        filter: "blur(6px)",
        scale: 0.5,
        opacity: 0,
      }}
      animate={{
        height: "auto",
        marginBottom: 16,
        filter: "blur(0px)",
        scale: 1,
        opacity: 1,
      }}
      exit={{
        height: 0,
        marginBottom: 0,
        filter: "blur(6px)",
        scale: 0.5,
        opacity: 0,
      }}
      className="list-none"
    >
      <div
        ref={setNodeRef}
        {...attributes}
        className={cn(
          "bg-white group rounded-2xl shadow max-w-min border relative cursor-default overflow-hidden",
          {
            "opacity-40": isDragging,
          },
        )}
        style={{
          transform: `translateY(${transform?.y ?? 0}px)`,
          transition,
        }}
      >
        <Tooltip content="Drag to reorder" side="left">
          <button
            {...listeners}
            className="absolute left-[3px] top-1/2 -translate-y-1/2 text-neutral-300 group-hover:block hidden cursor-grab"
            aria-label="Reorder"
          >
            <LuGripVertical className="w-4 h-4" />
            <LuGripVertical className="w-4 h-4 -mt-0.5" />
            <LuGripVertical className="w-4 h-4 -mt-0.5" />
          </button>
        </Tooltip>

        <div className="px-5 pt-3 pb-0">
          <div className="flex gap-2 items-center min-w-0 h-8 mb-2">
            <div className="font-base text-neutral-600 leading-none tracking-tight font-semibold">
              {habit.name}
            </div>

            <div className="hidden group-hover:flex gap-1 p-1 bg-white rounded-lg border shadow">
              <EditHabitButton habit={habit} />
              <DeleteHabitButton habit={habit} />
            </div>

            <button
              // loading={pending}
              disabled={isTodayCompleted}
              onClick={completeToday}
              className="rounded-full flex text-xs items-center disabled:text-neutral-400 ml-auto shrink-0 bg-transparent text-neutral-500 shadow-none p-0 hover:bg-neutral hover:text-neutral-950"
            >
              {isTodayCompleted ? (
                <>
                  Completed
                  <LuCheckSquare className="w-4 h-4 ml-1" />
                </>
              ) : (
                <>
                  Mark as done
                  {pending ? (
                    <LuLoader className="w-4 h-4 ml-1 animate-spin" />
                  ) : (
                    <LuSquare className="w-4 h-4 ml-1" />
                  )}
                </>
              )}
            </button>
          </div>

          <ContributionCalendar
            color={habit.color}
            streaks={habit.streaks}
            currentDayIndex={currentDayIndex}
          />
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          className={cn(
            "w-full hover:bg-gradient-to-t hover:from-stone-100 flex justify-center",
            {
              "p-4": showStats,
              "py-1": !showStats,
            },
          )}
        >
          {showStats ? (
            <Stats habit={habit} />
          ) : (
            <LuChevronDown className="text-neutral-400" />
          )}
        </button>
      </div>
    </motion.li>
  );
}

const DeleteHabitButton = ({ habit }: { habit: Habit }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await deleteHabit({ habitId: habit.id });

      toast.success("Habit deleted!", {
        description: "The habit has been successfully deleted.",
      });

      setIsDialogOpen(false);
    });
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Tooltip content="Delete habit" side="top">
        <Dialog.Trigger asChild>
          <button className="flex rounded-md text-red-600 text-xs p-1.5 hover:bg-neutral-100">
            <LuTrash className="w-3.5 h-3.5" />
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
            Delete habit
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Are you sure you want to delete this habit? This action cannot be
            undone.
          </Dialog.Description>

          <div className="mt-5 flex justify-end">
            <Dialog.Close asChild>
              <Button className="mr-3 bg-transparent hover:bg-neutral-100 text-neutral-800 shadow-none border-none">
                Cancel
              </Button>
            </Dialog.Close>

            <Button onClick={handleClick} disabled={pending} loading={pending}>
              Delete
            </Button>
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
};

type EditHabitInputs = {
  name: string;
  color: string;
};

const EditHabitButton = ({ habit }: { habit: Habit }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EditHabitInputs>({
    defaultValues: {
      name: habit.name,
      color: habit.color,
    },
  });

  const selectedColor = watch("color");

  const onSubmit: SubmitHandler<{ name: string; color: string }> = async (
    data,
  ) => {
    startTransition(async () => {
      await updateHabit({
        habitId: habit.id,
        name: data.name,
        color: data.color,
      });

      toast.success("Habit updated!", {
        description: "Your habit has been updated successfully.",
      });

      reset({ name: data.name, color: data.color });
      setIsDialogOpen(false);
    });
  };

  const onOpenChange = (isOpen: boolean) => {
    reset();
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenChange}>
      <Tooltip content="Edit habit" side="top">
        <Dialog.Trigger asChild>
          <button className="flex rounded-lg text-neutral-600 text-xs p-1.5 hover:bg-neutral-100">
            <LuPencil className="w-3.5 h-3.5" />
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
            Edit habit
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Make changes to your habit.
          </Dialog.Description>

          <form onSubmit={handleSubmit(onSubmit)}>
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

            <div className="flex items-center gap-5 mt-3">
              <label className="w-[90px] text-right text-xs text-neutral-600">
                Color
              </label>
              <div className="grid grid-cols-6 items-center gap-1">
                {HABIT_COLORS.map((color) => (
                  <label
                    key={color}
                    className="inline-flex items-center justify-center rounded-full cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={color}
                      {...register("color", { required: true })}
                    />
                    <span
                      className={cn(
                        "block w-5 h-5 border border-white rounded-md hover:brightness-110",
                        {
                          "ring-2 ring-black/90": selectedColor === color,
                        },
                      )}
                      style={{ backgroundColor: color }}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <Button disabled={pending} loading={pending}>
                Save
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
};

const Stats = ({ habit }: { habit: Habit }) => {
  const lastCompletedStat = habit.lastCompletedAt
    ? relativeTime({ date: habit.lastCompletedAt })
    : null;
  const streakEndsAtStat = useMemo(() => {
    if (habit.streak === 0 || habit.lastCompletedAt === null) return null;
    const lastCompleteDay = new Date(
      habit.lastCompletedAt.getFullYear(),
      habit.lastCompletedAt.getMonth(),
      habit.lastCompletedAt.getDate() + 2,
    );
    return relativeTime({ date: lastCompleteDay });
  }, [habit.streak, habit.lastCompletedAt]);

  return (
    <div className="flex justify-center gap-4 items-center">
      <StatSection title="Current Streak" stat={`${habit.streak} days`} />

      <Seperator orientation="vertical" />

      <StatSection
        title="Longest Streak"
        stat={`${habit.longestStreak} days`}
      />

      {lastCompletedStat && (
        <>
          <Seperator orientation="vertical" />
          <StatSection title="Last completed" stat={lastCompletedStat} />
        </>
      )}

      {streakEndsAtStat && (
        <>
          <Seperator orientation="vertical" />
          <StatSection title="Streak ends" stat={streakEndsAtStat} />
        </>
      )}
    </div>
  );
};

const StatSection = ({
  title,
  stat,
  extra,
}: {
  title: string;
  stat: string;
  extra?: string;
}) => (
  <div className="flex flex-col gap-1 items-center">
    <div className="text-2xs text-neutral-500 leading-none">{title}</div>
    <div className="text-base font-bold tracking-tight leading-none text-neutral-800">
      {stat}
    </div>
    {extra && (
      <div className="text-2xs leading-none text-neutral-500">{extra}</div>
    )}
  </div>
);

const ContributionCalendar = ({
  color,
  streaks,
  currentDayIndex,
}: {
  color: string;
  streaks: Habit["streaks"];
  currentDayIndex: number;
}) => {
  const contributions = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) =>
        Array.from({ length: 52 }).map((_, j) => {
          const index = i + j * 7;
          return streaks[index] || 0;
        }),
      ),
    [streaks],
  );

  return (
    <div className="overflow-auto max-w-[calc(100vw-4rem)]">
      <table
        role="grid"
        aria-readonly="true"
        className="table table-auto border-spacing-1 relative"
      >
        <caption className="sr-only">Streak Calendar</caption>
        <thead>
          {/*<tr className="h-4">
          {renderWeekHeaders()}
        </tr>*/}
        </thead>
        <tbody>
          {contributions.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map(({ value }, dayIndex) => (
                <td key={dayIndex}>
                  <div
                    className={cn("w-3 h-3 rounded border border-black/10", {
                      "border-white/60": value === 0,
                    })}
                    style={{
                      backgroundColor: value === 0 ? "#ddd" : color,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderWeekHeaders = () => {
  // render week headers
  // week 1, week 5, week 9, week 13, week 17, week 21, week 25, week 29, week 33, week 37, week 41, week 45, week 49
  return Array.from({ length: 52 }).map((_, i) => {
    if (i % 4 === 0) {
      return (
        <td
          key={i}
          colSpan={4}
          className="text-xs text-neutral-400"
        >{`${i + 1}th`}</td>
      );
    }
    return null;
  });
};
