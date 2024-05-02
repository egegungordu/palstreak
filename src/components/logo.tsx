"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo({ className }: { className?: string }) {
  const { resolvedTheme = "" } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className={cn("w-8 h-8", className)}>
      {isMounted && (
        <img
          src={
            resolvedTheme === "light"
              ? "/palstreak-light.svg"
              : "/palstreak-dark.svg"
          }
          className={cn("h-8 w-8 group-hover:brightness-110 transition-all", className)}
          alt=""
        />
      )}
    </div>
  );
}
