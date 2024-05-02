import AddHabitButton from "@/components/add-habit-button";
import HabitsList from "@/components/habits-list";
import Loader from "@/components/loader";
import Logo from "@/components/logo";
import MockHabitCard from "@/components/mock-habit-card";
import { db } from "@/db";
import { habit } from "@/db/schema";
import { auth, signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";
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

const MOCK_HABIT1 = {
  id: "1",
  name: "Drink water",
  userId: "1",
  order: 0,
  color: "#a5b4fc",
  createdAt: new Date(),
  // streaks: Record<number, {
  //     date: Date;
  //     value: number;
  // }>;
  streaks: Object.fromEntries(
    Array.from({ length: 7 * 52 }).map((_, i) => [
      i,
      {
        date: new Date(),
        value: Math.floor(Math.random() * 2),
      },
    ]),
  ),
  streak: 5,
  longestStreak: 7,
  lastCompletedAt: new Date(),
  timezoneOffset: 0,
};

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <main className="w-full max-w-screen-lg mx-auto relative isolate h-full overflow-hidden px-4">
        {/* TODO: do this with svgs or canvas, this might be slow on mobile */}
        <div
          className="absolute grid grid-cols-12 gap-2 -z-10 -top-10 min-w-[500px] w-full left-1/2 -translate-x-1/2"
          style={{
            maskImage: "linear-gradient(180deg, #000 20%, transparent 80%)",
          }}
        >
          {Array.from({ length: 12 * 5 }).map((_, idx) => (
            <div
              key={idx}
              style={{
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: '2s',
              }}
              className="w-full border border-border-grid aspect-square rounded-lg bg-landing-grid animate-pulse"
            />
          ))}
          <div className="absolute w-32 h-full bg-gradient-to-r from-background left-0 top-0" />
          <div className="absolute w-32 h-full bg-gradient-to-l from-background right-0 top-0" />
        </div>

        <Logo className="w-20 h-20 mx-auto mt-20" />

        <h1 className="text-center text-3xl sm:text-4xl font-bold mt-4">
          Track your habits with friends
        </h1>

        <div className="w-full flex flex-col items-center mt-6">
          <MockHabitCard habit={MOCK_HABIT1} />
        </div>

        <div className="flex mx-auto mt-8 items-center justify-center">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="mt-auto text-neutral-100 shadow shadow-shadow bg-sky-600 text-xs font-semibold rounded-full hover:brightness-110 transition-all px-4 py-2 flex items-center gap-2 hover:shadow-lg hover:scale-105 duration-150"
            >
              Start tracking your habits
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (session && !session.user.onboardingFinished) {
    redirect("/onboarding");
  }

  return (
    <main className="w-full pt-8 pb-4 mx-auto lg:mx-0 px-4 md:px-2 max-w-screen-sm flex flex-col items-center">
      <div className="flex items-center justify-between w-full self-start">
        <h1 className="font-bold text-lg">Habits</h1>

        <AddHabitButton />
      </div>

      <div className="mt-6" />

      <Suspense fallback={<Loader />}>
        <Habits />
      </Suspense>

      <div className="mt-2" />
    </main>
  );
}
