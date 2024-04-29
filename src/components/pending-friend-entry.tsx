"use client";

import { LuCheck, LuX } from "react-icons/lu";
import CircleButton from "./circle-button";
import { HiMiniArrowDownLeft, HiMiniArrowUpRight } from "react-icons/hi2";
import Avatar from "boring-avatars";
import Tooltip from "./tooltip";
import FriendEntry from "./friend-entry";
import { useTransition } from "react";
import acceptFriendRequest from "@/actions/accept-friend-request";
import declineFriendRequest from "@/actions/decline-friend-request";
import withdrawFriendRequest from "@/actions/withdraw-friend-request";

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
  const [acceptPending, startAcceptTransition] = useTransition();
  const [declinePending, startDeclineTransition] = useTransition();
  const [withdrawPending, startWithdrawTransition] = useTransition();

  const handleAccept = () => {
    startAcceptTransition(async () => {
      await acceptFriendRequest({ friendId: friend.id });
    });
  };
  const handleDecline = () => {
    startDeclineTransition(async () => {
      await declineFriendRequest({ friendId: friend.id });
    });
  };
  const handleWithdraw = () => {
    startWithdrawTransition(async () => {
      await withdrawFriendRequest({ friendId: friend.id });
    });
  };

  return (
    <FriendEntry friend={friend}>
      <div className="bg-foreground p-0.5 rounded-md shadow shadow-shadow text-2xs flex items-center ml-2 mr-auto">
        <Tooltip
          asChild={false}
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
        <>
          <Tooltip content="Accept" side="top">
            <CircleButton loading={acceptPending} onClick={handleAccept}>
              <LuCheck className="w-4 h-4 text-green-500" />
            </CircleButton>
          </Tooltip>

          <Tooltip content="Decline" side="top">
            <CircleButton
              className="ml-2"
              loading={declinePending}
              onClick={handleDecline}
            >
              <LuX className="w-4 h-4 text-red-500" />
            </CircleButton>
          </Tooltip>
        </>
      )}

      {friend.direction === "outgoing" && (
        <Tooltip content="Withdraw" side="top">
          <CircleButton loading={withdrawPending} onClick={handleWithdraw}>
            <LuX className="w-4 h-4 text-red-500" />
          </CircleButton>
        </Tooltip>
      )}
    </FriendEntry>
  );
}
