"use client";

import { LuCheck, LuCircleEllipsis, LuMoreVertical, LuX } from "react-icons/lu";
import CircleButton from "./circle-button";
import { HiMiniArrowDownLeft, HiMiniArrowUpRight } from "react-icons/hi2";
import Avatar from "boring-avatars";
import Tooltip from "./tooltip";
import FriendEntry from "./friend-entry";

export default function NormalFriendEntry({
  friend,
}: {
  friend: {
    id: string;
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  };
}) {

  return (
    <FriendEntry friend={friend}>
      <Tooltip
        content="Manage"
        side="top"
      >
        <CircleButton>
          <LuMoreVertical className="w-4 h-4 text-text-faded" />
        </CircleButton>
      </Tooltip>
    </FriendEntry>
  );
}
