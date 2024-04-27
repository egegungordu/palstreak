"use server";

import { db } from "@/db";
import { friendRequests, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export default async function sendFriendRequest({
  friendUsername,
}: {
  friendUsername: string;
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
    const friend = await tx
      .select()
      .from(users)
      .where(eq(users.username, friendUsername));

    if (friend.length === 0) {
      return;
    }

    await db.insert(friendRequests).values({
      fromUserId: userId,
      toUserId: friend[0].id,
    });
  });

  revalidatePath("/friends");
}
