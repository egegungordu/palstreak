import AddFriendButton from "@/components/add-friend-button";
import AddHabitButton from "@/components/add-habit-button";
import FriendsCard from "@/components/friends-card";
import HabitsList from "@/components/habits-list";
import Loader from "@/components/loader";
import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function getHabits(userId: string) {
  // TODO: drizzle returns string for the date field in the jsonb column, fix this
  let habits = await db.select().from(habit).where(eq(habit.userId, userId));

  // fill empty streaks
  habits = habits.map((habit) => {
    const startDate = habit.createdAt;

    const streaks = Array.from({ length: 7 * 52 }).map((_, i) => ({
      // make date from start by adding days
      date: habit.streaks[i]?.date
        ? new Date(habit.streaks[i].date)
        : new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
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
    <main className="mx-auto py-8 px-2 pt-20 max-w-screen-md flex flex-col items-center">
      <FriendsCard />

      <div className="flex items-center justify-between w-full self-start mt-8">
        <h1 className="font-bold text-lg">Habits</h1>

        <AddHabitButton />
      </div>

      <div className="mt-6" />

      <Suspense fallback={<Loader />}>
        <Habits />
      </Suspense>

      <div className="mt-2" />
    </main>
  )
}
