"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { resolvedTheme = "" } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-8 h-8">
      {isMounted && (
        <img
          src={
            resolvedTheme === "light"
              ? "/palstreak-light.svg"
              : "/palstreak-dark.svg"
          }
          className="h-8 w-8 group-hover:brightness-110 transition-all animate-logo-show"
          alt=""
        />
      )}
    </div>
  );
}
