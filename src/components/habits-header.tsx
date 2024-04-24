import EditHabitsButton from "./edit-habits-button";
import { Habit } from "./habits-list";

export default function HabitsHeader({ habits }: { habits: Habit[] }) {
  return (
    <div className="flex w-full justify-end">
      <EditHabitsButton />
    </div>
  );
}
