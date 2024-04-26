import { db } from "@/db";
import HabitCard from "./habit-card";
import { habit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import AddHabit from "./add-habit";
import HabitsHeader from "./habits-header";

async function getHabits(userId: string) {
  let habits = await db.select().from(habit).where(eq(habit.userId, userId));

  // fill empty streaks
  habits = habits.map((habit) => {
    const startDate = habit.createdAt;

    const streaks = Array.from({ length: 7 * 52 }).map((_, i) => ({
      // make date from start by adding days
      date: habit.streaks[i]?.date || new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      value: habit.streaks[i]?.value || 0,
    }));

    return {
      ...habit,
      streaks,
    };
  });

  return habits;
}

export type Habit = Awaited<ReturnType<typeof getHabits>>[0];

export default async function HabitsList() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return null;
  }

  const habits = await getHabits(session.user.id);

  return (
    <div className="flex flex-col gap-3 items-center">
      {/*<HabitsHeader habits={habits} />*/}

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}

      <AddHabit />
    </div>
  );
}
