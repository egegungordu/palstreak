import FriendsCard from "@/components/friends-card";
import HabitsList from "@/components/habits-list";
import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

async function getHabits(userId: string) {
  let habits = await db.select().from(habit).where(eq(habit.userId, userId));

  // fill empty streaks
  habits = habits.map((habit) => {
    const startDate = habit.createdAt;

    const streaks = Array.from({ length: 7 * 52 }).map((_, i) => ({
      // make date from start by adding days
      date:
        habit.streaks[i]?.date ||
        new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      value: habit.streaks[i]?.value || 0,
    }));

    return {
      ...habit,
      streaks,
    };
  });

  return habits.sort((a, b) => a.order - b.order);
}

export type Habit = Awaited<ReturnType<typeof getHabits>>[0];

async function Habits() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return null;
  }

  const habits = await getHabits(session.user.id);

  return <HabitsList habits={habits} />;
}

export default async function Home() {
  const session = await auth();

  if (session && !session.user.onboardingFinished) {
    redirect("/onboarding");
  }

  return (
    <main className="flex flex-col items-center gap-4 py-8 px-2 pt-20">
      <FriendsCard />

      <div className="mt-2" />

      <Habits />

      <div className="mt-2" />
    </main>
  );
}
