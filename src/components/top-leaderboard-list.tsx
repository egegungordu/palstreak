"use client";

import Avatar from "boring-avatars";
import { cn } from "@/lib/utils";
import { AVATAR_COLORS } from "@/globals";
import Link from "next/link";

const streakColors = {
  // grey
  0: "#d1d5db",
  // yellow
  14: "#fcd34d",
};

function streakToColor(streak: number) {
  if (streak >= 14) {
    return streakColors[14];
  }
  return streakColors[0];
}

export default function TopLeaderboardList({
  leaderboardUsers,
  username,
}: {
  leaderboardUsers: {
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  }[];
  username: string;
}) {
  return (
    <div className="flex gap-2 w-full max-w-screen-md items-center relative">
      <div className="overflow-hidden w-full relative">
        <div className="flex flex-col gap-1">
          {leaderboardUsers.map((user, idx) => (
            <div key={idx} className="flex gap-1 w-full">
              <div
                className={cn(
                  "font-semibold tabular-nums text-xs w-6 aspect-square rounded-full flex items-center justify-center",
                  {
                    "bg-foregroundx-darker": idx <= 3,
                  },
                )}
              >
                {idx + 1}
              </div>

              <Link
                href={`/user/${user.username}`}
                className={cn(
                  "flex gap-2 items-center select-none group rounded-xl px-2 py-1.5 w-full hover:bg-foreground-dark",
                  {
                    "bg-foreground border border-border shadow shadow-shadow hover:bg-foreground":
                      user.username === username,
                  },
                )}
              >
                <div className="rounded-full p-1 bg-foreground shadow relative isolate">
                  {/*<div className="hidden text-text group-hover:grid absolute inset-0 w-full h-full place-items-center bg-foreground rounded-full font-bold">
                  {friend.progress * 100}%
                </div>*/}
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.image}
                      alt="Profile picture"
                      className="rounded-full w-8 h-8 shrink-0"
                    />
                  ) : (
                    <Avatar
                      size={32}
                      name={user.username ?? ""}
                      variant="marble"
                      colors={AVATAR_COLORS}
                    />
                  )}
                </div>

                <div>
                  <div className="font-medium text-xs">{user.username}</div>
                  <div className="text-text-faded text-xs mt-1">
                    <span
                      className="font-bold text-text-strong px-1 py-px rounded-md bg-foreground shadow shadow-shadow"
                      // style={{
                      //   backgroundColor: streakToColor(friend.streak),
                      // }}
                    >
                      {user.longestCurrentStreak}
                    </span>{" "}
                    days
                  </div>
                  <div className="relative bg-neutral-200 w-14 h-2 rounded-full hidden"></div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
