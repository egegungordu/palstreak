"use client";

import Button from "@/components/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-14 flex justify-center mx-auto w-full">
      <div className="rounded-2xl flex flex-col border border-border shadow shadow-shadow bg-foreground px-5 py-4 mt-4 max-w-sm w-full">
        <h2 className="text-xl text-text font-semibold">Something went wrong!</h2>
        <p className="text-text-faded text-sm mt-2">{error.message}</p>
        <Button className="ml-auto mt-2" onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}
