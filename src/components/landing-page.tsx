"use client";

import Logo from "@/components/logo";
import MockHabitCard from "@/components/mock-habit-card";
import signInAction from "@/actions/sign-in-action";
import { motion } from "framer-motion";

const MOCK_HABIT1 = {
  name: "📚 Read atleast 10 pages",
  color: "#b465db",
  streaks: Object.fromEntries(
    Array.from({ length: 7 * 52 }).map((_, i) => [
      i,
      {
        date: new Date(),
        value: Math.floor(Math.random() * 2),
      },
    ]),
  ),
};

const MOCK_HABIT2 = {
  name: "💧 Drink water",
  color: "#ed8d51",
  streaks: Object.fromEntries(
    Array.from({ length: 7 * 52 }).map((_, i) => [
      i,
      {
        date: new Date(),
        value: Math.floor(Math.random() * 2),
      },
    ]),
  ),
};

const MOCK_HABIT3 = {
  name: "🏋️ Workout",
  color: "#99d98c",
  streaks: Object.fromEntries(
    Array.from({ length: 7 * 52 }).map((_, i) => [
      i,
      {
        date: new Date(),
        value: Math.floor(Math.random() * 2),
      },
    ]),
  ),
};

export default function LandingPage() {
  return (
    <main className="w-full max-w-screen-lg mx-auto relative isolate h-full overflow-hidden px-4">
      {/* TODO: do this with svgs or canvas, this might be slow on mobile */}
      <div
        className="absolute grid grid-cols-12 gap-2 -z-10 -top-10 min-w-[500px] w-full left-1/2 -translate-x-1/2"
        style={{
          maskImage: "linear-gradient(180deg, #000 20%, transparent 80%)",
        }}
      >
        {Array.from({ length: 12 * 5 }).map((_, idx) => (
          <div
            suppressHydrationWarning
            key={idx}
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: "2s",
            }}
            className="w-full border border-border-grid aspect-square rounded-lg bg-landing-grid animate-pulse"
          />
        ))}
        <div className="absolute w-32 h-full bg-gradient-to-r from-background left-0 top-0" />
        <div className="absolute w-32 h-full bg-gradient-to-l from-background right-0 top-0" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <Logo className="w-20 h-20 mx-auto mt-20" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
        className="text-center text-3xl md:text-4xl lg:text-5xl font-bold mt-4"
      >
        <span className="bg-gradient-to-br from-logo to-logo-light text-transparent bg-clip-text">
          Habits
        </span>{" "}
        <span className="text-xl">with</span>{" "}
        <span className="italic">friends</span>
      </motion.h1>

      <div className="mt-10 relative max-w-fit mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.3, left: "0%" }}
          animate={{ opacity: 1, scale: 0.75, left: "-50%", rotate: -12 }}
          transition={{
            delay: 0.7,
            stiffness: 200,
            damping: 20,
            mass: 1,
            type: "spring",
          }}
          className="p-3 bg-white/10 rounded-3xl border border-border absolute top-4"
        >
          <MockHabitCard habit={MOCK_HABIT1} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            stiffness: 200,
            damping: 20,
            mass: 1,
            type: "spring",
          }}
          className="p-3 bg-white/10 rounded-3xl border border-border shadow shadow-shadow backdrop-blur"
        >
          <MockHabitCard habit={MOCK_HABIT2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.3, right: "0%" }}
          animate={{ opacity: 1, scale: 0.75, right: "-50%", rotate: 12 }}
          transition={{
            delay: 0.7,
            stiffness: 200,
            damping: 20,
            mass: 1,
            type: "spring",
          }}
          className="p-3 bg-white/10 rounded-3xl border border-border absolute top-4 -z-10"
        >
          <MockHabitCard habit={MOCK_HABIT3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: 0.5,
          stiffness: 200,
          damping: 20,
          mass: 1,
          type: "spring",
        }}
        className="flex mx-auto mt-8 items-center justify-center"
      >
        <form action={signInAction}>
          <button
            type="submit"
            className="mt-auto text-neutral-100 shadow shadow-shadow bg-sky-500 font-semibold rounded-full px-4 py-2 flex items-center gap-2 ring ring-inset ring-white/20 hover:shadow-md hover:scale-105 duration-150 hover:brightness-105 transition-all"
          >
            Start tracking your habits
          </button>

          <div className="text-xs text-text-faded text-center mt-1">
            100% Free, forever
          </div>
        </form>
      </motion.div>
    </main>
  );
}
