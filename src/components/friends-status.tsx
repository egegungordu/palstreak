import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, friends } from "@/db/schema";
import { eq } from "drizzle-orm";
import FriendsStatusList from "./friends-status-list";

async function getAllFriends() {
  const session = await auth();

  if (!session) {
    return [];
  }

  const dbFriends = await db
    .select({ user: users })
    .from(users)
    .leftJoin(friends, eq(users.id, friends.userId))
    .where(eq(friends.friendId, session.user.id))
    .union(
      db
        .select({ user: users })
        .from(users)
        .leftJoin(friends, eq(users.id, friends.friendId))
        .where(eq(friends.userId, session.user.id)),
    );

  return dbFriends
    .map(({ user }) => ({
      id: user.id,
      username: user.username,
      longestCurrentStreak: user.longestCurrentStreak,
      image: user.image,
    }))
    .sort((a, b) => b.longestCurrentStreak - a.longestCurrentStreak);
}

export default async function FriendsStatus() {
  const friends = await getAllFriends()

  return <FriendsStatusList friends={friends} />;
}

export function FriendsStatusSkeleton() {
  return <div></div>;
}
