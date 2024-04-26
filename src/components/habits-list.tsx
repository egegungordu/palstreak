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
  useEffect,
  useOptimistic,
  useState,
  useTransition,
} from "react";
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers";
import reorderHabits from "@/actions/reorder-habits";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function HabitsList({ habits }: { habits: Habit[] }) {
  const [pending, startTransition] = useTransition();
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [shouldDragOverlayPop, setShouldDragOverlayPop] = useState(false);
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
    setShouldDragOverlayPop(false);

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
    setShouldDragOverlayPop(true);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setShouldDragOverlayPop(false);
  };

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
        <ol className={cn("flex flex-col items-center")}>
          <AnimatePresence initial={false}>
            {/*<HabitsHeader habits={habits} />*/}

            {optimisticState.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </AnimatePresence>
        </ol>

        <AddHabit />
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        <AnimatePresence initial={false}>
          {activeId ? (
            <OverlayHabit
              key="no-animate-habit"
              habits={habits}
              activeId={activeId}
              shouldPop={shouldDragOverlayPop}
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
  shouldPop: boolean;
}

const OverlayHabit = forwardRef<HTMLDivElement, OverlayHabitProps>(
  function OverlayHabit({ activeId, habits, shouldPop }, ref) {
    const activeHabit = habits.find((habit) => habit.id === activeId)!;
    console.log(shouldPop);

    return (
      <motion.div
        key="some-key"
        className="pointer-events-none rounded-2xl origin-center animate-habit-pop"
        ref={ref}
      >
        <HabitCard habit={activeHabit} />
      </motion.div>
    );
  },
);
