import { cn } from "../lib/utils";
import { ComponentProps } from "react";

export default function Button({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 bg-neutral-800 text-neutral-200 shadow hover:bg-neutral-800/90 px-4 py-2",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
