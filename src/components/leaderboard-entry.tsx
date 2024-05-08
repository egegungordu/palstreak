"use client";

import { AVATAR_COLORS } from "@/globals";
import { cn } from "@/lib/utils";
import Avatar from "boring-avatars";
import { FaMedal } from "react-icons/fa";

export default function LeaderboardEntry({
  friend,
  children,
  rank,
}: {
  friend: {
    id: string;
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  };
  children?: React.ReactNode;
  rank: number;
}) {
  return (
    <div
      className={cn(
        "flex col-span-2 items-center rounded-xl gap-4 hover:bg-background-button-hover p-4 transition-colors",
        "first:flex-col first:gap-2 [&:first-child>div]:text-text-strong [&:first-child>div]:text-xl [&:first-child>div]:font-semibold [&:first-child>span]:mr-0",
        "[&:nth-child(2)]:flex-col [&:nth-child(2)]:gap-2 [&:nth-child(2)]:col-span-1 [&:nth-child(2)>div]:text-text-strong [&:nth-child(2)>div]:text-xl [&:nth-child(2)>div]:font-semibold [&:nth-child(2)>span]:mr-0",
        "[&:nth-child(3)]:flex-col [&:nth-child(3)]:gap-2 [&:nth-child(3)]:col-span-1 [&:nth-child(3)>div]:text-text-strong [&:nth-child(3)>div]:text-xl [&:nth-child(3)>div]:font-semibold [&:nth-child(3)>span]:mr-0",
      )}
    >
      <div className="text-text-faded flex gap-1 items-center">
        {rank <= 3 && (
          <FaMedal
            className={cn("w-5 h-5 drop-shadow-md", {
              "text-gold": rank === 1,
              "text-silver": rank === 2,
              "text-bronze": rank === 3,
            })}
          />
        )}
        {rank}
      </div>

      <div className="relative rounded-full shadow shadow-shadow max-w-fit after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
        {friend.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={friend.image}
            alt="Profile picture"
            className="rounded-full w-[44px] h-[44px] shrink-0"
          />
        ) : (
          <Avatar
            size={44}
            name={friend.username || ""}
            variant="marble"
            colors={AVATAR_COLORS}
          />
        )}
      </div>

      <span className="mr-auto">{friend.username}</span>

      {children}
    </div>
  );
}

export function LeaderboardEntryEmpty({ rank }: { rank: number }) {
  return (
    <div
      className={cn(
        "flex col-span-2 items-center rounded-xl gap-4 hover:bg-background-button-hover p-4 transition-colors",
        "first:flex-col first:gap-2 [&:first-child>div]:text-text-strong [&:first-child>div]:text-xl [&:first-child>div]:font-semibold [&:first-child>span]:mr-0",
        "[&:nth-child(2)]:flex-col [&:nth-child(2)]:gap-2 [&:nth-child(2)]:col-span-1 [&:nth-child(2)>div]:text-text-strong [&:nth-child(2)>div]:text-xl [&:nth-child(2)>div]:font-semibold [&:nth-child(2)>span]:mr-0",
        "[&:nth-child(3)]:flex-col [&:nth-child(3)]:gap-2 [&:nth-child(3)]:col-span-1 [&:nth-child(3)>div]:text-text-strong [&:nth-child(3)>div]:text-xl [&:nth-child(3)>div]:font-semibold [&:nth-child(3)>span]:mr-0",
      )}
    >
      <div className="text-text-faded flex gap-1 items-center">
        {rank <= 3 && (
          <FaMedal
            className={cn("w-5 h-5 drop-shadow-md", {
              "text-gold": rank === 1,
              "text-silver": rank === 2,
              "text-bronze": rank === 3,
            })}
          />
        )}
        {rank}
      </div>

      <div className="relative rounded-full shadow shadow-shadow max-w-fit after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
        <div className="size-[44px] rounded-full bg-foreground-darker" />
      </div>

      <span className="w-14 h-4 rounded-md bg-foreground-dark" />

      <div className="w-20 h-4 rounded-md bg-foreground-dark" />
    </div>
  );
}
