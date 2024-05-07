import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { calculateConsistencyScore, calculateNthDay } from "@/actions/utils";

client.defineJob({
  id: "calculate-streaks",
  name: "Calculate and update streaks for each user every hour",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 * * * *",
  }),
  run: async (payload, io) => {
    // this cron runs every hour, the timezoneOffset will be the hour of ts
    const targetStreakResetTimezoneOffset =
      (payload.ts.getUTCHours() - 24) * 60;
    io.logger.info(
      `Target streak reset timezone offset: ${targetStreakResetTimezoneOffset}`,
    );

    // runTask cant serialize the Date ?
    const resetTimezoneHabits = await io
      .runTask(
        "get-reset-timezone-habits",
        async () =>
          await db
            .select()
            .from(habit)
            .where(eq(habit.timezoneOffset, targetStreakResetTimezoneOffset)),
      )
      .then((res) =>
        res.map((r) => ({
          ...r,
          lastCompletedAt: r.lastCompletedAt
            ? new Date(r.lastCompletedAt)
            : null,
        })),
      );

    const habitsToReset = resetTimezoneHabits.filter((dbHabit) => {
      if (!dbHabit.lastCompletedAt) {
        return false;
      }

      const diff = payload.ts.getTime() - dbHabit.lastCompletedAt.getTime();
      return diff >= 24 * 60 * 60 * 1000;
    });

    io.logger.info(
      `Habits to reset: (count: ${habitsToReset.length}) ${habitsToReset
        .map((h) => h.id)
        .join(", ")}`,
    );

    await io.runTask("update-habits", async () => {
      db.transaction(async (tx) => {
        await tx
          .update(habit)
          .set({
            streak: 0,
          })
          .where(
            inArray(
              habit.id,
              habitsToReset.map((h) => h.id),
            ),
          );

        const usersAffected = await tx
          .select()
          .from(users)
          .where(
            inArray(
              users.id,
              habitsToReset.map((h) => h.userId),
            ),
          );

        io.logger.info(
          `Users affected: (count: ${usersAffected.length}) ${usersAffected.map((u) => u.id).join(", ")}`,
        );

        for (const user of usersAffected) {
          const userHabits = await tx
            .select()
            .from(habit)
            .where(eq(habit.userId, user.id));

          const longestCurrentStreak = userHabits.reduce(
            (acc, habit) => Math.max(acc, habit.streak),
            0,
          );

          const overallConsistencyScore = await calculateConsistencyScore(userHabits);

          await tx
            .update(users)
            .set({
              consistencyScore: overallConsistencyScore.toString(),
              longestCurrentStreak,
            })
            .where(eq(users.id, user.id));
        }
      });
    });
  },
});
