"use client";

import { LuCheck, LuX } from "react-icons/lu";
import CircleButton from "./circle-button";
import { HiMiniArrowDownLeft, HiMiniArrowUpRight } from "react-icons/hi2";
import Avatar from "boring-avatars";
import Tooltip from "./tooltip";
import FriendEntry from "./friend-entry";

export default function PendingFriendEntry({
  friend,
}: {
  friend: {
    id: string;
    direction: "outgoing" | "incoming";
    username: string | null;
    longestCurrentStreak: number;
    image: string | null;
  };
}) {
  const handleAccept = () => {};
  const handleDecline = () => {};
  const handleWithdraw = () => {};

  return (
    <FriendEntry friend={friend}>
      <div className="bg-foreground p-0.5 rounded-md shadow shadow-shadow text-2xs flex items-center ml-2 mr-auto">
        <Tooltip
          content={
            friend.direction === "incoming"
              ? "Incoming friend request"
              : "Outgoing friend request"
          }
          side="right"
        >
          {friend.direction === "incoming" ? (
            <HiMiniArrowDownLeft className="text-green-500 w-4 h-4" />
          ) : (
            <HiMiniArrowUpRight className="text-sky-500 w-4 h-4" />
          )}
        </Tooltip>
      </div>

      {friend.direction === "incoming" && (
        <Tooltip content="Accept" side="top">
          <CircleButton onClick={handleAccept}>
            <LuCheck className="w-4 h-4 text-green-500" />
          </CircleButton>
        </Tooltip>
      )}

      <Tooltip
        content={friend.direction === "incoming" ? "Decline" : "Withdraw"}
        side="top"
      >
        <CircleButton
          onClick={
            friend.direction === "incoming" ? handleDecline : handleWithdraw
          }
        >
          <LuX className="w-4 h-4 text-red-500" />
        </CircleButton>
      </Tooltip>
    </FriendEntry>
  );
}
