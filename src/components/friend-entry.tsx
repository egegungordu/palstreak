"use client";

import { AVATAR_COLORS } from "@/globals";
import Avatar from "boring-avatars";

export default function FriendEntry({
  friend,
  children,
}: {
  friend: {
    id: string;
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  };
  children: React.ReactNode;
}) {
  return (
    <div
      key={friend.id}
      className="flex items-center rounded-xl hover:bg-background-button-hover p-4 transition-colors"
    >
      <div className="mr-4 relative rounded-full shadow shadow-shadow max-w-fit after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
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

      {friend.username}

      {children}
    </div>
  );
}
