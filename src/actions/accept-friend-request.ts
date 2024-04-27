"use server";

import { db } from "@/db";
import { friendRequests, friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, count, eq } from "drizzle-orm";

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
    const friend = await tx.select().from(users).where(eq(users.id, friendId));

    if (friend.length === 0) {
      return;
    }

    const incomingFriendRequests = await db
      .select()
      .from(friendRequests)
      .where(
        and(
          eq(friendRequests.fromUserId, friendId),
          eq(friendRequests.toUserId, userId),
        ),
      );

    if (incomingFriendRequests.length === 0) {
      return;
    }

    await db
      .delete(friendRequests)
      .where(
        and(
          eq(friendRequests.fromUserId, friendId),
          eq(friendRequests.toUserId, userId),
        ),
      );

    await db.insert(friends).values({
      userId: userId,
      friendId: friendId,
    });
  });

  revalidatePath("/friends");
}
