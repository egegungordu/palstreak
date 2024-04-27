"use server";

import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export default async function markComplete({ habitId }: { habitId: string }) {
  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.onboardingFinished
  ) {
    throw new Error("Unauthorized");
  }
 
  const userId = session.user.id;

  const dbHabit = await db.select().from(habit).where(eq(habit.id, habitId));

  // TODO: should this be an error or something else?
  if (!dbHabit) {
    throw new Error("Habit not found");
  }

  const targetHabit = dbHabit[0];

  // check if already completed today
  // calculate the nth day of the habit
  // adjust everything with habit.timezoneOffset
  const firstDay = new Date(
    targetHabit.createdAt.getTime() - targetHabit.timezoneOffset * 60 * 1000,
  );
  const firstDayStart = new Date(
    firstDay.getUTCFullYear(),
    firstDay.getUTCMonth(),
    firstDay.getUTCDate(),
  );
  const today = new Date(
    new Date().getTime() - targetHabit.timezoneOffset * 60 * 1000,
  );
  const todayStart = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  const nthDay = Math.floor(
    (todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000),
  );

  // check if already completed today
  if (targetHabit.streaks[nthDay]) {
    throw new Error("Already completed today");
  }

  const streak = targetHabit.streak + 1;
  const longestStreak = Math.max(targetHabit.longestStreak, streak);
  const lastCompletedAt = new Date();

  await db.transaction(async (tx) => {
    await tx
      .update(habit)
      .set({
        streak,
        longestStreak,
        lastCompletedAt,
        streaks: {
          ...targetHabit.streaks,
          [nthDay]: {
            date: new Date(),
            value: 1,
          },
        },
      })
      .where(eq(habit.id, habitId));

    // update the user's longest streak
    const { longestCurrentStreak } = (
      await tx
        .select({
          longestCurrentStreak: users.longestCurrentStreak,
        })
        .from(users)
        .where(eq(users.id, userId))
    )[0];

    await tx
      .update(users)
      .set({
        longestCurrentStreak: Math.max(
          longestCurrentStreak || 0,
          longestStreak,
        ),
      })
      .where(eq(users.id, userId));
  });

  revalidatePath("/");
}
