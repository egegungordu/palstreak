/* eslint-disable @next/next/no-img-element */
"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./button";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import completeOnboarding from "@/actions/complete-onboarding";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { USERNAME_REGEX } from "@/globals";
import imageCompression from "browser-image-compression";
import uploadProfilePicture from "@/actions/upload-profile-picture";
import { LuArrowRight, LuCamera, LuLoader, LuLogOut } from "react-icons/lu";

type OnboardingInputs = {
  username: string;
};

export default function OnboardingForm() {
  const [pending, startTransition] = useTransition();
  const { data } = useSession();
  const router = useRouter();
  const { update } = useSession();
  const [profilePicturePending, startProfilePictureTransition] =
    useTransition();

  if (!data?.user) {
    throw new Error("User not found");
  }

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    const form = e.target.form;
    if (!form) return;
    const formData = new FormData(form);
    const image = formData.get("file") as File;
    if (!image) return;
    if (!image.type.startsWith("image")) return;

    e.preventDefault();

    startProfilePictureTransition(async () => {
      const options = {
        maxSizeMB: 0.2,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      // do local compression only if the image is not a gif
      if (image.type !== "image/gif") {
        const compressedImage = await imageCompression(image, options);
        formData.set("file", compressedImage);
      }

      formData.append("userId", data.user.id);

      await uploadProfilePicture(formData);

      await update({});

      router.refresh();
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<OnboardingInputs>({
    defaultValues: {
      username: "",
    },
  });

  const onSubmit: SubmitHandler<{ username: string }> = async (data) => {
    startTransition(async () => {
      const response = await completeOnboarding({ username: data.username });

      console.log(response)

      if (!response.ok) {
        setError("username", {
          type: "manual",
          message: response.message,
        });
        return;
      }

      toast.success("Onboarding completed successfully", {
        description: "Welcome to the club! 🎉",
      });

      await update({});

      router.refresh();
    });
  };

  return (
    <>
      <form className="my-2">
        <label
          className={cn(
            "cursor-pointer flex items-center gap-2 rounded-full mx-auto relative isolate group shadow shadow-shadow",
            {
              "opacity-80 pointer-events-none": profilePicturePending,
            },
          )}
          htmlFor="file"
        >
          <div className="absolute -right-20 text-xs rotate-6 text-center pointer-events-none">
            Gifs are
            <br /> supported!
            <div
              className="bg-text-faded size-6 rotate-45 mt-2 ml-2 animate-inviting-arrow origin-top-left"
              style={{
                mask: "url(wow-arrow.svg)",
                maskRepeat: "no-repeat",
                maskSize: "0.75rem",
                WebkitMask: "url(wow-arrow.svg)",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "0.75rem",
              }}
            />
          </div>

          {profilePicturePending && (
            <div className="absolute inset-0 flex items-center justify-center text-text-strong">
              <LuLoader className="w-5 h-5 animate-spin" />
            </div>
          )}

          <div className="group-hover:opacity-30 rounded-full transition-opacity overflow-hidden">
            {data.user.image ? (
              <img
                src={data.user.image}
                alt="Profile picture"
                className="size-24"
              />
            ) : (
              <div className="inset-0 p-4 size-24 bg-foreground rounded-full border border-border flex flex-col items-center justify-center text-2xs text-center leading-tight">
                <LuCamera className="w-4 h-4" />
                Set profile picture
              </div>
            )}
          </div>

          {data.user.image && (
            <div className="absolute rounded-full inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-2xs text-center leading-tight">
              <LuCamera className="w-4 h-4" />
              Change profile picture
            </div>
          )}
        </label>

        <input
          className="hidden"
          id="file"
          type="file"
          name="file"
          accept="image/*"
          onChange={handlePictureUpload}
        />
      </form>

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

        <div className="flex justify-between mt-5">
          <Button
            onClick={async () => {
              await signOut();
              router.refresh();
            }}
            type="button"
            className="bg-transparent hover:bg-foreground-dark text-text shadow-none border-none"
          >
            <LuLogOut className="size-3.5 mr-2" />
            Log out
          </Button>

          <Button disabled={pending} loading={pending}>
            Get started
            <LuArrowRight className="size-3.5 ml-2" />
          </Button>
        </div>
      </form>
    </>
  );
}
