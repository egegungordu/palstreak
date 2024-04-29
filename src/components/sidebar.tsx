"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuHome, LuUsers2 } from "react-icons/lu";
import Tooltip from "./tooltip";

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
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-full fixed shadow shadow-shadow border-r border-border w-10 xl:w-56 bg-foreground hidden lg:block p-1.5 shrink-0 box-content z-10">
      <div className="h-14" />

      <div className="flex flex-col gap-1">
        {LINKS.map(({ href, Icon, name }) => (
          <Tooltip key={href} content={name} side="right" tooltipClassName="xl:hidden">
            <Link
              href={href}
              className={cn(
                "flex gap-2 w-full text-text-faded items-center rounded-md px-3 h-10 hover:text-text-strong transition-colors",
                {
                  "text-text-strong font-semibold bg-foreground-dark":
                    pathname === href,
                },
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="xl:block hidden">{name}</span>
            </Link>
          </Tooltip>
        ))}
      </div>
    </aside>
  );
}
