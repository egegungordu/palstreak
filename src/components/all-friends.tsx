import { db } from "@/db";
import { friends, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import Avatar from "boring-avatars";
import NormalFriendEntry from "./normal-friend-entry";

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

  return dbFriends.map(({ user }) => ({
    id: user.id,
    username: user.username,
    longestCurrentStreak: user.longestCurrentStreak,
    image: user.image,
  }));
}

export default async function AllFriends() {
  const friends = await getAllFriends();

  return (
    <div>
      {friends.map((friend) => (
        <NormalFriendEntry key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
