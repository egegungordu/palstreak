"use client";

import useIsMobile from "@/hooks/use-is-mobile";

export default function IsMobile({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return <>{isMobile ? children : null}</>;
}
