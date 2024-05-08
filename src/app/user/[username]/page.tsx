import RightSidebarEmpty from "@/components/right-sidebar-empty";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AVATAR_COLORS } from "@/globals";
import Avatar from "boring-avatars";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { LuFlame, LuUsers2 } from "react-icons/lu";

const getUserByUsername = async (username: string) => {
  return db
    .select({
      username: users.username,
      image: users.image,
      lastActive: users.lastActive,
      longestCurrentStreak: users.longestCurrentStreak,
      friendCount: users.friendCount,
    })
    .from(users)
    .where(eq(users.username, username))
    .then((res) => (res.length > 0 ? res[0] : null));
};

const formatDate = (date: Date) => {
  const day = date.toLocaleDateString();
  return day;
};

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const user = await getUserByUsername(params.username);

  if (!user) {
    notFound();
  }

  return (
    <>
      <main className="w-full pt-8 pb-4 mx-auto lg:mx-0 px-4 md:px-2 max-w-screen-sm">
        <div className="flex items-center gap-4 sm:gap-8">
          <div className="shrink-0 relative rounded-full shadow shadow-shadow max-w-fit after:absolute after:inset-0 after:ring-inset after:ring-2 after:ring-white/40 after:rounded-full">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile picture"
                className="rounded-full size-20 sm:size-24 shrink-0"
              />
            ) : (
              <Avatar
                name={user.username || ""}
                variant="marble"
                colors={AVATAR_COLORS}
              />
            )}
          </div>

          <div className="w-full">
            <h1 className="text-2xl font-bold leading-none">
              {params.username}
            </h1>
            <div className="text-text-faded text-xs mt-2">
              Last active {formatDate(user.lastActive)}
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
                <span className="font-semibold">
                  {user.friendCount}
                </span>{" "}
                friends
              </div>
            </div>
          </div>
        </div>
      </main>
      <RightSidebarEmpty />
    </>
  );
}
