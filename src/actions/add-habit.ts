"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export default async function addHabit({ name, timezoneOffset }: { name: string, timezoneOffset: number }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  await db.insert(habit).values({
    name: name,
    userId: session.user.id,
    timezoneOffset: timezoneOffset,
  });

  revalidatePath("/");
}
