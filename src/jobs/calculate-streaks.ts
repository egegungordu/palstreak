import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { db } from "@/db";
import { habit, users } from "@/db/schema";
import { count, eq } from "drizzle-orm";

client.defineJob({
  id: "calculate-streaks",
  name: "Calculate and update streaks for each user every hour",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "0 * * * *",
  }),
  run: async (payload, io, ctx) => {
    // this cron runs every hour, the timezoneOffset will be the hour of ts
    const targetStreakResetTimezoneOffset =
      (payload.ts.getUTCHours() - 24) * 60;
    io.logger.info(
      `Target streak reset timezone offset: ${targetStreakResetTimezoneOffset}`,
    );

    const dbHabits = await db
      .select()
      .from(habit)
      .where(eq(habit.timezoneOffset, targetStreakResetTimezoneOffset));

    dbHabits.forEach(async (dbHabit) => {
      io.logger.info(`Calculating streaks for ${dbHabit.id}...`);
      const firstDay = new Date(dbHabit.createdAt.getTime() - dbHabit.timezoneOffset * 60 * 1000);
      const firstDayStart = new Date(firstDay.getFullYear(), firstDay.getMonth(), firstDay.getDate());
      const today = new Date((payload.ts).getTime() - dbHabit.timezoneOffset * 60 * 1000);
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const nthDay = Math.floor((todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000));
      io.logger.info(JSON.stringify({ firstDay, firstDayStart, today, todayStart, nthDay }));
    });

    // io.logger.info(`Calculating streaks for ${dbUsers.length} users...`);
    //
    // io.logger.info(JSON.stringify(dbUsers));
    //
    // return dbUsers;
  },
});
