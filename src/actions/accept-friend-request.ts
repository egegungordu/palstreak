"use server";

import { db } from "@/db";
import { friendRequests, friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, count, eq } from "drizzle-orm";
import { sortIds } from "@/db/utils";

export default async function acceptFriendRequest({
  friendId,
}: {
  friendId: string;
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

  await db.transaction(async (tx) => {
    const deletedFriendRequest = await tx
      .delete(friendRequests)
      .where(
        and(
          eq(friendRequests.fromUserId, friendId),
          eq(friendRequests.toUserId, userId),
        ),
      )
      .returning();

    if (deletedFriendRequest.length === 0) {
      return;
    }

    const [smallId, bigId] = sortIds(userId, friendId);

    await db.insert(friends).values({
      userId: smallId,
      friendId: bigId,
    });
  });

  revalidatePath("/friends");
}
