"use server";

import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const addHabitSchema = z.object({
  timezoneOffset: z.number(),
  name: z.string(),
  colorIndex: z.number().min(0).int(),
});

export default async function addHabit(params: z.infer<typeof addHabitSchema>) {
  const { timezoneOffset, name, colorIndex } = addHabitSchema.parse(params);

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

  await db.insert(habit).values({
    userId,
    timezoneOffset: timezoneOffset,
    name: name,
    colorIndex: colorIndex,
  });

  revalidatePath("/");
}
