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
import { useSession } from "next-auth/react";

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
