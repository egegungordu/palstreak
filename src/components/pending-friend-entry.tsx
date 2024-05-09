"use client";

import { LuArrowUpRight, LuCheck, LuX } from "react-icons/lu";
import CircleButton from "./circle-button";
import { HiMiniArrowDownLeft, HiMiniArrowUpRight } from "react-icons/hi2";
import Tooltip from "./tooltip";
import FriendEntry from "./friend-entry";
import { useTransition } from "react";
import acceptFriendRequest from "@/actions/accept-friend-request";
import declineFriendRequest from "@/actions/decline-friend-request";
import withdrawFriendRequest from "@/actions/withdraw-friend-request";
import { toast } from "sonner";

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

  const handleAccept = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startAcceptTransition(async () => {
      await acceptFriendRequest({ friendId: friend.id });

      toast.success("Friend request accepted!", {
        description: "The friend request has been successfully accepted.",
      });
    });
  };
  const handleDecline = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startDeclineTransition(async () => {
      await declineFriendRequest({ friendId: friend.id });

      toast.success("Friend request declined!", {
        description: "The friend request has been successfully declined.",
      });
    });
  };
  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    startWithdrawTransition(async () => {
      await withdrawFriendRequest({ friendId: friend.id });

      toast.success("Friend request withdrawn!", {
        description: "The friend request has been successfully withdrawn.",
      });
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
            <LuArrowUpRight className="text-green-500 size-3.5 rotate-180" />
          ) : (
            <LuArrowUpRight className="text-green-500 size-3.5" />
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
