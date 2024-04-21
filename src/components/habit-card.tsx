"use client";

import Button from "./button";

export default function HabitCard({ title }: { title: string }) {
  const completeToday = () => {
    alert("Edit");
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-min border">
      <div className="flex justify-between gap-4 items-center min-w-0">
        <div className="font-base text-neutral-600 leading-none tracking-tight font-semibold">
          {title}
        </div>

        <Button onClick={completeToday} className="rounded-full shrink-0">
          Mark as complete
        </Button>
      </div>

      <ContributionCalendar />
    </div>
  );
}

// <div className="grid grid-rows-7 grid-flow-col gap-0.5 auto-cols-min mt-2">
//   {Array.from({ length: 7 * 52 }).map((_, i) => (
//     <div key={i} className="bg-gray-200 w-3 aspect-square rounded" />
//   ))}
// </div>

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ContributionCalendar = () => {
  // Dummy data for contributions (0-4 represents contribution intensity)
  const contributions = Array.from({ length: 7 }).map(() =>
    Array.from({ length: 52 }, () => Math.floor(Math.random() * 5)),
  );

  return (
    <table
      role="grid"
      aria-readonly="true"
      className="table table-auto"
      style={{ borderSpacing: "3px", overflow: "hidden", position: "relative" }}
    >
      <caption className="sr-only">Contribution Graph</caption>
      <thead>
        <tr className="h-4">
          <td className="w-4">
            <span className="sr-only">Day of Week</span>
          </td>

          {renderMonthHeaders()}
        </tr>
      </thead>
      <tbody>
        {contributions.map((week, weekIndex) => (
          <tr key={weekIndex}>
            <td>
              <div className="w-8 relative">
                <div className="absolute text-end text-2xs text-neutral-400 top-1/2 left-0 -translate-y-1/2">{WEEK_DAYS[weekIndex]}</div>
              </div>
            </td>

            {week.map((count, dayIndex) => (
              <td key={dayIndex}>
                <div
                  className={`w-3 h-3 rounded-sm ${count > 0 ? "bg-sky-500" : "bg-gray-200"}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const renderMonthHeaders = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return months.map((month, index) => (
    <td key={index} className="relative" colSpan={4}>
      <span className="sr-only">{month}</span>
      <span aria-hidden="true" className="absolute top-0 text-neutral-400 text-xs">
        {month}
      </span>
    </td>
  ));
};
