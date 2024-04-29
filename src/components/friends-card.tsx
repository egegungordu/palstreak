"use client";

import Avatar from "boring-avatars";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
type CarouselApi = UseEmblaCarouselType[1];
import { useCallback, useEffect, useState } from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const friends = [
  {
    username: "Shadow",
    streak: 14,
    progress: 0.2,
  },
  {
    username: "Betul",
    streak: 30,
    progress: 0.6,
  },
  {
    username: "Ghoul",
    streak: 60,
    progress: 0.8,
  },
  {
    username: "Atabey",
    streak: 60,
    progress: 0.8,
  },
  {
    username: "Petneplp",
    streak: 60,
    progress: 0.8,
  },
];

const streakColors = {
  // grey
  0: "#d1d5db",
  // yellow
  14: "#fcd34d",
};

function streakToColor(streak: number) {
  if (streak >= 14) {
    return streakColors[14];
  }
  return streakColors[0];
}

export default function FriendsCard() {
  const [emblaRef, api] = useEmblaCarousel();

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) {
      return;
    }

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
    api?.scrollNext();
  }, [api]);

  useEffect(() => {
    if (!api) {
      return;
    }

    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="flex gap-2 w-full max-w-screen-md items-center">
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="rounded-full p-2 border border-border bg-foreground hover:bg-background-button-hover disabled:pointer-events-none disabled:opacity-0 transition-all"
      >
        <ChevronLeftIcon />
      </button>

      <div
        className={cn(
          "overflow-hidden w-full relative",
          "after:absolute after:h-full after:w-10 after:bg-gradient-to-l after:from-background after:top-0 after:right-0",
        )}
        ref={emblaRef}
      >
        <div className="flex">
          {friends.map((friend, idx) => (
            <div
              key={idx}
              className="flex gap-2 items-center min-w-36 select-none group"
            >
              <div className="rounded-full p-1 bg-foreground shadow relative isolate">
                <div className="hidden text-text group-hover:grid absolute inset-0 w-full h-full place-items-center bg-foreground rounded-full font-bold">
                  {friend.progress * 100}%
                </div>

                <Avatar
                  size={42}
                  name={friend.username}
                  variant="beam"
                  colors={[
                    "#fee9a6",
                    "#fec0ab",
                    "#fa5894",
                    "#660860",
                    "#9380b7",
                  ]}
                />
              </div>

              <div>
                <div className="font-medium text-xs">{friend.name}</div>
                <div className="text-text-faded text-xs mt-1">
                  <span
                    className="font-bold text-text-strong px-1 py-px rounded-md bg-foreground shadow shadow-shadow"
                    // style={{
                    //   backgroundColor: streakToColor(friend.streak),
                    // }}
                  >
                    {friend.streak}
                  </span>{" "}
                  days
                </div>
                <div className="relative bg-neutral-200 w-14 h-2 rounded-full hidden"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="rounded-full p-2 border border-border bg-foreground hover:bg-background-button-hover disabled:pointer-events-none disabled:opacity-0 transition-all"
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
}
