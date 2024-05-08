import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, friends } from "@/db/schema";
import { eq } from "drizzle-orm";
import { LuUsers2 } from "react-icons/lu";
import LeaderboardEntry, { LeaderboardEntryEmpty } from "./leaderboard-entry";

async function getLeaderboardUsers() {
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

  return [...dbFriends, ...me].map(({ user }) => ({
    id: user.id,
    username: user.username,
    longestCurrentStreak: user.longestCurrentStreak,
    consistencyScore: parseFloat(user.consistencyScore),
    image: user.image,
  }));
}

export default async function LeaderboardTabs() {
  // unsorted users
  const leaderboardUsers = await getLeaderboardUsers();
  const consistencyLeaderboard = leaderboardUsers
    .slice()
    .sort((a, b) => b.consistencyScore - a.consistencyScore);
  const streakLeaderboard = leaderboardUsers
    .slice()
    .sort((a, b) => b.longestCurrentStreak - a.longestCurrentStreak);
  const overallLeaderboard = leaderboardUsers
    .map((user) => ({
      ...user,
      overallScore: user.consistencyScore * user.longestCurrentStreak * 100,
    }))
    .sort((a, b) => b.overallScore - a.overallScore);

  return (
    <Tabs defaultValue="Overall">
      <TabsList>
        <TabsTrigger className="px-2 text-xs sm:text-sm" value="Overall">Overall</TabsTrigger>
        <TabsTrigger className="px-2 text-xs sm:text-sm" value="Consistency">Consistency</TabsTrigger>
        <TabsTrigger className="px-2 text-xs sm:text-sm" value="Streak">Streak</TabsTrigger>
      </TabsList>
      <TabsContent value="Overall" className="grid grid-cols-2 gap-2 pt-2">
        {overallLeaderboard.map((friend, index) => (
          <LeaderboardEntry key={friend.id} friend={friend} rank={index + 1}>
            <div className="tabular-nums">
              {friend.overallScore.toFixed(0)} points
            </div>
          </LeaderboardEntry>
        ))}
        {Array.from({ length: 3 - overallLeaderboard.length }).map((_, index) => (
          <LeaderboardEntryEmpty key={index} rank={index - overallLeaderboard.length + 3} />
        ))}
      </TabsContent>
      <TabsContent value="Consistency" className="grid grid-cols-2 gap-2 pt-2">
        {consistencyLeaderboard.map((friend, index) => (
          <LeaderboardEntry key={friend.id} friend={friend} rank={index + 1}>
            <div className="tabular-nums">{(friend.consistencyScore * 100).toFixed(1)} %</div>
          </LeaderboardEntry>
        ))}
        {Array.from({ length: 3 - consistencyLeaderboard.length }).map((_, index) => (
          <LeaderboardEntryEmpty key={index} rank={index - consistencyLeaderboard.length + 3} />
        ))}
      </TabsContent>
      <TabsContent value="Streak" className="grid grid-cols-2 gap-2 pt-2">
        {streakLeaderboard.map((friend, index) => (
          <LeaderboardEntry key={friend.id} friend={friend} rank={index + 1}>
            <div className="tabular-nums">
              {friend.longestCurrentStreak} days
            </div>
          </LeaderboardEntry>
        ))}
        {Array.from({ length: 3 - streakLeaderboard.length }).map((_, index) => (
          <LeaderboardEntryEmpty key={index} rank={index - streakLeaderboard.length + 3} />
        ))}
      </TabsContent>
    </Tabs>
  );
}
