"use server";

import { db } from "@/db";
import {  friends } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { sortIds } from "@/db/utils";
import { z } from "zod";

const removeFriendSchema = z.object({
  friendId: z.string(),
});

export default async function removeFriend(params: z.infer<typeof removeFriendSchema>) {
  const { friendId } = removeFriendSchema.parse(params);

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

  const [smallId, bigId] = sortIds(userId, friendId);

  const deletedFriend = await db
    .delete(friends)
    .where(and(eq(friends.userId, smallId), eq(friends.friendId, bigId)))
    .returning();

  if (deletedFriend.length === 0) {
    return;
  }

  revalidatePath("/friends");
}
