"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { USERNAME_REGEX } from "@/globals";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateSettingsSchema = z.object({
  username: z.string().regex(USERNAME_REGEX),
});

export default async function updateSettings(
  props: z.infer<typeof updateSettingsSchema>,
) {
  const { username } = updateSettingsSchema.parse(props);

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

  try {
    await db.update(users).set({ username }).where(eq(users.id, userId));
  } catch (e: unknown) {
    return {
      ok: false,
      message: "Username already taken",
    } as const;
  }

  revalidatePath("/", "layout");

  return { ok: true } as const;
}
