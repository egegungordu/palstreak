import FriendsCard from "@/components/friends-card";
import HabitsList from "@/components/habits-list";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-16 gap-4">
      <FriendsCard />

      <div className="mt-2" />

      <HabitsList />
    </main>
  );
}
