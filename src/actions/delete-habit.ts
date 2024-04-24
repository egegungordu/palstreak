"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function deleteHabit({ habitId }: { habitId: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db
    .delete(habit)
    .where(and(eq(habit.id, habitId), eq(habit.userId, session.user.id)));

  revalidatePath("/");
}
