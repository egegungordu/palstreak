import { Suspense } from "react";
import Sidebar from "./sidebar";
import TopLeaderboard, { TopLeaderboardSkeleton } from "./top-leaderboard";

export default function RightSidebarHome() {
  return (
    <Sidebar className="sticky h-full top-14 pt-8 mr-6 xl:mr-0 lg:w-48 shrink-0 hidden lg:block">
      <div className="text-text-faded text-xs px-4 mb-3">
        Streak Leaderboard
      </div>

      <Suspense fallback={<TopLeaderboardSkeleton />}>
        <TopLeaderboard />
      </Suspense>
    </Sidebar>
  );
}
