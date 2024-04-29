import { cn } from "../lib/utils";
import { ComponentProps } from "react";

import { LuLoader } from "react-icons/lu";

export default function Button({
  children,
  className,
  loading = false,
  ...props
}: ComponentProps<"button"> & {loading?: boolean}) {
  return (
    <button
      className={cn(
        "inline-flex relative isolate overflow-hidden items-center justify-center whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 bg-text-strong text-foreground-dark hover:bg-text-faded shadow shadow-shadow px-4 py-2",
        className,
      )}
      {...props}
    >
      {children}

      {loading && (
        <div className="absolute inset-0 bg-neutral-800/30 grid place-items-center">
          <LuLoader className="w-5 h-5 animate-spin text-foreground" />
        </div>
      )}
    </button>
  );
}
