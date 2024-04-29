"use server";

import { db } from "@/db";
import { friendRequests, friends } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { sortIds } from "@/db/utils";

export default async function removeFriend({ friendId }: { friendId: string }) {
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
