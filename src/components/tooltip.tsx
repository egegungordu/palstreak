"use client";

import React, { ComponentProps } from "react";
import * as _Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

type Side = ComponentProps<typeof _Tooltip.Content>["side"];

export default function Tooltip({
  children,
  tooltipClassName,
  content,
  side = "top",
  show = true,
  asChild = true,
}: {
  children: React.ReactNode;
  tooltipClassName?: string;
  content?: string;
  side?: Side;
  show?: boolean;
  asChild?: boolean;
}) {
  return (
    <_Tooltip.Provider>
      <_Tooltip.Root delayDuration={100}>
        <_Tooltip.Trigger asChild={asChild}>{children}</_Tooltip.Trigger>
        <_Tooltip.Portal>
          {show && (
            <_Tooltip.Content
              className={cn(
                "select-none rounded-md text-xs bg-foreground px-4 py-2 leading-none shadow shadow-shadow border border-border will-change-[transform,opacity]",
                tooltipClassName,
              )}
              sideOffset={5}
              side={side}
            >
              {content}
              <_Tooltip.Arrow className="fill-foreground" />
            </_Tooltip.Content>
          )}
        </_Tooltip.Portal>
      </_Tooltip.Root>
    </_Tooltip.Provider>
  );
}
