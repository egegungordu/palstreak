import { cn } from "../lib/utils";
import { ComponentProps, forwardRef } from "react";

import { LuLoader } from "react-icons/lu";

const CircleButton = forwardRef<HTMLButtonElement, ComponentProps<'button'> & { loading?: boolean }>(
  function CircleButton({ children, className, loading = false, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-full relative p-2.5 border border-border bg-foreground hover:bg-foreground-dark shadow-shadow transition-all isolate overflow-hidden',
          className,
        )}
        {...props}
      >
        {children}

        {loading && (
          <div className="absolute inset-0 bg-neutral-800/30 grid place-items-center">
            <LuLoader className="w-5 h-5 animate-spin text-neutral-200" />
          </div>
        )}
      </button>
    );
  }
);

export default CircleButton;
