"use server";

import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { calculateConsistencyScore, calculateNthDay } from "./utils";

const markCompleteSchema = z.object({
  habitId: z.string(),
});

export default async function markComplete(
  params: z.infer<typeof markCompleteSchema>,
) {
  const { habitId } = markCompleteSchema.parse(params);

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
  const nthDay = calculateNthDay(targetHabit);

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

    // update users consistency score
    const habits = await tx
      .select()
      .from(habit)
      .where(eq(habit.userId, userId));

    const overallConsistencyScore = await calculateConsistencyScore(habits);

    await tx
      .update(users)
      .set({
        longestCurrentStreak: Math.max(
          longestCurrentStreak || 0,
          longestStreak,
        ),
        consistencyScore: overallConsistencyScore.toString(),
        lastActive: new Date(),
      })
      .where(eq(users.id, userId));
  });

  revalidatePath("/");
}
