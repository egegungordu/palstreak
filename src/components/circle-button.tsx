import { cn } from "../lib/utils";
import { ComponentProps } from "react";

import { LuLoader } from "react-icons/lu";

export default function CircleButton({
  children,
  className,
  loading = false,
  ...props
}: ComponentProps<"button"> & {loading?: boolean}) {
  return (
    <button
      className={cn(
        "ml-auto rounded-full p-2.5 border border-border bg-foreground hover:bg-foreground-dark shadow-shadow transition-all",
        className,
      )}
      {...props}
    >
      {children}

      {loading && (
        <div className="absolute inset-0 bg-neutral-800/50 grid place-items-center">
          <LuLoader className="w-5 h-5 animate-spin text-neutral-200" />
        </div>
      )}
    </button>
  );
}
