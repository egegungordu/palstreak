"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateHabitSchema = z.object({
  habitId: z.string(),
  name: z.string(),
  colorIndex: z.number().min(0).int(),
});

export default async function updateHabit(
  params: z.infer<typeof updateHabitSchema>,
) {
  const { habitId, name, colorIndex } = updateHabitSchema.parse(params);

  const session = await auth();
  if (
    !session ||
    !session.user ||
    !session.user.id ||
    !session.user.onboardingFinished
  ) {
    throw new Error("Unauthorized");
  }

  await db
    .update(habit)
    .set({
      name: name,
      colorIndex: colorIndex,
    })
    .where(and(eq(habit.userId, session.user.id), eq(habit.id, habitId)));

  revalidatePath("/");
}
