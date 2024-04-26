import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

export function relativeTime({ date }: { date: Date }) {
  const diff = date.getTime() - Date.now();
  const sign = Math.sign(diff);

  const diffInSeconds = Math.floor(Math.abs(diff) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 2) {
    return rtf.format(diffInDays * sign, "day");
  }

  if (diffInHours > 0) {
    return rtf.format(diffInHours * sign, "hour");
  }

  if (diffInMinutes > 0) {
    return rtf.format(diffInMinutes * sign, "minute");
  }

  return rtf.format(diffInSeconds * sign, "second");
}
