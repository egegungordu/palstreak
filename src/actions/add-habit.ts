"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function addHabit({
  timezoneOffset,
  name,
  color,
}: {
  timezoneOffset: number;
  name: string;
  color: string;
}) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;

  await db.transaction(async (tx) => {
    const { habitCount } = (
      await tx
        .select({ habitCount: sql<number>`count(*)` })
        .from(habit)
        .where(eq(habit.userId, userId))
    )[0];

    await tx.insert(habit).values({
      userId,
      order: habitCount,
      timezoneOffset: timezoneOffset,
      name: name,
      color: color,
    });
  });

  revalidatePath("/");
}
