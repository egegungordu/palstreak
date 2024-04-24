"use client";

import { LuPencil } from "react-icons/lu";
import Tooltip from "./tooltip";
import { useHabitsStore } from "@/store/habits";
import { cn } from "@/lib/utils";

export default function EditHabitsButton() {
  const isInEditMode = useHabitsStore((state) => state.isInEditMode);
  const setIsInEditMode = useHabitsStore((state) => state.setIsInEditMode);

  return (
    <Tooltip content="Edit habits" side="right">
      <button
        onClick={() => setIsInEditMode(!isInEditMode)}
        className={cn("text-xs flex text-neutral-600 items-center p-1.5 rounded-md hover:bg-neutral-200 transition-colors", {
          "bg-neutral-200 shadow-inner": isInEditMode,
        })}
        aria-label="Edit habits"
      >
        <LuPencil className="w-3.5 h-3.5" />
      </button>
    </Tooltip>
  );
}
