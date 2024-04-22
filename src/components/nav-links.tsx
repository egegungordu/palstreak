"use client";

import { Pencil2Icon, FaceIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { name: "Home", href: "/", icon: Pencil2Icon },
  { name: "Friends", href: "/friends", icon: FaceIcon },
];

export default function NavLinks() {
  const path = usePathname();

  return (
    <ul className="flex gap-2">
      {LINKS.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            className={cn(
              "text-neutral-400 hover:text-neutral-200 flex items-center px-2 py-1.5 rounded-md",
              path === link.href && "text-neutral-100 font-medium shadow"
            )}
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
