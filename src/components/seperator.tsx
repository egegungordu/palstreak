
export default function Seperator({ orientation = "horizontal" }: { orientation?: "horizontal" | "vertical" }) {
  return <div className={`bg-neutral-200 self-stretch ${orientation === "horizontal" ? "h-px" : "w-px"}`} />;
}
