"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reorderHabitsSchema = z.object({
  newOrder: z.array(z.string()),
});

export default async function reorderHabits(
  params: z.infer<typeof reorderHabitsSchema>,
) {
  const { newOrder } = reorderHabitsSchema.parse(params);

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
    const dbHabits = await tx
      .select()
      .from(habit)
      .where(eq(habit.userId, userId));

    if (dbHabits.length !== newOrder.length) {
      tx.rollback();
      throw new Error("Invalid order");
    }

    for (const dbHabit of dbHabits) {
      const newOrderIndex = newOrder.indexOf(dbHabit.id);

      if (newOrderIndex === -1) {
        tx.rollback();
        throw new Error("Invalid order");
      }

      await tx
        .update(habit)
        .set({
          order: newOrderIndex,
        })
        .where(and(eq(habit.userId, userId), eq(habit.id, dbHabit.id)));
    }
  });

  revalidatePath("/");
}
