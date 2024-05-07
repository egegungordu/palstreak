"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuTrophy, LuUsers2 } from "react-icons/lu";
import AccountDropdown from "./account-dropdown";

const LINKS = [
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
];

export default function MobileBottomNavbar() {
  const pathname = usePathname();

  return (
    <>
      <div className="h-14 md:hidden" />
      <div className="h-14 fixed md:hidden bottom-0 left-0 bg-background border-t border-border w-full flex gap-1 justify-around p-1">
        {LINKS.map(({ href, Icon, name }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-lg flex-1 flex gap-1 flex-col items-center justify-center text-text-faded hover:text-text-strong transition-colors",
              {
                "text-text-strong bg-foreground font-medium": pathname === href,
              },
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-2xs leading-none">{name}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
