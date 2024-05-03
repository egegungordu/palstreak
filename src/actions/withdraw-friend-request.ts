"use server";

import { db } from "@/db";
import { friendRequests } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

const withdrawFriendRequestSchema = z.object({
  friendId: z.string(),
});

export default async function withdrawFriendRequest(
  params: z.infer<typeof withdrawFriendRequestSchema>,
) {
  const { friendId } = withdrawFriendRequestSchema.parse(params);

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
        eq(friendRequests.fromUserId, userId),
        eq(friendRequests.toUserId, friendId),
      ),
    )
    .returning();

  if (deletedFriendRequest.length === 0) {
    return;
  }

  revalidatePath("/friends");
}
