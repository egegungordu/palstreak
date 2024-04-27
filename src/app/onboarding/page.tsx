import OnboardingForm from "@/components/onboarding-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const session = await auth();
  const isLoggedOut = !session;
  const isLoggedInAndOnboardingFinished = session && session.user.onboardingFinished;

  if (isLoggedOut || isLoggedInAndOnboardingFinished) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-screen-sm h-full w-full p-8 flex flex-col justify-center items-center">
      <h1 className="font-semibold text-base">PalStreak</h1>

      <p className="text-text-faded text-sm mt-2 mb-4">
        Let&apos;s get you set up with an account
      </p>
      
      <OnboardingForm />
    </div>
  );
}
