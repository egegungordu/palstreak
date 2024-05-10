"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Speed = "fast" | "normal" | "slow";

const SPEEDS: Record<Speed, number> = {
  fast: 0.6,
  normal: 0.4,
  slow: 0.2,
};

export default function FakeLoadingBar({
  speed = "normal",
  show = true,
  className,
}: {
  speed?: Speed;
  show?: boolean;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);

    const timeout = setTimeout(() => {
      setProgress(30);
    }, 200);

    const interval = setInterval(() => {
      setProgress((prev) => prev + (100 - prev) * SPEEDS[speed]);
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [speed, show]);

  return (
    <div
      key={`${speed}-${show}`}
      className={cn(
        "h-1.5 bg-background shadow-inner border border-border rounded-lg overflow-hidden opacity-0",
        show && "opacity-100",
        className,
      )}
    >
      <div
        className="h-full bg-text-strong transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
