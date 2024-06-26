"use client";

import { cn, relativeTime, formatDate } from "@/lib/utils";
import Button from "./button";
import {
  HTMLAttributes,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { type Habit } from "@/app/page";
import markComplete from "@/actions/mark-complete";
import Seperator from "./seperator";
import {
  LuCheckSquare,
  LuChevronDown,
  LuFlame,
  LuGrip,
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
import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionValue,
} from "framer-motion";
import IsMobile from "./is-mobile";
import useIsMobile from "@/hooks/use-is-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";

export default function HabitCard({ habit }: { habit: Habit }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [pending, startTransiiton] = useTransition();
  const isMobile = useIsMobile();
  const currentDayIndex = useMemo(() => {
    const firstDay = new Date(
      habit.createdAt.getTime() - habit.timezoneOffset * 60 * 1000,
    );
    const firstDayStart = new Date(
      firstDay.getUTCFullYear(),
      firstDay.getUTCMonth(),
      firstDay.getUTCDate(),
    );
    const today = new Date(
      new Date().getTime() - habit.timezoneOffset * 60 * 1000,
    );
    const todayStart = new Date(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate(),
    );
    const nthDay = Math.floor(
      (todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000),
    );

    return nthDay;
  }, [habit.createdAt, habit.timezoneOffset]);
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

  const completeToday = (e: React.MouseEvent) => {
    e.stopPropagation();
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
      ref={setNodeRef}
      {...attributes}
    >
      <div
        className={cn(
          "bg-foreground group rounded-2xl shadow-md shadow-shadow max-w-min border border-border relative cursor-default overflow-hidden",
          {
            "opacity-40": isDragging,
            "touch-manipulation": isMobile,
          },
        )}
        style={{
          transform: `translateY(${transform?.y ?? 0}px)`,
          transition,
        }}
        {...(isMobile && !isDrawerOpen ? listeners : {})}
      >
        <Tooltip content="Drag to reorder" side="left" disableHoverableContent>
          <button
            {...listeners}
            className="absolute z-10 left-[3px] top-1/2 -translate-y-1/2 text-text-disabled group-hover:block hidden cursor-grab touch-none"
            aria-label="Reorder"
          >
            <LuGripVertical className="w-4 h-4" />
            <LuGripVertical className="w-4 h-4 -mt-0.5" />
            <LuGripVertical className="w-4 h-4 -mt-0.5" />
          </button>
        </Tooltip>

        <div className="px-5 pt-3 pb-0 relative">
          {isMobile && (
            <MobileActions
              habit={habit}
              open={isDrawerOpen}
              onOpenChange={setIsDrawerOpen}
            />
          )}

          <div className="flex gap-2 items-center min-w-0 h-8 mb-2">
            <div className="font-base text-text-faded leading-none tracking-tight font-semibold">
              {habit.name}
            </div>

            {!isMobile && (
              <div className="hidden group-hover:flex gap-1 p-1 bg-foreground rounded-lg border border-border shadow shadow-shadow">
                <EditHabitButton habit={habit} />
                <DeleteHabitButton habit={habit} />
                <DragHabitButton {...listeners} />
              </div>
            )}

            <button
              disabled={isTodayCompleted}
              onClick={completeToday}
              className="rounded-full z-10 flex text-xs items-center leading-none tracking-tight font-semibold disabled:font-medium disabled:text-text-disabled ml-auto shrink-0 bg-transparent text-text-faded shadow-none p-1 hover:text-text-strong"
            >
              {isTodayCompleted ? (
                <>
                  Completed
                  <LuCheckSquare className="w-4 h-4 ml-1.5" />
                </>
              ) : (
                <>
                  Mark as done
                  {pending ? (
                    <LuLoader className="w-4 h-4 ml-1.5 animate-spin" />
                  ) : (
                    <LuSquare className="w-4 h-4 ml-1.5" />
                  )}
                </>
              )}
            </button>
          </div>

          <ContributionCalendar
            colorIndex={habit.colorIndex}
            streaks={habit.streaks}
            currentDayIndex={currentDayIndex}
          />
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          className={cn("w-full hover:bg-foreground-dark flex justify-center", {
            "p-4": showStats,
            "py-1": !showStats,
          })}
        >
          {showStats ? (
            <Stats habit={habit} />
          ) : (
            <LuChevronDown className="text-text-disabled" />
          )}
        </button>
      </div>
    </motion.li>
  );
}

const DragHabitButton = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <Tooltip content="Drag to reorder" side="top" disableHoverableContent>
      <button
        {...props}
        aria-label="Reorder"
        className="flex rounded-md text-text-faded text-xs p-1.5 hover:bg-background-button-hover cursor-grab touch-none"
      >
        <LuGrip className="w-3.5 h-3.5" />
      </button>
    </Tooltip>
  );
};

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
      <Tooltip content="Delete habit" side="top" disableHoverableContent>
        <Dialog.Trigger asChild>
          <button
            aria-label="Delete habit"
            className="flex rounded-md text-red-600 text-xs p-1.5 hover:bg-background-button-hover"
          >
            <LuTrash className="w-3.5 h-3.5" />
          </button>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
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
              <Button className="mr-3 bg-transparent hover:bg-foreground-dark text-text shadow-none border-none">
                Cancel
              </Button>
            </Dialog.Close>

            <Button onClick={handleClick} disabled={pending} loading={pending}>
              Delete
            </Button>
          </div>

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
};

type EditHabitInputs = {
  name: string;
  colorIndex: number;
};

const EditHabitButton = ({ habit }: { habit: Habit }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onOpenChange = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
  };

  const handleSubmit = () => {
    setIsDialogOpen(false);
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onOpenChange}>
      <Tooltip content="Edit habit" side="top" disableHoverableContent>
        <Dialog.Trigger asChild>
          <button
            aria-label="Edit habit"
            className="flex rounded-lg text-text-faded text-xs p-1.5 hover:bg-background-button-hover"
          >
            <LuPencil className="w-3.5 h-3.5" />
          </button>
        </Dialog.Trigger>
      </Tooltip>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlay-show backdrop-blur-sm fixed inset-0 z-20" />
        <Dialog.Content
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="overflow-auto data-[state=open]:animate-content-show fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-foreground p-6 border border-border shadow shadow-shadow focus:outline-none z-30"
        >
          <Dialog.Title className="m-0 text-base font-medium">
            Edit habit
          </Dialog.Title>

          <Dialog.Description className="mt-3 mb-5 leading-normal">
            Make changes to your habit.
          </Dialog.Description>

          <EditHabitForm
            key={`${isDialogOpen}`}
            habit={habit}
            onSubmit={handleSubmit}
          />

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
};

const EditHabitForm = ({
  habit,
  onSubmit: _onSubmit,
  className,
  children,
}: {
  habit: Habit;
  onSubmit?: () => void;
  className?: string;
  children?: React.ReactNode;
}) => {
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
      colorIndex: habit.colorIndex,
    },
  });

  const selectedColorIndex = watch("colorIndex");

  const onSubmit: SubmitHandler<EditHabitInputs> = async (data) => {
    startTransition(async () => {
      await updateHabit({
        habitId: habit.id,
        name: data.name,
        colorIndex: parseInt(data.colorIndex as unknown as string),
      });

      toast.success("Habit updated!", {
        description: "Your habit has been updated successfully.",
      });

      reset({ name: data.name, colorIndex: data.colorIndex });

      _onSubmit?.();
    });
  };

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-center gap-5">
        <label
          className="w-[50px] sm:w-[90px] text-right text-xs text-text-faded"
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
        <label className="w-[50px] sm:w-[90px] text-right text-xs text-text-faded">
          Color
        </label>
        <div className="grid grid-cols-6 items-center gap-1">
          {HABIT_COLORS.map((color, index) => (
            <label
              key={color}
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
                  HABIT_COLORS[index],
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
      <div className="mt-7 flex justify-between">
        {children}
        <Button
          disabled={pending}
          loading={pending}
          className="ml-auto shrink-0"
        >
          Save
        </Button>
      </div>
    </form>
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
    <div className="text-2xs text-text-faded leading-none">{title}</div>
    <div className="text-base font-bold tracking-tight leading-none text-text">
      {stat}
    </div>
    {extra && <div className="text-2xs leading-none text-faded">{extra}</div>}
  </div>
);

export const ContributionCalendar = ({
  showOverflow = true,
  colorIndex,
  streaks,
  currentDayIndex,
  weeks = 52,
}: {
  showOverflow?: boolean;
  colorIndex: number;
  streaks: Habit["streaks"];
  currentDayIndex: number;
  weeks?: number;
}) => {
  const contributions = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) =>
        Array.from({ length: weeks }).map((_, j) => {
          const index = i + j * 7;
          return {
            value: streaks[index] ? streaks[index].value : 0,
            date: streaks[index]?.date,
          };
        }),
      ),
    [streaks, weeks],
  );

  return (
    <div
      className={cn("overflow-hidden max-w-[calc(100vw-4rem)]", {
        "overflow-auto": showOverflow,
      })}
    >
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
              <AnimatePresence>
                {week.map(({ value }, dayIndex) => {
                  const isToday = dayIndex * 7 + weekIndex === currentDayIndex;
                  const isBeforeToday =
                    dayIndex * 7 + weekIndex < currentDayIndex;
                  return (
                    <td key={dayIndex}>
                      {value === 0 ? (
                        <div
                          className={cn(
                            "w-[10px] h-[10px] rounded border border-border-grid bg-background-grid hover:brightness-125",
                            {
                              "bg-background-grid-today": isToday,
                              "bg-foreground": isBeforeToday,
                            },
                          )}
                        />
                      ) : (
                        <Tooltip
                          disableHoverableContent
                          content={formatDate({ date: week[dayIndex].date })}
                        >
                          <div
                            className={cn(
                              "w-[10px] h-[10px] rounded border border-border-grid bg-background-grid hover:brightness-125 shadow-inner shadow-shadow-grid",
                              HABIT_COLORS[colorIndex],
                            )}
                          />
                        </Tooltip>
                      )}
                    </td>
                  );
                })}
              </AnimatePresence>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MobileActions = ({
  habit,
  open,
  onOpenChange,
}: {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const handleSubmit = () => {
    onOpenChange(false);
  };

  const [isDeleting, setIsDeleting] = useState(false);
  const [deletePending, startDeleteTransition] = useTransition();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDeleting(false);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [isDeleting]);

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      progress.set(100);
      return;
    }

    startDeleteTransition(async () => {
      await deleteHabit({ habitId: habit.id });

      toast.success("Habit deleted!", {
        description: "The habit has been successfully deleted.",
      });

      onOpenChange(false);
    });
  };

  const progress = useMotionValue(0);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute inset-0 z-10"
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{habit.name}</DrawerTitle>
          <DrawerDescription className="flex items-center justify-center">
            <LuFlame className="w-5 h-5 text-text-faded" />
            <span className="text-xs text-text-faded ml-1">
              {habit.streak} days
            </span>
          </DrawerDescription>
        </DrawerHeader>

        <DrawerFooter>
          <EditHabitForm className="" habit={habit} onSubmit={handleSubmit}>
            <Button
              onClick={handleDelete}
              type="button"
              loading={deletePending}
              disabled={deletePending}
              className="bg-transparent border border-red-500 hover:bg-transparent text-red-500"
            >
              {isDeleting ? (
                <motion.div
                  animate={{
                    background: `conic-gradient(rgb(239 68 68) ${progress.get()}%, transparent ${progress.get()}%)`,
                  }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="size-4 mr-2 rounded-full relative after:absolute after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:size-3 after:bg-foreground after:rounded-full"
                />
              ) : (
                <LuTrash className="size-4 mr-2" />
              )}
              {isDeleting ? "Are you sure?" : "Delete"}
            </Button>
          </EditHabitForm>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
