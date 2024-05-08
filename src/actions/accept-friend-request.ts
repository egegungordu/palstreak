"use server";

import { db } from "@/db";
import { friendRequests, friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { or, and, eq, sql } from "drizzle-orm";
import { sortIds } from "@/db/utils";
import { z } from "zod";

const acceptFriendRequestSchema = z.object({
  friendId: z.string(),
});

export default async function acceptFriendRequest(
  params: z.infer<typeof acceptFriendRequestSchema>,
) {
  const { friendId } = acceptFriendRequestSchema.parse(params);

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

    await db.update(users).set({
      friendCount: sql`${users.friendCount} + 1`,
    }).where(or(eq(users.id, smallId), eq(users.id, bigId)));
  });

  revalidatePath("/friends");
}
