import AddFriendButton from "@/components/add-friend-button";
import FriendsTabs from "@/components/friends-tabs";
import Loader from "@/components/loader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Leaderboard() {
  const session = await auth();

  if (session && !session.user.onboardingFinished) {
    redirect("/onboarding");
  }

  if (!session) {
    redirect("/");
  }

  return (
    <main className="w-full pt-8 pb-4 mx-auto lg:mx-0 px-4 md:px-2 max-w-screen-sm">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg">Leaderboard</h1>

        <AddFriendButton username={session.user.username || ""} />
      </div>

      <div className="my-6" />

      <Suspense fallback={<Loader />}>
        <FriendsTabs />
      </Suspense>
    </main>
  );
}

