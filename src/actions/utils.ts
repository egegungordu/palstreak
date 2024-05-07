import { Habit } from "@/app/page";

const areas = [
  1, 1.9512098358305678, 2.855899656026243, 3.7161377136510847,
  4.53381615685713, 5.31067260554292, 6.048308341075429, 6.74820374862509,
  7.411731512003878, 8.040167955571395, 8.634702847463231, 9.196447916532076,
  9.726444287286341, 10.225668999373852,
];

export const calculateConsistencyScore = async (habits: Habit[]) => {
  const consistencyScores = habits.map((h) => {
    let accumulativeScore = 0;
    const { streaks } = h;
    const nthDay = calculateNthDay(h);
    // iterate over streaks object keys
    Object.keys(streaks).forEach((key) => {
      const streakDay = parseInt(key);
      const difference = nthDay - streakDay;
      // calculate the score based on formula
      const scoreForDay = Math.max(0.1, 1 - Math.log(difference / 20 + 1));
      accumulativeScore += scoreForDay;
    });
    const totalArea = nthDay > 13 ? areas[13] + (nthDay - 13) * 0.4 : areas[nthDay];
    return accumulativeScore / totalArea;
  });

  return (
    consistencyScores.reduce((acc, score) => acc + score, 0) /
    consistencyScores.length
  );
};

export const calculateNthDay = (habit: Habit) => {
  // check if already completed today
  // calculate the nth day of the habit
  // adjust everything with habit.timezoneOffset
  const firstDay = new Date(
    habit.createdAt.getTime() - habit.timezoneOffset * 60 * 1000,
  );
  const firstDayStart = new Date(
    firstDay.getUTCFullYear(),
    firstDay.getUTCMonth(),
    firstDay.getUTCDate(),
  );
  const today = new Date(
    new Date().getTime() - habit.timezoneOffset * 60 * 1000,
  );
  const todayStart = new Date(
    today.getUTCFullYear(),
    today.getUTCMonth(),
    today.getUTCDate(),
  );
  return Math.floor(
    (todayStart.getTime() - firstDayStart.getTime()) / (24 * 60 * 60 * 1000),
  );
};
