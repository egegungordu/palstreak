import EditHabitsButton from "./edit-habits-button";
import { type Habit } from "@/app/page";

export default function HabitsHeader({ habits }: { habits: Habit[] }) {
  return (
    <div className="flex w-full justify-end">
      <EditHabitsButton />
    </div>
  );
}
