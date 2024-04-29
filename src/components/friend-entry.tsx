"use client";

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
        <Avatar
          size={44}
          name={friend.username || ""}
          variant="beam"
          colors={["#fee9a6", "#fec0ab", "#fa5894", "#660860", "#9380b7"]}
        />
      </div>

      {friend.username}

      {children}
    </div>
  );
}
