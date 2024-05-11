import signInAction from "@/actions/sign-in-action";
import Button from "@/components/button";
import EditProfileButton from "@/components/edit-profile-button";
import MockHabitCard from "@/components/mock-habit-card";
import RightSidebarEmpty from "@/components/right-sidebar-empty";
import Sidebar from "@/components/sidebar";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AVATAR_COLORS } from "@/globals";
import { auth } from "@/lib/auth";
import { relativeTime } from "@/lib/utils";
import Avatar from "boring-avatars";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { LuFlame, LuPencil, LuUsers2 } from "react-icons/lu";

const getUserByUsername = async (username: string) => {
  return await db.query.users
    .findFirst({
      columns: {
        username: true,
        image: true,
        lastActive: true,
        longestCurrentStreak: true,
        friendCount: true,
      },
      where: eq(users.username, username),
      with: {
        habits: {
          columns: {
            userId: false,
          },
        },
      },
    })
    .then((user) => {
      if (!user) {
        return null;
      }

      return {
        ...user,
        habits: user.habits.map((habit) => ({
          ...habit,
          streaks: Array.from({ length: 7 * 52 }).map((_, i) => ({
            date: habit.streaks[i]?.date
              ? new Date(habit.streaks[i].date)
              : new Date(habit.createdAt.getTime() + i * 24 * 60 * 60 * 1000),
            value: habit.streaks[i]?.value || 0,
          })),
        })).sort((a, b) => a.order - b.order),
      };
    })
};

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);
  const session = await auth();
  const isLoggedIn = session !== null;

  if (!user) {
    notFound();
  }

  return (
    <>
      <main className="w-full pt-8 pb-4 mx-auto lg:mx-0 px-4 md:px-2 max-w-screen-sm">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="shrink-0 size-20 sm:size-24 overflow-hidden isolate relative rounded-full shadow shadow-shadow max-w-fit after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile picture"
                className="rounded-full size-20 sm:size-24 shrink-0"
              />
            ) : (
              <Avatar
                size={96}
                name={user.username || ""}
                variant="marble"
                colors={AVATAR_COLORS}
              />
            )}
          </div>

          <div className="w-full min-w-0">
            <div className="text-2xl font-bold flex items-center gap-4 flex-wrap">
              <div className="overflow-hidden text-ellipsis">
                {user.username}
              </div>

              {user.username === session?.user.username &&  <EditProfileButton />}
            </div>
            <div className="text-text-faded text-xs mt-2">
              Last active {relativeTime({ date: user.lastActive })}
            </div>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 w-full">
              <div className="flex gap-1 items-center">
                <LuFlame className="w-4 h-4" />
                <span className="font-semibold">
                  {user.longestCurrentStreak}
                </span>{" "}
                days
              </div>

              <div className="flex gap-1 items-center">
                <LuUsers2 className="w-4 h-4" />
                <span className="font-semibold">{user.friendCount}</span>{" "}
                friends
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold">Habits</h2>
          <div className="mt-4 gap-2 grid grid-cols-1 sm:grid-cols-2">
            {user.habits.map((habit) => (
              <MockHabitCard weeks={52} showButton={false} key={habit.id} habit={habit} />
            ))}
          </div>
        </div>
      </main>
      {isLoggedIn ? (
        <RightSidebarEmpty />
      ) : (
        <Sidebar className="sticky h-full top-14 pt-8 mr-6 xl:mr-0 lg:w-48 shrink-0 hidden lg:block">
          <p className="text-xs mb-4 text-center">
            Join PalStreak to connect with {params.username} and other friends.
          </p>

          <form action={signInAction}>
            <button className="w-full text-neutral-100 shadow shadow-shadow bg-sky-500 font-semibold rounded-full px-4 py-2 flex justify-center items-center gap-2 ring ring-inset ring-white/20 hover:shadow-md hover:scale-105 duration-150 hover:brightness-105 transition-all">
              Join PalStreak
            </button>
          </form>
        </Sidebar>
      )}
    </>
  );
}
