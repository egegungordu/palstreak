import FriendsCard from "@/components/friends-card";
import HabitsList from "@/components/habits-list";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex flex-col items-center gap-4 py-10 px-2">
      <FriendsCard />

      <div className="mt-2" />

      <HabitsList />

      <div className="mt-2" />
    </main>
  );
}
