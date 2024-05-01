"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./button";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import completeOnboarding from "@/actions/complete-onboarding";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { USERNAME_REGEX } from "@/globals";

type OnboardingInputs = {
  username: string;
};

export default function OnboardingForm() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const { update } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInputs>({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit: SubmitHandler<{ username: string }> = async (data) => {
    startTransition(async () => {
      await completeOnboarding({ username: data.username });

      toast.success("Onboarding completed successfully", {
        description: "Welcome to the club! 🎉",
      });

      await update({});

      router.push("/");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md">
      <p className="text-text-faded text-sm mt-2 mb-4">
        Choose a username. This will be your unique identifier on PalStreak.
      </p>

      <input
        className={cn(
          "inline-flex placeholder:text-text-disabled h-[35px] w-full flex-1 border border-border items-center justify-center rounded-md px-4 leading-none shadow shadow-shadow outline-none",
          errors.username && "border-red-500",
        )}
        type="text"
        autoComplete="off"
        placeholder="MyUsername123"
        {...register("username", {
          required: {
            value: true,
            message: "This field is required",
          },
          pattern: {
            value: USERNAME_REGEX,
            message: "Invalid username format",
          },
        })}
      />

      <div className="text-text-faded text-xs pl-[110px] mt-3">
        3-15 characters, letters, numbers, or underscores only.
      </div>

      {errors.username && (
        <div className="mt-2 text-end text-red-500 text-xs">
          {errors.username.message}
        </div>
      )}

      <small className="block text-end text-xs text-text-disabled mt-4">
        This information will be displayed to your friends
      </small>

      <div className="mt-5 flex justify-end">
        <Button disabled={pending} loading={pending}>
          Get started
        </Button>
      </div>
    </form>
  );
}
