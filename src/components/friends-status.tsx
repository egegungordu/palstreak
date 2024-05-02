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
  return (
    <div className="flex gap-2 w-full max-w-screen-md items-center relative">
      <div
        className="overflow-hidden w-full relative">
        <div className="flex">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-center min-w-36 select-none group"
            >
              <div className="rounded-full p-1 bg-foreground shadow relative isolate">
                <div className="w-[42px] h-[42px] bg-foreground-darker rounded-full animate-pulse"></div>
              </div>

              <div>
                <div className="rounded-md w-14 h-4 bg-foreground-darker animate-pulse"/>
                <div className="rounded-md w-8 h-4 bg-foreground-darker mt-1 animate-pulse"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
