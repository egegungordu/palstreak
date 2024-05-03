"use server";

import { db } from "@/db";
import { friendRequests, friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { sortIds } from "@/db/utils";
import { z } from "zod";

const sendFriendRequestSchema = z.object({
  friendUsername: z.string(),
});

export default async function sendFriendRequest(
  params: z.infer<typeof sendFriendRequestSchema>,
) {
  const { friendUsername } = sendFriendRequestSchema.parse(params);

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

  // its doing something
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const success = await db.transaction(async (tx) => {
    // TODO: might not need this since db has foreign key constraints?
    const friend = await tx
      .select()
      .from(users)
      .where(eq(users.username, friendUsername));

    if (friend.length === 0) {
      return false;
    }

    // sadly, you can't be friends with yourself
    if (friend[0].id === userId) {
      return false;
    }

    const [smallId, bigId] = sortIds(userId, friend[0].id);

    const existingFriend = await tx
      .select()
      .from(friends)
      .where(and(eq(friends.userId, smallId), eq(friends.friendId, bigId)));

    if (existingFriend.length > 0) {
      return false;
    }

    const deletedExistingIncomingRequest = await tx
      .delete(friendRequests)
      .where(
        and(
          eq(friendRequests.fromUserId, friend[0].id),
          eq(friendRequests.toUserId, userId),
        ),
      )
      .returning();

    // if we deleted an existing incoming request, we are now friends (yay!)
    if (deletedExistingIncomingRequest.length > 0) {
      await tx.insert(friends).values({
        userId: smallId,
        friendId: bigId,
      });
    } else {
      await db.insert(friendRequests).values({
        fromUserId: userId,
        toUserId: friend[0].id,
      });
    }

    return true;
  });

  revalidatePath("/friends");

  return success;
}
