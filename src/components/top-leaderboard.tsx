import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, friends } from "@/db/schema";
import { eq } from "drizzle-orm";
import TopLeaderboardList from "./top-leaderboard-list";

async function getLeaderboardTop10() {
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

  const me = (
    await db.select().from(users).where(eq(users.id, session.user.id))
  ).map((a) => ({
    user: a,
  }));

  return [...dbFriends, ...me]
    .map(({ user }) => ({
      id: user.id,
      username: user.username,
      longestCurrentStreak: user.longestCurrentStreak,
      image: user.image,
    }))
    .sort((a, b) => b.longestCurrentStreak - a.longestCurrentStreak)
    .slice(0, 10);
}

export default async function TopLeaderboard() {
  const leaderboardUsers = await getLeaderboardTop10();
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return (
    <TopLeaderboardList
      leaderboardUsers={leaderboardUsers}
      username={session.user.username || ""}
    />
  );
}

export function TopLeaderboardSkeleton() {
  return (
    <div className="flex gap-2 w-full items-center relative">
      <div className="overflow-hidden w-full relative">
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-center min-w-36 select-none group"
            >
              <div className="font-semibold tabular-nums text-text-disabled">
                {idx + 1}.
              </div>

              <div className="rounded-full p-1 bg-foreground shadow relative isolate">
                <div className="w-8 h-8 bg-foreground-darker rounded-full animate-pulse"></div>
              </div>

              <div>
                <div className="rounded-md w-14 h-4 bg-foreground-darker animate-pulse" />
                <div className="rounded-md w-8 h-4 bg-foreground-darker mt-1 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
