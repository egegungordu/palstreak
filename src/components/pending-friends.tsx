import { db } from "@/db";
import { friendRequests, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import FriendEntry from "./friend-entry";
import PendingFriendEntry from "./pending-friend-entry";

async function getPendingFriends() {
  const session = await auth();

  if (!session) {
    return [];
  }

  const outgoingRequests = await db
    .select()
    .from(friendRequests)
    .where(eq(friendRequests.fromUserId, session.user.id))
    .innerJoin(users, eq(friendRequests.toUserId, users.id));

  const incomingRequests = await db
    .select()
    .from(friendRequests)
    .where(eq(friendRequests.toUserId, session.user.id))
    .innerJoin(users, eq(friendRequests.fromUserId, users.id));

  return [...outgoingRequests, ...incomingRequests].map(
    ({ friendRequest, user }) => ({
      id: friendRequest.id,
      direction:
        friendRequest.fromUserId === session.user.id
          ? ("outgoing" as const)
          : ("incoming" as const),
      username: user.username,
      longestCurrentStreak: user.longestCurrentStreak,
      image: user.image,
    }),
  );
}

export default async function PendingFriends() {
  const friends = await getPendingFriends();

  return (
    <div>
      {friends.map((friend) => (
        <PendingFriendEntry key={friend.id} friend={friend} />
      ))}
    </div>
  );
}
