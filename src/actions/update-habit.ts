"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function updateHabit({ habitId, name }: { habitId: string, name: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .update(habit)
    .set({
      name: name,
    })
    .where(and(eq(habit.userId, session.user.id), eq(habit.id, habitId)));

  revalidatePath("/");
}
