"use server";

import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export default async function completeOnboarding({ username }: { username: string }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  await db
    .update(users)
    .set({ onboardingFinished: true, username: username })
    .where(eq(users.id, userId));

  revalidatePath("/onboarding");
}
