"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function markComplete({ habitId }: { habitId: string }) {
  const dbHabit = await db.select().from(habit).where(eq(habit.id, habitId));

  // TODO: should this be an error or something else?
  if (!dbHabit) {
    throw new Error("Habit not found");
  }

  const targetHabit = dbHabit[0];

  // check if already completed today
  // calculate the nth day of the habit
  // adjust everything with habit.timezoneOffset
  const firstDay = new Date(targetHabit.createdAt.getTime() - targetHabit.timezoneOffset * 60 * 1000);
  const firstDayStart = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate());
  const today = new Date((new Date()).getTime() - targetHabit.timezoneOffset * 60 * 1000);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const nthDay = Math.floor((todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000));

  // check if already completed today
  if (targetHabit.streaks[nthDay]) {
    throw new Error("Already completed today");
  }

  // update the habit
  await db.update(habit)
    .set({
      streaks: {
        ...targetHabit.streaks,
        [nthDay]: {
          date: new Date(),
          value: 1,
        },
      },
    });

  revalidatePath("/");
    
}
