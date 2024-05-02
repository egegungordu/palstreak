import AddFriendButton from "@/components/add-friend-button";
import FriendsTabs from "@/components/friends-tabs";
import Loader from "@/components/loader";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Friends() {
  const session = await auth();

  if (session && !session.user.onboardingFinished) {
    redirect("/onboarding");
  }

  if (!session) {
    redirect("/");
  }

  return (
    <main className="mx-auto py-8 px-2 pt-20 max-w-screen-md">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-lg">Friends</h1>

        <AddFriendButton username={session.user.username || ""} />
      </div>

      <div className="my-6" />

      <Suspense fallback={<Loader />}>
        <FriendsTabs />
      </Suspense>
    </main>
  );
}
