/* eslint-disable @next/next/no-img-element */
import updateSettings from "@/actions/update-settings";
import uploadProfilePicture from "@/actions/upload-profile-picture";
import { AVATAR_COLORS, USERNAME_REGEX } from "@/globals";
import { cn } from "@/lib/utils";
import Avatar from "boring-avatars";
import imageCompression from "browser-image-compression";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { LuCamera, LuLoader } from "react-icons/lu";
import { toast } from "sonner";
import FakeLoadingBar from "./fake-loading-bar";
import Button from "./button";

type SettingsInputs = {
  username: string;
};

export default function ProfileSettings({
  onSave,
  onUploadPicture,
}: {
  onSave?: () => void;
  onUploadPicture?: () => void;
}) {
  const [profilePicturePending, startProfilePictureTransition] =
    useTransition();
  const [pending, startTransition] = useTransition();

  const { update, data: session } = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<SettingsInputs>({
    defaultValues: {
      username: session?.user.username || "",
    },
  });

  const onSubmit: SubmitHandler<SettingsInputs> = async (data) => {
    startTransition(async () => {
      const res = await updateSettings({
        username: data.username,
      });

      if (!res.ok) {
        setError("username", {
          type: "manual",
          message: res.message,
        });
        return;
      }

      toast.success("Settings saved!");

      await update({});

      reset({ username: data.username });

      onSave?.();

      router.refresh();
    });
  };

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

      formData.append("userId", session!.user.id!);

      await uploadProfilePicture(formData);

      await update({});

      toast.success("Profile picture updated!");

      onUploadPicture?.();

      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-6 sm:mt-2">
      <form className="flex gap-5">
        <div className="w-[90px] text-right text-xs text-faded shrink-0">
          Profile picture
        </div>

        <div className="flex flex-col w-full">
          <label
            className={cn(
              "cursor-pointer flex items-center gap-2 rounded-full overflow-hidden mx-auto relative isolate group",
              {
                "opacity-80 pointer-events-none": profilePicturePending,
              },
            )}
            htmlFor="file"
          >
            {profilePicturePending && (
              <div className="absolute inset-0 flex items-center justify-center text-text-strong">
                <LuLoader className="w-5 h-5 animate-spin" />
              </div>
            )}

            <div className="group-hover:opacity-30 transition-opacity">
              {session?.user.image ? (
                <img
                  src={session.user.image}
                  alt="Profile picture"
                  className="size-24"
                />
              ) : (
                <Avatar
                  size={96}
                  name={session?.user.username || "User"}
                  variant="marble"
                  colors={AVATAR_COLORS}
                />
              )}
            </div>

            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-2xs text-center leading-tight">
              <LuCamera className="w-4 h-4" />
              Change profile picture
            </div>
          </label>

          <FakeLoadingBar
            key={`${profilePicturePending}`}
            className="mt-3"
            show={profilePicturePending}
          />
        </div>

        <input
          className="hidden"
          id="file"
          type="file"
          name="file"
          accept="image/*"
          onChange={handlePictureUpload}
        />
      </form>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-5">
          <label
            className="w-[90px] text-right text-xs text-faded"
            htmlFor="habit-name"
          >
            Username
          </label>
          <input
            className={cn(
              "inline-flex h-[35px] w-full flex-1 border border-border items-center justify-center rounded-md px-4 leading-none shadow shadow-shadow outline-none",
              errors.username && "border-red-500",
            )}
            type="text"
            autoComplete="off"
            id="habit-name"
            placeholder="Do 100 pushups"
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
        </div>

        <div className="text-xs text-text-faded text-end w-full my-1">
          3-15 characters, letters, numbers, or underscores only.
        </div>

        {errors.username && (
          <div className="mt-2 text-end text-red-500 text-xs">
            {errors.username.message}
          </div>
        )}

        <div className="mt-12 flex justify-end">
          <Button
            loading={pending || profilePicturePending}
            disabled={pending || profilePicturePending}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}
