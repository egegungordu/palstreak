"use client";

import { cn } from "@/lib/utils";
import Button from "./button";
import { useMemo } from "react";

export default function HabitCard({
  title,
  color,
  streaks,
}: {
  title: string;
  color: string;
  streaks: number[];
}) {
  const completeToday = () => {
    alert("Edit");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-min border animate-habit-card-show">
      <div className="flex justify-between gap-4 items-center min-w-0 mb-2">
        <div className="font-base text-neutral-600 leading-none tracking-tight font-semibold">
          {title}
        </div>

        <Button onClick={completeToday} className="rounded-full shrink-0">
          Mark as complete
        </Button>
      </div>

      <ContributionCalendar color={color} streaks={streaks} />
    </div>
  );
}

const ContributionCalendar = ({
  color,
  streaks,
}: {
  color: string;
  streaks: number[];
}) => {
  const contributions = useMemo(() =>
    Array.from({ length: 7 }).map((_, i) =>
      Array.from({ length: 52 }).map((_, j) => {
        const index = i + j * 7;
        return streaks[index] || 0;
      }
    )
  ), [streaks]);

  return (
    <div className="overflow-auto max-w-[calc(100vw-4rem)]">
    <table
      role="grid"
      aria-readonly="true"
      className="table table-auto border-spacing-1 relative"
    >
      <caption className="sr-only">Contribution Graph</caption>
      <thead>
        {/*<tr className="h-4">
          {renderWeekHeaders()}
        </tr>*/}
      </thead>
      <tbody>
        {contributions.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((count, dayIndex) => (
              <td key={dayIndex}>
                <div
                  className={cn("w-3 h-3 rounded-sm border border-black/10", {
                    "border-white/60": count === 0,
                  })}
                  style={{
                    backgroundColor: count === 0 ? "#ddd" : color,
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
