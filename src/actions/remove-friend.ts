"use server";

import { db } from "@/db";
import { friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { and, eq, or, sql } from "drizzle-orm";
import { sortIds } from "@/db/utils";
import { z } from "zod";

const removeFriendSchema = z.object({
  friendId: z.string(),
});

export default async function removeFriend(
  params: z.infer<typeof removeFriendSchema>,
) {
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

  await db.transaction(async (tx) => {
    const deletedFriend = await tx
      .delete(friends)
      .where(and(eq(friends.userId, smallId), eq(friends.friendId, bigId)))
      .returning();

    if (deletedFriend.length === 0) {
      return;
    }

    await db
      .update(users)
      .set({
        friendCount: sql`${users.friendCount} - 1`,
      })
      .where(or(eq(users.id, smallId), eq(users.id, bigId)));
  });

  revalidatePath("/friends");
}
