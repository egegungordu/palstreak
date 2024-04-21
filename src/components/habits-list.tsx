import HabitCard from "./habit-card";

export default function HabitsList() {
  return (
    <div className="flex flex-col gap-4">
      <HabitCard title="Read 30 minutes of Japanese novels" />
      <HabitCard title="Read 30 minutes of Japanese novels" />
    </div>
  );
}
