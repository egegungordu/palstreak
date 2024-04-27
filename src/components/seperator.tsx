
export default function Seperator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return <div className={`bg-foreground-darker self-stretch ${orientation === "horizontal" ? "h-px" : "w-px"}`} />;
}
