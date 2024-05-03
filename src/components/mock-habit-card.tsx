"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { LuCheckSquare, LuLoader, LuSquare } from "react-icons/lu";
import { ContributionCalendar } from "./habit-card";

export default function MockHabitCard({
  weeks = 28,
  habit,
}: {
  weeks?: number;
  habit: {
    name: string;
    color: string;
    streaks: Record<
      number,
      {
        date: Date;
        value: number;
      }
    >;
  };
}) {
  const [isTodayCompleted, setTodayCompleted] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <div
      className={cn(
        "bg-foreground group rounded-2xl shadow-md shadow-shadow max-w-min border border-border relative cursor-default overflow-hidden",
      )}
    >
      <div className="px-5 pt-3 pb-4">
        <div className="flex gap-2 items-center min-w-0 h-8 mb-2">
          <div className="font-base text-text-faded leading-none tracking-tight font-semibold">
            {habit.name}
          </div>

          <button
            disabled={isTodayCompleted}
            onClick={() => {
              setPending(true);
              setTimeout(() => {
                setTodayCompleted(true);
                setPending(false);
              }, 500);
            }}
            className="rounded-full flex text-xs items-center leading-none tracking-tight font-semibold disabled:font-medium disabled:text-text-disabled ml-auto shrink-0 bg-transparent text-text-faded shadow-none p-0 hover:text-text-strong"
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
          color={habit.color}
          streaks={habit.streaks}
          currentDayIndex={-1}
          weeks={weeks}
        />
      </div>
    </div>
  );
}
