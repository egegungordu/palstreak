"use client";

import { getIncomingRequestsQuery } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuTrophy, LuUser2, LuUsers2 } from "react-icons/lu";

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
    href: "/leaderboard",
    Icon: LuTrophy,
    name: "Leaderboard",
  },
  {
    href: `/user/${username}`,
    Icon: LuUser2,
    name: "Profile",
  },
];

export default function MobileBottomNavbar() {
  const pathname = usePathname();

  const { data } = useQuery(getIncomingRequestsQuery);

  const { data: session } = useSession();

  return (
    <>
      <div className="h-14 md:hidden" />
      <div className="h-14 fixed md:hidden bottom-0 left-0 bg-background border-t border-border w-full flex gap-1 justify-around p-1">
        {generateLinks(session?.user.username ?? "").map(
          ({ href, Icon, name }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "rounded-lg relative flex-1 flex gap-1 flex-col items-center justify-center text-text-faded hover:text-text-strong transition-colors",
                {
                  "text-text-strong bg-foreground font-medium":
                    pathname === href,
                },
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="text-2xs leading-none">{name}</span>

              {name === "Friends" && data && data.count > 0 && (
                <>
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                </>
              )}
            </Link>
          ),
        )}
      </div>
    </>
  );
}
