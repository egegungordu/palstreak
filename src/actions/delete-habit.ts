"use server";

import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { calculateConsistencyScore, calculateNthDay } from "./utils";

const deleteHabitSchema = z.object({
  habitId: z.string(),
});

export default async function deleteHabit(
  props: z.infer<typeof deleteHabitSchema>,
) {
  const { habitId } = deleteHabitSchema.parse(props);

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

  await db.transaction(async (tx) => {
    await tx
      .delete(habit)
      .where(and(eq(habit.id, habitId), eq(habit.userId, userId)));

    const habits = await tx
      .select()
      .from(habit)
      .where(eq(habit.userId, userId));

    const longestStreak = habits.reduce(
      (acc, h) => Math.max(acc, h.streak),
      0,
    );

    const overallConsistencyScore = await calculateConsistencyScore(habits);

    await tx
      .update(users)
      .set({
        consistencyScore: overallConsistencyScore.toString(),
        longestCurrentStreak: longestStreak || 0,
      })
      .where(eq(users.id, userId));
  });

  revalidatePath("/");
}
