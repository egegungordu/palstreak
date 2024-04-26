"use client";

import HabitCard from "./habit-card";
import AddHabit from "./add-habit";
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
  useOptimistic,
  useState,
  useTransition,
} from "react";
import {
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import reorderHabits from "@/actions/reorder-habits";
import { cn } from "@/lib/utils";

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
    easing: "cubic-bezier(.32,.99,.76,1.26)",
    duration: 300,
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
      modifiers={[restrictToFirstScrollableAncestor]}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={optimisticState.map((habit) => habit.id)}
      >
        <ol className={cn("flex flex-col gap-3 items-center")}>
          {/*<HabitsHeader habits={habits} />*/}

          {optimisticState.map((habit) => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
        </ol>

        <AddHabit />
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeId ? <OverlayHabit habits={habits} activeId={activeId} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

interface OverlayHabitProps extends HTMLProps<HTMLDivElement> {
  activeId: UniqueIdentifier;
  habits: Habit[];
}

const OverlayHabit = forwardRef<HTMLDivElement, OverlayHabitProps>(
  function OverlayHabit({ activeId, habits, ...props }, ref) {
    const activeHabit = habits.find((habit) => habit.id === activeId);

    // useEffect(() => {
    //   document.body.style.cursor = "grabbing";
    //
    //   return () => {
    //     document.body.style.cursor = "";
    //   };
    // }, []);

    return (
      <div
        {...props}
        className={cn("pointer-events-none origin-center", {
          "shadow-2xl": true,
        })}
        ref={ref}
      >
        <HabitCard habit={activeHabit} />
      </div>
    );
  },
);
