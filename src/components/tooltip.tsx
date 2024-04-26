import React, { ComponentProps } from "react";
import * as _Tooltip from "@radix-ui/react-tooltip";

type Side = ComponentProps<typeof _Tooltip.Content>["side"];

export default function Tooltip({
  children,
  content,
  side = "top",
}: {
  children: React.ReactNode;
  content?: string;
  side?: Side;
}) {
  return (
    <_Tooltip.Provider>
      <_Tooltip.Root delayDuration={200}>
        <_Tooltip.Trigger asChild>{children}</_Tooltip.Trigger>
        <_Tooltip.Portal>
          <_Tooltip.Content
            className="select-none rounded-md text-xs bg-white px-4 py-2 leading-none shadow will-change-[transform,opacity]"
            sideOffset={5}
            side={side}
          >
            {content}
            <_Tooltip.Arrow className="fill-white" />
          </_Tooltip.Content>
        </_Tooltip.Portal>
      </_Tooltip.Root>
    </_Tooltip.Provider>
  );
}