"use client";

import HabitCard from "./habit-card";
import { type Habit } from "@/app/page";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MeasuringStrategy,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  HTMLProps,
  forwardRef,
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import reorderHabits from "@/actions/reorder-habits";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { createRestrictToParentElementSmooth } from "@/lib/dnd-modifiers";
import { LuLayoutGrid } from "react-icons/lu";
import MockHabitCard from "./mock-habit-card";

const restrictToParentElementSmooth = createRestrictToParentElementSmooth({
  padding: 32,
  damping: 32,
});

export default function HabitsList({ habits }: { habits: Habit[] }) {
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [optimisticState, moveOptimistic] = useOptimistic(
    habits,
    (_, optimisticHabits: Habit[]) => {
      return optimisticHabits;
    },
  );

  const dropAnimationConfig: DropAnimation = {
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
    duration: 290,
    sideEffects: defaultDropAnimationSideEffects({
      className: {
        active: "opacity-40",
      },
    }),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over === null || active.id === over.id) {
      return;
    }

    const oldIndex = habits.findIndex((habit) => habit.id === active.id);
    const newIndex = habits.findIndex((habit) => habit.id === over.id);
    const newOrderedHabits = arrayMove(habits, oldIndex, newIndex);

    startTransition(async () => {
      moveOptimistic(newOrderedHabits);
      await reorderHabits({
        newOrder: newOrderedHabits.map((habit) => habit.id),
      });
    });

    setActiveId(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  if (optimisticState.length === 0) {
    return (
      <div className="mt-4 text-text-disabled text-center">
        <LuLayoutGrid className="w-6 h-6 text-foreground-darker inline mr-2 mb-1" />
        Add a habit from the top right to get started!
        <div
          className="opacity-30 pointer-events-none mt-12 flex flex-col gap-4"
          style={{
            maskImage: "linear-gradient(to bottom, black 50%, transparent 90%)",
          }}
        >
          <MockHabitCard
            weeks={52}
            habit={{
              name: "🧠 Daily learning",
              color: "transparent",
              streaks: [],
            }}
          />

          <MockHabitCard
            weeks={52}
            habit={{
              name: "🏋️ Workout",
              color: "transparent",
              streaks: [],
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <DndContext
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      modifiers={[restrictToParentElementSmooth]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={optimisticState.map((habit) => habit.id)}
      >
        <ol className={cn("flex flex-col items-center")}>
          <AnimatePresence initial={false}>
            {/*<HabitsHeader habits={habits} />*/}

            {optimisticState.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </AnimatePresence>
        </ol>
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        <AnimatePresence initial={false}>
          {activeId ? (
            <OverlayHabit
              key="no-animate-habit"
              habits={habits}
              activeId={activeId}
            />
          ) : null}
        </AnimatePresence>
      </DragOverlay>
    </DndContext>
  );
}

interface OverlayHabitProps extends HTMLProps<HTMLDivElement> {
  activeId: UniqueIdentifier;
  habits: Habit[];
}

const OverlayHabit = forwardRef<HTMLDivElement, OverlayHabitProps>(
  function OverlayHabit({ activeId, habits }, ref) {
    const activeHabit = habits.find((habit) => habit.id === activeId)!;

    useEffect(() => {
      if (!activeId) {
        return;
      }

      document.body.style.cursor = "grabbing";

      return () => {
        document.body.style.cursor = "";
      };
    }, [activeId]);

    return (
      <div
        className="pointer-events-none rounded-2xl origin-center animate-habit-pop"
        ref={ref}
      >
        <HabitCard habit={activeHabit} />
      </div>
    );
  },
);
