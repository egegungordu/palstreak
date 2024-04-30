import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, friends, friendRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import NormalFriendEntry from "./normal-friend-entry";
import PendingFriendEntry from "./pending-friend-entry";
import { LuSquirrel } from "react-icons/lu";

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
      id: user.id,
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

export default async function FriendsTabs() {
  const allFriends = await getAllFriends();
  const pendingFriends = await getPendingFriends();

  return (
    <Tabs defaultValue="All">
      <TabsList>
        <TabsTrigger value="All">All</TabsTrigger>
        <TabsTrigger value="Pending" className="relative">
          Pending
          {pendingFriends.length > 0 && (
            <>
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </>
          )}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="All">
        {allFriends.length > 0 && (
          <div className="ml-4 mt-4 mb-4 text-xs text-text-faded">
            {allFriends.length} friends
          </div>
        )}
        {allFriends.map((friend) => (
          <NormalFriendEntry key={friend.id} friend={friend} />
        ))}
        {allFriends.length === 0 && (
          <div className="mt-4 text-text-disabled text-center">
            <LuSquirrel className="mx-auto w-12 h-12 text-foreground-darker mb-6" />
            No friends yet. Add some friends to see them here.
          </div>
        )}
      </TabsContent>
      <TabsContent value="Pending">
        {pendingFriends.length > 0 && (
          <div className="ml-4 mt-4 mb-4 text-xs text-text-faded">
            {pendingFriends.length} requests
          </div>
        )}
        {pendingFriends.map((friend) => (
          <PendingFriendEntry key={friend.id} friend={friend} />
        ))}
        {pendingFriends.length === 0 && (
          <div className="mt-4 text-text-disabled text-center">
            <LuSquirrel className="mx-auto w-12 h-12 text-foreground-darker mb-6" />
            No pending friend requests.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
