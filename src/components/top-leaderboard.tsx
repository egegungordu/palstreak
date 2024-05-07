import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, friends } from "@/db/schema";
import { eq } from "drizzle-orm";
import TopLeaderboardList from "./top-leaderboard-list";
import Link from "next/link";
import { LuUsers2 } from "react-icons/lu";

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

  // no friends :(
  if (leaderboardUsers.length <= 1) {
    return (
      <div className="mt-6 text-text-disabled text-center text-xs">
        <LuUsers2 className="mx-auto w-10 h-10 text-foreground-darker mb-4" />
        <Link href="/friends">
          <span className="underline text-text">Add friends</span>
        </Link>{" "}
        to see them on the leaderboard!
      </div>
    );
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
    <div className="flex gap-2 w-full max-w-screen-md items-center relative">
      <div className="overflow-hidden w-full relative">
        <div className="flex flex-col gap-1"
          style={{
            maskImage: "linear-gradient(180deg, black 30%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(180deg, black 30%, transparent 90%)",
            }}
        >
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex gap-2 w-full items-center select-none group py-2 animate-pulse"
            >
              <div className="font-semibold tabular-nums text-xs w-6 aspect-square flex items-center justify-center text-text-disabled">
                {idx + 1}
              </div>

              <div className="w-9 h-9 pl-2 bg-foreground-darker rounded-full animate-pulse"></div>

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
