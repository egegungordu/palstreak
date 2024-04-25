import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

const rtf = new Intl.RelativeTimeFormat("en", { style: "narrow" });

export function relativeTime({ date }: { date: Date }) {
  const diff = date.getTime() - Date.now();

  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours > 0) {
    return rtf.format(diffInHours, "hour");
  }

  if (diffInMinutes > 0) {
    return rtf.format(diffInMinutes, "minute");
  }

  return rtf.format(diffInSeconds, "second");
}
