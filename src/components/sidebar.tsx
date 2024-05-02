import { cn } from "@/lib/utils";

export default function Sidebar({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return <aside className={cn("w-48", className)}>{children}</aside>;
}
