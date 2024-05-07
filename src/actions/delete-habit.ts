"use server";

import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

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

    // we might have deleted the longest streak for the user,
    // so we need to recompute the longest streak
    const { longestStreak } = (
      await tx
        .select({
          longestStreak: max(habit.streak),
        })
        .from(habit)
        .where(eq(habit.userId, userId))
    )[0];

    await tx
      .update(users)
      .set({
        longestCurrentStreak: longestStreak || 0,
      })
      .where(eq(users.id, userId));
  });

  revalidatePath("/");
}
