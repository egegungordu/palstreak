"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { USERNAME_REGEX } from "@/globals";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const completeOnboardingSchema = z.object({
  username: z.string().regex(USERNAME_REGEX),
});

export default async function completeOnboarding(
  props: z.infer<typeof completeOnboardingSchema>,
) {
  const { username } = completeOnboardingSchema.parse(props);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }

  // if they are somehow stuck in onboarding, early exit
  if (session.user.onboardingFinished) {
    revalidatePath("/onboarding");
    redirect("/");
  }

  const userId = session.user.id;

  try {
    await db
      .update(users)
      .set({ onboardingFinished: true, username: username })
      .where(eq(users.id, userId));
  } catch (e: unknown) {
    return {
      ok: false,
      message: "Username already taken",
    } as const;
  }

  revalidatePath("/onboarding");

  return {
    ok: true,
  } as const;
}
