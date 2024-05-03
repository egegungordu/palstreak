"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function completeOnboarding({
  username,
}: {
  username: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    await db
      .update(users)
      .set({ onboardingFinished: true, username: username })
      .where(eq(users.id, userId));
  } catch (e: unknown) {
    return {
      message: "Username already taken",
    };
  }

  revalidatePath("/onboarding");
  redirect("/");
}
