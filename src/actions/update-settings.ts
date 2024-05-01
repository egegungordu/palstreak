"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function updateSettings({
  username,
}: {
  username: string;
}) {
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

  await db.update(users).set({ username }).where(eq(users.id, userId));

  revalidatePath("/", "layout");
}
