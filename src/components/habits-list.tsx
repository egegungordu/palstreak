import { db } from "@/db";
import HabitCard from "./habit-card";
import { habit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import AddHabit from "./add-habit";

export default async function HabitsList() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return null;
  }

  const habits = await db.select().from(habit).where(
    eq(habit.userId, session.user.id)
  );

  return (
    <div className="flex flex-col gap-4 items-center">
      {habits.map((habit) => (
        <HabitCard key={habit.id} title={habit.name} color="#000" streaks={habit.streaks} />
      ))}

      <AddHabit />
    </div>
  );
}
