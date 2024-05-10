"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuTrophy, LuUser2, LuUsers2 } from "react-icons/lu";
import Tooltip from "./tooltip";
import Sidebar from "./sidebar";
import { useSession } from "next-auth/react";
import AccountDropdown from "./account-dropdown";
import { useQuery } from "@tanstack/react-query";
import { getIncomingRequestsQuery } from "@/lib/queries";

const generateLinks = (username: string) => [
  {
    href: "/",
    Icon: LuHome,
    name: "Home",
  },
  {
    href: "/friends",
    Icon: LuUsers2,
    name: "Friends",
  },
  {
    href: `/user/${username}`,
    Icon: LuUser2,
    name: "Profile",
  },
  {
    href: "/leaderboard",
    Icon: LuTrophy,
    name: "Leaderboard",
  },
];

export default function LeftSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const { data } = useQuery(getIncomingRequestsQuery);

  return (
    <Sidebar className="sticky h-[calc(100vh_-_6.5rem)] top-14 border-r border-border w-10 xl:w-48 hidden md:block p-1.5 py-6 shrink-0 box-content">
      <div className="flex flex-col gap-1 h-full">
        {generateLinks(session?.user.username ?? "").map(
          ({ href, Icon, name }) => (
            <Tooltip
              key={href}
              content={name}
              side="right"
              tooltipClassName="xl:hidden"
            >
              <Link
                href={href}
                className={cn(
                  "flex gap-2 w-full text-text-faded items-center rounded-md px-3 h-10 hover:text-text-strong transition-colors relative",
                  {
                    "text-text-strong font-semibold bg-foreground-dark":
                      pathname === href,
                  },
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="xl:block hidden">{name}</span>

                {name === "Friends" && data && data.count > 0 && (
                  <>
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                  </>
                )}
              </Link>
            </Tooltip>
          ),
        )}

        <div className="flex-1" />

        {session && <AccountDropdown session={session} />}
      </div>
    </Sidebar>
  );
}
