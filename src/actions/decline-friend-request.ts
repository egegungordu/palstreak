"use server";

import { db } from "@/db";
import { friendRequests, friends } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { sortIds } from "@/db/utils";

export default async function declineFriendRequest({
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

  const deletedFriendRequest = await db
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

  revalidatePath("/friends");
}
